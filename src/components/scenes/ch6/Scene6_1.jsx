import React from 'react';
import { useCourse } from '../../../context/CourseContext';

const whyCards = [
  {
    icon: '☁️',
    title: '瀏覽器即可使用',
    desc: '完全雲端，不需安裝任何軟體，開啟瀏覽器即可操作 Neo4j',
  },
  {
    icon: '🎓',
    title: '適合學習與 Prototyping',
    desc: '免費方案提供足夠的空間進行概念驗證與課堂練習',
  },
  {
    icon: '💻',
    title: '無需安裝 Desktop',
    desc: '學生只需有帳號，跳過繁瑣的本地環境設定，專注在概念學習',
  },
  {
    icon: '⚡',
    title: '課堂快速上手',
    desc: '幾分鐘內建立資料庫，立即開始撰寫 Cypher，零等待時間',
  },
];

const goals = [
  '理解 Node / Relationship / Property 的概念與意義',
  '在 Neo4j AuraDB 建立圖資料（CREATE）',
  '練習 CREATE / MATCH / MERGE 語法',
  '查詢疾病、用藥、飲食的多跳關係',
  '理解如何從知識圖譜走向 GraphRAG',
];

export default function Scene6_1() {
  const { animStep } = useCourse();

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* 左欄：為什麼用 AuraDB Free */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">
          為什麼用 AuraDB Free
        </div>

        {animStep === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-slate-400">點擊下一步開始</p>
          </div>
        )}

        <div className="space-y-3">
          {whyCards.map((card, i) => {
            const isVisible = animStep >= i + 1;
            return (
              <div
                key={card.title}
                className="rounded-xl p-4"
                style={{
                  background: '#ffffff',
                  border: '1px solid #d1ddf5',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <div className="text-sm font-bold text-slate-700 mb-1">{card.title}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{card.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右欄：今日學習目標 */}
      <div
        className="w-72 flex-shrink-0 border-l border-blue-100 flex flex-col p-6 overflow-y-auto"
        style={{ background: '#f5f8ff' }}
      >
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">
          今日學習目標
        </div>

        <div
          className="space-y-3"
          style={{
            opacity: animStep >= 1 ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {goals.map((goal, i) => {
            const isActive = animStep >= i + 1;
            return (
              <div
                key={goal}
                className="flex items-start gap-3"
                style={{
                  transition: 'opacity 0.3s ease',
                  opacity: animStep >= 1 ? 1 : 0,
                }}
              >
                {/* 圓圈 badge */}
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400"
                  style={{
                    background: isActive ? '#16a34a' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    border: isActive ? '2px solid #16a34a' : '2px solid #e2e8f0',
                    transition: 'all 0.4s ease',
                  }}
                >
                  {isActive ? '✓' : i + 1}
                </div>
                {/* 文字 */}
                <span
                  className="text-xs leading-relaxed pt-0.5 transition-all duration-400"
                  style={{
                    color: isActive ? '#1e293b' : '#94a3b8',
                    fontWeight: isActive ? '500' : '400',
                    transition: 'all 0.4s ease',
                  }}
                >
                  {goal}
                </span>
              </div>
            );
          })}
        </div>

        {/* 進度說明 */}
        {animStep >= 1 && (
          <div
            className="mt-6 rounded-xl p-3"
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
          >
            <div className="text-xs font-semibold text-blue-700 mb-1">
              本章涵蓋範圍
            </div>
            <p className="text-xs text-blue-600 leading-relaxed">
              從零開始操作 AuraDB，到撰寫 Cypher，再到理解 GraphRAG 的完整學習路徑。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
