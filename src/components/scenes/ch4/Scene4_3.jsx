import React from 'react';
import { useCourse } from '../../../context/CourseContext';

const queryNodes = [
  { id: 'patient',  label: '李先生',   type: 'Patient', x: 80,  y: 180, r: 30 },
  { id: 'diabetes', label: '糖尿病',   type: 'Disease', x: 250, y: 90,  r: 28 },
  { id: 'metformin',label: 'Metformin',type: 'Drug',    x: 420, y: 180, r: 28 },
  { id: 'highsugar',label: '高糖飲料', type: 'Food',    x: 560, y: 90,  r: 28 },
  { id: 'highcarb', label: '精緻澱粉', type: 'Food',    x: 560, y: 270, r: 28 },
];

const queryEdges = [
  { id: 'qe1', from: 'patient',   to: 'diabetes',  label: 'HAS_DISEASE',  color: '#b45309' },
  { id: 'qe2', from: 'patient',   to: 'metformin', label: 'TAKES',        color: '#15803d' },
  { id: 'qe3', from: 'metformin', to: 'diabetes',  label: 'TREATS',       color: '#1d4ed8' },
  { id: 'qe4', from: 'diabetes',  to: 'highsugar', label: 'SHOULD_AVOID', color: '#dc2626' },
  { id: 'qe5', from: 'diabetes',  to: 'highcarb',  label: 'SHOULD_AVOID', color: '#dc2626' },
];

const TYPE_COLORS = {
  Patient: { fill: '#fef3c7', stroke: '#b45309', text: '#92400e' },
  Disease: { fill: '#fde8e8', stroke: '#dc2626', text: '#991b1b' },
  Drug:    { fill: '#dbeafe', stroke: '#1d4ed8', text: '#1e3a8a' },
  Food:    { fill: '#dcfce7', stroke: '#15803d', text: '#14532d' },
};

// 每個 animStep 對應的高亮狀態與說明
const STEPS = [
  {
    title: '查詢開始',
    desc: '問題輸入：「糖尿病患者服用 Metformin 時，晚餐應避免哪些食物？」',
    nodes: ['patient'],
    edges: [],
    cypher: '// 輸入查詢問題...',
  },
  {
    title: '從病人出發，找到疾病',
    desc: '從病人節點，沿著 HAS_DISEASE 關係，走到「糖尿病」節點。',
    nodes: ['patient', 'diabetes'],
    edges: ['qe1'],
    cypher: 'MATCH (p:Patient {name: "李先生"})\n-[:HAS_DISEASE]->(d:Disease)',
  },
  {
    title: '確認用藥 Metformin',
    desc: '確認病人服用的藥物，以及 Metformin 與糖尿病的 TREATS 關係。',
    nodes: ['patient', 'diabetes', 'metformin'],
    edges: ['qe1', 'qe2', 'qe3'],
    cypher: 'MATCH (p:Patient)\n-[:HAS_DISEASE]->(d:Disease),\n(p)-[:TAKES]->(dr:Drug)\n-[:TREATS]->(d)\nWHERE dr.name = "Metformin"',
  },
  {
    title: '找到應避免的食物',
    desc: '從糖尿病節點，沿著 SHOULD_AVOID 關係，找到所有應避免的食物。',
    nodes: ['patient', 'diabetes', 'metformin', 'highsugar', 'highcarb'],
    edges: ['qe1', 'qe2', 'qe3', 'qe4', 'qe5'],
    cypher: 'MATCH (p:Patient)\n-[:HAS_DISEASE]->(d:Disease)\n-[:SHOULD_AVOID]->(f:Food)\nRETURN f.name',
  },
  {
    title: '查詢完成，取得答案',
    desc: '答案路徑：病人 → 糖尿病 → 應避免食物。這條路徑本身就是推理的依據。',
    nodes: ['patient', 'diabetes', 'metformin', 'highsugar', 'highcarb'],
    edges: ['qe1', 'qe2', 'qe3', 'qe4', 'qe5'],
    cypher: '// 結果：\n// f.name = "高糖飲料"\n// f.name = "精緻澱粉"\n// (路徑本身就是解釋)',
  },
];

export default function Scene4_3() {
  const { animStep } = useCourse();

  // animStep 1~5 對應 STEPS[0~4]
  const currentStep = animStep >= 1 ? STEPS[Math.min(animStep - 1, STEPS.length - 1)] : null;
  const hlNodes = currentStep?.nodes || [];
  const hlEdges = currentStep?.edges || [];

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* 左側：步驟清單 */}
      <div className="w-56 flex-shrink-0 flex flex-col gap-2 p-4 border-r border-blue-100"
        style={{ background: '#f5f8ff' }}>
        <div className="rounded-xl p-3 mb-1"
          style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <div className="text-xs text-blue-700 font-semibold mb-1">查詢問題</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            糖尿病患者服用 Metformin，晚餐應避免哪些食物？
          </p>
        </div>

        <div className="text-xs text-slate-400 uppercase tracking-widest px-1">查詢步驟</div>

        {STEPS.map((s, i) => {
          const stepAnimStep = i + 1;
          const isActive = animStep === stepAnimStep;
          const isDone   = animStep > stepAnimStep;
          const isFuture = animStep < stepAnimStep;

          return (
            <div key={i}
              className="rounded-lg p-2.5 transition-all"
              style={{
                background: isActive ? '#eff6ff' : isDone ? '#f0fdf4' : '#ffffff',
                border: `1px solid ${isActive ? '#1d4ed8' : isDone ? '#15803d' : '#d1ddf5'}`,
                opacity: isFuture ? 0.4 : 1,
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: isActive ? '#1d4ed8' : isDone ? '#15803d' : '#e2e8f0',
                    color: (isActive || isDone) ? '#ffffff' : '#64748b',
                  }}>
                  {isDone ? '✓' : i + 1}
                </div>
                <span className="text-xs font-medium"
                  style={{ color: isActive ? '#1d4ed8' : isDone ? '#15803d' : '#64748b' }}>
                  {s.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 主要：SVG 圖形 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-4">
          {animStep === 0 ? (
            <div className="text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-slate-400 text-sm">點擊「下一步」開始多跳查詢示範</p>
            </div>
          ) : (
            <svg width="620" height="340" style={{ overflow: 'visible' }}>
              <defs>
                {queryEdges.map((edge) => (
                  <marker key={edge.id} id={`arrow-${edge.id}`}
                    viewBox="0 0 10 10" refX="10" refY="5"
                    markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z"
                      fill={hlEdges.includes(edge.id) ? edge.color : edge.color + '50'} />
                  </marker>
                ))}
              </defs>

              <rect width="620" height="340" rx="12" fill="#f8fafc" />

              {/* 邊 */}
              {queryEdges.map((edge) => {
                const from = queryNodes.find((n) => n.id === edge.from);
                const to   = queryNodes.find((n) => n.id === edge.to);
                if (!from || !to) return null;
                const isHL = hlEdges.includes(edge.id);

                const dx = to.x - from.x, dy = to.y - from.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const nx = dx / dist, ny = dy / dist;
                const x1 = from.x + nx * from.r;
                const y1 = from.y + ny * from.r;
                const x2 = to.x   - nx * (to.r + 8);
                const y2 = to.y   - ny * (to.r + 8);
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2;
                // 文字偏移：垂直線左移，水平線上移
                const lx = mx + (Math.abs(dy) > Math.abs(dx) ? -28 : 0);
                const ly = my + (Math.abs(dx) > Math.abs(dy) ? -10 : 0);

                return (
                  <g key={edge.id} style={{ transition: 'opacity 0.4s' }}
                    opacity={isHL ? 1 : (currentStep ? 0.15 : 0.5)}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={edge.color}
                      strokeWidth={isHL ? 3 : 2}
                      markerEnd={`url(#arrow-${edge.id})`}
                      style={{ filter: isHL ? `drop-shadow(0 0 5px ${edge.color}60)` : 'none', transition: 'all 0.4s' }}
                    />
                    <text x={lx} y={ly} textAnchor="middle" fontSize="8" fontWeight="700"
                      fill={edge.color}
                      style={{ userSelect: 'none', paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '2.5px' }}>
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* 節點 */}
              {queryNodes.map((node) => {
                const c = TYPE_COLORS[node.type];
                const isHL = hlNodes.includes(node.id);
                return (
                  <g key={node.id} transform={`translate(${node.x},${node.y})`}
                    style={{ transition: 'opacity 0.4s' }}
                    opacity={isHL ? 1 : (currentStep ? 0.2 : 0.6)}>
                    {isHL && (
                      <circle r={node.r + 10} fill="none" stroke={c.stroke}
                        strokeWidth="1.5" opacity="0.35"
                        className="animate-ping" style={{ animationDuration: '2s' }} />
                    )}
                    <circle r={node.r}
                      fill={c.fill}
                      stroke={c.stroke}
                      strokeWidth={isHL ? 2.5 : 1.5}
                      style={{ filter: isHL ? `drop-shadow(0 0 10px ${c.stroke}50)` : 'none', transition: 'all 0.4s' }}
                    />
                    <text textAnchor="middle" dominantBaseline="middle"
                      fontSize={node.label.length > 5 ? 8 : 10} fontWeight="600" fill={c.text}
                      style={{ userSelect: 'none', paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '2px' }}>
                      {node.label}
                    </text>
                    <text y={node.r + 14} textAnchor="middle" fontSize="8"
                      fill={c.stroke} opacity={isHL ? 0.9 : 0.5}
                      style={{ userSelect: 'none' }}>
                      :{node.type}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* 底部：步驟說明 + Cypher */}
        {currentStep && (
          <div className="flex-shrink-0 flex gap-4 px-4 pb-4 border-t border-blue-100 pt-3">
            <div className="flex-1 rounded-xl p-3"
              style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div className="text-xs font-semibold text-blue-700 mb-1">
                步驟 {animStep}：{currentStep.title}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{currentStep.desc}</p>
            </div>
            <div className="flex-1 rounded-xl p-3"
              style={{ background: '#1e2d4a', border: '1px solid #2d4a7a' }}>
              <div className="text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
                對應 Cypher 語法
              </div>
              <pre className="text-xs leading-relaxed font-mono whitespace-pre"
                style={{ color: '#a5b4fc' }}>
                {currentStep.cypher}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
