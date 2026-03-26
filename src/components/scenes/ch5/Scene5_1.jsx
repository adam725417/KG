import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const cyphers = [
  {
    id: 'create',
    keyword: 'CREATE',
    color: '#15803d',
    title: '建立節點',
    code: `CREATE (d:Disease {
  name: "糖尿病",
  icd: "E11",
  category: "代謝疾病"
})`,
    explanation: 'CREATE 用來建立新的節點。括號內是節點，冒號後是 Label，大括號內是屬性（Properties）。',
    effect: '在圖資料庫中新增一個 Disease 節點，代表「糖尿病」這個實體。',
    highlightNodes: ['diabetes'],
  },
  {
    id: 'create-rel',
    keyword: 'CREATE REL',
    color: '#1d4ed8',
    title: '建立關係',
    code: `MATCH (dr:Drug {name: "Metformin"})
MATCH (d:Disease {name: "糖尿病"})
CREATE (dr)-[:TREATS {
  evidenceLevel: "A",
  firstLine: true
}]->(d)`,
    explanation: 'CREATE 也可以建立關係。先 MATCH 找到兩個節點，再用箭頭語法建立有方向的關係，方括號內是關係類型和屬性。',
    effect: '在 Metformin 和糖尿病之間建立 TREATS 關係，代表「Metformin 治療糖尿病」。',
    highlightNodes: ['metformin', 'diabetes'],
    highlightEdges: ['e-treats'],
  },
  {
    id: 'match',
    keyword: 'MATCH',
    color: '#0369a1',
    title: '查詢節點與關係',
    code: `MATCH (p:Patient)-[:HAS_DISEASE]->(d:Disease)
      -[:SHOULD_AVOID]->(f:Food)
WHERE p.name = "李先生"
RETURN d.name, f.name`,
    explanation: 'MATCH 用來查詢符合特定圖模式（Pattern）的節點和關係。路徑模式就像在圖上畫一條路，找到所有符合的路徑。',
    effect: '找出李先生的所有疾病，以及這些疾病應避免的食物。',
    highlightNodes: ['patient', 'diabetes', 'highsugar'],
    highlightEdges: ['e-has', 'e-avoid'],
  },
  {
    id: 'merge',
    keyword: 'MERGE',
    color: '#b45309',
    title: '更新或建立（避免重複）',
    code: `MERGE (dr:Drug {name: "Aspirin"})
ON CREATE SET dr.class = "NSAID"
ON MATCH SET dr.updatedAt = date()`,
    explanation: 'MERGE 是 CREATE + MATCH 的結合：如果節點不存在就建立，如果存在就更新。避免建立重複的節點。',
    effect: '如果 Aspirin 不存在，就建立它；如果已存在，就更新 updatedAt 欄位。',
    highlightNodes: [],
  },
];

// 簡易圖示意節點
const demoNodes = [
  { id: 'patient', label: '李先生', type: 'Patient', x: 100, y: 180 },
  { id: 'diabetes', label: '糖尿病', type: 'Disease', x: 280, y: 100 },
  { id: 'metformin', label: 'Metformin', type: 'Drug', x: 280, y: 260 },
  { id: 'highsugar', label: '高糖飲料', type: 'Food', x: 460, y: 100 },
];

const TYPE_COLORS = {
  Patient:  { fill: '#fef3c7', stroke: '#b45309', text: '#92400e' },
  Disease:  { fill: '#fde8e8', stroke: '#dc2626', text: '#991b1b' },
  Drug:     { fill: '#dbeafe', stroke: '#1d4ed8', text: '#1e3a8a' },
  Food:     { fill: '#dcfce7', stroke: '#15803d', text: '#14532d' },
};

export default function Scene5_1() {
  const { animStep } = useCourse();
  const [selectedCypher, setSelectedCypher] = useState(null);

  const visibleCyphers = cyphers.slice(0, Math.max(0, animStep));
  const selectedData = cyphers.find((c) => c.id === selectedCypher);
  const highlightNodes = selectedData?.highlightNodes || [];

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* 左側：圖形視覺化 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-4 self-start">
          圖資料庫視覺化（Neo4j）
        </div>

        <svg width="540" height="300">
          <defs>
            <marker id="arrow-neo4j" viewBox="0 0 10 10" refX="10" refY="5"
              markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
            <marker id="arrow-neo4j-hl" viewBox="0 0 10 10" refX="10" refY="5"
              markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#1d4ed8" />
            </marker>
          </defs>
          {/* SVG background light */}
          <rect width="540" height="300" rx="12" fill="#f8fafc" />
          <rect width="540" height="300" rx="12" fill="none" stroke="#e2e8f0" strokeWidth="1" />

          {/* Neo4j 品牌色點綴 */}
          <text x="20" y="24" fontSize="11" fill="#018bff" opacity="0.8"
            style={{ userSelect: 'none' }}>
            neo4j
          </text>

          {/* 連線 */}
          {[
            { x1: 130, y1: 175, x2: 255, y2: 115, hl: highlightNodes.includes('patient') && highlightNodes.includes('diabetes') },
            { x1: 130, y1: 185, x2: 257, y2: 250, hl: highlightNodes.includes('metformin') },
            { x1: 305, y1: 255, x2: 305, y2: 135, hl: highlightNodes.includes('metformin') && highlightNodes.includes('diabetes') },
            { x1: 307, y1: 100, x2: 438, y2: 100, hl: highlightNodes.includes('highsugar') },
          ].map(({ x1, y1, x2, y2, hl }, i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={hl ? '#1d4ed8' : '#cbd5e1'}
              strokeWidth={hl ? 2.5 : 1.5}
              markerEnd={hl ? 'url(#arrow-neo4j-hl)' : 'url(#arrow-neo4j)'}
              style={{ filter: hl ? 'drop-shadow(0 0 4px #1d4ed840)' : 'none', transition: 'all 0.3s' }}
            />
          ))}

          {/* 節點 */}
          {demoNodes.map((node) => {
            const colors = TYPE_COLORS[node.type];
            const isHighlighted = highlightNodes.includes(node.id);
            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                {isHighlighted && (
                  <circle r="34" fill="none" stroke={colors.stroke}
                    strokeWidth="1.5" opacity="0.4"
                    className="animate-ping" style={{ animationDuration: '2s' }} />
                )}
                <circle r="26" fill={colors.fill}
                  stroke={isHighlighted ? colors.stroke : colors.stroke + '60'}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  style={{ filter: isHighlighted ? `drop-shadow(0 0 10px ${colors.stroke}40)` : 'none', transition: 'all 0.3s' }}
                />
                <text textAnchor="middle" dominantBaseline="middle"
                  fontSize={node.label.length > 5 ? 8 : 10} fontWeight="600"
                  fill={colors.text}
                  style={{
                    userSelect: 'none',
                    paintOrder: 'stroke',
                    stroke: '#ffffff',
                    strokeWidth: '2px',
                  }}>
                  {node.label}
                </text>
                <text y="34" textAnchor="middle" fontSize="8"
                  fill={colors.stroke} opacity="0.8" style={{ userSelect: 'none' }}>
                  :{node.type}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Neo4j 特點 */}
        {animStep >= 1 && (
          <div className="w-full max-w-md mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: '⚡', label: '原生圖資料庫', desc: '資料以圖形式原生儲存' },
              { icon: '🔤', label: 'Cypher 語法', desc: '直觀的圖查詢語言' },
              { icon: '🌐', label: 'ACID 保證', desc: '企業級資料一致性' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg p-2.5 text-center"
                style={{ background: '#ffffff', border: '1px solid #d1ddf5' }}>
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-xs font-semibold text-slate-600 mb-0.5">{item.label}</div>
                <div className="text-xs text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 右側：Cypher 語法卡片 */}
      <div className="w-80 flex-shrink-0 border-l border-blue-100 overflow-y-auto p-4"
        style={{ background: '#f5f8ff' }}>
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">
          Cypher 查詢語言
        </div>

        <div className="space-y-2">
          {cyphers.map((cypher, i) => {
            const isVisible = i < animStep;
            const isSelected = selectedCypher === cypher.id;

            return (
              <div
                key={cypher.id}
                className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                style={{
                  opacity: isVisible ? 1 : 0.1,
                  transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
                  border: `1px solid ${isSelected ? cypher.color : '#d1ddf5'}`,
                  background: isSelected ? `${cypher.color}10` : '#ffffff',
                  pointerEvents: isVisible ? 'auto' : 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
                onClick={() => isVisible && setSelectedCypher(isSelected ? null : cypher.id)}
              >
                {/* 標題 */}
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <span
                    className="text-xs font-bold font-mono px-2 py-0.5 rounded"
                    style={{ background: `${cypher.color}15`, color: cypher.color }}
                  >
                    {cypher.keyword}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">{cypher.title}</span>
                </div>

                {/* Cypher 程式碼 */}
                {isSelected && (
                  <div>
                    <pre
                      className="px-3 py-3 text-xs font-mono leading-relaxed overflow-x-auto border-t border-blue-100 whitespace-pre"
                      style={{ color: '#a5b4fc', background: '#1e2d4a' }}
                    >
                      {cypher.code}
                    </pre>
                    <div className="px-3 pb-3 pt-2 space-y-2">
                      <div>
                        <div className="text-xs font-semibold mb-1" style={{ color: cypher.color }}>
                          語法說明
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {cypher.explanation}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs font-semibold mb-1 text-slate-500">效果</div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {cypher.effect}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
