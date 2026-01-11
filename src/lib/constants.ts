import { prebuiltAppConfig } from "@mlc-ai/web-llm";

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  size: string;
  vram_required: string;
  tags: string[];
  recommended_for: string;
  performance_score: number; // 1-10 scale
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: "gemma-2b-it-q4f32_1-MLC",
    name: "Gemma 2B (Standard)",
    description: "Google's lightweight open model. Best balance of compatibility and performance. Runs on most modern laptops.",
    size: "~1.4 GB",
    vram_required: "2GB",
    tags: ["Google", "Lightweight", "High Compatibility"],
    recommended_for: "Laptops, Older GPUs, Quick Tasks",
    performance_score: 8
  },
  {
    id: "gemma-2b-it-q4f16_1-MLC",
    name: "Gemma 2B (Fast)",
    description: "Optimized version using FP16 shaders. Faster generation but requires better GPU support (Shader-F16).",
    size: "~1.4 GB",
    vram_required: "2GB",
    tags: ["Google", "Fast", "FP16"],
    recommended_for: "Modern GPUs (RTX 3060+, M1/M2 Mac)",
    performance_score: 9
  },
  {
    id: "gemma-7b-it-q4f32_1-MLC", // Assuming availability, if fails we can fallback or user can select others
    name: "Gemma 7B (High Quality)",
    description: "Much smarter and more capable model. Requires significantly more memory and compute power.",
    size: "~5.0 GB",
    vram_required: "6GB",
    tags: ["Google", "Smart", "Heavy"],
    recommended_for: "High-end Desktop GPUs, Apple Silicon with 16GB+ RAM",
    performance_score: 6 // Slower generation
  }
];

export const MODEL_CONFIG = prebuiltAppConfig;