import { useLLM } from './lib/hooks/use-llm';
import { ChatInterface } from './components/chat/ChatInterface';
import { DownloadProgress } from './components/status/DownloadProgress';

function App() {
  const { messages, sendMessage, isLoading, downloadProgress, isModelLoaded } = useLLM();

  // 1. Downloading or Initializing State
  if (!isModelLoaded) {
    if (downloadProgress) {
      return (
        <>
            <div className="wavy-background">
                <div className="wave-blob blob-1"></div>
                <div className="wave-blob blob-2"></div>
                <div className="wave-blob blob-3"></div>
            </div>
            <DownloadProgress progress={downloadProgress} />
        </>
      );
    }
    // Very brief state before the first progress report comes in
    return (
      <div className="flex flex-col h-screen items-center justify-center space-y-4 relative overflow-hidden">
        <div className="wavy-background">
            <div className="wave-blob blob-1"></div>
            <div className="wave-blob blob-2"></div>
            <div className="wave-blob blob-3"></div>
        </div>
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin z-10"></div>
        <p className="text-sm text-indigo-200 font-medium z-10">Booting up WebGemma...</p>
      </div>
    );
  }

  // 2. Chat State (Model is ready)
  return (
    <>
      <div className="wavy-background">
        <div className="wave-blob blob-1"></div>
        <div className="wave-blob blob-2"></div>
        <div className="wave-blob blob-3"></div>
      </div>
      <ChatInterface 
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </>
  );
}

export default App;