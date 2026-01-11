import { InitProgressReport } from '@mlc-ai/web-llm';
import { Loader2 } from 'lucide-react';

interface DownloadProgressProps {
  progress: InitProgressReport;
}

export function DownloadProgress({ progress }: DownloadProgressProps) {
  // Parse the progress text to determine percentage if possible, 
  // or rely on a simple visual indicator.
  // The report usually has a format like "Fetching param shard [1/15]..."
  
  // Note: 'progress' field in InitProgressReport is a number 0-1.
  const percentage = progress.progress || 0; 
  const isComplete = percentage === 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {isComplete ? "Finalizing..." : "Initializing WebGemma"}
          </h1>
          <p className="text-sm text-gray-500">
            {isComplete 
              ? "Compiling shaders and loading model into GPU. This can take a minute." 
              : "Loading the AI brain into your browser. This happens once."}
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden relative">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${percentage * 100}%` }}
          ></div>
          {percentage === 0 && (
             <div className="absolute inset-0 bg-blue-400/30 animate-pulse w-full h-full"></div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-600 h-6">
          {percentage === 0 || isComplete ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          <span className="break-all line-clamp-1">{progress.text}</span>
        </div>

        {!isComplete && (
            <div className="flex items-center justify-center gap-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-100">
            <span>⚠️</span>
            <span>Do not close this tab. The model is ~1.5GB.</span>
            </div>
        )}
      </div>
    </div>
  );
}
