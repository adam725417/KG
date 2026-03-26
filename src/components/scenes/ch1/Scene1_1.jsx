import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const tables = [
  {
    id: 'disease', title: '疾病表 (Disease)', color: '#dc2626',
    bgColor: '#fde8e8', borderColor: '#fca5a5',
    columns: ['disease_id', 'name', 'category', 'severity', 'icd_code'],
    rows: [['D001','糖尿病','代謝疾病','中重度','E11'],['D002','高血壓','心血管','中度','I10'],['D003','慢性腎臟病','泌尿系統','重度','N18']],
    description: '儲存所有疾病的基本資訊，包含 ICD 國際疾病分類碼、嚴重程度等欄位。',
    purpose: '作為疾病的主要資料表，透過 disease_id 與其他表做 JOIN 查詢。',
    icon: '🏥',
  },
  {
    id: 'drug', title: '藥物表 (Drug)', color: '#1d4ed8',
    bgColor: '#dbeafe', borderColor: '#93c5fd',
    columns: ['drug_id', 'name', 'class', 'dosage', 'warning'],
    rows: [['DR001','Metformin','降血糖','500mg','腎功能不全慎用'],['DR002','Amlodipine','降血壓','5mg','肝功能不全慎用'],['DR003','Furosemide','利尿劑','40mg','電解質監測']],
    description: '儲存藥物的基本資訊、分類、建議劑量與警示事項。',
    purpose: '透過 drug_id 與疾病表和飲食表建立關聯。',
    icon: '💊',
  },
  {
    id: 'food', title: '飲食表 (Food)', color: '#15803d',
    bgColor: '#dcfce7', borderColor: '#86efac',
    columns: ['food_id', 'name', 'category', 'glycemic_idx', 'sodium'],
    rows: [['F001','白米飯','主食','72（高）','1mg'],['F002','西瓜','水果','72（高）','1mg'],['F003','泡麵','加工食品','60（中）','1800mg']],
    description: '儲存食物的營養資訊，包含升糖指數、鈉含量等重要欄位。',
    purpose: '透過中間關聯表與疾病、藥物建立「哪些食物應避免」的查詢關係。',
    icon: '🥗',
  },
];

export default function Scene1_1() {
  const { animStep } = useCourse();
  const [selectedTable, setSelectedTable] = useState(null);
  const [hoveredJoin, setHoveredJoin] = useState(false);

  const showTables = animStep >= 1;
  const showJoins  = animStep >= 2;
  const showComplexity = animStep >= 3;
  const selectedInfo = tables.find((t) => t.id === selectedTable);

  return (
    <div className="h-full flex flex-col p-6 gap-4 overflow-auto" style={{ background: '#eef3fc' }}>
      {/* 三張表格 */}
      <div className="flex-1 flex items-center justify-center gap-8 min-h-0 relative">
        {tables.map((table, i) => (
          <div
            key={table.id}
            className="cursor-pointer transition-all duration-700"
            style={{
              opacity: showTables ? 1 : 0,
              transform: showTables ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: `${i * 0.18}s`,
            }}
            onClick={() => setSelectedTable(selectedTable === table.id ? null : table.id)}
          >
            <div
              className="rounded-2xl overflow-hidden shadow-md transition-all"
              style={{
                width: '200px',
                background: '#fff',
                border: `2px solid ${selectedTable === table.id ? table.color : table.borderColor}`,
                boxShadow: selectedTable === table.id
                  ? `0 4px 24px ${table.color}35`
                  : `0 2px 12px ${table.color}18`,
              }}
            >
              {/* 表頭 */}
              <div className="px-3 py-2.5 flex items-center gap-2"
                style={{ background: table.bgColor, borderBottom: `2px solid ${table.borderColor}` }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: table.color }} />
                <span className="text-xs font-bold" style={{ color: table.color }}>{table.title}</span>
              </div>
              {/* 欄位標頭 */}
              <div className="grid text-xs font-bold text-slate-400 px-2 py-1"
                style={{ gridTemplateColumns: 'repeat(2,1fr)', borderBottom: '1px solid #f0f6ff' }}>
                {table.columns.slice(0, 2).map((c) => (
                  <div key={c} className="px-1 py-0.5 truncate">{c}</div>
                ))}
              </div>
              {/* 資料列 */}
              {table.rows.map((row, ri) => (
                <div key={ri}
                  className="grid text-xs text-slate-600 px-2 py-1 hover:bg-blue-50 transition-all"
                  style={{ gridTemplateColumns: 'repeat(2,1fr)', borderBottom: ri < table.rows.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                  {row.slice(0, 2).map((cell, ci) => (
                    <div key={ci} className="px-1 py-0.5 truncate">{cell}</div>
                  ))}
                </div>
              ))}
              <div className="px-3 py-1.5 text-xs text-center" style={{ color: table.color + '99' }}>
                +{table.columns.length - 2} 個欄位…
              </div>
            </div>
            {!selectedTable && (
              <div className="text-center mt-1 text-xs text-slate-400">點擊查看用途</div>
            )}
          </div>
        ))}

        {/* JOIN 線條覆蓋層
            座標說明：SVG 640px 置中，三表各 200px gap-8(32px) 共 664px 也置中
            Disease: x=-12~188  Drug: x=220~420  Food: x=452~652
            y=100 對應表格垂直中央（SVG 200px 高）
        */}
        {showJoins && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <svg width="640" height="200" style={{ overflow: 'visible' }}>
              <defs>
                <marker id="join-arrow" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 Z" fill="#475569" />
                </marker>
                <marker id="join-arrow-warn" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 Z" fill="#b45309" />
                </marker>
              </defs>

              {/* 疾病右邊(188) → 藥物左邊(220) */}
              <line x1="188" y1="100" x2="219" y2="100"
                stroke="#475569" strokeWidth="2.5" strokeDasharray="6 4"
                markerEnd="url(#join-arrow)" opacity="0.8" />
              {/* 藥物右邊(420) → 食物左邊(452) */}
              <line x1="420" y1="100" x2="451" y2="100"
                stroke="#475569" strokeWidth="2.5" strokeDasharray="6 4"
                markerEnd="url(#join-arrow)" opacity="0.8" />

              {/* JOIN 標籤（Disease→Drug 中間 x=204） */}
              <rect x="166" y="84" width="76" height="16" rx="5"
                fill="#ffffff" stroke="#d1ddf5" strokeWidth="1.5" />
              <text x="204" y="93" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#64748b">
                JOIN 關聯
              </text>

              {/* JOIN 標籤（Drug→Food 中間 x=436） */}
              <rect x="398" y="84" width="76" height="16" rx="5"
                fill="#ffffff" stroke="#d1ddf5" strokeWidth="1.5" />
              <text x="436" y="93" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#64748b">
                JOIN 關聯
              </text>

              {/* 疾病→食物 弧線（複雜度）Disease右(188) → Food左(452) */}
              {showComplexity && (
                <>
                  <path d="M 188 88 Q 320 28 452 88"
                    stroke="#b45309" strokeWidth="2.5" fill="none"
                    strokeDasharray="6 4" markerEnd="url(#join-arrow-warn)" opacity="0.8" />
                  {/* JOIN 標籤 */}
                  <rect x="280" y="22" width="80" height="18" rx="6"
                    fill="#ffffff" stroke="#fde68a" strokeWidth="1.5" />
                  <text x="320" y="34" textAnchor="middle" fontSize="9" fontWeight="700" fill="#b45309">
                    JOIN（複雜）
                  </text>
                </>
              )}
            </svg>

            {/* 複雜度警示 */}
            {showComplexity && (
              <div className="absolute top-2 right-4 rounded-xl px-3 py-2 text-xs font-semibold shadow"
                style={{ background: '#fef3c7', border: '1.5px solid #fde68a', color: '#b45309' }}>
                ⚠ 關係越來越複雜！
              </div>
            )}
          </div>
        )}
      </div>

      {/* 選中表格說明 */}
      {selectedInfo && (
        <div className="flex-shrink-0 rounded-2xl p-4 shadow-sm"
          style={{ background: '#ffffff', border: `2px solid ${selectedInfo.borderColor}` }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: selectedInfo.bgColor }}>
              {selectedInfo.icon}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm mb-1" style={{ color: selectedInfo.color }}>{selectedInfo.title}</div>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">{selectedInfo.description}</p>
              <div className="text-xs px-2 py-1 rounded-lg" style={{ background: selectedInfo.bgColor, color: selectedInfo.color }}>
                💡 {selectedInfo.purpose}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 步驟提示 */}
      {!showTables && (
        <div className="flex-shrink-0 text-center text-slate-400 text-sm">點擊「下一步」開始動畫 →</div>
      )}

      {/* 步驟指示器 */}
      <div className="flex-shrink-0 flex items-center justify-center gap-4 text-xs text-slate-400">
        {['顯示三張表','出現 JOIN 連線','複雜度提示','完成'].map((label, i) => (
          <div key={i} className="flex items-center gap-1.5" style={{ color: animStep > i ? '#2563eb' : '#cbd5e1' }}>
            <div className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: animStep > i ? '#dbeafe' : '#f1f5f9', border: `1.5px solid ${animStep > i ? '#2563eb' : '#e2e8f0'}`, color: animStep > i ? '#1d4ed8' : '#94a3b8', fontWeight: '700' }}>
              {i + 1}
            </div>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
