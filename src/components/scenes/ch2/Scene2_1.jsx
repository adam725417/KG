import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';
import { NODE_COLORS } from '../../ui/GraphCanvas';

const nodeTypes = [
  {
    type: 'Disease',
    label: '疾病 (Disease)',
    examples: ['糖尿病', '高血壓', '慢性腎臟病', '心臟衰竭'],
    description: '代表一種醫療疾病或狀況。是 Knowledge Graph 中最核心的實體之一。',
    cypher: '(d:Disease {name: "糖尿病"})',
    icon: '🏥',
    properties: ['name', 'icd_code', 'category', 'severity'],
  },
  {
    type: 'Drug',
    label: '藥物 (Drug)',
    examples: ['Metformin', 'Amlodipine', 'Furosemide', 'Aspirin'],
    description: '代表一種藥物。可連結到它所治療的疾病，以及需要注意的飲食或交互作用。',
    cypher: '(dr:Drug {name: "Metformin"})',
    icon: '💊',
    properties: ['name', 'class', 'dosage', 'warningLevel'],
  },
  {
    type: 'Food',
    label: '食物 (Food)',
    examples: ['白米飯', '西瓜', '泡麵', '菠菜'],
    description: '代表一種食物或飲食項目。可連結到它對特定疾病或藥物的影響。',
    cypher: '(f:Food {name: "泡麵"})',
    icon: '🥗',
    properties: ['name', 'category', 'glycemicIndex', 'sodiumContent'],
  },
  {
    type: 'Patient',
    label: '病人 (Patient)',
    examples: ['李先生', '王女士', '陳同學'],
    description: '代表一位具體的病人。連結到他的疾病、用藥、飲食建議等各種個人化資訊。',
    cypher: '(p:Patient {id: "P001"})',
    icon: '🧑‍⚕️',
    properties: ['id', 'name', 'age', 'gender'],
  },
  {
    type: 'Nutrient',
    label: '營養素 (Nutrient)',
    examples: ['鈉', '鉀', '碳水化合物', '蛋白質'],
    description: '代表一種營養素成分。可連結到食物（含有）和疾病（影響）之間。',
    cypher: '(n:Nutrient {name: "鈉"})',
    icon: '🔬',
    properties: ['name', 'unit', 'dailyLimit', 'type'],
  },
];

const TYPE_COLORS = {
  Disease:  { fill: '#fde8e8', stroke: '#dc2626', text: '#991b1b' },
  Drug:     { fill: '#dbeafe', stroke: '#1d4ed8', text: '#1e3a8a' },
  Food:     { fill: '#dcfce7', stroke: '#15803d', text: '#14532d' },
  Patient:  { fill: '#fef3c7', stroke: '#b45309', text: '#92400e' },
  Nutrient: { fill: '#f3e8ff', stroke: '#7c3aed', text: '#4c1d95' },
  Symptom:  { fill: '#e0f2fe', stroke: '#0369a1', text: '#075985' },
};

export default function Scene2_1() {
  const { animStep } = useCourse();
  const [selectedType, setSelectedType] = useState(null);

  const visibleNodes = nodeTypes.slice(0, Math.max(0, animStep));
  const selectedNodeData = selectedType
    ? nodeTypes.find((n) => n.type === selectedType)
    : null;

  const getColors = (type) => TYPE_COLORS[type] || NODE_COLORS[type] || { fill: '#f1f5f9', stroke: '#64748b', text: '#334155' };

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* 主要舞台：節點展示 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 節點網格 */}
        <div className="flex-1 flex items-center justify-center p-6">
          {animStep === 0 ? (
            <div className="text-center">
              <div className="text-5xl mb-4">⬡</div>
              <p className="text-slate-500 text-sm">點擊「下一步」逐一揭示不同類型的 Node</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6 max-w-2xl">
              {nodeTypes.map((nodeType, i) => {
                const isVisible = i < animStep;
                const isSelected = selectedType === nodeType.type;
                const colors = getColors(nodeType.type);

                return (
                  <div
                    key={nodeType.type}
                    className="transition-all duration-500 cursor-pointer"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(20px)',
                      transitionDelay: `${i * 0.1}s`,
                      pointerEvents: isVisible ? 'auto' : 'none',
                    }}
                    onClick={() => isVisible && setSelectedType(
                      isSelected ? null : nodeType.type
                    )}
                  >
                    <div
                      className="rounded-2xl p-5 flex flex-col items-center gap-3 transition-all"
                      style={{
                        background: isSelected ? `${colors.fill}` : '#ffffff',
                        border: `2px solid ${isSelected ? colors.stroke : colors.stroke + '40'}`,
                        boxShadow: isSelected ? `0 0 24px ${colors.stroke}25` : '0 1px 4px rgba(0,0,0,0.06)',
                      }}
                    >
                      {/* 節點圖示 */}
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                        style={{
                          background: colors.fill,
                          border: `2px solid ${colors.stroke}`,
                          boxShadow: isSelected ? `0 0 16px ${colors.stroke}40` : `0 0 8px ${colors.stroke}20`,
                        }}
                      >
                        <span className="text-xl">{nodeType.icon}</span>
                      </div>

                      {/* 類型名稱 */}
                      <div className="text-center">
                        <div
                          className="text-sm font-bold"
                          style={{ color: colors.text }}
                        >
                          {nodeType.type}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{nodeType.label.split(' ')[1]}</div>
                      </div>

                      {/* 範例 */}
                      <div className="flex flex-wrap gap-1 justify-center">
                        {nodeType.examples.slice(0, 2).map((ex) => (
                          <span
                            key={ex}
                            className="text-xs px-2 py-0.5 rounded"
                            style={{ background: `${colors.stroke}15`, color: colors.stroke }}
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cypher 語法示意 */}
        {animStep >= 2 && (
          <div
            className="flex-shrink-0 mx-6 mb-4 p-3 rounded-xl"
            style={{ background: '#1e2d4a', border: '1px solid #2d4a7a' }}
          >
            <div className="text-xs text-slate-400 mb-2 uppercase tracking-widest">
              Cypher 語法預覽
            </div>
            <div className="cypher-code text-sm text-slate-300">
              {selectedNodeData ? (
                <>
                  <span style={{ color: '#38bdf8' }}>CREATE </span>
                  <span style={{ color: '#a5b4fc' }}>{selectedNodeData.cypher}</span>
                </>
              ) : (
                <>
                  <span style={{ color: '#64748b' }}>// 點選一個 Node 類型，查看對應的 Cypher 語法</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 右側詳情面板 */}
      <div
        className="w-60 flex-shrink-0 border-l border-blue-100 overflow-y-auto"
        style={{ background: '#f5f8ff' }}
      >
        {selectedNodeData ? (
          <div className="p-4">
            {/* 標題 */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{
                  background: getColors(selectedNodeData.type).fill,
                  border: `2px solid ${getColors(selectedNodeData.type).stroke}`,
                }}
              >
                {selectedNodeData.icon}
              </div>
              <div>
                <div className="font-bold text-sm text-slate-800">
                  {selectedNodeData.type}
                </div>
                <div className="text-xs text-slate-400">節點類型</div>
              </div>
            </div>

            {/* 描述 */}
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {selectedNodeData.description}
            </p>

            {/* 範例 */}
            <div className="mb-4">
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
                範例實體
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedNodeData.examples.map((ex) => (
                  <span
                    key={ex}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: `${getColors(selectedNodeData.type).stroke}12`,
                      color: getColors(selectedNodeData.type).text,
                      border: `1px solid ${getColors(selectedNodeData.type).stroke}30`,
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>

            {/* 常見屬性 */}
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">
                常見屬性（Properties）
              </div>
              {selectedNodeData.properties.map((prop) => (
                <div
                  key={prop}
                  className="flex items-center gap-2 py-1.5 border-b border-blue-100 text-xs"
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    background: getColors(selectedNodeData.type).stroke
                  }} />
                  <span className="font-mono text-slate-500">{prop}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 flex flex-col items-center justify-center h-full text-center">
            <div className="text-3xl mb-3 mt-8">⬡</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              點擊左側任一<br />Node 類型<br />查看詳細說明
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
