import { useState, useCallback, useRef } from "react";
import { CreateWebWorkerMLCEngine, MLCEngineInterface, InitProgressReport, ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { MODEL_CONFIG } from "../constants";

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
  
  // Track selected model
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const [downloadProgress, setDownloadProgress] = useState<InitProgressReport | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  // Avoid double initialization
  const engineInitRef = useRef(false);

  const selectModel = useCallback(async (modelId: string) => {
    if (engineInitRef.current || selectedModel === modelId) return;
    
    setSelectedModel(modelId);
    engineInitRef.current = true;
    setDownloadProgress({ 
        progress: 0, 
        timeElapsed: 0, 
        text: "Initializing engine..." 
    });

    try {
        console.log("Initializing WebGemma MLCEngine with model:", modelId);
        const worker = new Worker(new URL('../../workers/llm.worker.ts', import.meta.url), { type: 'module' });
        
        worker.onmessage = (msg) => {
            if (msg.data?.kind === "initProgressCallback") {
                console.log("Main Thread: Received progress:", msg.data.progress);
            }
        };

        worker.onerror = (err) => {
            console.error("Worker encountered an error:", err);
            setDownloadProgress({ 
                progress: 0, 
                timeElapsed: 0, 
                text: "Error: Worker crashed. Check console." 
            });
            engineInitRef.current = false; // Allow retry
        };

        const appConfig = {
            ...MODEL_CONFIG,
            useIndexedDBCache: true
        };

        const timeoutId = setTimeout(() => {
            setDownloadProgress(prev => {
                if (prev?.progress === 0 && prev?.text === "Initializing engine...") {
                    return { ...prev, text: "Error: Initialization timed out." };
                }
                return prev;
            });
        }, 30000);

        const mlcEngine = await CreateWebWorkerMLCEngine(
          worker,
          modelId,
          { 
            initProgressCallback: (report: InitProgressReport) => {
               clearTimeout(timeoutId);
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
        engineInitRef.current = false;
        setSelectedModel(null); // Reset selection to allow user to try again
    }
  }, [selectedModel]);

  const sendMessage = useCallback(async (text: string) => {
    if (!engine || !text.trim()) return;

    console.log("Sending message:", text);
    const newMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
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
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    // Only exclude tools for Gemma-2b based on ID pattern if needed, but for now we excluded globally in prev turn.
    // If we want to re-enable for 7b, we can check selectedModel here. 
    // For now, keeping tools disabled to be safe as requested by prior context.
    
    const chunks = await engine.chat.completions.create({
      messages: history as ChatCompletionMessageParam[],
      stream: true,
      // tools: AVAILABLE_TOOLS, 
    });

    let fullContent = "";
    
    for await (const chunk of chunks) {
      const choice = chunk.choices[0];
      const delta = choice?.delta;
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
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    downloadProgress,
    isModelLoaded,
    selectedModel,
    selectModel
  };
}
