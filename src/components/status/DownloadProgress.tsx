import { InitProgressReport } from '@mlc-ai/web-llm';
import { Loader2, Download, CheckCircle2 } from 'lucide-react';

interface DownloadProgressProps {
  progress: InitProgressReport;
}

export function DownloadProgress({ progress }: DownloadProgressProps) {
  const percentage = progress.progress || 0; 
  const isComplete = percentage === 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white relative z-10">
      
      {/* Glass Card */}
      <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl ring-1 ring-white/5 animate-in fade-in zoom-in duration-500">
        
        {/* Icon Header */}
        <div className="flex justify-center mb-8">
            <div className={`p-4 rounded-2xl ${isComplete ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'} ring-1 ring-white/10 shadow-lg shadow-black/20`}>
                {isComplete ? (
                    <CheckCircle2 className="w-8 h-8 animate-in zoom-in duration-300" />
                ) : (
                    <Download className="w-8 h-8 animate-bounce" />
                )}
            </div>
        </div>

        <div className="space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {isComplete ? "System Ready" : "Initializing Model"}
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            {isComplete 
              ? "Optimization complete. Launching interface..." 
              : "Downloading and compiling WebGemma to run locally on your device."}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
                <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-300 bg-indigo-900/30 border border-indigo-500/20">
                    {isComplete ? 'Done' : 'Loading'}
                </span>
                </div>
                <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-300">
                    {Math.round(percentage * 100)}%
                </span>
                </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-zinc-800 border border-white/5">
                <div 
                    style={{ width: `${percentage * 100}%` }} 
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-out ${isComplete ? 'bg-green-500' : 'bg-indigo-500'}`}
                ></div>
            </div>
        </div>

        {/* Status Text */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-500 h-6">
          {percentage === 0 || isComplete ? <Loader2 className="w-3 h-3 animate-spin text-indigo-500" /> : null}
          <span className="break-all line-clamp-1">{progress.text}</span>
        </div>

        {!isComplete && (
            <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                <span className="text-yellow-500 mt-0.5">⚠️</span>
                <p className="text-xs text-yellow-200/80 leading-relaxed">
                    Please keep this tab open. The model (~1.5GB) is being cached to your browser storage for future offline use.
                </p>
            </div>
        )}
      </div>
    </div>
  );
}