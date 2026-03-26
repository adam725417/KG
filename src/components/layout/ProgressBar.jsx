import React from 'react';
import { useCourse } from '../../context/CourseContext';

export default function ProgressBar() {
  const { currentIndex, totalScenes, currentScene, animStep } = useCourse();
  const sceneProgress = ((currentIndex + 1) / totalScenes) * 100;
  const maxStep = currentScene?.animationSteps || 1;

  return (
    <div
      className="flex-shrink-0 px-5 py-2 flex items-center gap-5 border-b"
      style={{ background: '#ffffff', borderColor: '#d1ddf5' }}
    >
      {/* 整體進度 */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs font-medium text-slate-500 whitespace-nowrap">整體進度</span>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#e8f0fe' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${sceneProgress}%`,
              background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
            }}
          />
        </div>
        <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
          {currentIndex + 1} / {totalScenes}
        </span>
      </div>

      <div className="h-4 w-px bg-slate-200" />

      {/* 本幕步驟 */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs font-medium text-slate-500 whitespace-nowrap">本幕進度</span>
        <div className="flex gap-1.5">
          {Array.from({ length: maxStep }).map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: '22px',
                background: i < animStep ? '#2563eb' : '#e8f0fe',
              }}
            />
          ))}
        </div>
        <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
          {animStep} / {maxStep}
        </span>
      </div>
    </div>
  );
}
