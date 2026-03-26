import React, { useState } from 'react';
import { useCourse } from '../../context/CourseContext';

export default function NarrationBox() {
  const { currentScene } = useCourse();
  const [isExpanded, setIsExpanded] = useState(true);
  if (!currentScene) return null;

  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm flex flex-col min-h-0"
      style={{ border: '1.5px solid #d1ddf5', background: '#ffffff', flex: '1 1 0' }}
    >
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="flex-shrink-0 w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 transition-all"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#2563eb' }} />
          <span className="text-xs font-bold text-slate-600 tracking-wide">教學旁白</span>
        </div>
        <span className="text-slate-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div
          className="flex-1 overflow-y-auto px-4 pb-4 border-t"
          style={{ borderColor: '#e8f0fe' }}
        >
          <p className="text-sm text-slate-700 leading-relaxed mt-3">{currentScene.narration}</p>
        </div>
      )}
    </div>
  );
}
