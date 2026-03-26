import React, { useState } from 'react';
import { NODE_COLORS, REL_COLORS } from '../../theme';

export { NODE_COLORS };

/**
 * 可重用的 SVG 知識圖譜畫布 — 淺色鮮明版
 * 節點：飽和填色 + 加粗描邊
 * 邊線：深色 + strokeWidth 2.5，確保在淺底清晰可見
 */
function getRelColor(type) {
  return REL_COLORS[type] || REL_COLORS.default;
}

/** 計算節點邊緣到節點邊緣的直線路徑（帶箭頭偏移） */
function calcLinePath(x1, y1, x2, y2, r1 = 28, r2 = 28) {
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / dist, ny = dy / dist;
  return {
    sx: x1 + nx * r1,
    sy: y1 + ny * r1,
    ex: x2 - nx * (r2 + 10),
    ey: y2 - ny * (r2 + 10),
    midX: (x1 + x2) / 2,
    midY: (y1 + y2) / 2,
  };
}

/** 曲線路徑（避免重疊邊） */
function calcCurvePath(x1, y1, x2, y2, curve = 0, r1 = 28, r2 = 28) {
  const { sx, sy, ex, ey, midX, midY } = calcLinePath(x1, y1, x2, y2, r1, r2);
  if (curve === 0) return `M ${sx} ${sy} L ${ex} ${ey}`;
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const perpX = -(dy / dist), perpY = dx / dist;
  const cpX = midX + perpX * curve, cpY = midY + perpY * curve;
  return `M ${sx} ${sy} Q ${cpX} ${cpY} ${ex} ${ey}`;
}

/* ── 單個節點 ────────────────────────────────────────── */
function GraphNode({ node, isHighlighted, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const colors = NODE_COLORS[node.type] || NODE_COLORS.Symptom;
  const r = node.r || 28;
  const active = isHighlighted || hovered || isSelected;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={() => onClick?.(node)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* 外光暈（active 時顯示） */}
      {active && (
        <circle
          r={r + 9}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.5"
          opacity="0.45"
        />
      )}

      {/* 主圓 */}
      <circle
        r={r}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={isSelected ? 3.5 : active ? 3 : 2.5}
        style={{
          filter: active
            ? `drop-shadow(0 2px 8px ${colors.stroke}55)`
            : `drop-shadow(0 1px 3px ${colors.stroke}30)`,
          transition: 'all 0.18s',
        }}
      />

      {/* 節點標籤文字 */}
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={node.labelSize || (node.label?.length > 5 ? 9 : 11)}
        fontWeight="700"
        fill={colors.text}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {node.label}
      </text>

      {/* 類型小字 */}
      {node.showType !== false && (
        <text
          y={r + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fontWeight="600"
          fill={colors.stroke}
          opacity="0.85"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          :{node.type}
        </text>
      )}
    </g>
  );
}

/* ── 主元件 ─────────────────────────────────────────── */
export default function GraphCanvas({
  nodes = [],
  edges = [],
  highlightedNodes = [],
  highlightedEdges = [],
  visibleEdgeCount = Infinity,
  onNodeClick,
  onEdgeHover,
  width = 600,
  height = 400,
  selectedNodeId,
  showEdgeDash = false,
  queryPathNodes = [],
}) {
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const visibleEdges = edges.slice(0, visibleEdgeCount);

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Arrow marker defs */}
        <defs>
          {/* 格線 pattern */}
          <pattern id="grid-light" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d1ddf5" strokeWidth="0.6" />
          </pattern>

          {/* 各關係類型的箭頭 */}
          {Object.entries(REL_COLORS).map(([type, color]) => (
            <marker
              key={type}
              id={`gc-arrow-${type}`}
              viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7"
              orient="auto"
            >
              <path d="M 0 1 L 9 5 L 0 9 Z" fill={color} />
            </marker>
          ))}
          {/* 高亮箭頭（白底深色） */}
          <marker
            id="gc-arrow-highlight"
            viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8"
            orient="auto"
          >
            <path d="M 0 1 L 9 5 L 0 9 Z" fill="#1e2d4a" />
          </marker>
        </defs>

        {/* 格線背景 */}
        <rect width={width} height={height} fill="url(#grid-light)" rx="12" opacity="0.6" />
        <rect width={width} height={height} fill="none" stroke="#d1ddf5" strokeWidth="1" rx="12" />

        {/* ── 邊線 ────────────────────────────────────── */}
        {visibleEdges.map((edge, idx) => {
          const fn = nodes.find((n) => n.id === edge.from);
          const tn = nodes.find((n) => n.id === edge.to);
          if (!fn || !tn) return null;

          const isHL = highlightedEdges.includes(edge.id);
          const isHov = hoveredEdge === edge.id;
          const color = isHL ? '#1e2d4a' : getRelColor(edge.type);
          const sw = isHL ? 3 : isHov ? 2.8 : 2.2;
          const pathD = calcCurvePath(
            fn.x, fn.y, tn.x, tn.y,
            edge.curve || 0, fn.r || 28, tn.r || 28,
          );
          const pathId = `gc-ep-${idx}`;

          return (
            <g key={edge.id || idx}>
              {/* 實際路徑 */}
              <path
                d={pathD}
                id={pathId}
                fill="none"
                stroke={color}
                strokeWidth={sw}
                strokeDasharray={showEdgeDash && !isHL ? '7 4' : 'none'}
                markerEnd={isHL ? 'url(#gc-arrow-highlight)' : `url(#gc-arrow-${edge.type || 'default'})`}
                opacity={isHL ? 1 : 0.82}
                style={{
                  filter: isHL
                    ? 'drop-shadow(0 0 4px rgba(30,45,74,0.5))'
                    : `drop-shadow(0 1px 3px ${color}44)`,
                  transition: 'all 0.18s',
                  animation: showEdgeDash && !isHL ? 'dashFlow 1.2s linear infinite' : 'none',
                }}
                onMouseEnter={() => { setHoveredEdge(edge.id); onEdgeHover?.(edge); }}
                onMouseLeave={() => { setHoveredEdge(null); onEdgeHover?.(null); }}
              />

              {/* 關係標籤 */}
              {edge.label && (
                <>
                  <path id={`${pathId}-label`} d={pathD} fill="none" stroke="none" />
                  <text style={{ pointerEvents: 'none', userSelect: 'none' }}>
                    <textPath href={`#${pathId}-label`} startOffset="50%" textAnchor="middle">
                      <tspan
                        fontSize="9"
                        fontWeight="700"
                        fill={isHL ? '#1e2d4a' : color}
                        style={{
                          paintOrder: 'stroke',
                          stroke: '#ffffff',
                          strokeWidth: '3px',
                        }}
                      >
                        {edge.label}
                      </tspan>
                    </textPath>
                  </text>
                </>
              )}

              {/* 加寬 hover 感應區 */}
              <path
                d={pathD}
                fill="none"
                stroke="transparent"
                strokeWidth="14"
                onMouseEnter={() => { setHoveredEdge(edge.id); onEdgeHover?.(edge); }}
                onMouseLeave={() => { setHoveredEdge(null); onEdgeHover?.(null); }}
                style={{ cursor: 'pointer' }}
              />
            </g>
          );
        })}

        {/* ── 節點 ────────────────────────────────────── */}
        {nodes.map((node) => (
          <GraphNode
            key={node.id}
            node={node}
            isHighlighted={highlightedNodes.includes(node.id) || queryPathNodes.includes(node.id)}
            isSelected={node.id === selectedNodeId}
            onClick={onNodeClick}
          />
        ))}
      </svg>
    </div>
  );
}
