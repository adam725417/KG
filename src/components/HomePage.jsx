import React, { useEffect, useState } from 'react';
import { courseData } from '../data/courseData';
import { CHAPTER_COLORS } from '../theme';

const CHAPTER_ICONS = { ch1: '📊', ch2: '🔗', ch3: '🎯', ch4: '🏥', ch5: '🤖' };

// 背景裝飾節點
const BG_NODES = [
  { x: 8,  y: 12, r: 22, color: '#dc2626' },
  { x: 28, y: 30, r: 28, color: '#1d4ed8' },
  { x: 55, y: 10, r: 18, color: '#15803d' },
  { x: 78, y: 25, r: 20, color: '#7c3aed' },
  { x: 18, y: 60, r: 24, color: '#b45309' },
  { x: 45, y: 70, r: 22, color: '#0369a1' },
  { x: 72, y: 65, r: 18, color: '#dc2626' },
  { x: 88, y: 45, r: 16, color: '#15803d' },
  { x: 35, y: 88, r: 20, color: '#1d4ed8' },
  { x: 65, y: 85, r: 24, color: '#b45309' },
];
const BG_EDGES = [
  [0,1],[1,2],[2,3],[0,4],[1,5],[3,7],[4,8],[5,9],[6,7],[5,6]
];

export default function HomePage({ onStart }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const fadeIn = (delay = 0) => ({
    opacity:   mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transition: `all 0.6s ease ${delay}s`,
  });

  return (
    <div className="h-screen overflow-auto relative" style={{ background: '#eef3fc' }}>
      {/* 背景 SVG 圖譜 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg width="100%" height="100%" style={{ opacity: 0.12 }}>
          {BG_EDGES.map(([a, b], i) => {
            const n1 = BG_NODES[a], n2 = BG_NODES[b];
            return (
              <line key={i}
                x1={`${n1.x}%`} y1={`${n1.y}%`}
                x2={`${n2.x}%`} y2={`${n2.y}%`}
                stroke="#2563eb" strokeWidth="2" strokeDasharray="6 4"
              />
            );
          })}
          {BG_NODES.map((n, i) => (
            <circle key={i} cx={`${n.x}%`} cy={`${n.y}%`} r={n.r}
              fill={n.color} opacity="0.7"
              className="animate-pulse-slow"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </svg>
        {/* 頂部漸層遮罩 */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #eef3fc00 0%, #eef3fccc 60%, #eef3fc 100%)' }}
        />
      </div>

      {/* 主內容 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-16 text-center">
        {/* 標籤 */}
        <div
          className="text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase"
          style={{
            background: '#dbeafe', color: '#1d4ed8',
            border: '1.5px solid #93c5fd',
            ...fadeIn(0),
          }}
        >
          互動教學課程
        </div>

        {/* 主標題 */}
        <h1 className="text-5xl font-black text-center mb-4 leading-tight" style={fadeIn(0.1)}>
          <span style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {courseData.title}
          </span>
        </h1>

        {/* 副標題 */}
        <p className="text-xl text-slate-500 mb-3" style={fadeIn(0.2)}>
          {courseData.subtitle}
        </p>

        {/* 描述 */}
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed mb-10" style={fadeIn(0.3)}>
          {courseData.description}
        </p>

        {/* 開始按鈕 */}
        <button
          onClick={onStart}
          className="px-10 py-4 rounded-2xl text-base font-bold transition-all duration-200 hover:scale-105 active:scale-95 mb-14 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
            color: '#fff',
            boxShadow: '0 4px 24px rgba(37,99,235,0.35)',
            ...fadeIn(0.4),
          }}
        >
          開始互動教學 →
        </button>

        {/* 章節卡片 */}
        <div className="w-full max-w-4xl" style={fadeIn(0.5)}>
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">課程章節</div>
          <div className="grid grid-cols-5 gap-3">
            {courseData.chapters.map((ch) => {
              const color = CHAPTER_COLORS[ch.id];
              return (
                <div
                  key={ch.id}
                  className="rounded-2xl p-4 text-center shadow-sm"
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${color}30`,
                    boxShadow: `0 2px 12px ${color}15`,
                  }}
                >
                  <div className="text-2xl mb-2">{CHAPTER_ICONS[ch.id]}</div>
                  <div className="text-xs font-bold mb-1" style={{ color }}>{ch.id.replace('ch', 'Ch. ')}</div>
                  <div className="text-xs text-slate-500 leading-tight">{ch.title}</div>
                  <div className="mt-2 text-xs font-semibold" style={{ color: color + 'aa' }}>
                    {ch.scenes.length} 幕
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 統計 */}
        <div className="flex items-center gap-10 mt-8" style={fadeIn(0.6)}>
          {[
            { label: '章節', value: courseData.chapters.length },
            { label: '動畫幕次', value: courseData.totalScenes },
            { label: '互動測驗', value: '20+' },
            { label: '知識重點', value: '60+' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black" style={{ color: '#2563eb' }}>{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
