import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

// GraphRAG 流程步驟
const flowSteps = [
  {
    id: 'query',
    step: 1,
    title: '使用者問題輸入',
    icon: '💬',
    color: '#0369a1',
    content: '糖尿病患者服用 Metformin 時，晚餐應避免哪些食物？',
    type: 'query',
  },
  {
    id: 'ner',
    step: 2,
    title: '實體辨識（NER）',
    icon: '🏷',
    color: '#7c3aed',
    content: ['糖尿病 → :Disease', 'Metformin → :Drug', '晚餐 → 觸發飲食查詢', '食物 → :Food（目標）'],
    type: 'entities',
  },
  {
    id: 'graph-expand',
    step: 3,
    title: '圖擴展（Graph Expansion）',
    icon: '🌐',
    color: '#15803d',
    content: '從辨識出的實體節點出發，在 Knowledge Graph 中擴展相關鄰居節點和路徑',
    type: 'graph',
  },
  {
    id: 'context',
    step: 4,
    title: '結構化 Context 組裝',
    icon: '📋',
    color: '#b45309',
    content: [
      '病人 → HAS_DISEASE → 糖尿病',
      '糖尿病 → TREATED_BY → Metformin',
      '糖尿病 → SHOULD_AVOID → 高糖飲料、精緻澱粉、含糖飲料',
      '(証據等級: A, 來源: ADA 2023)',
    ],
    type: 'context',
  },
  {
    id: 'llm',
    step: 5,
    title: 'LLM 生成答案',
    icon: '🤖',
    color: '#dc2626',
    content: '根據結構化知識路徑，生成有依據的自然語言答案，並可追溯推導路徑',
    type: 'llm',
  },
];

// 比較模式
const MODES = [
  { id: 'graphrag', label: 'GraphRAG 流程', color: '#15803d' },
  { id: 'rag', label: '傳統 RAG 流程', color: '#dc2626' },
];

export default function Scene5_3() {
  const { animStep } = useCourse();
  const [activeMode, setActiveMode] = useState('graphrag');
  const [hoveredStep, setHoveredStep] = useState(null);

  const visibleSteps = flowSteps.slice(0, Math.max(0, animStep));

  // 傳統 RAG 流程（對比）
  const ragSteps = [
    { id: 'r1', title: '問題向量化', icon: '🔢', color: '#64748b', desc: '問題轉成向量' },
    { id: 'r2', title: '相似度檢索', icon: '🔍', color: '#64748b', desc: '找最相似的段落 chunks' },
    { id: 'r3', title: 'LLM 生成', icon: '🤖', color: '#64748b', desc: '根據 chunks 直接生成答案' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 模式切換 */}
      <div className="flex-shrink-0 flex gap-3 px-6 pt-4 pb-2">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeMode === mode.id ? `${mode.color}12` : '#ffffff',
              color: activeMode === mode.id ? mode.color : '#64748b',
              border: `1px solid ${activeMode === mode.id ? mode.color : '#d1ddf5'}`,
            }}
          >
            {mode.id === 'graphrag' ? '⭐ ' : ''}{mode.label}
          </button>
        ))}
      </div>

      {/* 主要內容 */}
      <div className="flex-1 overflow-hidden">
        {activeMode === 'graphrag' ? (
          /* GraphRAG 流程 */
          <div className="h-full flex gap-0 overflow-hidden">
            {/* 流程步驟 */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="flex items-stretch gap-0 w-full max-w-3xl">
                {flowSteps.map((step, i) => {
                  const isVisible = i < visibleSteps.length;
                  const isHovered = hoveredStep === step.id;

                  return (
                    <React.Fragment key={step.id}>
                      {/* 步驟卡片 */}
                      <div
                        className="flex-1 transition-all duration-500 cursor-pointer"
                        style={{
                          opacity: isVisible ? 1 : 0.1,
                          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                          transitionDelay: `${i * 0.1}s`,
                        }}
                        onMouseEnter={() => setHoveredStep(step.id)}
                        onMouseLeave={() => setHoveredStep(null)}
                      >
                        <div
                          className="rounded-xl p-4 h-full flex flex-col items-center text-center gap-2 transition-all"
                          style={{
                            background: isHovered ? `${step.color}10` : '#ffffff',
                            border: `1px solid ${isHovered ? step.color : '#d1ddf5'}`,
                            boxShadow: isHovered ? `0 0 16px ${step.color}15` : '0 1px 4px rgba(0,0,0,0.06)',
                          }}
                        >
                          {/* 步驟號碼 */}
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: step.color, color: '#ffffff' }}
                          >
                            {step.step}
                          </div>

                          {/* 圖示 */}
                          <div className="text-2xl">{step.icon}</div>

                          {/* 標題 */}
                          <div
                            className="text-xs font-semibold leading-tight"
                            style={{ color: step.color }}
                          >
                            {step.title}
                          </div>

                          {/* 內容 */}
                          {isHovered && (
                            <div className="mt-1">
                              {Array.isArray(step.content) ? (
                                <div className="space-y-1">
                                  {step.content.map((item, j) => (
                                    <div key={j} className="text-xs text-slate-500 text-left font-mono leading-snug">
                                      {item}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  {step.content}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 箭頭 */}
                      {i < flowSteps.length - 1 && (
                        <div
                          className="flex items-center justify-center w-6 flex-shrink-0 transition-all duration-500"
                          style={{ opacity: i < visibleSteps.length - 1 ? 1 : 0.1 }}
                        >
                          <div style={{ color: '#94a3b8', fontSize: '16px' }}>→</div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* 傳統 RAG 流程（對比） */
          <div className="h-full overflow-y-auto p-6 flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                {ragSteps.map((step, i) => (
                  <React.Fragment key={step.id}>
                    <div
                      className="flex-1 rounded-xl p-5 text-center"
                      style={{ background: '#ffffff', border: '1px solid #d1ddf5' }}
                    >
                      <div className="text-2xl mb-2">{step.icon}</div>
                      <div className="text-xs font-semibold text-slate-500 mb-1">{step.title}</div>
                      <div className="text-xs text-slate-400">{step.desc}</div>
                    </div>
                    {i < ragSteps.length - 1 && (
                      <div className="text-slate-400 text-xl">→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* 問題列表 */}
              <div
                className="rounded-xl p-4"
                style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}
              >
                <div className="text-xs font-semibold text-red-600 mb-3">⚠ 傳統 RAG 的結構性限制</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { issue: '語意相似 ≠ 關係連貫', detail: '找到相似段落不代表找到了因果路徑' },
                    { issue: '無法保證多跳完整性', detail: '多跳推理所需的所有跳點可能找不全' },
                    { issue: '缺乏結構化推理依據', detail: 'LLM 收到的是碎片，而非完整路徑' },
                    { issue: '幻覺風險較高', detail: '沒有圖路徑支撐，LLM 容易自行填補' },
                  ].map((item) => (
                    <div key={item.issue}
                      className="rounded-lg p-2.5"
                      style={{ background: '#ffffff', border: '1px solid #fca5a5' }}>
                      <div className="text-xs font-semibold text-red-600 mb-0.5">{item.issue}</div>
                      <div className="text-xs text-slate-400 leading-relaxed">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 切換提示 */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveMode('graphrag')}
                  className="text-xs px-4 py-2 rounded-lg transition-all"
                  style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #15803d40' }}
                >
                  → 切換查看 GraphRAG 如何解決這些問題
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部：關鍵差異摘要 */}
      {animStep >= 3 && (
        <div
          className="flex-shrink-0 flex items-center gap-6 px-6 py-3 border-t border-blue-100"
          style={{ background: '#f5f8ff' }}
        >
          <div className="text-xs text-slate-400">核心差異：</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded" style={{ background: '#fef2f2', color: '#991b1b' }}>
              傳統 RAG
            </span>
            <span className="text-slate-400">語意相似 → chunk 拼接 → 生成</span>
          </div>
          <div className="text-slate-300">vs</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded" style={{ background: '#f0fdf4', color: '#14532d' }}>
              GraphRAG
            </span>
            <span className="text-slate-400">實體辨識 → 圖路徑擴展 → 結構化 Context → 生成</span>
          </div>
        </div>
      )}
    </div>
  );
}
