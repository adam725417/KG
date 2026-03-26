import React, { useState, useEffect } from 'react';
import { useCourse } from '../../../context/CourseContext';

// 文件段落（chunks）
const chunks = [
  { id: 'c1', text: 'Metformin 是治療第二型糖尿病的第一線藥物...', x: 80, y: 60, relevance: 0.92, related: true },
  { id: 'c2', text: '高糖食物會造成血糖快速上升，糖尿病患者應避免...', x: 240, y: 30, relevance: 0.85, related: true },
  { id: 'c3', text: '每日建議飲水量為 2000ml，有助於代謝廢物...', x: 420, y: 70, relevance: 0.23, related: false },
  { id: 'c4', text: 'Metformin 服用時應注意腎功能，腎功能不全者慎用...', x: 560, y: 40, relevance: 0.78, related: true },
  { id: 'c5', text: '血壓控制的飲食策略：減少鈉的攝取，多吃蔬菜...', x: 140, y: 180, relevance: 0.31, related: false },
  { id: 'c6', text: '升糖指數（GI）高的食物包括：白米、白麵包、西瓜...', x: 330, y: 150, relevance: 0.88, related: true },
  { id: 'c7', text: '運動對於糖尿病管理至關重要，建議每週 150 分鐘...', x: 500, y: 180, relevance: 0.42, related: false },
  { id: 'c8', text: '台灣糖尿病用藥指引（2023版）建議...', x: 60, y: 280, relevance: 0.71, related: true },
  { id: 'c9', text: '晚餐建議：多蔬菜、少澱粉、避免油炸食物...', x: 240, y: 290, relevance: 0.83, related: true },
  { id: 'c10', text: '藥物交互作用：Metformin 與酒精共服應特別注意...', x: 430, y: 270, relevance: 0.69, related: true },
];

const LIMITATIONS = [
  {
    id: 'l1',
    title: '只找相似，不找關係',
    desc: '向量相似度找到的是「語意相近的段落」，但不能保證這些段落在關係上是連貫的。',
    icon: '🔗',
  },
  {
    id: 'l2',
    title: '無法推理多跳關係',
    desc: '「病人→疾病→藥物→食物」這樣的多跳路徑，無法只靠向量相似度重建。',
    icon: '↔',
  },
  {
    id: 'l3',
    title: '答案缺乏結構依據',
    desc: '找到的 chunk 各自獨立，LLM 需要自行「猜測」它們之間的關係，容易幻覺。',
    icon: '🌫',
  },
];

export default function Scene5_2() {
  const { animStep } = useCourse();
  const [queryActive, setQueryActive] = useState(false);
  const [floatOffset, setFloatOffset] = useState(0);

  // 文件漂浮動畫
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatOffset((v) => (v + 0.05) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const showChunks = animStep >= 1;
  const showQuery = animStep >= 2;
  const showMatches = animStep >= 3;
  const showLimitations = animStep >= 4;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 主要視覺舞台 */}
      <div className="flex-1 relative overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0" style={{ background: '#eef3fc' }}>
          {/* 飄浮的 chunk 卡片 */}
          {showChunks && chunks.map((chunk, i) => {
            const floatY = Math.sin(floatOffset + i * 0.7) * 5;
            const isMatched = showMatches && chunk.related;
            const isHighRelevance = chunk.relevance > 0.75;

            return (
              <div
                key={chunk.id}
                className="absolute rounded-lg p-2 text-xs leading-snug transition-all duration-300 cursor-pointer"
                style={{
                  left: `${chunk.x}px`,
                  top: `${chunk.y + floatY}px`,
                  width: '160px',
                  background: isMatched
                    ? (isHighRelevance ? '#eff6ff' : '#ffffff')
                    : '#ffffff',
                  border: `1px solid ${isMatched
                    ? (isHighRelevance ? '#1d4ed8' : '#d1ddf5')
                    : '#e2e8f0'}`,
                  color: isMatched ? '#334155' : '#94a3b8',
                  boxShadow: isMatched && isHighRelevance
                    ? '0 0 12px rgba(29, 78, 216, 0.15)'
                    : '0 1px 3px rgba(0,0,0,0.06)',
                  opacity: showMatches ? 1 : (showChunks ? 0.8 : 0),
                  transform: `translateY(${showChunks ? '0' : '20px'})`,
                  transitionDelay: `${i * 0.05}s`,
                }}
              >
                {isMatched && isHighRelevance && (
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#1d4ed8' }} />
                    <span className="text-xs font-semibold text-blue-700">
                      相似度 {(chunk.relevance * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
                <p className="leading-snug" style={{ fontSize: '10px' }}>
                  {chunk.text.slice(0, 50)}...
                </p>
              </div>
            );
          })}

          {/* 查詢問題框 */}
          {showQuery && (
            <div
              className="absolute transition-all duration-500"
              style={{
                left: '50%', top: '35%',
                transform: 'translate(-50%, -50%)',
                opacity: showQuery ? 1 : 0,
              }}
            >
              <div
                className="rounded-xl px-5 py-3 text-sm font-medium text-slate-800"
                style={{
                  background: '#eff6ff',
                  border: '2px solid #1d4ed8',
                  boxShadow: '0 0 20px rgba(29, 78, 216, 0.15)',
                  whiteSpace: 'nowrap',
                }}
              >
                🔍 糖尿病患者服用 Metformin，晚餐應避免哪些食物？
              </div>

              {/* 向量射線示意 */}
              {showMatches && (
                <svg
                  className="absolute inset-0 pointer-events-none"
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                >
                  {chunks.filter((c) => c.related && c.relevance > 0.75).map((chunk, i) => {
                    const fromX = 0;
                    const fromY = 0;
                    const toX = (chunk.x - 550) + 80;
                    const toY = (chunk.y - 140) + 20;

                    return (
                      <line key={chunk.id}
                        x1={fromX} y1={fromY}
                        x2={toX} y2={toY}
                        stroke="#1d4ed8" strokeWidth="1"
                        strokeDasharray="4 3"
                        opacity="0.25"
                      />
                    );
                  })}
                </svg>
              )}
            </div>
          )}

          {/* 結構缺失說明 */}
          {showMatches && (
            <div
              className="absolute bottom-4 right-4 rounded-xl p-3 text-xs"
              style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                maxWidth: '200px',
              }}
            >
              <div className="font-semibold mb-1">⚠ 問題所在</div>
              <p className="leading-relaxed">
                找到的 chunk 彼此沒有「關係連結」，LLM 難以確認它們的因果邏輯。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 底部：RAG 限制卡片 */}
      {showLimitations && (
        <div
          className="flex-shrink-0 flex gap-3 px-6 py-4 border-t border-blue-100"
          style={{ background: '#f5f8ff' }}
        >
          {LIMITATIONS.map((lim, i) => (
            <div
              key={lim.id}
              className="flex-1 rounded-xl p-3 card-appear"
              style={{
                background: '#ffffff',
                border: '1px solid #d1ddf5',
                animationDelay: `${i * 0.2}s`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{lim.icon}</span>
                <div className="text-xs font-semibold text-slate-700">{lim.title}</div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{lim.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
