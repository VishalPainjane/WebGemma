import { prebuiltAppConfig } from "@mlc-ai/web-llm";

// Switch to a model that doesn't strictly require shader-f16 (often q4f32 or specific quantized versions)
// The error indicates shader-f16 is missing. We should try the q4f32_1 version or similar if available, 
// OR explicitly configure the engine to fallback if possible (though usually we just change model).
// Let's check available models in prebuiltAppConfig or just pick the widely compatible one.
// "gemma-2b-it-q4f32_1-MLC" is usually safer for compatibility than f16.

export const SELECTED_MODEL = "gemma-2b-it-q4f32_1-MLC";

export const MODEL_CONFIG = prebuiltAppConfig;

console.log("Using Model Config:", MODEL_CONFIG);
