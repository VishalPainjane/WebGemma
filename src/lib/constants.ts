import { prebuiltAppConfig } from "@mlc-ai/web-llm";

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  size: string;
  vram_required: string;
  tags: string[];
  recommended_for: string;
  performance_score: number; // 1-10
  quality_rating: "Lossless" | "Near Perfect" | "Balanced" | "Medium" | "Low";
  release_date: string;
  source: "Hugging Face" | "Ollama" | "Kaggle Models" | "LM Studio" | "MLC-AI" | "ONNX Community";
  url: string;
  quantized: boolean;
  quantType?: string;
  requiresAuth?: boolean;
  context_window: string;
  modality: string;
  runtime_status: "Stable" | "Experimental" | "Optimized";
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: "gemma-3-270m-it-q4f16_1-MLC",
    name: "Gemma 3 270M (Ultra Light)",
    description: "Best for real-time web apps. Extremely fast generation (~50 tokens/sec) with minimal VRAM usage.",
    size: "287 MB",
    vram_required: "500 MB",
    tags: ["Google", "Gemma 3", "Ultra Lightweight", "Real-time"],
    recommended_for: "Mobile Browsers, Low-end Laptops",
    performance_score: 10,
    quality_rating: "Balanced",
    release_date: "March 2025",
    source: "ONNX Community",
    url: "https://huggingface.co/onnx-community/gemma-3-270m-it-ONNX",
    quantized: true,
    quantType: "Q4_0",
    context_window: "32,000 tokens",
    modality: "Text-only",
    runtime_status: "Optimized"
  },
  {
    id: "gemma-3-1b-it-q4f16_1-MLC",
    name: "Gemma 3 1B (WebGPU Balanced)",
    description: "The sweet spot for intelligence and speed. Native 1B parameters optimized for WebGPU runtimes.",
    size: "861 MB",
    vram_required: "1.5 GB",
    tags: ["Google", "Gemma 3", "Native 1B"],
    recommended_for: "General Chatbots, Document Analysis",
    performance_score: 9,
    quality_rating: "Near Perfect",
    release_date: "March 2025",
    source: "MLC-AI",
    url: "https://huggingface.co/onnx-community/gemma-3-1b-it-ONNX",
    quantized: true,
    quantType: "Q4_0",
    context_window: "32,000 tokens",
    modality: "Text-only",
    runtime_status: "Stable"
  },
  {
    id: "gemma-2-2b-it-q4f16_1-MLC",
    name: "Gemma 2 2B (Stable Fallback)",
    description: "Mature WebGPU support. Highly stable across different browser versions and hardware.",
    size: "1.18 GB",
    vram_required: "2.5 GB",
    tags: ["Google", "Gemma 2", "Stable", "Legacy"],
    recommended_for: "Older Browsers, Stability-critical apps",
    performance_score: 8,
    quality_rating: "Balanced",
    release_date: "June 2024",
    source: "Hugging Face",
    url: "https://huggingface.co/google/gemma-2-2b-it-GGUF",
    quantized: true,
    quantType: "Q4_0",
    context_window: "8,192 tokens",
    modality: "Text-only",
    runtime_status: "Stable"
  },
  {
    id: "gemma-3n-e2b-it-q4f16_1-MLC",
    name: "Gemma 3n E2B (Multimodal)",
    description: "Mobile-optimized multimodal model. Supports text, image, and audio tasks via MatFormer architecture.",
    size: "1.2 GB",
    vram_required: "2.0 GB",
    tags: ["Google", "Multimodal", "Gemma 3n", "Advanced"],
    recommended_for: "Vision tasks, Audio apps on Mobile GPUs",
    performance_score: 7,
    quality_rating: "Near Perfect",
    release_date: "Jan 2026",
    source: "MLC-AI",
    url: "https://huggingface.co/google/gemma-3n-E2B",
    quantized: true,
    quantType: "PLE Optimized",
    context_window: "32,000 tokens",
    modality: "Text, Image, Audio",
    runtime_status: "Experimental"
  }
];

export const MODEL_CONFIG = prebuiltAppConfig;
