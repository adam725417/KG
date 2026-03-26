import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const valueCards = [
  {
    id: 'explainable',
    icon: '🔍',
    title: '可解釋答案',
    subtitle: 'Explainable Reasoning',
    color: '#0369a1',
    desc: '圖路徑本身就是答案的推導依據，每一步都有跡可循，而不是黑盒輸出。',
    useCase: '醫療決策中，醫師可以看到「為什麼系統建議避免某食物」的完整邏輯鏈。',
    metrics: ['路徑可視化', '推導透明化', '符合法規要求'],
  },
  {
    id: 'multi-hop',
    icon: '⛓',
    title: '多跳推理',
    subtitle: 'Multi-hop Reasoning',
    color: '#7c3aed',
    desc: '能沿著多條關係邊，跨越多個實體，推導出需要多步邏輯的答案。',
    useCase: '「這個病人→有這種疾病→服用這個藥→有這些禁忌食物」，四步推理一次完成。',
    metrics: ['3+ 跳路徑', '跨實體推理', '關係鏈完整'],
  },
  {
    id: 'integration',
    icon: '🔀',
    title: '跨資料源整合',
    subtitle: 'Data Integration',
    color: '#15803d',
    desc: '不同來源的知識（臨床指南、文獻、內部資料庫）可以統一在圖結構中，互相連結。',
    useCase: '將 ADA 指南、醫院 EHR 資料、食品資料庫整合到同一個知識圖譜中。',
    metrics: ['統一 Schema', '多源融合', '知識聯動'],
  },
  {
    id: 'schema',
    icon: '🧩',
    title: '可擴充 Schema',
    subtitle: 'Extensible Schema',
    color: '#b45309',
    desc: '知識圖譜的 Schema 可以彈性擴充，新增新的節點類型和關係類型，不需要 Schema migration。',
    useCase: '原本只有疾病和藥物，後來加入營養素和症狀，不需要重建整個知識庫。',
    metrics: ['Schema 彈性', '增量更新', '版本兼容'],
  },
  {
    id: 'hallucination',
    icon: '🛡',
    title: '降低幻覺風險',
    subtitle: 'Reduce Hallucination',
    color: '#dc2626',
    desc: '有結構化事實路徑支撐，LLM 的回答有所依據，大幅降低憑空捏造事實的機率。',
    useCase: '醫療建議必須有出處，GraphRAG 確保每個建議都能回溯到具體的圖路徑和証據來源。',
    metrics: ['事實有依據', '可追溯性', '降低幻覺 40%+'],
  },
];

export default function Scene5_4() {
  const { animStep } = useCourse();
  const [selectedCard, setSelectedCard] = useState(null);

  const visibleCards = valueCards.slice(0, Math.max(0, animStep));
  const selectedData = valueCards.find((c) => c.id === selectedCard);

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* 左側：背景知識網路（裝飾） + 價值卡片 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 知識網路背景裝飾 */}
        <div className="flex-shrink-0 h-2 w-full"
          style={{ background: 'linear-gradient(90deg, #0369a120, #7c3aed20, #15803d20)' }} />

        {/* 價值卡片網格 */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            {/* 前 3 張 */}
            {valueCards.slice(0, 3).map((card, i) => {
              const isVisible = i < visibleCards.length;
              const isSelected = selectedCard === card.id;

              return (
                <ValueCard
                  key={card.id}
                  card={card}
                  isVisible={isVisible}
                  isSelected={isSelected}
                  onClick={() => setSelectedCard(isSelected ? null : card.id)}
                  delay={i * 0.15}
                />
              );
            })}

            {/* 後 2 張（跨越兩欄置中） */}
            <div className="col-span-3 flex justify-center gap-4">
              {valueCards.slice(3).map((card, i) => {
                const idx = i + 3;
                const isVisible = idx < visibleCards.length;
                const isSelected = selectedCard === card.id;

                return (
                  <div key={card.id} className="w-64">
                    <ValueCard
                      card={card}
                      isVisible={isVisible}
                      isSelected={isSelected}
                      onClick={() => setSelectedCard(isSelected ? null : card.id)}
                      delay={idx * 0.15}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 底部：適用場景 */}
        {animStep >= 4 && (
          <div
            className="flex-shrink-0 mx-6 mb-4 rounded-xl p-4"
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
          >
            <div className="text-xs font-semibold text-blue-700 mb-2">
              🏭 GraphRAG 最適合的企業場景
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                '醫療決策支援',
                '藥物安全監控',
                '供應鏈風險分析',
                '知識型問答系統',
                '合規檢查系統',
                '企業知識管理',
                '製造流程優化',
                '金融風控分析',
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded"
                  style={{ background: '#dbeafe', color: '#1e3a8a' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 右側：選中卡片詳情 */}
      <div
        className="w-64 flex-shrink-0 border-l border-blue-100 overflow-y-auto"
        style={{ background: '#f5f8ff' }}
      >
        {selectedData ? (
          <div className="p-4">
            {/* 標題 */}
            <div
              className="rounded-xl p-4 mb-4"
              style={{
                background: `${selectedData.color}10`,
                border: `1px solid ${selectedData.color}30`,
              }}
            >
              <div className="text-2xl mb-2">{selectedData.icon}</div>
              <div className="text-sm font-bold text-slate-800 mb-0.5">{selectedData.title}</div>
              <div className="text-xs text-slate-400 font-mono">{selectedData.subtitle}</div>
            </div>

            {/* 說明 */}
            <div className="mb-4">
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">核心價值</div>
              <p className="text-xs text-slate-500 leading-relaxed">{selectedData.desc}</p>
            </div>

            {/* 應用情境 */}
            <div className="mb-4">
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">應用情境</div>
              <div
                className="rounded-lg p-3"
                style={{ background: '#ffffff', border: '1px solid #d1ddf5' }}
              >
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  「{selectedData.useCase}」
                </p>
              </div>
            </div>

            {/* 指標 */}
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">關鍵特性</div>
              {selectedData.metrics.map((metric) => (
                <div key={metric}
                  className="flex items-center gap-2 py-1.5 border-b border-blue-100 text-xs"
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: selectedData.color }} />
                  <span style={{ color: selectedData.color }}>{metric}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="text-3xl mb-3">🏆</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              點擊左側任一<br />價值卡片<br />查看詳細說明
            </p>
            {animStep === 0 && (
              <p className="text-xs text-slate-300 mt-4">
                點擊「下一步」<br />逐一點亮價值卡片
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 子元件：價值卡片
function ValueCard({ card, isVisible, isSelected, onClick, delay }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="cursor-pointer transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0.1,
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(16px)',
        transitionDelay: `${delay}s`,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="rounded-xl p-4 flex flex-col items-center text-center gap-2 transition-all"
        style={{
          background: isSelected ? `${card.color}10` : (isHovered ? `${card.color}06` : '#ffffff'),
          border: `1px solid ${isSelected ? card.color : (isHovered ? card.color + '50' : '#d1ddf5')}`,
          boxShadow: isSelected ? `0 0 20px ${card.color}15` : '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div className="text-2xl">{card.icon}</div>
        <div>
          <div
            className="text-sm font-bold mb-0.5"
            style={{ color: isSelected ? card.color : '#334155' }}
          >
            {card.title}
          </div>
          <div className="text-xs text-slate-400">{card.subtitle}</div>
        </div>
        {(isSelected || isHovered) && (
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            {card.desc}
          </p>
        )}

        {/* 指示點 */}
        <div
          className="w-2 h-2 rounded-full mt-1 transition-all"
          style={{
            background: isSelected ? card.color : '#e2e8f0',
            boxShadow: isSelected ? `0 0 8px ${card.color}` : 'none',
          }}
        />
      </div>
    </div>
  );
}
