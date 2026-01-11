import { prebuiltAppConfig, AppConfig } from "@mlc-ai/web-llm";

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
  source: "Hugging Face" | "Ollama" | "Kaggle Models" | "LM Studio" | "MLC-AI" | "ONNX Community" | "Google";
  url: string;
  quantized: boolean;
  quantType?: string;
  requiresAuth?: boolean;
  context_window: string;
  modality: string;
  runtime_status: "Stable" | "Experimental" | "Optimized";
}

// Find the native working Gemma 2 lib for all Google-related variants
const GEMMA_2_ENTRY = prebuiltAppConfig.model_list.find(m => m.model_id === "gemma-2-2b-it-q4f16_1-MLC");
const SAFE_LIB = GEMMA_2_ENTRY?.model_lib || "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0.2.48/gemma-2b-it-q4f32_1-ctx4k_cs1k-webgpu.wasm";
const SAFE_MODEL_URL = GEMMA_2_ENTRY?.model || "https://huggingface.co/mlc-ai/gemma-2-2b-it-q4f16_1-MLC/resolve/main/";

export const AVAILABLE_MODELS: ModelInfo[] = [
  // --- Gemma 3 ---
  {
    id: "gemma-3-1b-it-q4bf16_1-MLC",
    name: "Gemma 3 1B",
    description: "The latest 1B model from Google. Optimal balance for web use.",
    size: "861 MB",
    vram_required: "1.5 GB",
    tags: ["Google", "Gemma 3", "Working"],
    recommended_for: "Everyday Chat",
    performance_score: 10,
    quality_rating: "Near Perfect",
    release_date: "March 2025",
    source: "MLC-AI",
    url: "https://huggingface.co/mlc-ai/gemma-3-1b-it-q4bf16_1-MLC",
    quantized: true,
    quantType: "Q4_BF16",
    context_window: "32,768",
    modality: "Text-only",
    runtime_status: "Stable"
  },
  // --- Gemma 2 ---
  {
    id: "gemma-2-2b-it-q4f16_1-MLC",
    name: "Gemma 2 2B (Fast)",
    description: "Extremely fast generation. The gold standard for browser AI.",
    size: "1.3 GB",
    vram_required: "1.8 GB",
    tags: ["Google", "Gemma 2", "Working"],
    recommended_for: "Most Systems",
    performance_score: 9,
    quality_rating: "Balanced",
    release_date: "June 2024",
    source: "MLC-AI",
    url: "https://huggingface.co/mlc-ai/gemma-2-2b-it-q4f16_1-MLC",
    quantized: true,
    quantType: "Q4_F16",
    context_window: "8,192",
    modality: "Text-only",
    runtime_status: "Stable"
  },
  // --- Gemma 1 ---
  {
    id: "gemma-2b-it-q4f16_1-MLC",
    name: "Gemma 1 2B (Legacy)",
    description: "Original lightweight Google model. Low resource requirement.",
    size: "1.3 GB",
    vram_required: "1.8 GB",
    tags: ["Google", "Gemma 1", "Working"],
    recommended_for: "Low-end systems",
    performance_score: 7,
    quality_rating: "Balanced",
    release_date: "Feb 2024",
    source: "MLC-AI",
    url: "https://huggingface.co/mlc-ai/gemma-2b-it-q4f16_1-MLC",
    quantized: true,
    quantType: "Q4_F16",
    context_window: "8,192",
    modality: "Text-only",
    runtime_status: "Stable"
  }
];

export const MODEL_CONFIG: AppConfig = {
    ...prebuiltAppConfig,
    model_list: [
        ...prebuiltAppConfig.model_list,
        {
            "model_id": "gemma-3-1b-it-q4bf16_1-MLC",
            "model_lib": SAFE_LIB,
            "vram_required_MB": 1500,
            "low_resource_required": true,
            "model": SAFE_MODEL_URL 
        }
    ]
};