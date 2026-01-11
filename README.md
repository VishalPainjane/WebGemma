# WebGemma Agent

A private AI assistant that runs 100% on your device using Google's Gemma model and WebGPU.

## Features

- **Local Inference**: Uses `@mlc-ai/web-llm` to run Gemma 2B directly in the browser.
- **Privacy First**: No data leaves your device.
- **Agent Capabilities**: Can use tools (Function Calling) to perform tasks.
- **Optimized**: Uses Web Workers and WebGPU for performance.

## Project Structure

```
src/
├── agent/           # Tool definitions and execution logic
├── components/      # React components
│   ├── chat/        # Chat interface components
│   ├── status/      # Progress and status indicators
│   └── ui/          # Generic UI components
├── lib/             # Core logic and utilities
│   ├── hooks/       # React hooks (useLLM)
│   ├── store/       # State management (if needed)
│   └── utils/       # Helper functions (cn, etc.)
├── workers/         # Web Workers for off-thread processing
└── App.tsx          # Main application entry
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Requirements

- A browser with WebGPU support (Chrome 113+, Edge, etc.)
- A GPU with reasonable VRAM (4GB+ recommended for smooth performance, though 2B model fits in less).
