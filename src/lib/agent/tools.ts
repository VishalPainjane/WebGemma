import { ChatCompletionTool } from "@mlc-ai/web-llm";

export const AVAILABLE_TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate",
      description: "Perform a mathematical calculation",
      parameters: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: "The mathematical expression to evaluate (e.g., '2 + 2 * 5')",
          },
        },
        required: ["expression"],
      },
    },
  }
];

export async function executeToolCall(name: string, args: any): Promise<string> {
  switch (name) {
    case "get_current_weather":
      // Mock weather data
      return JSON.stringify({
        location: args.location,
        temperature: "72",
        unit: args.unit || "fahrenheit",
        forecast: ["sunny", "windy"],
      });
      
    case "calculate":
      try {
        // Safety: only allow basic math characters
        if (/[^0-9+\-*/().\s]/.test(args.expression)) {
            return "Error: Invalid characters in expression.";
        }
        // eslint-disable-next-line no-new-func
        const result = new Function('return ' + args.expression)();
        return String(result);
      } catch (e) {
        return "Error evaluating expression.";
      }

    default:
      return "Error: Tool not found.";
  }
}
