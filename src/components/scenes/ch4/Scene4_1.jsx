import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

// 完整案例世界觀的所有節點
const allNodes = [
  // 中心：病人
  { id: 'patient', label: '李先生', type: 'Patient', x: 310, y: 200, r: 36, ring: 0 },
  // 第一環：疾病
  { id: 'diabetes', label: '糖尿病', type: 'Disease', x: 310, y: 70, r: 28, ring: 1 },
  { id: 'hypertension', label: '高血壓', type: 'Disease', x: 480, y: 145, r: 28, ring: 1 },
  { id: 'ckd', label: '慢性腎臟病', type: 'Disease', x: 430, y: 310, r: 28, ring: 1 },
  // 第二環：藥物
  { id: 'metformin', label: 'Metformin', type: 'Drug', x: 160, y: 70, r: 26, ring: 2 },
  { id: 'amlodipine', label: 'Amlodipine', type: 'Drug', x: 560, y: 80, r: 26, ring: 2 },
  { id: 'furosemide', label: 'Furosemide', type: 'Drug', x: 540, y: 310, r: 26, ring: 2 },
  // 第三環：食物
  { id: 'highsugar', label: '高糖飲料', type: 'Food', x: 100, y: 160, r: 24, ring: 3 },
  { id: 'banana', label: '香蕉', type: 'Food', x: 100, y: 280, r: 24, ring: 3 },
  { id: 'highsalt', label: '高鹽食品', type: 'Food', x: 180, y: 360, r: 24, ring: 3 },
  // 第四環：症狀/營養素
  { id: 'glucose', label: '血糖', type: 'Symptom', x: 220, y: 140, r: 22, ring: 4 },
  { id: 'sodium', label: '鈉', type: 'Nutrient', x: 400, y: 380, r: 22, ring: 4 },
];

// 所有邊
const allEdges = [
  // 病人-疾病
  { id: 'e1', from: 'patient', to: 'diabetes', type: 'HAS_DISEASE', ring: 1 },
  { id: 'e2', from: 'patient', to: 'hypertension', type: 'HAS_DISEASE', ring: 1 },
  { id: 'e3', from: 'patient', to: 'ckd', type: 'HAS_DISEASE', ring: 1 },
  // 藥物-疾病
  { id: 'e4', from: 'metformin', to: 'diabetes', type: 'TREATS', ring: 2 },
  { id: 'e5', from: 'amlodipine', to: 'hypertension', type: 'TREATS', ring: 2 },
  { id: 'e6', from: 'furosemide', to: 'ckd', type: 'TREATS', ring: 2 },
  // 病人-藥物
  { id: 'e7', from: 'patient', to: 'metformin', type: 'TAKES', ring: 2 },
  // 疾病-食物
  { id: 'e8', from: 'diabetes', to: 'highsugar', type: 'SHOULD_AVOID', ring: 3 },
  { id: 'e9', from: 'hypertension', to: 'highsalt', type: 'SHOULD_AVOID', ring: 3 },
  { id: 'e10', from: 'ckd', to: 'banana', type: 'SHOULD_AVOID', ring: 3 },
  // 食物-營養素
  { id: 'e11', from: 'highsugar', to: 'glucose', type: 'CONTAINS', ring: 4 },
  { id: 'e12', from: 'highsalt', to: 'sodium', type: 'CONTAINS', ring: 4 },
];

const TYPE_COLORS = {
  Patient:  { fill: '#fef3c7', stroke: '#b45309', text: '#92400e' },
  Disease:  { fill: '#fde8e8', stroke: '#dc2626', text: '#991b1b' },
  Drug:     { fill: '#dbeafe', stroke: '#1d4ed8', text: '#1e3a8a' },
  Food:     { fill: '#dcfce7', stroke: '#15803d', text: '#14532d' },
  Nutrient: { fill: '#f3e8ff', stroke: '#7c3aed', text: '#4c1d95' },
  Symptom:  { fill: '#e0f2fe', stroke: '#0369a1', text: '#075985' },
};

const REL_COLORS = {
  HAS_DISEASE: '#b45309',
  TREATS:      '#1d4ed8',
  TAKES:       '#15803d',
  SHOULD_AVOID:'#dc2626',
  CONTAINS:    '#7c3aed',
};

export default function Scene4_1() {
  const { animStep } = useCourse();
  const [filterType, setFilterType] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // 根據動畫步驟決定顯示的節點和邊
  const visibleRing = Math.max(0, animStep - 1);
  const visibleNodes = allNodes.filter((n) => n.ring <= visibleRing);
  const visibleEdges = allEdges.filter((e) => e.ring <= visibleRing);

  // 過濾器
  const filteredNodes = filterType
    ? visibleNodes.filter((n) => n.type === filterType || n.id === 'patient')
    : visibleNodes;
  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = filterType
    ? visibleEdges.filter((e) => filteredNodeIds.has(e.from) && filteredNodeIds.has(e.to))
    : visibleEdges;

  const nodeTypes = ['Disease', 'Drug', 'Food', 'Nutrient', 'Symptom'];

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* 主要 SVG 舞台 */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 640 430"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {Object.entries(REL_COLORS).map(([type, color]) => (
              <marker key={type} id={`arrow4-${type}`}
                viewBox="0 0 10 10" refX="10" refY="5"
                markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={color} opacity="0.8" />
              </marker>
            ))}
          </defs>

          {/* SVG 背景 */}
          <rect width="640" height="430" fill="#ffffff" rx="0" />

          {/* 同心圓暗示（裝飾） */}
          {animStep >= 2 && [80, 155, 220].map((r, i) => (
            <circle key={i} cx="310" cy="200" r={r}
              fill="none" stroke="#d1ddf5" strokeWidth="1" strokeDasharray="4 4"
              opacity={0.6}
            />
          ))}

          {/* 邊 */}
          {filteredEdges.map((edge) => {
            const from = allNodes.find((n) => n.id === edge.from);
            const to = allNodes.find((n) => n.id === edge.to);
            if (!from || !to) return null;
            const color = REL_COLORS[edge.type] || '#64748b';
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const nx = dx / dist;
            const ny = dy / dist;
            const r1 = from.r || 24;
            const r2 = to.r || 24;
            const x1 = from.x + nx * r1;
            const y1 = from.y + ny * r1;
            const x2 = to.x - nx * (r2 + 6);
            const y2 = to.y - ny * (r2 + 6);
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={edge.id}>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={color}
                  strokeWidth="2.5"
                  markerEnd={`url(#arrow4-${edge.type})`}
                  opacity="0.7"
                />
                <text x={midX} y={midY - 5} textAnchor="middle"
                  fontSize="7" fill={color} opacity="0.9"
                  style={{
                    userSelect: 'none',
                    paintOrder: 'stroke',
                    stroke: '#ffffff',
                    strokeWidth: '2px',
                  }}>
                  {edge.type}
                </text>
              </g>
            );
          })}

          {/* 節點 */}
          {filteredNodes.map((node) => {
            const colors = TYPE_COLORS[node.type];
            const isHovered = hoveredNode === node.id;
            const dimmed = filterType && node.type !== filterType && node.id !== 'patient';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => filterType === node.type
                  ? setFilterType(null)
                  : node.type !== 'Patient' && setFilterType(node.type)
                }
                style={{ cursor: node.type !== 'Patient' ? 'pointer' : 'default', opacity: dimmed ? 0.25 : 1 }}
                className="transition-all duration-300"
              >
                {/* 光暈 */}
                {(isHovered || node.ring === 0) && (
                  <circle r={node.r + 8} fill="none" stroke={colors.stroke}
                    strokeWidth="1" opacity="0.3"
                    className={node.ring === 0 ? 'animate-ping' : ''}
                    style={{ animationDuration: '3s' }}
                  />
                )}
                <circle
                  r={node.r}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={node.ring === 0 ? 2.5 : 1.5}
                  style={{ filter: (isHovered || node.ring === 0) ? `drop-shadow(0 0 8px ${colors.stroke}50)` : 'none' }}
                />
                <text textAnchor="middle" dominantBaseline="middle"
                  fontSize={node.label.length > 5 ? 8 : (node.label.length > 3 ? 9 : 11)}
                  fontWeight="600" fill={colors.text}
                  style={{
                    userSelect: 'none',
                    pointerEvents: 'none',
                    paintOrder: 'stroke',
                    stroke: '#ffffff',
                    strokeWidth: '2px',
                  }}>
                  {node.label}
                </text>
                <text y={node.r + 12} textAnchor="middle"
                  fontSize="7" fill={colors.stroke} opacity="0.8"
                  style={{ userSelect: 'none', pointerEvents: 'none' }}>
                  :{node.type}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 步驟說明 */}
        {animStep === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
            <div className="text-center">
              <div className="text-4xl mb-3">🌌</div>
              <p className="text-slate-500 text-sm">點擊「下一步」逐環展開知識宇宙</p>
            </div>
          </div>
        )}

        {/* 步驟狀態 */}
        {animStep >= 1 && (
          <div className="absolute top-4 left-4 text-xs px-3 py-1.5 rounded-lg"
            style={{ background: '#ffffff', border: '1px solid #d1ddf5', color: '#334155', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            {animStep === 1 && '① 病人節點 — 知識宇宙的核心'}
            {animStep === 2 && '② 展開疾病層 — 共病關係'}
            {animStep === 3 && '③ 展開藥物層 — 用藥關係'}
            {animStep === 4 && '④ 展開食物層 — 飲食禁忌'}
            {animStep >= 5 && '⑤ 完整知識網路'}
          </div>
        )}
      </div>

      {/* 右側：過濾器 */}
      <div className="w-48 flex-shrink-0 border-l border-blue-100 p-4 flex flex-col gap-3"
        style={{ background: '#f5f8ff' }}>
        <div className="text-xs text-slate-400 uppercase tracking-widest">
          節點類型篩選
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          點擊篩選同類節點，觀察它們在圖中的分布
        </p>

        {nodeTypes.map((type) => {
          const colors = TYPE_COLORS[type];
          const count = visibleNodes.filter((n) => n.type === type).length;
          const isActive = filterType === type;

          return (
            <button
              key={type}
              onClick={() => count > 0 && setFilterType(isActive ? null : type)}
              disabled={count === 0}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all disabled:opacity-30"
              style={{
                background: isActive ? `${colors.stroke}15` : '#ffffff',
                border: `1px solid ${isActive ? colors.stroke : '#d1ddf5'}`,
                color: isActive ? colors.text : '#475569',
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: colors.stroke }} />
              <span className="flex-1 text-left">{type}</span>
              <span className="text-xs" style={{ color: colors.stroke }}>
                {count}
              </span>
            </button>
          );
        })}

        {filterType && (
          <button
            onClick={() => setFilterType(null)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all mt-1"
            style={{ background: '#ffffff', color: '#64748b', border: '1px solid #d1ddf5' }}
          >
            ✕ 清除篩選
          </button>
        )}

        <div className="mt-auto text-xs text-slate-400 leading-relaxed border-t border-blue-100 pt-3">
          節點數：{visibleNodes.length}<br />
          關係數：{visibleEdges.length}
        </div>
      </div>
    </div>
  );
}
