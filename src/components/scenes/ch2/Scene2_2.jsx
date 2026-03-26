import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

// 關係定義
const relationships = [
  {
    id: 'TREATS',
    from: { label: 'Metformin', type: 'Drug', x: 80, y: 180 },
    to: { label: '糖尿病', type: 'Disease', x: 320, y: 80 },
    color: '#1d4ed8',
    explanation: '某藥物用來治療某疾病。方向：藥物 → 疾病。',
    example: '(Metformin)-[:TREATS]->(糖尿病)',
    detail: 'TREATS 表示治療關係。藥物節點指向疾病節點，代表「這個藥物可用來治療這種疾病」。',
    properties: ['evidenceLevel: "A"', 'clinicalNote: "第一線用藥"'],
  },
  {
    id: 'SHOULD_AVOID',
    from: { label: '糖尿病', type: 'Disease', x: 320, y: 80 },
    to: { label: '高糖飲料', type: 'Food', x: 540, y: 180 },
    color: '#dc2626',
    explanation: '罹患某疾病的病人，應該避免某類食物。',
    example: '(糖尿病)-[:SHOULD_AVOID]->(高糖飲料)',
    detail: 'SHOULD_AVOID 表示飲食禁忌關係。疾病節點指向食物節點，代表「有這種疾病時應避免該食物」。',
    properties: ['severity: "high"', 'reason: "快速升高血糖"'],
  },
  {
    id: 'HAS_DISEASE',
    from: { label: '病人', type: 'Patient', x: 200, y: 310 },
    to: { label: '糖尿病', type: 'Disease', x: 320, y: 80 },
    color: '#b45309',
    explanation: '某病人罹患某種疾病，建立病人與疾病的關聯。',
    example: '(病人)-[:HAS_DISEASE]->(糖尿病)',
    detail: 'HAS_DISEASE 表示病人的診斷關係。病人節點指向疾病節點，讓系統能從病人出發查詢所有相關疾病。',
    properties: ['diagnosedAt: "2022-03"', 'status: "active"'],
  },
  {
    id: 'TAKES',
    from: { label: '病人', type: 'Patient', x: 200, y: 310 },
    to: { label: 'Metformin', type: 'Drug', x: 80, y: 180 },
    color: '#15803d',
    explanation: '某病人正在服用某藥物，記錄用藥行為。',
    example: '(病人)-[:TAKES]->(Metformin)',
    detail: 'TAKES 表示用藥關係。病人節點指向藥物節點，記錄病人目前服用的藥物及其劑量資訊。',
    properties: ['dosage: "500mg"', 'frequency: "BID"'],
  },
  {
    id: 'INTERACTS_WITH',
    from: { label: 'Metformin', type: 'Drug', x: 80, y: 180 },
    to: { label: 'Amlodipine', type: 'Drug', x: 430, y: 310 },
    color: '#7c3aed',
    explanation: '兩種藥物之間存在交互作用，可能增強或減弱彼此效果。',
    example: '(Metformin)-[:INTERACTS_WITH]->(Amlodipine)',
    detail: 'INTERACTS_WITH 記錄藥物間的交互關係。通常是雙向的，代表兩種藥同時服用時需要注意。',
    properties: ['type: "monitor"', 'severity: "moderate"'],
  },
];

// 節點顏色（light theme）
const TYPE_COLORS = {
  Drug:    { fill: '#dbeafe', stroke: '#1d4ed8', text: '#1e3a8a' },
  Disease: { fill: '#fde8e8', stroke: '#dc2626', text: '#991b1b' },
  Food:    { fill: '#dcfce7', stroke: '#15803d', text: '#14532d' },
  Patient: { fill: '#fef3c7', stroke: '#b45309', text: '#92400e' },
};

export default function Scene2_2() {
  const { animStep } = useCourse();
  const [selectedRel, setSelectedRel] = useState(null);

  const visibleRels = relationships.slice(0, Math.max(0, animStep - 1));
  const selectedRelData = relationships.find((r) => r.id === selectedRel);

  // 收集所有可見節點（去重）
  const allNodes = [];
  const nodeIds = new Set();
  visibleRels.forEach((rel) => {
    [rel.from, rel.to].forEach((n) => {
      const nodeId = `${n.label}-${n.type}`;
      if (!nodeIds.has(nodeId)) {
        nodeIds.add(nodeId);
        allNodes.push({ ...n, id: nodeId });
      }
    });
  });

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* 主要 SVG 舞台 */}
      <div className="flex-1 relative flex items-center justify-center">
        {animStep === 0 ? (
          <div className="text-center">
            <div className="text-5xl mb-4">↔</div>
            <p className="text-slate-500 text-sm">點擊「下一步」逐一展示不同類型的 Relationship</p>
          </div>
        ) : (
          <svg width="620" height="420" style={{ overflow: 'visible' }}>
            <defs>
              {relationships.map((rel) => (
                <marker key={rel.id}
                  id={`arrow-${rel.id}`}
                  viewBox="0 0 10 10" refX="10" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={rel.color} />
                </marker>
              ))}
            </defs>

            {/* 背景 */}
            <rect width="620" height="420" rx="12" fill="#f8fafc" opacity="1" />

            {/* 關係線 */}
            {visibleRels.map((rel) => {
              const isSelected = selectedRel === rel.id;
              const dx = rel.to.x - rel.from.x;
              const dy = rel.to.y - rel.from.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              const nx = dx / dist;
              const ny = dy / dist;
              const r = 24;
              const x1 = rel.from.x + nx * r;
              const y1 = rel.from.y + ny * r;
              const x2 = rel.to.x - nx * (r + 8);
              const y2 = rel.to.y - ny * (r + 8);

              return (
                <g key={rel.id}
                  onClick={() => setSelectedRel(isSelected ? null : rel.id)}
                  style={{ cursor: 'pointer' }}
                  className="transition-all duration-300"
                >
                  {/* 點擊範圍加寬 */}
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="transparent" strokeWidth="16"
                  />
                  {/* 實際線條 */}
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={rel.color}
                    strokeWidth={isSelected ? 3.5 : 2.5}
                    markerEnd={`url(#arrow-${rel.id})`}
                    opacity={isSelected ? 1 : 0.7}
                    style={{
                      filter: isSelected ? `drop-shadow(0 0 6px ${rel.color})` : 'none',
                    }}
                  />
                  {/* 關係標籤 */}
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill={rel.color}
                    style={{
                      userSelect: 'none',
                      pointerEvents: 'none',
                      paintOrder: 'stroke',
                      stroke: '#ffffff',
                      strokeWidth: '3px',
                    }}
                  >
                    {rel.id}
                  </text>
                </g>
              );
            })}

            {/* 節點 */}
            {allNodes.map((node) => {
              const colors = TYPE_COLORS[node.type];
              const isRelated = selectedRelData &&
                (selectedRelData.from.label === node.label ||
                 selectedRelData.to.label === node.label);

              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  {isRelated && (
                    <circle r="30" fill="none" stroke={colors.stroke}
                      strokeWidth="1" opacity="0.4"
                      className="animate-ping"
                    />
                  )}
                  <circle
                    r="24"
                    fill={colors.fill}
                    stroke={isRelated ? colors.stroke : colors.stroke + '80'}
                    strokeWidth={isRelated ? 2.5 : 1.5}
                    style={{
                      filter: isRelated ? `drop-shadow(0 0 8px ${colors.stroke})` : 'none',
                    }}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={node.label.length > 4 ? 8 : 10}
                    fontWeight="600"
                    fill={colors.text}
                    style={{
                      userSelect: 'none',
                      pointerEvents: 'none',
                      paintOrder: 'stroke',
                      stroke: '#ffffff',
                      strokeWidth: '2px',
                    }}
                  >
                    {node.label}
                  </text>
                  <text
                    y="32"
                    textAnchor="middle"
                    fontSize="8"
                    fill={colors.stroke}
                    opacity="0.8"
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                  >
                    :{node.type}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* 底部提示 */}
        {animStep >= 2 && !selectedRelData && (
          <div className="absolute bottom-4 text-xs text-slate-400 text-center">
            點擊關係線查看詳細說明
          </div>
        )}
      </div>

      {/* 右側：關係說明 */}
      <div
        className="w-64 flex-shrink-0 border-l border-blue-100 overflow-y-auto"
        style={{ background: '#f5f8ff' }}
      >
        {selectedRelData ? (
          <div className="p-4">
            {/* 關係名稱 */}
            <div
              className="rounded-lg p-3 mb-4"
              style={{
                background: `${selectedRelData.color}12`,
                border: `1px solid ${selectedRelData.color}40`,
              }}
            >
              <div
                className="text-base font-bold mb-1 font-mono"
                style={{ color: selectedRelData.color }}
              >
                [{selectedRelData.id}]
              </div>
              <div className="text-xs text-slate-500">
                {selectedRelData.explanation}
              </div>
            </div>

            {/* Cypher 範例 */}
            <div className="mb-4">
              <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Cypher 語法</div>
              <div
                className="rounded-lg p-3 font-mono text-xs leading-relaxed"
                style={{ background: '#1e2d4a', border: '1px solid #2d4a7a', color: '#a5b4fc' }}
              >
                {selectedRelData.example}
              </div>
            </div>

            {/* 詳細說明 */}
            <div className="mb-4">
              <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">詳細說明</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {selectedRelData.detail}
              </p>
            </div>

            {/* 屬性 */}
            <div>
              <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">關係屬性範例</div>
              {selectedRelData.properties.map((prop) => (
                <div
                  key={prop}
                  className="text-xs font-mono px-2 py-1 rounded mb-1"
                  style={{ background: '#ffffff', color: '#475569', border: '1px solid #d1ddf5' }}
                >
                  {prop}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 flex flex-col items-center justify-center h-full text-center">
            {/* 關係清單 */}
            <div className="w-full">
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-3">
                本幕關係類型
              </div>
              {relationships.map((rel, i) => (
                <div
                  key={rel.id}
                  className="flex items-center gap-2 py-2 border-b border-blue-100 text-xs cursor-pointer hover:bg-blue-50 px-2 rounded transition-all"
                  style={{ opacity: i < visibleRels.length ? 1 : 0.3 }}
                  onClick={() => i < visibleRels.length && setSelectedRel(rel.id)}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: rel.color }} />
                  <span className="font-mono" style={{ color: rel.color }}>{rel.id}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
