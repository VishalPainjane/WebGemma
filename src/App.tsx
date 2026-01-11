import { useLLM } from './lib/hooks/use-llm';
import { ChatInterface } from './components/chat/ChatInterface';
import { DownloadProgress } from './components/status/DownloadProgress';

function App() {
  const { messages, sendMessage, isLoading, downloadProgress, isModelLoaded } = useLLM();

  // 1. Downloading or Initializing State
  if (!isModelLoaded) {
    if (downloadProgress) {
      return <DownloadProgress progress={downloadProgress} />;
    }
    // Very brief state before the first progress report comes in
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-medium">Booting up WebGemma...</p>
      </div>
    );
  }

  // 2. Chat State (Model is ready)
  return (
    <ChatInterface 
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    />
  );
}

export default App;