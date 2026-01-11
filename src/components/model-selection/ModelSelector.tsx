import { AVAILABLE_MODELS, ModelInfo } from "../../lib/constants";
import { Cpu, HardDrive, Zap, CheckCircle2, ChevronRight, BarChart3, AlertTriangle } from "lucide-react";

interface ModelSelectorProps {
  onSelect: (modelId: string) => void;
}

export function ModelSelector({ onSelect }: ModelSelectorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white relative z-10">
      
      {/* Header */}
      <div className="text-center space-y-4 mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 mb-4">
           <Cpu className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white/50">
          Choose Your Intelligence
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Select a model to run locally in your browser. All processing happens on your device, ensuring complete privacy.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {AVAILABLE_MODELS.map((model, idx) => (
          <ModelCard key={model.id} model={model} onSelect={onSelect} index={idx} />
        ))}
      </div>

      <div className="mt-12 flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
        <AlertTriangle className="w-3 h-3 text-yellow-500" />
        <span>Performance depends on your device's GPU capabilities.</span>
      </div>
    </div>
  );
}

function ModelCard({ model, onSelect, index }: { model: ModelInfo, onSelect: (id: string) => void, index: number }) {
  return (
    <div 
      className="group relative flex flex-col bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-zinc-800/80 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
            {model.name}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {model.tags.map(tag => (
              <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-xs ring-1 ring-indigo-500/20">
            {model.performance_score}/10
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed">
        {model.description}
      </p>

      {/* Specs */}
      <div className="space-y-3 mb-6 bg-black/20 rounded-xl p-4 border border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center text-gray-500">
            <HardDrive className="w-3 h-3 mr-2" /> Download Size
          </span>
          <span className="text-gray-200 font-mono">{model.size}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center text-gray-500">
            <Zap className="w-3 h-3 mr-2" /> VRAM Required
          </span>
          <span className="text-gray-200 font-mono">{model.vram_required}</span>
        </div>
         <div className="flex items-center justify-between text-xs">
          <span className="flex items-center text-gray-500">
            <BarChart3 className="w-3 h-3 mr-2" /> Eval
          </span>
          <span className="text-gray-200">Standard</span>
        </div>
      </div>

      {/* Action */}
      <button 
        onClick={() => onSelect(model.id)}
        className="w-full py-3 px-4 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center group-hover:shadow-lg"
      >
        <span>Select Model</span>
        <ChevronRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </button>

      {/* Recommendation Badge */}
      <div className="mt-4 pt-4 border-t border-white/5">
         <p className="text-[10px] text-gray-500 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1.5 text-emerald-500/70" />
            Recommended for: {model.recommended_for}
         </p>
      </div>
    </div>
  );
}
