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
  quality_rating: "Lossless" | "Near Perfect" | "Balanced" | "Medium" | "Low";
  release_date: string;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: "gemma-3-1b-it-q8f16_1-MLC",
    name: "Gemma 3 1B (Max Quality)",
    description: "Native small model released March 2025. Highest intelligence-to-size ratio. Perfect for long documents with 32k context.",
    size: "1.1 GB",
    vram_required: "2GB",
    tags: ["Google", "Native 1B", "Gemma 3", "32k Context"],
    recommended_for: "Standard Laptops, High-Precision Tasks",
    performance_score: 10,
    quality_rating: "Lossless",
    release_date: "March 2025"
  },
  {
    id: "gemma-3-1b-it-q4f16_1-MLC",
    name: "Gemma 3 1B (Balanced)",
    description: "Extremely fast version of the native 1B model. Balanced for daily assistant tasks and quick summaries.",
    size: "650 MB",
    vram_required: "1.5GB",
    tags: ["Google", "Fast", "Gemma 3"],
    recommended_for: "Mobile Devices, Ultra-fast responses",
    performance_score: 9,
    quality_rating: "Balanced",
    release_date: "March 2025"
  },
  {
    id: "gemma-2-2b-it-iq3_xxs-MLC",
    name: "Gemma 2 2B (Deep Compression)",
    description: "Heavily quantized Gemma 2. Higher parameter count but more compression artifacts. Good for broad knowledge.",
    size: "1.18 GB",
    vram_required: "2.5GB",
    tags: ["Google", "Gemma 2", "IQ3", "Experimental"],
    recommended_for: "General Knowledge, Broad Queries",
    performance_score: 7,
    quality_rating: "Medium",
    release_date: "June 2024"
  },
  {
    id: "codegemma-2b-it-iq3_m-MLC",
    name: "CodeGemma 2B (IQ3)",
    description: "Specialized for programming tasks. Quantized to fit within the 1.4GB threshold while maintaining logic.",
    size: "1.30 GB",
    vram_required: "3GB",
    tags: ["Google", "Coding", "Python", "JS"],
    recommended_for: "Developers, Code Completion",
    performance_score: 8,
    quality_rating: "Medium",
    release_date: "April 2024"
  },
  {
    id: "gemma-3n-1b-it-q4f16_1-MLC",
    name: "Gemma 3n (Mobile optimized)",
    description: "NPU-optimized variant designed specifically for mobile and laptop silicon. Peak efficiency.",
    size: "800 MB",
    vram_required: "1.5GB",
    tags: ["Google", "NPU", "Mobile", "Gemma 3"],
    recommended_for: "MacBooks (M1-M4), Windows on ARM",
    performance_score: 9,
    quality_rating: "Near Perfect",
    release_date: "March 2025"
  }
];

export const MODEL_CONFIG = prebuiltAppConfig;
