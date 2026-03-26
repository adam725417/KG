import React, { useState, useEffect } from 'react';
import { useCourse } from '../../context/CourseContext';

export default function Controls() {
  const {
    currentIndex, totalScenes, currentScene, animStep,
    isAutoPlay, showQuiz,
    nextScene, prevScene, replayScene,
    nextAnimStep, prevAnimStep,
    setIsAutoPlay, setShowQuiz,
  } = useCourse();

  const maxStep = currentScene?.animationSteps || 1;
  const isLastStep = animStep >= maxStep;
  const hasQuiz = currentScene?.quiz?.length > 0;

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const btn = (label, onClick, opts = {}) => {
    const { disabled, active, color = '#2563eb', title } = opts;
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: active ? `${color}15` : '#f0f6ff',
          color: active ? color : '#334155',
          border: `1.5px solid ${active ? color : '#d1ddf5'}`,
          boxShadow: active ? `0 0 0 2px ${color}22` : 'none',
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      className="flex-shrink-0 flex items-center justify-between px-5 py-2.5 border-t"
      style={{ background: '#ffffff', borderColor: '#d1ddf5' }}
    >
      {/* 左：動畫步驟控制 */}
      <div className="flex items-center gap-2">
        {btn('← 上一步', prevAnimStep, { disabled: animStep === 0, title: '上一個動畫步驟' })}
        {btn(
          isLastStep ? '已完成' : '下一步 →',
          nextAnimStep,
          { disabled: isLastStep, active: !isLastStep, color: '#2563eb', title: '下一個動畫步驟' }
        )}
        {btn(
          isAutoPlay ? '⏸ 暫停' : '▶ 自動播放',
          () => setIsAutoPlay((v) => !v),
          { active: isAutoPlay, color: '#7c3aed' }
        )}
        {btn('↺ 重播', replayScene, { title: '重播本幕動畫' })}
        <button
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border-dashed transition-all opacity-60"
          style={{ background: '#f0f6ff', color: '#94a3b8', border: '1.5px dashed #d1ddf5' }}
          title="旁白功能開發中"
          onClick={() => alert('旁白功能開發中，即將接入 TTS 服務')}
        >
          🔊 旁白
        </button>
      </div>

      {/* 中：場景切換 */}
      <div className="flex items-center gap-2">
        {btn('‹ 上一幕', prevScene, { disabled: currentIndex === 0 })}
        {hasQuiz && btn(
          showQuiz ? '✕ 關閉測驗' : '📝 測驗',
          () => setShowQuiz((v) => !v),
          { active: showQuiz, color: '#15803d' }
        )}
        {btn('下一幕 ›', nextScene, {
          disabled: currentIndex === totalScenes - 1,
          active: true, color: '#2563eb',
        })}
      </div>

      {/* 右：全螢幕 */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? '還原視窗' : '最大化版面'}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: isFullscreen ? '#0f172a15' : '#f0f6ff',
          color: isFullscreen ? '#0f172a' : '#334155',
          border: `1.5px solid ${isFullscreen ? '#0f172a40' : '#d1ddf5'}`,
        }}
      >
        {isFullscreen ? '⛶ 還原' : '⛶ 最大化'}
      </button>
    </div>
  );
}
