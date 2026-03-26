import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const graphragSteps = [
  {
    icon: '🗂',
    title: 'Neo4j 知識圖譜',
    desc: '儲存結構化事實，節點、關係、屬性皆清晰可查',
    color: '#1d4ed8',
  },
  {
    icon: '🔍',
    title: 'Cypher 路徑查詢',
    desc: '根據問題實體，在圖中展開相關路徑',
    color: '#7c3aed',
  },
  {
    icon: '📋',
    title: 'Context 組裝',
    desc: '將查詢結果整理成結構化的文字 Context',
    color: '#b45309',
  },
  {
    icon: '🤖',
    title: 'LLM 生成答案',
    desc: '根據有依據的 Context 生成自然語言回覆',
    color: '#15803d',
  },
];

const TABS = [
  { id: 'graphrag', label: 'GraphRAG 架構' },
  { id: 'about', label: '關於本課程' },
];

export default function Scene6_6() {
  const { animStep } = useCourse();
  const [activeTab, setActiveTab] = useState('graphrag');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Tab 切換列 */}
      <div
        className="flex-shrink-0 flex gap-2 px-6 pt-4 pb-0 border-b border-blue-100"
        style={{ background: '#f5f8ff' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all duration-200"
            style={{
              background: activeTab === tab.id ? '#ffffff' : 'transparent',
              color: activeTab === tab.id ? '#1d4ed8' : '#64748b',
              borderTop: activeTab === tab.id ? '1px solid #d1ddf5' : '1px solid transparent',
              borderLeft: activeTab === tab.id ? '1px solid #d1ddf5' : '1px solid transparent',
              borderRight: activeTab === tab.id ? '1px solid #d1ddf5' : '1px solid transparent',
              borderBottom: activeTab === tab.id ? '1px solid #ffffff' : '1px solid transparent',
              marginBottom: activeTab === tab.id ? '-1px' : '0',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 內容 */}
      <div className="flex-1 overflow-y-auto">
        {/* Tab 1: GraphRAG 架構 */}
        {activeTab === 'graphrag' && (
          <div className="p-6">
            {animStep === 0 ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-sm text-slate-400">點擊下一步開始</p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <div className="text-xs text-slate-400 uppercase tracking-widest mb-6">
                  GraphRAG 運作流程
                </div>

                {/* 流程卡片 */}
                <div className="flex items-stretch gap-0 mb-6">
                  {graphragSteps.map((step, i) => {
                    const isVisible = animStep >= i + 1;
                    return (
                      <React.Fragment key={step.title}>
                        <div
                          className="flex-1 rounded-xl p-4 flex flex-col items-center text-center gap-2"
                          style={{
                            opacity: isVisible ? 1 : 0.15,
                            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                            transition: `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`,
                            background: '#ffffff',
                            border: `1px solid ${isVisible ? step.color + '40' : '#d1ddf5'}`,
                            boxShadow: isVisible ? `0 2px 8px ${step.color}12` : 'none',
                          }}
                        >
                          <div className="text-2xl">{step.icon}</div>
                          <div className="text-xs font-bold leading-tight" style={{ color: step.color }}>
                            {step.title}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                        </div>

                        {i < graphragSteps.length - 1 && (
                          <div
                            className="flex items-center justify-center w-8 flex-shrink-0 transition-all duration-300"
                            style={{ opacity: animStep >= i + 2 ? 1 : 0.15 }}
                          >
                            <span style={{ color: '#94a3b8', fontSize: '18px' }}>→</span>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* 說明框 */}
                {animStep >= 4 && (
                  <div
                    className="rounded-xl p-5"
                    style={{
                      background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
                      border: '1px solid #bfdbfe',
                      transition: 'opacity 0.4s ease',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">💡</span>
                      <div className="text-sm font-bold text-slate-700">
                        GraphRAG = 圖結構檢索 + LLM
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      與傳統 RAG 不同，GraphRAG 利用知識圖譜的結構化路徑來提供 Context，
                      強調每個答案都有圖路徑作為依據，大幅提升答案的可追溯性與可靠度。
                    </p>
                    <div className="flex gap-3">
                      {[
                        { label: '有結構依據', color: '#1d4ed8' },
                        { label: '多跳推理', color: '#7c3aed' },
                        { label: '降低幻覺', color: '#15803d' },
                        { label: '可解釋性', color: '#b45309' },
                      ].map((item) => (
                        <span
                          key={item.label}
                          className="text-xs px-2 py-1 rounded"
                          style={{ background: `${item.color}12`, color: item.color }}
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: 關於本課程 */}
        {activeTab === 'about' && (
          <div className="p-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">
                關於本課程
              </div>

              {/* 課程用途 */}
              <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #d1ddf5' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎓</span>
                  <div className="text-sm font-bold text-slate-700">課程用途</div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  本課程適合有 SQL 基礎、首次接觸圖資料庫的學習者。
                  透過實際操作 Neo4j AuraDB，學員將掌握知識圖譜建模與 Cypher 查詢的核心技能。
                </p>
              </div>

              {/* 可擴充方向 */}
              <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #d1ddf5' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🚀</span>
                  <div className="text-sm font-bold text-slate-700">可擴充方向</div>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      title: '藥物知識庫整合',
                      desc: '整合 DrugBank、RxNorm 等開放藥物資料庫，建構完整的藥物-疾病-副作用知識網絡',
                      color: '#1d4ed8',
                    },
                    {
                      title: '供應鏈知識圖譜',
                      desc: '將工廠、原料、供應商、物流節點建模為圖，實現風險路徑的即時分析',
                      color: '#15803d',
                    },
                    {
                      title: '電商推薦系統',
                      desc: '以用戶行為、商品屬性、購買關係建圖，實現基於圖路徑的個人化推薦',
                      color: '#7c3aed',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-3 rounded-lg px-3 py-2.5"
                      style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: item.color }} />
                      <div>
                        <div className="text-xs font-semibold mb-0.5" style={{ color: item.color }}>{item.title}</div>
                        <div className="text-xs text-slate-400 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 技術棧 */}
              <div className="rounded-xl p-4" style={{ background: '#f5f8ff', border: '1px solid #d1ddf5' }}>
                <div className="text-xs font-semibold text-slate-500 mb-2">技術棧</div>
                <div className="flex flex-wrap gap-2">
                  {['React 18', 'Vite', 'Tailwind CSS', 'Neo4j AuraDB Free'].map((tech) => (
                    <span key={tech} className="text-xs px-2.5 py-1 rounded" style={{ background: '#dbeafe', color: '#1e3a8a' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 版權 */}
              <div className="text-center py-3">
                <p className="text-xs text-slate-400">
                  © 2025 Knowledge Graph 互動教學 · 教學用途，歡迎改作與分享
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
