import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const questions = [
  { id:'q1', text:'糖尿病患者吃 Metformin，要避免哪些食物？', joins:2, color:'#1d4ed8', bg:'#eff6ff', icon:'💊' },
  { id:'q2', text:'如果他同時有高血壓，建議會改變嗎？',   joins:4, color:'#b45309', bg:'#fffbeb', icon:'🩺' },
  { id:'q3', text:'某食物會不會影響 Metformin 的藥效？',   joins:5, color:'#dc2626', bg:'#fef2f2', icon:'⚠️' },
];

const tableNodes = [
  { id:'disease',     label:'疾病表',    color:'#dc2626', bg:'#fde8e8', x:100, y:180 },
  { id:'drug',        label:'藥物表',    color:'#1d4ed8', bg:'#dbeafe', x:300, y:100 },
  { id:'food',        label:'飲食表',    color:'#15803d', bg:'#dcfce7', x:500, y:180 },
  { id:'interaction', label:'交互作用表', color:'#7c3aed', bg:'#f3e8ff', x:300, y:280 },
  { id:'patient',     label:'病人表',    color:'#b45309', bg:'#fef3c7', x:100, y:320 },
];

export default function Scene1_2() {
  const { animStep } = useCourse();
  const [activeQ, setActiveQ] = useState(null);

  const visibleQs = questions.slice(0, animStep);
  const activeData = questions.find((q) => q.id === activeQ);
  const highlighted = new Set(activeData ? ['disease','drug','food'] : []);
  if (activeData?.id === 'q2') { highlighted.add('patient'); }
  if (activeData?.id === 'q3') { highlighted.add('interaction'); }

  return (
    <div className="h-full flex gap-0 overflow-hidden" style={{ background: '#eef3fc' }}>
      {/* 左側問題列 */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-3 p-5 border-r" style={{ background: '#ffffff', borderColor: '#d1ddf5' }}>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">使用者問題</div>
        {questions.map((q, i) => {
          const isVisible = i < animStep;
          const isActive  = activeQ === q.id;
          return (
            <div key={q.id}
              className="transition-all duration-500 cursor-pointer"
              style={{ opacity: isVisible ? 1 : 0.15, transform: isVisible ? 'translateX(0)' : 'translateX(-16px)', transitionDelay: `${i*0.1}s`, pointerEvents: isVisible ? 'auto' : 'none' }}
              onClick={() => isVisible && setActiveQ(isActive ? null : q.id)}
            >
              <div className="rounded-xl p-3 transition-all"
                style={{ background: isActive ? q.bg : '#f8fafc', border: `2px solid ${isActive ? q.color : '#e2e8f0'}`, boxShadow: isActive ? `0 2px 12px ${q.color}25` : 'none' }}>
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">{q.icon}</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{q.text}</p>
                </div>
                {isVisible && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: q.color }}>需要 {q.joins} 層 JOIN</span>
                    <div className="flex gap-0.5">
                      {Array.from({length: q.joins}).map((_,ji) => (
                        <div key={ji} className="w-3 h-1.5 rounded-sm" style={{ background: q.color, opacity: 0.7 }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {visibleQs.length >= 2 && (
          <div className="rounded-xl p-3 mt-1 shadow-sm"
            style={{ background: visibleQs.length >= 3 ? '#fef2f2' : '#fafafa', border: `1.5px solid ${visibleQs.length >= 3 ? '#fca5a5' : '#e2e8f0'}` }}>
            <div className="text-xs font-bold mb-1" style={{ color: visibleQs.length >= 3 ? '#dc2626' : '#64748b' }}>
              {visibleQs.length >= 3 ? '⚠ 複雜度爆炸！' : `已出現 ${visibleQs.length} 個問題`}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {visibleQs.length >= 3 ? '跨表查詢越來越多，SQL 難以維護' : '每增加問題，就需要更多 JOIN'}
            </p>
          </div>
        )}
      </div>

      {/* 右側：表格關係圖 */}
      <div className="flex-1 flex items-center justify-center">
        {animStep === 0 ? (
          <div className="text-center">
            <div className="text-5xl mb-3">🤔</div>
            <p className="text-slate-400 text-sm">點擊「下一步」逐步展示問題如何增加複雜度</p>
          </div>
        ) : (
          <svg width="600" height="360" style={{ overflow: 'visible' }}>
            <defs>
              {['gray','amber','red'].map((n,i) => {
                const c = ['#475569','#b45309','#dc2626'][i];
                return (
                  <marker key={n} id={`arr-${n}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 1 L 9 5 L 0 9 Z" fill={c} />
                  </marker>
                );
              })}
            </defs>
            <rect width="600" height="360" rx="14" fill="#ffffff" stroke="#d1ddf5" strokeWidth="1.5" />

            {/* 節點 */}
            {tableNodes.map((n) => {
              const hl = highlighted.has(n.id);
              return (
                <g key={n.id} transform={`translate(${n.x},${n.y})`}>
                  <rect x="-52" y="-22" width="104" height="44" rx="10"
                    fill={hl ? n.bg : '#f8fafc'}
                    stroke={hl ? n.color : '#d1ddf5'}
                    strokeWidth={hl ? 2.5 : 1.5}
                    style={{ filter: hl ? `drop-shadow(0 2px 8px ${n.color}40)` : 'none', transition: 'all 0.3s' }}
                  />
                  <text textAnchor="middle" dominantBaseline="middle"
                    fontSize="10" fontWeight="700"
                    fill={hl ? n.color : '#94a3b8'}
                    style={{ userSelect: 'none', transition: 'all 0.3s' }}>
                    {n.label}
                  </text>
                </g>
              );
            })}

            {/* 連線 */}
            {animStep >= 1 && (
              <line x1="148" y1="175" x2="253" y2="138" stroke="#475569" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arr-gray)" opacity="0.7" />
            )}
            {animStep >= 1 && (
              <line x1="347" y1="127" x2="452" y2="168" stroke="#475569" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arr-gray)" opacity="0.7" />
            )}
            {animStep >= 2 && (
              <line x1="138" y1="198" x2="253" y2="262" stroke="#b45309" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arr-amber)" opacity="0.7" />
            )}
            {animStep >= 2 && (
              <line x1="148" y1="308" x2="100" y2="214" stroke="#b45309" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arr-amber)" opacity="0.7" />
            )}
            {animStep >= 3 && (
              <line x1="347" y1="268" x2="347" y2="142" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arr-red)" opacity="0.75" />
            )}
            {animStep >= 3 && (
              <line x1="450" y1="205" x2="360" y2="265" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="6 4" markerEnd="url(#arr-red)" opacity="0.75" />
            )}
            {animStep >= 3 && (
              <text x="300" y="338" textAnchor="middle" fontSize="11" fontWeight="700" fill="#dc2626">
                ⚠ 表格關係越來越複雜，SQL 難以維護
              </text>
            )}
          </svg>
        )}
      </div>
    </div>
  );
}
