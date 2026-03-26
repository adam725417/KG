import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const nodeProperties = {
  id: 'drug-metformin',
  nodeLabel: 'Drug',
  nodeColor: '#1d4ed8',
  nodeName: 'Metformin',
  properties: [
    { key: 'name', value: '"Metformin"', type: 'String', desc: '藥物通用名稱' },
    { key: 'brandName', value: '"Glucophage"', type: 'String', desc: '商品名' },
    { key: 'class', value: '"Biguanide"', type: 'String', desc: '藥物分類' },
    { key: 'dosage', value: '"500mg"', type: 'String', desc: '標準劑量' },
    { key: 'warningLevel', value: '2', type: 'Integer', desc: '警示等級（1-3）' },
    { key: 'requiresMonitoring', value: 'true', type: 'Boolean', desc: '是否需要監測' },
  ],
};

const relProperties = {
  id: 'treats-rel',
  relLabel: 'TREATS',
  relColor: '#1d4ed8',
  fromLabel: '(Metformin:Drug)',
  toLabel: '(糖尿病:Disease)',
  properties: [
    { key: 'evidenceLevel', value: '"A"', type: 'String', desc: '臨床証據等級（A最高）' },
    { key: 'firstLine', value: 'true', type: 'Boolean', desc: '是否為第一線用藥' },
    { key: 'clinicalNote', value: '"可降低 HbA1c 約 1-2%"', type: 'String', desc: '臨床備注' },
    { key: 'source', value: '"ADA 2023 Guidelines"', type: 'String', desc: '資料來源' },
    { key: 'updatedAt', value: '"2023-01-01"', type: 'Date', desc: '更新時間' },
  ],
};

// Light theme node colors
const TYPE_COLORS = {
  Drug:    { fill: '#dbeafe', stroke: '#1d4ed8', text: '#1e3a8a' },
  Disease: { fill: '#fde8e8', stroke: '#dc2626', text: '#991b1b' },
};

export default function Scene2_3() {
  const { animStep } = useCourse();
  const [activeTab, setActiveTab] = useState('node'); // 'node' | 'rel'
  const [selectedPropIdx, setSelectedPropIdx] = useState(null);

  const showPanel = animStep >= 1;
  const showProps = animStep >= 2;
  const showRelProps = animStep >= 3;

  const currentData = activeTab === 'node' ? nodeProperties : relProperties;
  const properties = activeTab === 'node' ? nodeProperties.properties : relProperties.properties;

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* 左側：圖形示意 */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* 圖形示意 SVG */}
          <svg width="400" height="260" className="mx-auto">
            <defs>
              <marker id="arrow-blue-sc23" viewBox="0 0 10 10" refX="10" refY="5"
                markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#1d4ed8" />
              </marker>
            </defs>

            {/* 背景 */}
            <rect width="400" height="260" rx="12" fill="#f8fafc" opacity="1" />

            {/* 藥物節點 */}
            <g
              transform="translate(100, 130)"
              onClick={() => setActiveTab('node')}
              style={{ cursor: 'pointer' }}
            >
              {activeTab === 'node' && (
                <circle r="44" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.3"
                  className="animate-ping" style={{ animationDuration: '2s' }}
                />
              )}
              <circle
                r="36"
                fill="#dbeafe"
                stroke="#1d4ed8"
                strokeWidth={activeTab === 'node' ? 2.5 : 1.5}
                style={{ filter: activeTab === 'node' ? 'drop-shadow(0 0 10px #1d4ed840)' : 'none' }}
              />
              <text textAnchor="middle" dominantBaseline="middle"
                fontSize="10" fontWeight="700" fill="#1e3a8a"
                style={{
                  userSelect: 'none',
                  paintOrder: 'stroke',
                  stroke: '#ffffff',
                  strokeWidth: '2px',
                }}>
                Metformin
              </text>
              <text y="44" textAnchor="middle" fontSize="8" fill="#1d4ed8" opacity="0.8"
                style={{ userSelect: 'none' }}>
                :Drug
              </text>
              {/* 屬性展開示意 */}
              {showPanel && activeTab === 'node' && (
                <g>
                  {nodeProperties.properties.slice(0, 3).map((p, i) => (
                    <g key={p.key} transform={`translate(-80, ${-50 + i * 18})`}>
                      <rect x="0" y="-7" width="72" height="14" rx="3"
                        fill="#ffffff" stroke="#d1ddf5" />
                      <text fontSize="7" fill="#64748b" style={{ userSelect: 'none' }}>
                        <tspan fill="#475569">{p.key}: </tspan>
                        <tspan fill="#64748b">{p.value.slice(0, 8)}</tspan>
                      </text>
                    </g>
                  ))}
                  <line x1="-44" y1="-20" x2="-8" y2="-20" stroke="#d1ddf5" strokeWidth="1" strokeDasharray="3 2" />
                </g>
              )}
            </g>

            {/* 關係線 */}
            {showPanel && (
              <g
                onClick={() => setActiveTab('rel')}
                style={{ cursor: 'pointer' }}
              >
                <line
                  x1="136" y1="130"
                  x2="270" y2="130"
                  stroke="#1d4ed8"
                  strokeWidth={activeTab === 'rel' ? 3 : 2.5}
                  markerEnd="url(#arrow-blue-sc23)"
                  opacity={activeTab === 'rel' ? 1 : 0.7}
                  style={{ filter: activeTab === 'rel' ? 'drop-shadow(0 0 4px #1d4ed840)' : 'none' }}
                />
                <rect x="175" y="116" width="60" height="18" rx="4"
                  fill={activeTab === 'rel' ? '#dbeafe' : '#f1f5f9'}
                  stroke={activeTab === 'rel' ? '#1d4ed8' : '#cbd5e1'}
                />
                <text x="205" y="125" textAnchor="middle" dominantBaseline="middle"
                  fontSize="9" fontWeight="700" fill={activeTab === 'rel' ? '#1e3a8a' : '#64748b'}
                  style={{ userSelect: 'none' }}>
                  TREATS
                </text>
                {/* 關係屬性示意 */}
                {showRelProps && activeTab === 'rel' && (
                  <g transform="translate(163, 80)">
                    {relProperties.properties.slice(0, 2).map((p, i) => (
                      <g key={p.key} transform={`translate(0, ${i * 16})`}>
                        <rect x="0" y="-7" width="90" height="13" rx="2"
                          fill="#ffffff" stroke="#bfdbfe" />
                        <text x="5" fontSize="7" fill="#64748b" style={{ userSelect: 'none' }}>
                          <tspan fill="#475569">{p.key}: </tspan>
                          <tspan fill="#64748b">{p.value.slice(0, 10)}</tspan>
                        </text>
                      </g>
                    ))}
                    <line x1="42" y1="9" x2="42" y2="20" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="2 2" />
                  </g>
                )}
              </g>
            )}

            {/* 疾病節點 */}
            {showPanel && (
              <g transform="translate(310, 130)">
                <circle r="32" fill="#fde8e8" stroke="#dc2626" strokeWidth="1.5" />
                <text textAnchor="middle" dominantBaseline="middle"
                  fontSize="10" fontWeight="700" fill="#991b1b"
                  style={{
                    userSelect: 'none',
                    paintOrder: 'stroke',
                    stroke: '#ffffff',
                    strokeWidth: '2px',
                  }}>
                  糖尿病
                </text>
                <text y="40" textAnchor="middle" fontSize="8" fill="#dc2626" opacity="0.8"
                  style={{ userSelect: 'none' }}>
                  :Disease
                </text>
              </g>
            )}

            {/* 說明文字 */}
            <text x="200" y="235" textAnchor="middle" fontSize="10" fill="#64748b"
              style={{ userSelect: 'none' }}>
              {activeTab === 'node'
                ? '點擊左邊藥物節點 → 展開節點屬性'
                : '點擊中間關係線 → 展開關係屬性'}
            </text>
          </svg>

          {/* 切換按鈕 */}
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={() => setActiveTab('node')}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeTab === 'node' ? '#dbeafe' : '#f1f5f9',
                color: activeTab === 'node' ? '#1d4ed8' : '#64748b',
                border: `1px solid ${activeTab === 'node' ? '#1d4ed8' : '#d1ddf5'}`,
              }}
            >
              ⬡ 節點屬性
            </button>
            <button
              onClick={() => { setActiveTab('rel'); }}
              disabled={!showRelProps}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: activeTab === 'rel' ? '#dbeafe' : '#f1f5f9',
                color: activeTab === 'rel' ? '#1d4ed8' : '#64748b',
                border: `1px solid ${activeTab === 'rel' ? '#1d4ed8' : '#d1ddf5'}`,
              }}
            >
              → 關係屬性 {!showRelProps && '（下一步解鎖）'}
            </button>
          </div>
        </div>
      </div>

      {/* 右側：屬性面板 */}
      <div
        className="w-72 flex-shrink-0 border-l border-blue-100 overflow-y-auto transition-all duration-500"
        style={{
          background: '#f5f8ff',
          opacity: showProps ? 1 : 0.3,
        }}
      >
        <div className="p-4">
          {/* 標題 */}
          <div className="mb-4">
            <div
              className="text-xs font-bold mb-1 font-mono"
              style={{ color: currentData.nodeColor || currentData.relColor }}
            >
              {activeTab === 'node'
                ? `(${currentData.nodeName}:${currentData.nodeLabel})`
                : `[:${currentData.relLabel}]`}
            </div>
            {activeTab === 'rel' && (
              <div className="text-xs text-slate-400 font-mono">
                {relProperties.fromLabel} → {relProperties.toLabel}
              </div>
            )}
          </div>

          {/* 屬性列表 */}
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-3">
            Properties
          </div>

          <div className="space-y-2">
            {(showProps ? properties : []).map((prop, idx) => (
              <div
                key={prop.key}
                className="rounded-lg p-3 cursor-pointer transition-all"
                style={{
                  background: selectedPropIdx === idx ? '#eff6ff' : '#ffffff',
                  border: `1px solid ${selectedPropIdx === idx ? '#1d4ed8' : '#d1ddf5'}`,
                  animationDelay: `${idx * 0.1}s`,
                }}
                onClick={() => setSelectedPropIdx(selectedPropIdx === idx ? null : idx)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-slate-500">{prop.key}</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ background: '#e2e8f0', color: '#475569' }}
                  >
                    {prop.type}
                  </span>
                </div>
                <div className="font-mono text-xs" style={{ color: '#7c3aed' }}>
                  {prop.value}
                </div>
                {selectedPropIdx === idx && (
                  <div className="mt-2 text-xs text-slate-400 leading-relaxed border-t border-blue-100 pt-2">
                    {prop.desc}
                  </div>
                )}
              </div>
            ))}

            {!showProps && (
              <div className="text-xs text-slate-400 text-center py-4">
                點擊「下一步」展開屬性
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
