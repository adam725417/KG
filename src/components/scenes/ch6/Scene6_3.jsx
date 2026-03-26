import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const nodes = [
  {
    id: 'patient',
    label: '王小明',
    type: 'Patient',
    x: 300, y: 200, r: 32,
    fill: '#fef3c7', stroke: '#b45309', text: '#92400e',
    tooltip: { type: 'Patient', props: "{ name: '王小明', age: 58 }", desc: '代表病人個體' },
  },
  {
    id: 'disease1',
    label: '糖尿病',
    type: 'Disease',
    x: 130, y: 90, r: 28,
    fill: '#fde8e8', stroke: '#dc2626', text: '#991b1b',
    tooltip: { type: 'Disease', props: "{ name: '糖尿病', category: '慢性病' }", desc: '疾病實體' },
  },
  {
    id: 'disease2',
    label: '高血壓',
    type: 'Disease',
    x: 130, y: 310, r: 28,
    fill: '#fde8e8', stroke: '#dc2626', text: '#991b1b',
    tooltip: { type: 'Disease', props: "{ name: '高血壓', category: '慢性病' }", desc: '疾病實體' },
  },
  {
    id: 'drug',
    label: 'Metformin',
    type: 'Drug',
    x: 480, y: 90, r: 28,
    fill: '#dbeafe', stroke: '#1d4ed8', text: '#1e3a8a',
    tooltip: { type: 'Drug', props: "{ name: 'Metformin', warningLevel: 'medium' }", desc: '藥物資訊' },
  },
  {
    id: 'food1',
    label: '高糖飲料',
    type: 'Food',
    x: 480, y: 310, r: 28,
    fill: '#dcfce7', stroke: '#15803d', text: '#14532d',
    tooltip: { type: 'Food', props: "{ name: '高糖飲料', category: '飲料' }", desc: '食物限制' },
  },
  {
    id: 'food2',
    label: '葡萄柚',
    type: 'Food',
    x: 300, y: 370, r: 28,
    fill: '#dcfce7', stroke: '#15803d', text: '#14532d',
    tooltip: { type: 'Food', props: "{ name: '葡萄柚', category: '水果' }", desc: '食物限制' },
  },
  {
    id: 'nutrient',
    label: '糖分',
    type: 'Nutrient',
    x: 480, y: 200, r: 26,
    fill: '#f3e8ff', stroke: '#7c3aed', text: '#4c1d95',
    tooltip: { type: 'Nutrient', props: "{ name: '糖分' }", desc: '食物成分' },
  },
];

const edges = [
  { from: 'patient', to: 'disease1', label: 'HAS_DISEASE', color: '#b45309' },
  { from: 'patient', to: 'disease2', label: 'HAS_DISEASE', color: '#b45309' },
  { from: 'patient', to: 'drug', label: 'TAKES', color: '#15803d' },
  { from: 'drug', to: 'disease1', label: 'TREATS', color: '#1d4ed8' },
  { from: 'disease1', to: 'food1', label: 'SHOULD_AVOID', color: '#dc2626' },
  { from: 'drug', to: 'food2', label: 'INTERACTS_WITH', color: '#7c3aed' },
  { from: 'food1', to: 'nutrient', label: 'CONTAINS', color: '#7c3aed' },
];

const legend = [
  { type: 'Patient', fill: '#fef3c7', stroke: '#b45309', text: '#92400e' },
  { type: 'Disease', fill: '#fde8e8', stroke: '#dc2626', text: '#991b1b' },
  { type: 'Drug', fill: '#dbeafe', stroke: '#1d4ed8', text: '#1e3a8a' },
  { type: 'Food', fill: '#dcfce7', stroke: '#15803d', text: '#14532d' },
  { type: 'Nutrient', fill: '#f3e8ff', stroke: '#7c3aed', text: '#4c1d95' },
];

function getNodeById(id) {
  return nodes.find((n) => n.id === id);
}

function calcEdgePath(fromNode, toNode) {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return { x1: fromNode.x, y1: fromNode.y, x2: toNode.x, y2: toNode.y };
  const ux = dx / dist;
  const uy = dy / dist;
  const x1 = fromNode.x + ux * fromNode.r;
  const y1 = fromNode.y + uy * fromNode.r;
  const x2 = toNode.x - ux * (toNode.r + 6);
  const y2 = toNode.y - uy * (toNode.r + 6);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return { x1, y1, x2, y2, mx, my };
}

export default function Scene6_3() {
  const { animStep } = useCourse();
  const [hoveredNode, setHoveredNode] = useState(null);

  const showNodes = animStep >= 1;
  const showEdges = animStep >= 2;
  const showLegend = animStep >= 3;

  const hoveredData = nodes.find((n) => n.id === hoveredNode);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {animStep === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-400">點擊下一步開始</p>
        </div>
      )}

      {animStep >= 1 && (
        <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4">
          {/* Tooltip */}
          {hoveredData && (
            <div
              className="absolute z-20 rounded-xl p-3 pointer-events-none"
              style={{
                left: hoveredData.x + hoveredData.r + 12,
                top: hoveredData.y - 50,
                background: '#ffffff',
                border: `1px solid ${hoveredData.stroke}`,
                boxShadow: `0 4px 16px ${hoveredData.stroke}20`,
                minWidth: '180px',
                transform: 'translateX(-50%) translateX(40px)',
              }}
            >
              <div
                className="text-xs font-bold mb-1"
                style={{ color: hoveredData.stroke }}
              >
                :{hoveredData.tooltip.type}
              </div>
              <div
                className="text-xs font-mono mb-1"
                style={{ color: '#475569', background: '#f8fafc', borderRadius: '4px', padding: '4px 6px' }}
              >
                {hoveredData.tooltip.props}
              </div>
              <div className="text-xs text-slate-400">{hoveredData.tooltip.desc}</div>
            </div>
          )}

          <svg width="620" height="460" style={{ overflow: 'visible' }}>
            <defs>
              {edges.map((edge) => (
                <marker
                  key={`arrow-${edge.label}-${edge.color}`}
                  id={`arrow-${edge.from}-${edge.to}`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={edge.color} />
                </marker>
              ))}
            </defs>

            {/* 背景 */}
            <rect width="620" height="460" rx="16" fill="#f8fafc" />
            <rect width="620" height="460" rx="16" fill="none" stroke="#e2e8f0" strokeWidth="1" />

            {/* 邊 */}
            {showEdges && edges.map((edge, i) => {
              const fromNode = getNodeById(edge.from);
              const toNode = getNodeById(edge.to);
              if (!fromNode || !toNode) return null;
              const { x1, y1, x2, y2, mx, my } = calcEdgePath(fromNode, toNode);

              return (
                <g
                  key={`${edge.from}-${edge.to}`}
                  style={{
                    opacity: showEdges ? 1 : 0,
                    transition: `opacity 0.4s ease ${i * 0.08}s`,
                  }}
                >
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={edge.color}
                    strokeWidth="1.5"
                    markerEnd={`url(#arrow-${edge.from}-${edge.to})`}
                    opacity="0.7"
                  />
                  <text
                    x={mx} y={my - 5}
                    textAnchor="middle"
                    fontSize="8"
                    fill={edge.color}
                    style={{ userSelect: 'none' }}
                    opacity="0.9"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* 節點 */}
            {nodes.map((node, i) => (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                style={{
                  opacity: showNodes ? 1 : 0,
                  transform: showNodes
                    ? `translate(${node.x}px, ${node.y}px)`
                    : `translate(${node.x}px, ${node.y + 20}px)`,
                  transition: `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {hoveredNode === node.id && (
                  <circle
                    r={node.r + 8}
                    fill="none"
                    stroke={node.stroke}
                    strokeWidth="1.5"
                    opacity="0.25"
                  />
                )}
                <circle
                  r={node.r}
                  fill={node.fill}
                  stroke={node.stroke}
                  strokeWidth={hoveredNode === node.id ? 2.5 : 1.5}
                  style={{
                    filter: hoveredNode === node.id ? `drop-shadow(0 0 8px ${node.stroke}40)` : 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={node.label.length > 4 ? 9 : 11}
                  fontWeight="600"
                  fill={node.text}
                  style={{
                    userSelect: 'none',
                    paintOrder: 'stroke',
                    stroke: '#ffffff',
                    strokeWidth: '2px',
                  }}
                >
                  {node.label}
                </text>
                <text
                  y={node.r + 12}
                  textAnchor="middle"
                  fontSize="8"
                  fill={node.stroke}
                  opacity="0.8"
                  style={{ userSelect: 'none' }}
                >
                  :{node.type}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* 底部 legend */}
      {showLegend && (
        <div
          className="flex-shrink-0 flex items-center justify-center gap-4 px-6 py-3 border-t border-blue-100"
          style={{
            background: '#f5f8ff',
            opacity: showLegend ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {legend.map((item) => (
            <div key={item.type} className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ background: item.fill, border: `1.5px solid ${item.stroke}` }}
              />
              <span className="text-xs font-medium" style={{ color: item.text }}>
                {item.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
