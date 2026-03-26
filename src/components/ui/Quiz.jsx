import React, { useState } from 'react';
import { useCourse } from '../../context/CourseContext';

export default function Quiz() {
  const { currentScene, quizAnswers, submitQuizAnswer } = useCourse();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  if (!currentScene?.quiz?.length) return null;

  const handleSelect = (qIdx, optIdx) => {
    if (submitted[qIdx]) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };
  const handleSubmit = (qIdx) => {
    if (selectedAnswers[qIdx] === undefined) return;
    setSubmitted((prev) => ({ ...prev, [qIdx]: true }));
    submitQuizAnswer(currentScene.id, qIdx, selectedAnswers[qIdx]);
  };

  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm flex flex-col min-h-0"
      style={{ border: '1.5px solid #fde68a', background: '#ffffff', flex: '1 1 0' }}
    >
      <div
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: '#fde68a', background: '#fffbeb' }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: '#b45309' }} />
        <span className="text-xs font-bold text-amber-800 tracking-wide">測驗</span>
        <span className="text-xs text-slate-400 ml-auto">共 {currentScene.quiz.length} 題</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
        {currentScene.quiz.map((q, qIdx) => {
          const isSubmitted = submitted[qIdx];
          const selected = selectedAnswers[qIdx];
          const isCorrect = selected === q.answer;

          return (
            <div key={q.id}>
              <div className="text-sm font-semibold text-slate-800 mb-3 leading-relaxed">
                <span className="inline-block mr-2 px-1.5 py-0.5 rounded text-xs font-bold"
                  style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                  Q{qIdx + 1}
                </span>
                {q.question}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let bg = '#f8fafc', border = '#e2e8f0', color = '#334155';
                  if (selected === optIdx && !isSubmitted) { bg = '#eff6ff'; border = '#2563eb'; color = '#1e3a8a'; }
                  if (isSubmitted) {
                    if (optIdx === q.answer) { bg = '#f0fdf4'; border = '#15803d'; color = '#14532d'; }
                    else if (optIdx === selected) { bg = '#fef2f2'; border = '#dc2626'; color = '#991b1b'; }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      disabled={isSubmitted}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-start gap-2"
                      style={{ background: bg, border: `1.5px solid ${border}`, color, cursor: isSubmitted ? 'default' : 'pointer' }}
                    >
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: isSubmitted && optIdx === q.answer ? '#15803d'
                            : isSubmitted && optIdx === selected ? '#dc2626'
                            : selected === optIdx ? '#2563eb' : '#e2e8f0',
                          color: (isSubmitted || selected === optIdx) ? '#fff' : '#94a3b8',
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {!isSubmitted && (
                <button
                  onClick={() => handleSubmit(qIdx)}
                  disabled={selected === undefined}
                  className="mt-3 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30"
                  style={{ background: selected !== undefined ? '#2563eb' : '#e2e8f0', color: selected !== undefined ? '#fff' : '#94a3b8' }}
                >
                  確認答案
                </button>
              )}

              {isSubmitted && (
                <div
                  className="mt-3 p-3 rounded-xl"
                  style={{
                    background: isCorrect ? '#f0fdf4' : '#fef2f2',
                    border: `1.5px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
                  }}
                >
                  <div className="text-xs font-bold mb-1" style={{ color: isCorrect ? '#15803d' : '#dc2626' }}>
                    {isCorrect ? '✓ 答對了！' : '✗ 答錯了'}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: isCorrect ? '#166534' : '#991b1b' }}>
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
