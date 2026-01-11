import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

console.log("WebGemma Worker: Starting up...");

// Let the handler create its own internal engine to ensure progress callbacks are linked correctly
const handler = new WebWorkerMLCEngineHandler();

console.log("WebGemma Worker: Handler initialized with internal engine.");

// Hook into the worker's message event
self.onmessage = (msg: MessageEvent) => {
  const type = msg.data?.type || (msg.data?.kind ? `kind:${msg.data.kind}` : "unknown");
  console.log(`%c[Worker] Received: ${type}`, "color: magenta; font-weight: bold", msg.data);
  
  try {
    handler.onmessage(msg);
  } catch (err) {
    console.error("WebGemma Worker: Critical error in handler.onmessage:", err);
    self.postMessage({ 
        type: 'error', 
        error: err instanceof Error ? err.message : String(err) 
    });
  }
};

self.onerror = (err) => {
    console.error("WebGemma Worker: Global Error:", err);
};

self.onunhandledrejection = (event) => {
    console.error("WebGemma Worker: Unhandled Rejection:", event.reason);
};
