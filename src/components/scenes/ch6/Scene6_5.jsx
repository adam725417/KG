import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const questions = [
  {
    id: 'q1',
    question: '請撰寫一個 Cypher，查詢「糖尿病」這個疾病節點，以及所有應避免的食物名稱。',
    hint: '從 Disease 節點出發，用 SHOULD_AVOID 關係走到 Food 節點。',
    answer: `MATCH (d:Disease {name:'糖尿病'})-[:SHOULD_AVOID]->(f:Food)
RETURN d.name AS 疾病, collect(f.name) AS 應避免食物`,
    explanation: 'MATCH 描述從 Disease 到 Food 的路徑，collect() 函式將多個結果合併成列表。',
  },
  {
    id: 'q2',
    question: '請撰寫一個 Cypher，查詢「王小明」服用了哪些藥物，以及這些藥物治療了哪些疾病。',
    hint: '從 Patient 出發，先走 TAKES 到 Drug，再從 Drug 走 TREATS 到 Disease。',
    answer: `MATCH (p:Patient {name:'王小明'})-[:TAKES]->(dr:Drug)-[:TREATS]->(d:Disease)
RETURN p.name AS 病人, dr.name AS 藥物, d.name AS 治療疾病`,
    explanation: '這是兩跳查詢：病人→藥物→疾病。Cypher 可以用箭頭連續描述多跳路徑。',
  },
  {
    id: 'q3',
    question: '請用 MERGE 建立一個新的 Nutrient 節點「Sodium」，如果已存在就更新 updatedAt 屬性。',
    hint: 'ON CREATE SET 處理新建的情況，ON MATCH SET 處理已存在的情況。',
    answer: `MERGE (n:Nutrient {name:'Sodium'})
ON CREATE SET n.createdAt = date()
ON MATCH SET n.updatedAt = date()`,
    explanation: 'MERGE 結合 ON CREATE / ON MATCH，讓你精確控制新建與更新時的不同行為。',
  },
  {
    id: 'q4',
    question: '請撰寫一個多跳查詢，找出王小明的所有疾病，以及每個疾病應避免的食物，並同時列出食物所含的營養素。',
    hint: '三跳查詢：Patient→Disease→Food→Nutrient。可以用 OPTIONAL MATCH 讓沒有 Nutrient 的食物也能被返回。',
    answer: `MATCH (p:Patient {name:'王小明'})-[:HAS_DISEASE]->(d:Disease)
OPTIONAL MATCH (d)-[:SHOULD_AVOID]->(f:Food)
OPTIONAL MATCH (f)-[:CONTAINS]->(n:Nutrient)
RETURN d.name AS 疾病, f.name AS 避免食物, n.name AS 含有營養素`,
    explanation: 'OPTIONAL MATCH 類似 SQL 的 LEFT JOIN，即使後段找不到匹配也不會讓整行消失。',
  },
];

function QuestionCard({ q, index, isVisible, copiedId, onCopy }) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: isVisible ? 'auto' : 'none',
        border: '1px solid #d1ddf5',
        background: '#ffffff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* 問題標題 */}
      <div className="flex items-start gap-3 px-4 py-4">
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: '#dbeafe', color: '#1e3a8a' }}
        >
          Q{index + 1}
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{q.question}</p>
      </div>

      {/* 操作按鈕列 */}
      <div
        className="flex gap-2 px-4 pb-3"
        style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}
      >
        <button
          onClick={() => setShowHint((v) => !v)}
          className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
          style={{
            background: showHint ? '#fffbeb' : '#f8fafc',
            color: showHint ? '#b45309' : '#64748b',
            border: `1px solid ${showHint ? '#fcd34d' : '#e2e8f0'}`,
          }}
        >
          {showHint ? '收起提示' : '查看提示'} 💡
        </button>
        <button
          onClick={() => setShowAnswer((v) => !v)}
          className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
          style={{
            background: showAnswer ? '#f0fdf4' : '#f8fafc',
            color: showAnswer ? '#15803d' : '#64748b',
            border: `1px solid ${showAnswer ? '#86efac' : '#e2e8f0'}`,
          }}
        >
          {showAnswer ? '收起答案' : '查看參考答案'} 📋
        </button>
      </div>

      {/* 提示區塊 */}
      {showHint && (
        <div
          className="mx-4 mb-3 rounded-lg px-3 py-2.5"
          style={{ background: '#fffbeb', border: '1px solid #fcd34d' }}
        >
          <div className="text-xs font-semibold text-amber-700 mb-1">提示</div>
          <p className="text-xs text-amber-800 leading-relaxed">{q.hint}</p>
        </div>
      )}

      {/* 答案區塊 */}
      {showAnswer && (
        <div className="mx-4 mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid #d1ddf5' }}>
          <div
            className="flex items-center justify-between px-3 py-2"
            style={{ background: '#1e2d4a' }}
          >
            <span className="text-xs font-mono" style={{ color: '#64748b' }}>
              參考答案
            </span>
            <button
              onClick={() => onCopy(q.id, q.answer)}
              className="text-xs px-2.5 py-1 rounded transition-all duration-200"
              style={{
                background: copiedId === q.id ? '#16a34a20' : '#ffffff10',
                color: copiedId === q.id ? '#4ade80' : '#94a3b8',
                border: `1px solid ${copiedId === q.id ? '#16a34a40' : '#ffffff20'}`,
              }}
            >
              {copiedId === q.id ? '已複製 ✓' : '複製'}
            </button>
          </div>
          <pre
            className="px-4 py-3 text-xs font-mono leading-relaxed overflow-x-auto"
            style={{ background: '#1e2d4a', color: '#a5b4fc', margin: 0 }}
          >
            {q.answer}
          </pre>
          {/* 解說 */}
          <div
            className="px-4 py-3"
            style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}
          >
            <div className="text-xs font-semibold text-slate-500 mb-1">解說</div>
            <p className="text-xs text-slate-400 leading-relaxed">{q.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Scene6_5() {
  const { animStep } = useCourse();
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
        {animStep === 0 ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <p className="text-sm text-slate-400">點擊下一步開始</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">
              課堂練習題
            </div>

            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                q={q}
                index={i}
                isVisible={animStep >= i + 1}
                copiedId={copiedId}
                onCopy={handleCopy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
