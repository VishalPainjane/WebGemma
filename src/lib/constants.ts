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
  source: "Hugging Face" | "Ollama" | "Kaggle Models" | "LM Studio" | "MLC-AI";
  url: string;
  quantized: boolean;
  quantType?: string;
  requiresAuth?: boolean;
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
    release_date: "March 2025",
    source: "MLC-AI",
    url: "https://huggingface.co/google/gemma-3-1b-it",
    quantized: true,
    quantType: "Q8_0"
  },
  {
    id: "gemma-2-2b-it-q4f32_1-MLC",
    name: "Gemma 2 2B GGUF (Q4_K_M)",
    description: "4-bit quantization, good balance. Optimized for browser-based WebGPU execution.",
    size: "1.4 GB",
    vram_required: "1.5-2GB",
    tags: ["Google", "Gemma 2", "Balanced"],
    recommended_for: "Mid-range Laptops",
    performance_score: 8,
    quality_rating: "Balanced",
    release_date: "June 2024",
    source: "Hugging Face",
    url: "https://huggingface.co/bartowski/gemma-2-2b-it-GGUF",
    quantized: true,
    quantType: "Q4_K_M"
  },
  {
    id: "gemma-2-2b-it-q4f16_1-MLC",
    name: "Gemma 2 2B (IQ3_M)",
    description: "Importance matrix quantization, smallest size. Near-native performance with extreme efficiency.",
    size: "950 MB",
    vram_required: "1-1.5GB",
    tags: ["Google", "Gemma 2", "Efficient"],
    recommended_for: "Low-end devices, Mobile",
    performance_score: 7,
    quality_rating: "Medium",
    release_date: "June 2024",
    source: "Hugging Face",
    url: "https://huggingface.co/bartowski/gemma-2-2b-it-GGUF",
    quantized: true,
    quantType: "IQ3_M"
  },
  {
    id: "gemma-2-9b-it-q4f16_1-MLC",
    name: "Gemma 2 9B GGUF (Q3_K_S)",
    description: "Larger model, heavily quantized for mid-range devices. Significantly more capable for complex reasoning.",
    size: "3.5 GB",
    vram_required: "4-5GB",
    tags: ["Google", "Large", "Expert"],
    recommended_for: "High-end Desktop, 16GB RAM devices",
    performance_score: 6,
    quality_rating: "Medium",
    release_date: "June 2024",
    source: "Hugging Face",
    url: "https://huggingface.co/bartowski/gemma-2-9b-it-GGUF",
    quantized: true,
    quantType: "Q3_K_S"
  },
  {
    id: "gemma-2-2b-it-int4-MLC",
    name: "Gemma 2 2B INT4",
    description: "Extreme compression for mobile devices and edge deployment via TFLite/MLC optimization.",
    size: "1.2 GB",
    vram_required: "512MB",
    tags: ["Kaggle", "Mobile", "Edge"],
    recommended_for: "Mobile Deployment, Web-Edge",
    performance_score: 9,
    quality_rating: "Low",
    release_date: "2024",
    source: "Kaggle Models",
    url: "https://www.kaggle.com/models/google/gemma-2",
    quantized: true,
    quantType: "INT4"
  }
];

export const MODEL_CONFIG = prebuiltAppConfig;