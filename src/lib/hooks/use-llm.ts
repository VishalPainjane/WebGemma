import { useState, useEffect, useCallback, useRef } from "react";
import { CreateWebWorkerMLCEngine, MLCEngineInterface, InitProgressReport, ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { SELECTED_MODEL, MODEL_CONFIG } from "../constants";
import { AVAILABLE_TOOLS, executeToolCall } from "../agent/tools";

export interface Message {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
  name?: string;
}

const SYSTEM_PROMPT: Message = {
  role: "system",
  content: "You are WebGemma, a private AI agent running directly in the user's browser. You are helpful, concise, and respect user privacy. You have access to tools. Use them when needed."
};

export function useLLM() {
  const [engine, setEngine] = useState<MLCEngineInterface | null>(null);
  const [messages, setMessages] = useState<Message[]>([SYSTEM_PROMPT]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<InitProgressReport | null>({ 
    progress: 0, 
    timeElapsed: 0, 
    text: "Initializing engine..." 
  });
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const engineInitRef = useRef(false);

  useEffect(() => {
    if (engineInitRef.current) return;
    engineInitRef.current = true;

    const initEngine = async () => {
      try {
        console.log("Initializing WebGemma MLCEngine...");
        const worker = new Worker(new URL('../../workers/llm.worker.ts', import.meta.url), { type: 'module' });
        
        // Listen for raw worker messages for debugging
        worker.onmessage = (msg) => {
            if (msg.data?.kind === "initProgressCallback") {
                console.log("Main Thread: Received progress from worker:", msg.data.progress);
            }
        };

        // Listen for raw worker errors that might not be caught by the engine
        worker.onerror = (err) => {
            console.error("Worker encountered an error:", err);
            setDownloadProgress(prev => ({ 
                progress: 0, 
                timeElapsed: 0, 
                text: "Error: Worker crashed. Check console." 
            }));
        };

        console.log("Worker created, loading model:", SELECTED_MODEL);
        
        const appConfig = {
            ...MODEL_CONFIG,
            useIndexedDBCache: true
        };
        console.log("Using AppConfig for Engine:", appConfig);

        // Safety timeout: If we don't get 'initProgressCallback' within 30s, assume stuck.
        const timeoutId = setTimeout(() => {
            setDownloadProgress(prev => {
                if (prev?.progress === 0 && prev?.text === "Initializing engine...") {
                    return { ...prev, text: "Error: Initialization timed out. Check network or console." };
                }
                return prev;
            });
        }, 30000);

        const mlcEngine = await CreateWebWorkerMLCEngine(
          worker,
          SELECTED_MODEL,
          { 
            initProgressCallback: (report: InitProgressReport) => {
               clearTimeout(timeoutId); // We made contact!
               console.log("Model loading progress:", report.text);
               setDownloadProgress(report);
            },
            appConfig: appConfig,
          }
        );
        
        clearTimeout(timeoutId);
        console.log("MLCEngine initialized successfully.");
        setEngine(mlcEngine);
        setIsModelLoaded(true);
        setDownloadProgress(null); 
      } catch (error) {
        console.error("Failed to initialize engine:", error);
        setDownloadProgress({ 
            progress: 0, 
            timeElapsed: 0, 
            text: `Error: ${error instanceof Error ? error.message : String(error)}` 
        });
      }
    };

    initEngine();
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!engine || !text.trim()) return;

    console.log("Sending message:", text);
    const newMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // 1. First call to model
      await processChatRequest(engine, updatedMessages, setMessages);

    } catch (err) {
      console.error("Generation failed", err);
      setMessages(prev => [...prev, { role: "system", content: "Error: Failed to generate response." }]);
    } finally {
      setIsLoading(false);
    }
  }, [engine, messages]);

  const processChatRequest = async (
    engine: MLCEngineInterface, 
    history: Message[], 
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    console.log("Processing chat request with history length:", history.length);
    // Add assistant placeholder
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    const chunks = await engine.chat.completions.create({
      messages: history as ChatCompletionMessageParam[],
      stream: true,
      tools: AVAILABLE_TOOLS,
    });

    let fullContent = "";
    let toolCalls: any[] = [];
    
    for await (const chunk of chunks) {
      const choice = chunk.choices[0];
      const delta = choice?.delta;
      
      // Handle Content
      if (delta?.content) {
        fullContent += delta.content;
        setMessages(prev => {
           const last = prev[prev.length - 1];
           if (last.role === 'assistant' && !last.tool_calls) {
             const newHistory = prev.slice(0, -1);
             newHistory.push({ ...last, content: fullContent });
             return newHistory;
           }
           return prev;
        });
      }

      // Handle Tool Calls (Accumulation)
      if (delta?.tool_calls) {
        for (const toolCallChunk of delta.tool_calls) {
             if (toolCallChunk.index !== undefined) {
                 if (!toolCalls[toolCallChunk.index]) {
                     console.log("Model requested tool call:", toolCallChunk.id);
                     toolCalls[toolCallChunk.index] = { 
                         id: toolCallChunk.id || `call_${Math.random().toString(36).substr(2, 9)}`, 
                         type: toolCallChunk.type || 'function', 
                         function: { name: "", arguments: "" } 
                     };
                 }
                 const tc = toolCalls[toolCallChunk.index];
                 if (toolCallChunk.id) tc.id = toolCallChunk.id;
                 if (toolCallChunk.type) tc.type = toolCallChunk.type;
                 if (toolCallChunk.function?.name) tc.function.name += toolCallChunk.function.name;
                 if (toolCallChunk.function?.arguments) tc.function.arguments += toolCallChunk.function.arguments;
             }
        }
      }
    }

    // If we have tool calls, we need to execute them
    if (toolCalls.length > 0) {
        console.log("Executing tool calls:", toolCalls.map(t => t.function.name));
        // Update the last assistant message with the full tool calls
        const assistantMsg: Message = {
            role: "assistant",
            content: fullContent || "", 
            tool_calls: toolCalls
        };
        
        // Update state to reflect the tool calls were made
        setMessages(prev => {
             const newHistory = prev.slice(0, -1);
             newHistory.push(assistantMsg);
             return newHistory;
        });

        // Current history for the next recursion
        let currentHistory = [...history, assistantMsg];

        // Execute tools
        for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            let functionArgs = {};
            try {
               functionArgs = JSON.parse(toolCall.function.arguments);
            } catch(e) {
               console.error("Failed to parse function args", e);
            }
            
            setMessages(prev => [...prev, { 
                role: "tool", 
                tool_call_id: toolCall.id, 
                name: functionName, 
                content: "Executing..." 
            } as Message]);

            const toolResult = await executeToolCall(functionName, functionArgs);
            
            const toolMsg: Message = {
                role: "tool",
                tool_call_id: toolCall.id,
                name: functionName,
                content: toolResult
            };
            
            // Update the "Executing..." placeholder with actual result
            setMessages(prev => {
                const newHistory = prev.slice(0, -1);
                newHistory.push(toolMsg);
                return newHistory;
            });

            currentHistory.push(toolMsg);
        }
        
        // Recursive call with new history
        await processChatRequest(engine, currentHistory, setMessages);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    downloadProgress,
    isModelLoaded
  };
}