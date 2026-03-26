import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const syntaxCards = [
  {
    id: 'create',
    keyword: 'CREATE',
    color: '#15803d',
    title: '直接建立節點與關係',
    plain: '就像在白板上畫一個新的節點或箭頭。每次執行都會建立新的物件，不管是否已存在。',
    context: '第一次建立資料時、確定資料是全新的時候使用',
    code: `CREATE (p:Patient {name:'李先生', age:65})
CREATE (d:Disease {name:'糖尿病'})
CREATE (p)-[:HAS_DISEASE]->(d)`,
  },
  {
    id: 'match',
    keyword: 'MATCH',
    color: '#1d4ed8',
    title: '查詢符合條件的圖 Pattern',
    plain: '就像用「形狀模板」在圖上找符合的結構。MATCH 描述你想找的節點和關係組合，系統會回傳所有符合的路徑。',
    context: '想查詢資料時、要找符合特定關係模式的節點組合',
    code: `MATCH (p:Patient)-[:HAS_DISEASE]->(d:Disease)
WHERE d.name = '糖尿病'
RETURN p.name, d.name`,
  },
  {
    id: 'merge',
    keyword: 'MERGE',
    color: '#b45309',
    title: '有就配對，沒有就建立',
    plain: '先 MATCH 找找看，有的話就用現有的；沒有的話才 CREATE 建新的。避免重複建立節點。',
    context: '資料可能已存在時、更新既有資料時、確保唯一性的建立操作',
    code: `MERGE (d:Disease {name:'糖尿病'})
ON CREATE SET d.createdAt = date()
ON MATCH SET d.updatedAt = date()`,
  },
];

export default function Scene6_4() {
  const { animStep } = useCourse();
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  function handleCopy(id, code) {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        {animStep === 0 && (
          <div className="flex-1 flex items-center justify-center h-full">
            <p className="text-sm text-slate-400">點擊下一步開始</p>
          </div>
        )}

        {animStep >= 1 && (
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">
              Cypher 核心語法
            </div>

            {syntaxCards.map((card, i) => {
              const isVisible = animStep >= i + 1;
              const isExpanded = expandedId === card.id;

              return (
                <div
                  key={card.id}
                  className="rounded-xl overflow-hidden transition-all duration-400"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(24px)',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                    border: `1px solid ${isExpanded ? card.color : '#d1ddf5'}`,
                    background: isExpanded ? `${card.color}06` : '#ffffff',
                    boxShadow: isExpanded ? `0 0 16px ${card.color}12` : '0 1px 4px rgba(0,0,0,0.06)',
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                >
                  {/* 卡片標題列（可點擊） */}
                  <button
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : card.id)}
                    disabled={!isVisible}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-bold font-mono px-2.5 py-1 rounded"
                        style={{ background: `${card.color}15`, color: card.color }}
                      >
                        {card.keyword}
                      </span>
                      <span className="text-sm font-medium text-slate-700">{card.title}</span>
                    </div>
                    <span
                      className="text-xs transition-transform duration-300 flex-shrink-0"
                      style={{
                        color: card.color,
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      ▼
                    </span>
                  </button>

                  {/* 展開內容 */}
                  {isExpanded && (
                    <div
                      style={{
                        borderTop: `1px solid ${card.color}20`,
                      }}
                    >
                      {/* 白話解釋 */}
                      <div className="px-4 pt-3 pb-2">
                        <div
                          className="text-xs font-semibold mb-1.5"
                          style={{ color: card.color }}
                        >
                          白話解釋
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{card.plain}</p>
                      </div>

                      {/* 適合情境 */}
                      <div className="px-4 pb-3">
                        <div className="text-xs font-semibold mb-1.5 text-slate-400">
                          適合情境
                        </div>
                        <div
                          className="text-xs rounded-lg px-3 py-2 leading-relaxed"
                          style={{ background: `${card.color}10`, color: card.color }}
                        >
                          {card.context}
                        </div>
                      </div>

                      {/* 程式碼區塊 */}
                      <div className="rounded-b-xl overflow-hidden">
                        <div
                          className="flex items-center justify-between px-4 py-2"
                          style={{ background: '#1e2d4a' }}
                        >
                          <span className="text-xs font-mono" style={{ color: '#64748b' }}>
                            範例
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(card.id, card.code);
                            }}
                            className="text-xs px-3 py-1 rounded transition-all duration-200"
                            style={{
                              background: copiedId === card.id ? '#16a34a20' : '#ffffff10',
                              color: copiedId === card.id ? '#4ade80' : '#94a3b8',
                              border: `1px solid ${copiedId === card.id ? '#16a34a40' : '#ffffff20'}`,
                            }}
                          >
                            {copiedId === card.id ? '已複製 ✓' : '複製'}
                          </button>
                        </div>
                        <pre
                          className="px-4 py-3 text-xs font-mono leading-relaxed overflow-x-auto"
                          style={{ background: '#1e2d4a', color: '#a5b4fc', margin: 0 }}
                        >
                          {card.code}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* 提示說明 */}
            {animStep >= 3 && (
              <div
                className="rounded-xl p-4 mt-2"
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
              >
                <div className="text-xs font-semibold text-blue-700 mb-1.5">
                  三個語法的使用時機總結
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { kw: 'CREATE', tip: '全新建立，不怕重複時', color: '#15803d' },
                    { kw: 'MATCH', tip: '查詢，不修改資料時', color: '#1d4ed8' },
                    { kw: 'MERGE', tip: '安全寫入，避免重複時', color: '#b45309' },
                  ].map((item) => (
                    <div key={item.kw} className="text-center">
                      <div
                        className="text-xs font-bold font-mono mb-1 px-2 py-0.5 rounded inline-block"
                        style={{ background: `${item.color}15`, color: item.color }}
                      >
                        {item.kw}
                      </div>
                      <div className="text-xs text-slate-500 leading-relaxed">{item.tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
