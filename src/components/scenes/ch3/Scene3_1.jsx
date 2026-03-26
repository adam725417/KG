import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const scenarios = [
  {
    id: 'multi-entity',
    title: '多實體關聯',
    icon: '🕸',
    color: '#0369a1',
    description: '問題同時涉及多種不同類型的實體（病人、疾病、藥物、食物）',
    example: '糖尿病患者服用 Metformin，晚餐可以吃什麼？',
    pathNodes: ['patient', 'disease', 'drug', 'food'],
    pathEdges: ['HAS_DISEASE', 'TAKES', 'SHOULD_AVOID'],
    whyGraph: 'Graph 天生以節點和邊表達多種實體及其關係，不需要多層 JOIN',
  },
  {
    id: 'multi-hop',
    title: '多跳推理',
    icon: '🔗',
    color: '#7c3aed',
    description: '答案需要沿著多段關係邊推導，不存在於單一表格中',
    example: '這個病人的疾病，用的藥物，有哪些飲食禁忌？',
    pathNodes: ['patient', 'disease', 'drug', 'food'],
    pathEdges: ['HAS_DISEASE', 'TREATED_BY', 'DRUG_AVOIDS'],
    whyGraph: 'Cypher 的路徑語法可以自然地表達多跳查詢，無需複雜的 JOIN 嵌套',
  },
  {
    id: 'trace',
    title: '關聯追蹤',
    icon: '🔍',
    color: '#15803d',
    description: '需要追蹤某個實體如何透過多個中間節點影響另一個實體',
    example: '某食物中的鈉含量，會如何影響高血壓患者的血壓控制？',
    pathNodes: ['food', 'nutrient', 'symptom', 'disease'],
    pathEdges: ['CONTAINS', 'CAUSES', 'WORSENS'],
    whyGraph: 'Graph 的路徑遍歷天然適合追蹤影響鏈，可視化展示更直觀',
  },
  {
    id: 'explain',
    title: '可解釋查詢',
    icon: '💡',
    color: '#b45309',
    description: '需要知道答案是從哪條路徑推導出來的，而不只是得到結果',
    example: '為什麼系統建議這位病人避免某食物？根據是什麼？',
    pathNodes: ['patient', 'disease', 'food'],
    pathEdges: ['HAS_DISEASE', 'SHOULD_AVOID'],
    whyGraph: 'Graph 查詢的路徑本身就是解釋：「病人有疾病X，疾病X應避免食物Y」',
  },
];

// 路徑動畫的節點位置
const pathLayout = {
  patient:  { x: 80,  y: 180, label: '病人',    type: 'Patient'  },
  disease:  { x: 220, y: 100, label: '疾病',    type: 'Disease'  },
  drug:     { x: 360, y: 180, label: '藥物',    type: 'Drug'     },
  food:     { x: 500, y: 100, label: '食物',    type: 'Food'     },
  nutrient: { x: 220, y: 100, label: '營養素',  type: 'Nutrient' },
  symptom:  { x: 360, y: 180, label: '症狀',    type: 'Symptom'  },
};

const TYPE_COLORS = {
  Patient:  { fill: '#fef3c7', stroke: '#b45309', text: '#92400e' },
  Disease:  { fill: '#fde8e8', stroke: '#dc2626', text: '#991b1b' },
  Drug:     { fill: '#dbeafe', stroke: '#1d4ed8', text: '#1e3a8a' },
  Food:     { fill: '#dcfce7', stroke: '#15803d', text: '#14532d' },
  Nutrient: { fill: '#f3e8ff', stroke: '#7c3aed', text: '#4c1d95' },
  Symptom:  { fill: '#e0f2fe', stroke: '#0369a1', text: '#075985' },
};

export default function Scene3_1() {
  const { animStep } = useCourse();
  const [activeScenario, setActiveScenario] = useState(null);

  const visibleScenarios = scenarios.slice(0, Math.max(0, animStep));
  const activeData = scenarios.find((s) => s.id === activeScenario);

  // 計算路徑節點
  const pathNodeIds = activeData?.pathNodes || [];
  const pathNodes = pathNodeIds.map((id) => pathLayout[id]).filter(Boolean);

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* 左側：情境卡片 */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-2 p-4 border-r border-blue-100 overflow-y-auto"
        style={{ background: '#f5f8ff' }}>
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">
          適合情境
        </div>

        {scenarios.map((scenario, i) => {
          const isVisible = i < animStep;
          const isActive = activeScenario === scenario.id;

          return (
            <div
              key={scenario.id}
              className="transition-all duration-500 cursor-pointer"
              style={{
                opacity: isVisible ? 1 : 0.15,
                transform: isVisible ? 'translateX(0)' : 'translateX(-16px)',
                transitionDelay: `${i * 0.1}s`,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
              onClick={() => isVisible && setActiveScenario(isActive ? null : scenario.id)}
            >
              <div
                className="rounded-xl p-3 transition-all"
                style={{
                  background: isActive ? `${scenario.color}12` : '#ffffff',
                  border: `1px solid ${isActive ? scenario.color : '#d1ddf5'}`,
                  boxShadow: isActive ? `0 0 12px ${scenario.color}15` : '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{scenario.icon}</span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: isActive ? scenario.color : '#334155' }}
                  >
                    {scenario.title}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  {scenario.description}
                </p>
                {isActive && (
                  <div
                    className="mt-2 text-xs px-2 py-1 rounded italic"
                    style={{ background: '#eff6ff', color: '#475569' }}
                  >
                    例：{scenario.example}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 右側：路徑動畫示意 */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6">
        {animStep === 0 ? (
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-slate-500 text-sm">點擊「下一步」揭示適合 Knowledge Graph 的問題情境</p>
          </div>
        ) : activeData ? (
          <>
            {/* 路徑示意圖 */}
            <div className="mb-4">
              <div
                className="text-sm font-semibold mb-1 text-center"
                style={{ color: activeData.color }}
              >
                {activeData.title} — 多跳路徑示意
              </div>
              <div
                className="text-xs text-slate-400 text-center mb-4"
                style={{ fontStyle: 'italic' }}
              >
                「{activeData.example}」
              </div>

              <svg width="580" height="260" className="mx-auto" style={{ overflow: 'visible' }}>
                <defs>
                  <marker id="arrow-path-highlight" viewBox="0 0 10 10" refX="10" refY="5"
                    markerWidth="8" markerHeight="8" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={activeData.color} />
                  </marker>
                </defs>
                <rect width="580" height="260" rx="12" fill="#f8fafc" opacity="1" />

                {/* 路徑節點 */}
                {pathNodes.map((node, i) => {
                  const colors = TYPE_COLORS[node.type];
                  return (
                    <g key={i} transform={`translate(${node.x}, ${node.y})`}>
                      <circle r="28" fill={colors.fill} stroke={activeData.color}
                        strokeWidth="2.5"
                        style={{ filter: `drop-shadow(0 0 8px ${activeData.color}30)` }}
                      />
                      <circle r="34" fill="none" stroke={activeData.color}
                        strokeWidth="1" opacity="0.3"
                        className="animate-ping"
                        style={{ animationDuration: `${1.5 + i * 0.3}s` }}
                      />
                      <text textAnchor="middle" dominantBaseline="middle"
                        fontSize={node.label.length > 3 ? 9 : 11} fontWeight="700"
                        fill={colors.text}
                        style={{
                          userSelect: 'none',
                          paintOrder: 'stroke',
                          stroke: '#ffffff',
                          strokeWidth: '2px',
                        }}>
                        {node.label}
                      </text>
                      <text y="38" textAnchor="middle" fontSize="9" fill={colors.stroke}
                        opacity="0.9" style={{ userSelect: 'none' }}>
                        :{node.type}
                      </text>

                      {/* 步驟數字 */}
                      <circle cx="22" cy="-22" r="10" fill={activeData.color} />
                      <text x="22" y="-22" textAnchor="middle" dominantBaseline="middle"
                        fontSize="9" fontWeight="700" fill="#ffffff" style={{ userSelect: 'none' }}>
                        {i + 1}
                      </text>
                    </g>
                  );
                })}

                {/* 路徑連線 */}
                {pathNodes.map((node, i) => {
                  if (i === pathNodes.length - 1) return null;
                  const next = pathNodes[i + 1];
                  const dx = next.x - node.x;
                  const dy = next.y - node.y;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  const nx = dx / dist;
                  const ny = dy / dist;
                  const r = 28;
                  const x1 = node.x + nx * r;
                  const y1 = node.y + ny * r;
                  const x2 = next.x - nx * (r + 8);
                  const y2 = next.y - ny * (r + 8);
                  const edgeLabel = activeData.pathEdges[i] || '';

                  return (
                    <g key={i}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={activeData.color}
                        strokeWidth="2.5"
                        markerEnd="url(#arrow-path-highlight)"
                        style={{ filter: `drop-shadow(0 0 4px ${activeData.color}40)` }}
                      />
                      <text
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2 - 10}
                        textAnchor="middle" fontSize="9" fontWeight="700"
                        fill={activeData.color}
                        style={{
                          userSelect: 'none',
                          paintOrder: 'stroke',
                          stroke: '#ffffff',
                          strokeWidth: '2px',
                        }}
                      >
                        {edgeLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 為什麼 Graph 適合 */}
            <div
              className="w-full max-w-lg rounded-xl p-4"
              style={{
                background: `${activeData.color}10`,
                border: `1px solid ${activeData.color}30`,
              }}
            >
              <div className="text-xs font-semibold mb-1" style={{ color: activeData.color }}>
                💡 為什麼 Knowledge Graph 適合這種問題？
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{activeData.whyGraph}</p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-2xl mb-3">👈</div>
            <p className="text-slate-500 text-sm">
              點擊左側情境卡片<br />查看對應的路徑示意
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
