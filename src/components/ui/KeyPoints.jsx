import React from 'react';
import { useCourse } from '../../context/CourseContext';

export default function KeyPoints() {
  const { currentScene } = useCourse();
  if (!currentScene?.keyPoints?.length) return null;

  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm flex flex-col min-h-0"
      style={{ border: '1.5px solid #bbf7d0', background: '#ffffff', flex: '1 1 0' }}
    >
      <div
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: '#15803d' }} />
        <span className="text-xs font-bold text-green-800 tracking-wide">知識重點</span>
      </div>
      <ul className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {currentScene.keyPoints.map((point, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold mt-0.5"
              style={{ background: '#dcfce7', color: '#15803d' }}
            >
              {i + 1}
            </span>
            <span className="text-xs text-slate-700 leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
