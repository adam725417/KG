import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

// 共病場景的節點位置
const nodes = [
  { id: 'patient', label: '李先生', type: 'Patient', x: 310, y: 200, r: 34 },
  { id: 'diabetes', label: '糖尿病', type: 'Disease', x: 160, y: 90, r: 28 },
  { id: 'hypertension', label: '高血壓', type: 'Disease', x: 460, y: 90, r: 28 },
  { id: 'ckd', label: '慢性腎臟病', type: 'Disease', x: 310, y: 330, r: 28 },
  // 食物
  { id: 'highsugar', label: '高糖食品', type: 'Food', x: 60, y: 210, r: 24 },
  { id: 'highsalt', label: '高鹽食品', type: 'Food', x: 560, y: 210, r: 24 },
  { id: 'banana', label: '香蕉', type: 'Food', x: 310, y: 420, r: 24 },
  // 衝突食物（同時被多種疾病限制）
  { id: 'kfc', label: '炸雞排', type: 'Food', x: 160, y: 330, r: 24 },
  { id: 'toast', label: '白吐司', type: 'Food', x: 460, y: 330, r: 24 },
];

// 限制邊（HAS_DISEASE 在前，依疾病順序排列）
const restrictionEdges = [
  // 病人-疾病（animStep=1 顯示）
  { id: 'e9',  from: 'patient',      to: 'diabetes',    type: 'HAS_DISEASE',  color: '#94a3b8', disease: 'patient' },
  { id: 'e10', from: 'patient',      to: 'hypertension',type: 'HAS_DISEASE',  color: '#94a3b8', disease: 'patient' },
  { id: 'e11', from: 'patient',      to: 'ckd',         type: 'HAS_DISEASE',  color: '#94a3b8', disease: 'patient' },
  // 糖尿病的限制（animStep=2）
  { id: 'e1',  from: 'diabetes',     to: 'highsugar',   type: 'SHOULD_AVOID', color: '#dc2626', disease: 'diabetes' },
  { id: 'e2',  from: 'diabetes',     to: 'kfc',         type: 'SHOULD_AVOID', color: '#dc2626', disease: 'diabetes' },
  { id: 'e3',  from: 'diabetes',     to: 'toast',       type: 'SHOULD_AVOID', color: '#dc2626', disease: 'diabetes' },
  // 高血壓的限制（animStep=3）
  { id: 'e4',  from: 'hypertension', to: 'highsalt',    type: 'SHOULD_AVOID', color: '#b45309', disease: 'hypertension' },
  { id: 'e5',  from: 'hypertension', to: 'kfc',         type: 'SHOULD_AVOID', color: '#b45309', disease: 'hypertension' },
  // 慢性腎臟病的限制（animStep=4）
  { id: 'e6',  from: 'ckd',          to: 'banana',      type: 'SHOULD_AVOID', color: '#7c3aed', disease: 'ckd' },
  { id: 'e7',  from: 'ckd',          to: 'highsalt',    type: 'SHOULD_AVOID', color: '#7c3aed', disease: 'ckd' },
  { id: 'e8',  from: 'ckd',          to: 'toast',       type: 'SHOULD_AVOID', color: '#7c3aed', disease: 'ckd' },
];

// 衝突食物（被多種疾病同時限制的）
const conflictFoods = ['kfc', 'toast', 'highsalt'];

const TYPE_COLORS = {
  Patient:  { fill: '#fef3c7', stroke: '#b45309', text: '#92400e' },
  Disease:  { fill: '#fde8e8', stroke: '#dc2626', text: '#991b1b' },
  Food:     { fill: '#dcfce7', stroke: '#15803d', text: '#14532d' },
};

const DISEASE_INFO = {
  diabetes:     { name: '糖尿病', color: '#dc2626', avoids: ['高糖食品', '炸雞排', '白吐司'] },
  hypertension: { name: '高血壓', color: '#b45309', avoids: ['高鹽食品', '炸雞排'] },
  ckd:          { name: '慢性腎臟病', color: '#7c3aed', avoids: ['香蕉（高鉀）', '高鹽食品', '白吐司'] },
};

export default function Scene4_2() {
  const { animStep } = useCourse();
  const [selectedFood, setSelectedFood] = useState(null);
  const [hoveredConflict, setHoveredConflict] = useState(null);

  // 根據步驟決定顯示哪些邊
  // index 0-2: HAS_DISEASE, 3-5: 糖尿病, 6-7: 高血壓, 8-10: 腎臟病
  const visibleEdgeCount = (() => {
    if (animStep <= 1) return 3;  // 只有 HAS_DISEASE
    if (animStep === 2) return 6; // 加上糖尿病限制
    if (animStep === 3) return 8; // 加上高血壓限制
    return restrictionEdges.length; // 加上腎臟病限制（animStep >= 4）
  })();

  const visibleEdges = restrictionEdges.slice(0, visibleEdgeCount);

  // 找出選中食物受哪些疾病影響
  const selectedFoodEdges = selectedFood
    ? visibleEdges.filter((e) => e.to === selectedFood && e.disease !== 'patient')
    : [];

  const isConflict = (foodId) => {
    const affectingDiseases = visibleEdges.filter((e) => e.to === foodId && e.disease !== 'patient');
    return affectingDiseases.length >= 2;
  };

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* 主要 SVG 舞台 */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 640 470"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {[
              { id: 'r1', color: '#dc2626' },
              { id: 'r2', color: '#b45309' },
              { id: 'r3', color: '#7c3aed' },
              { id: 'r4', color: '#94a3b8' },
            ].map(({ id, color }) => (
              <marker key={id} id={`arrow-${id}`}
                viewBox="0 0 10 10" refX="10" refY="5"
                markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={color} opacity="0.9" />
              </marker>
            ))}
          </defs>

          {/* SVG 背景 */}
          <rect width="640" height="470" fill="#ffffff" />

          {/* 邊 */}
          {visibleEdges.map((edge) => {
            const from = nodes.find((n) => n.id === edge.from);
            const to = nodes.find((n) => n.id === edge.to);
            if (!from || !to) return null;

            const isSelected = selectedFood === edge.to && edge.disease !== 'patient';
            const isHighlighted = isSelected || (selectedFood === null);

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

            const arrowId = {
              '#dc2626': 'r1',
              '#b45309': 'r2',
              '#7c3aed': 'r3',
              '#94a3b8': 'r4',
            }[edge.color] || 'r4';

            return (
              <g key={edge.id}>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={edge.color}
                  strokeWidth={isSelected ? 3 : 2.5}
                  markerEnd={`url(#arrow-${arrowId})`}
                  opacity={selectedFood && !isSelected && edge.disease !== 'patient' ? 0.12 : 0.75}
                  style={{ filter: isSelected ? `drop-shadow(0 0 4px ${edge.color}60)` : 'none' }}
                />
                {edge.disease !== 'patient' && (
                  <text
                    x={(x1 + x2) / 2 + (dy > 0 ? -14 : 14)}
                    y={(y1 + y2) / 2 + (dx > 0 ? -8 : 8)}
                    fontSize="7" fill={edge.color} opacity={isSelected ? 0.9 : 0.6}
                    textAnchor="middle" style={{ userSelect: 'none' }}
                  >
                    AVOID
                  </text>
                )}
              </g>
            );
          })}

          {/* 節點 */}
          {nodes.map((node) => {
            const isFood = node.type === 'Food';
            const colors = TYPE_COLORS[node.type] || TYPE_COLORS.Food;
            const hasConflict = isFood && isConflict(node.id) && animStep >= 4;
            const isSelected = selectedFood === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => isFood && setSelectedFood(isSelected ? null : node.id)}
                style={{ cursor: isFood ? 'pointer' : 'default' }}
              >
                {/* 衝突光圈 */}
                {hasConflict && (
                  <>
                    <circle r={node.r + 12} fill="none" stroke="#dc2626"
                      strokeWidth="2" opacity="0.5"
                      className="conflict-ring"
                    />
                    <text y={node.r + 20} textAnchor="middle"
                      fontSize="10" fill="#dc2626"
                      style={{ userSelect: 'none' }}>⚠</text>
                  </>
                )}
                {/* 選中光暈 */}
                {isSelected && (
                  <circle r={node.r + 8} fill="none" stroke={colors.stroke}
                    strokeWidth="1.5" opacity="0.5"
                    className="animate-ping" style={{ animationDuration: '2s' }}
                  />
                )}
                <circle
                  r={node.r}
                  fill={colors.fill}
                  stroke={hasConflict ? '#dc2626' : isSelected ? colors.stroke : colors.stroke + '80'}
                  strokeWidth={hasConflict ? 2 : isSelected ? 2.5 : 1.5}
                  style={{ filter: (hasConflict || isSelected) ? `drop-shadow(0 0 8px ${hasConflict ? '#dc262640' : colors.stroke + '40'})` : 'none' }}
                />
                <text textAnchor="middle" dominantBaseline="middle"
                  fontSize={node.label.length > 5 ? 8 : 10} fontWeight="600"
                  fill={colors.text}
                  style={{
                    userSelect: 'none',
                    pointerEvents: 'none',
                    paintOrder: 'stroke',
                    stroke: '#ffffff',
                    strokeWidth: '2px',
                  }}>
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* 疾病圖例 */}
          {animStep >= 2 && (
            <g transform="translate(10, 10)">
              {[
                { disease: 'diabetes', color: '#dc2626', name: '糖尿病限制' },
                { disease: 'hypertension', color: '#b45309', name: '高血壓限制' },
                { disease: 'ckd', color: '#7c3aed', name: '腎臟病限制' },
              ].slice(0, animStep - 1).map(({ color, name }, i) => (
                <g key={i} transform={`translate(0, ${i * 20})`}>
                  <line x1="0" y1="8" x2="20" y2="8" stroke={color} strokeWidth="2.5" />
                  <text x="25" y="12" fontSize="9" fill={color} style={{ userSelect: 'none' }}>
                    {name}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>

        {/* 步驟說明 */}
        {animStep === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
            <div className="text-center">
              <div className="text-4xl mb-3">⚔️</div>
              <p className="text-slate-500 text-sm">點擊「下一步」逐步展示共病衝突</p>
            </div>
          </div>
        )}

        {/* 步驟說明（左上） */}
        {animStep >= 1 && (
          <div className="absolute top-4 left-4 text-xs px-3 py-1.5 rounded-lg"
            style={{ background: '#ffffff', border: '1px solid #d1ddf5', color: '#334155', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            {animStep === 1 && '① 病人同時罹患三種疾病（共病）'}
            {animStep === 2 && '② 糖尿病的飲食限制（紅線）'}
            {animStep === 3 && '③ 高血壓的飲食限制（橙線）'}
            {animStep === 4 && '④ 腎臟病的飲食限制（紫線）'}
            {animStep >= 5 && '⑤ 點擊食物節點 → 查看受哪些疾病限制'}
          </div>
        )}

        {/* 衝突說明框 */}
        {animStep >= 4 && !selectedFood && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-4 py-2 rounded-lg"
            style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' }}>
            ⚠ 帶有警示光圈的食物，同時被多種疾病限制（點擊查看）
          </div>
        )}
      </div>

      {/* 右側：衝突詳情 */}
      <div className="w-56 flex-shrink-0 border-l border-blue-100 overflow-y-auto p-4"
        style={{ background: '#f5f8ff' }}>
        {selectedFood ? (
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-3">
              飲食衝突分析
            </div>
            <div className="font-semibold text-slate-800 mb-3 text-sm">
              {nodes.find((n) => n.id === selectedFood)?.label}
            </div>

            {selectedFoodEdges.length === 0 ? (
              <p className="text-xs text-slate-400">此食物目前無限制顯示</p>
            ) : (
              <>
                <div className="text-xs text-slate-400 mb-2">
                  受 {selectedFoodEdges.length} 種疾病限制：
                </div>
                {selectedFoodEdges.map((edge) => {
                  const info = DISEASE_INFO[edge.disease];
                  if (!info) return null;
                  return (
                    <div key={edge.id} className="rounded-lg p-2.5 mb-2"
                      style={{
                        background: `${edge.color}10`,
                        border: `1px solid ${edge.color}30`,
                      }}>
                      <div className="text-xs font-semibold mb-0.5" style={{ color: edge.color }}>
                        {info.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        此疾病需避免此類食物
                      </div>
                    </div>
                  );
                })}

                {selectedFoodEdges.length >= 2 && (
                  <div className="rounded-lg p-2.5 mt-3"
                    style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
                    <div className="text-xs font-semibold text-red-600 mb-1">⚠ 多重衝突</div>
                    <p className="text-xs text-red-700 leading-relaxed">
                      此食物同時被 {selectedFoodEdges.length} 種疾病標記為應避免，共病患者必須特別注意。
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-3">
              共病資訊
            </div>
            {Object.entries(DISEASE_INFO).map(([id, info]) => (
              <div key={id} className="rounded-lg p-2.5 mb-2"
                style={{ background: `${info.color}10`, border: `1px solid ${info.color}30` }}>
                <div className="text-xs font-semibold mb-1.5" style={{ color: info.color }}>
                  {info.name}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  限制：{info.avoids.join('、')}
                </div>
              </div>
            ))}
            <div className="mt-3 text-xs text-slate-400 leading-relaxed">
              點擊圖中食物節點，查看它被哪些疾病限制
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
