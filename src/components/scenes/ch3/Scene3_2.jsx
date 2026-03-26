import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const problems = [
  {
    id: 'p1',
    question: '計算今年第三季的總營業額',
    sqlSolution: 'SELECT SUM(amount) FROM sales WHERE quarter=3 AND year=2024',
    verdict: 'sql',
    reason: '這是單表聚合查詢（SUM + WHERE），SQL 直接、高效，不需要圖結構。',
    icon: '💰',
    tableIcon: '📊',
  },
  {
    id: 'p2',
    question: '查詢某員工的基本薪資資料',
    sqlSolution: 'SELECT salary FROM employees WHERE emp_id = "E001"',
    verdict: 'sql',
    reason: '單表查詢，沒有跨實體的關係需求。用 SQL 的 SELECT + WHERE 就夠了。',
    icon: '👤',
    tableIcon: '📋',
  },
  {
    id: 'p3',
    question: '查詢倉庫目前所有商品的庫存數量',
    sqlSolution: 'SELECT product_name, stock_qty FROM inventory ORDER BY product_name',
    verdict: 'sql',
    reason: '庫存查詢是典型的報表型查詢，表格資料庫搭配 INDEX 效能極佳。',
    icon: '📦',
    tableIcon: '🗄️',
  },
  {
    id: 'p4',
    question: '計算各部門本月的出勤率統計',
    sqlSolution: 'SELECT dept, AVG(attendance) FROM records GROUP BY dept',
    verdict: 'sql',
    reason: '統計彙總（GROUP BY + AVG）是 SQL 的強項，不需要圖的關係遍歷能力。',
    icon: '📅',
    tableIcon: '📈',
  },
];

export default function Scene3_2() {
  const { animStep } = useCourse();
  const [selectedProblem, setSelectedProblem] = useState(null);

  const visibleProblems = problems.slice(0, Math.max(0, animStep));
  const selected = problems.find((p) => p.id === selectedProblem);

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {/* 左側：問題卡片 */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-2 p-4 border-r border-blue-100 overflow-y-auto"
        style={{ background: '#f5f8ff' }}>
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">
          不適合用 Graph 的問題
        </div>

        {problems.map((prob, i) => {
          const isVisible = i < animStep;
          const isSelected = selectedProblem === prob.id;

          return (
            <div
              key={prob.id}
              className="transition-all duration-500 cursor-pointer"
              style={{
                opacity: isVisible ? 1 : 0.15,
                transform: isVisible ? 'translateX(0)' : 'translateX(-16px)',
                transitionDelay: `${i * 0.15}s`,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
              onClick={() => isVisible && setSelectedProblem(isSelected ? null : prob.id)}
            >
              <div
                className="rounded-xl p-3 transition-all"
                style={{
                  background: isSelected ? '#f0fdf4' : '#ffffff',
                  border: `1px solid ${isSelected ? '#15803d' : '#d1ddf5'}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{prob.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs text-slate-600 leading-snug">{prob.question}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded font-semibold"
                    style={{ background: '#dcfce7', color: '#15803d' }}
                  >
                    ✓ SQL 更適合
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: '#fef2f2', color: '#dc2626' }}
                  >
                    ✗ Graph 不必要
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* 底部說明 */}
        {animStep >= 2 && (
          <div
            className="rounded-xl p-3 mt-2"
            style={{ background: '#ffffff', border: '1px solid #d1ddf5' }}
          >
            <div className="text-xs font-semibold text-slate-600 mb-1">
              🧠 選型原則
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              技術選型要看「問題的本質結構」。如果問題本質是聚合、統計、單表查詢，SQL 更直接高效。如果問題本質是多實體關係、多跳推理，才考慮 Graph。
            </p>
          </div>
        )}
      </div>

      {/* 右側：SQL 解決方案展示 */}
      <div className="flex-1 flex items-center justify-center p-8">
        {animStep === 0 ? (
          <div className="text-center">
            <div className="text-4xl mb-3">🤔</div>
            <p className="text-slate-500 text-sm">點擊「下一步」揭示不適合用 Graph 的問題情境</p>
          </div>
        ) : selected ? (
          <div className="max-w-lg w-full space-y-4">
            {/* 問題說明 */}
            <div
              className="rounded-xl p-5"
              style={{ background: '#ffffff', border: '1px solid #d1ddf5', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{selected.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{selected.question}</div>
                  <div className="text-xs text-slate-400 mt-0.5">問題類型：簡單查詢／統計彙總</div>
                </div>
              </div>

              {/* SQL 解決方案 */}
              <div className="mb-3">
                <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                  <span>SQL 解決方案</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-xs"
                    style={{ background: '#dcfce7', color: '#15803d' }}
                  >
                    推薦
                  </span>
                </div>
                <div
                  className="rounded-lg p-3 font-mono text-sm"
                  style={{ background: '#1e2d4a', border: '1px solid #2d4a7a', color: '#4ade80' }}
                >
                  {selected.sqlSolution}
                </div>
              </div>

              {/* 分析說明 */}
              <div
                className="rounded-lg p-3"
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
              >
                <div className="text-xs font-semibold text-blue-700 mb-1">
                  為什麼用 SQL 更合適？
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{selected.reason}</p>
              </div>
            </div>

            {/* 對比：如果強行用 Graph... */}
            <div
              className="rounded-xl p-4"
              style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}
            >
              <div className="text-xs font-semibold text-red-600 mb-2">
                ⚠ 如果強行用 Knowledge Graph...
              </div>
              <div className="space-y-1">
                {[
                  '需要先建立 Schema 和節點，增加複雜度',
                  'Cypher 查詢反而不如 SQL 直觀',
                  '聚合函式（SUM、AVG、GROUP BY）在圖資料庫中效率較低',
                  '過度工程：用複雜工具解決簡單問題',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-red-700">
                    <span className="flex-shrink-0 text-red-500">✗</span>
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center max-w-sm">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">SQL 仍是好工具</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Knowledge Graph 不是要取代 SQL，而是在特定問題場景下提供更好的解法。
              點擊左側問題查看 SQL 如何解決它。
            </p>
            <div
              className="rounded-xl p-4"
              style={{ background: '#ffffff', border: '1px solid #d1ddf5', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <div className="text-xs font-semibold text-slate-600 mb-3">技術選型框架</div>
              <div className="space-y-2 text-xs">
                {[
                  { cond: '單表 / 雙表查詢', tool: 'SQL', ok: true },
                  { cond: '統計彙總（SUM/AVG）', tool: 'SQL', ok: true },
                  { cond: '多實體多跳關係', tool: 'Graph', ok: true },
                  { cond: '可解釋推理路徑', tool: 'Graph', ok: true },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">{row.cond}</span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-semibold"
                      style={{
                        background: row.tool === 'SQL' ? '#dcfce7' : '#eff6ff',
                        color: row.tool === 'SQL' ? '#15803d' : '#1d4ed8',
                      }}
                    >
                      {row.tool}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
