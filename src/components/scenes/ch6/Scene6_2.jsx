import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';

const steps = [
  {
    title: '建立 AuraDB Free',
    desc: '前往 neo4j.com/cloud/aura-free，使用 Google 帳號或 Email 注冊。建立後會得到連線 URI 與密碼，請務必儲存。',
    tip: '提醒學生先開瀏覽器到 neo4j.com，注冊好帳號再繼續。免費方案每個帳號可建立 1 個 instance。',
    cypher: null,
    observation: '取得 Neo4j AuraDB Free 的 Connection URI（格式：neo4j+s://xxx.databases.neo4j.io）',
  },
  {
    title: '貼上最小案例 Cypher',
    desc: '在 AuraDB Query 介面（左側 Query 標籤），貼上以下 Cypher 並按 Run。',
    tip: '建立後，學生可到 Explore 標籤查看圖形視覺化，確認節點與關係是否正確建立。',
    cypher: `CREATE (p:Patient {name:'王小明', age:58})
CREATE (d1:Disease {name:'糖尿病', category:'慢性病'})
CREATE (d2:Disease {name:'高血壓', category:'慢性病'})
CREATE (dr:Drug {name:'Metformin', warningLevel:'medium'})
CREATE (f1:Food {name:'高糖飲料', category:'飲料'})
CREATE (f2:Food {name:'葡萄柚', category:'水果'})
CREATE (n1:Nutrient {name:'糖分'})
CREATE (p)-[:HAS_DISEASE]->(d1)
CREATE (p)-[:HAS_DISEASE]->(d2)
CREATE (p)-[:TAKES]->(dr)
CREATE (dr)-[:TREATS]->(d1)
CREATE (d1)-[:SHOULD_AVOID]->(f1)
CREATE (dr)-[:INTERACTS_WITH {effect:'需注意服藥與飲食管理', evidenceLevel:'medium'}]->(f2)
CREATE (f1)-[:CONTAINS]->(n1)`,
    observation: '圖中出現 7 個節點（Patient, 2 Disease, Drug, 2 Food, Nutrient）與 7 條關係邊',
  },
  {
    title: '查詢基本關係',
    desc: '用 MATCH 查詢病人的疾病，確認資料是否正確建立。',
    tip: '強調 MATCH 的 Pattern Matching 概念：括號是節點，箭頭是關係，方括號是關係類型。',
    cypher: `MATCH (p:Patient {name:'王小明'})-[:HAS_DISEASE]->(d:Disease)
RETURN p.name AS 病人, collect(d.name) AS 疾病`,
    observation: '返回 王小明 → [糖尿病, 高血壓]',
  },
  {
    title: '練習多跳查詢',
    desc: '一次查詢病人的疾病、應避免的食物、以及藥物交互作用食物。',
    tip: '這就是多跳查詢的威力——一個 Cypher 可以同時走過多條關係路徑，在 SQL 需要多次 JOIN。',
    cypher: `MATCH (p:Patient {name:'王小明'})-[:HAS_DISEASE]->(d:Disease)
OPTIONAL MATCH (d)-[:SHOULD_AVOID]->(f1:Food)
OPTIONAL MATCH (p)-[:TAKES]->(dr:Drug)-[r:INTERACTS_WITH]->(f2:Food)
RETURN
  p.name AS 病人,
  collect(DISTINCT d.name) AS 疾病,
  collect(DISTINCT f1.name) AS 疾病避免食物,
  collect(DISTINCT f2.name) AS 藥物交互作用食物`,
    observation: '一次取得病人所有相關飲食限制，包含疾病與藥物兩個路徑的資訊',
  },
  {
    title: '用 MERGE 避免重複建立',
    desc: '如果重複跑 CREATE，會產生重複節點。改用 MERGE：如果已存在就配對，不存在才建立。',
    tip: 'MERGE 是資料更新的核心概念。ON CREATE SET 和 ON MATCH SET 讓你分別控制「新建」和「更新」的邏輯。',
    cypher: `MERGE (d:Disease {name:'糖尿病'})
MERGE (dr:Drug {name:'Metformin'})
MERGE (dr)-[:TREATS]->(d)`,
    observation: '執行後不會產生新節點，而是配對現有的 糖尿病 和 Metformin，確保 TREATS 關係唯一',
  },
  {
    title: '擴充共病情境',
    desc: '為王小明加入慢性腎臟病，並建立腎臟病與藥物的注意關係。',
    tip: '這模擬真實情境的知識圖譜擴充——在現有圖上新增節點與關係，不需要修改既有結構。',
    cypher: `MERGE (p:Patient {name:'王小明'})
MERGE (d3:Disease {name:'慢性腎臟病', category:'慢性病'})
MERGE (dr:Drug {name:'Metformin'})
MERGE (p)-[:HAS_DISEASE]->(d3)
MERGE (dr)-[:CAUTION_IN {reason:'腎功能不全時需調整劑量'}]->(d3)`,
    observation: '圖中新增 慢性腎臟病 節點，並與病人和藥物建立新關係',
  },
];

export default function Scene6_2() {
  const { animStep } = useCourse();
  const [copied, setCopied] = useState(false);

  const currentStep = animStep >= 1 ? steps[animStep - 1] : null;

  function handleCopy(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* 左側 Stepper sidebar */}
      <div
        className="w-52 flex-shrink-0 flex flex-col py-6 px-4 border-r border-blue-100 overflow-y-auto"
        style={{ background: '#f5f8ff' }}
      >
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-4">
          操作步驟
        </div>

        <div className="relative">
          {/* 垂直連接線 */}
          <div
            className="absolute left-4 top-5 bottom-5 w-0.5"
            style={{ background: '#d1ddf5' }}
          />

          <div className="space-y-1">
            {steps.map((step, i) => {
              const stepNum = i + 1;
              const isDone = animStep > stepNum;
              const isCurrent = animStep === stepNum;
              const isReachable = animStep >= stepNum;

              return (
                <div
                  key={stepNum}
                  className="relative flex items-start gap-3 py-2"
                  style={{ opacity: isReachable ? 1 : 0.4 }}
                >
                  {/* 圓圈 */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-300"
                    style={{
                      background: isDone
                        ? '#16a34a'
                        : isCurrent
                        ? '#1d4ed8'
                        : '#ffffff',
                      color: isDone || isCurrent ? '#ffffff' : '#94a3b8',
                      border: isDone
                        ? '2px solid #16a34a'
                        : isCurrent
                        ? '2px solid #1d4ed8'
                        : '2px solid #d1ddf5',
                      boxShadow: isCurrent ? '0 0 0 3px rgba(29,78,216,0.15)' : 'none',
                    }}
                  >
                    {isDone ? '✓' : stepNum}
                  </div>

                  {/* 標題 */}
                  <div className="pt-1.5">
                    <div
                      className="text-xs leading-snug"
                      style={{
                        fontWeight: isCurrent ? '600' : '400',
                        color: isCurrent ? '#1d4ed8' : isDone ? '#15803d' : '#64748b',
                      }}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 右側主要內容 */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6">
        {animStep === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">🗂</div>
            <p className="text-slate-400 text-sm">點擊下一步開始</p>
            <p className="text-slate-300 text-xs mt-2">共 6 個操作步驟</p>
          </div>
        ) : currentStep ? (
          <div className="space-y-4 max-w-2xl">
            {/* 步驟標題 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: '#1d4ed8', color: '#ffffff' }}
                >
                  {animStep}
                </div>
                <h2 className="text-base font-bold text-slate-800">{currentStep.title}</h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{currentStep.desc}</p>
            </div>

            {/* 老師提示 */}
            <div
              className="rounded-xl p-4"
              style={{ background: '#fffbeb', border: '1px solid #fcd34d' }}
            >
              <div className="flex items-start gap-2">
                <span className="text-base flex-shrink-0">💡</span>
                <div>
                  <div className="text-xs font-semibold text-amber-700 mb-1">老師提示</div>
                  <p className="text-xs text-amber-800 leading-relaxed">{currentStep.tip}</p>
                </div>
              </div>
            </div>

            {/* Cypher 代碼區塊 */}
            {currentStep.cypher && (
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #d1ddf5' }}>
                <div
                  className="flex items-center justify-between px-4 py-2"
                  style={{ background: '#1e2d4a' }}
                >
                  <span className="text-xs font-mono" style={{ color: '#64748b' }}>
                    Cypher
                  </span>
                  <button
                    onClick={() => handleCopy(currentStep.cypher)}
                    className="text-xs px-3 py-1 rounded transition-all duration-200"
                    style={{
                      background: copied ? '#16a34a20' : '#ffffff10',
                      color: copied ? '#4ade80' : '#94a3b8',
                      border: `1px solid ${copied ? '#16a34a40' : '#ffffff20'}`,
                    }}
                  >
                    {copied ? '已複製 ✓' : '複製'}
                  </button>
                </div>
                <pre
                  className="px-4 py-4 text-xs font-mono leading-relaxed overflow-x-auto"
                  style={{ background: '#1e2d4a', color: '#a5b4fc', margin: 0 }}
                >
                  {currentStep.cypher}
                </pre>
              </div>
            )}

            {/* 預期觀察 */}
            <div
              className="rounded-xl p-4"
              style={{ background: '#f0fdf4', border: '1px solid #86efac' }}
            >
              <div className="flex items-start gap-2">
                <span className="text-base flex-shrink-0">👀</span>
                <div>
                  <div className="text-xs font-semibold text-green-700 mb-1">預期觀察</div>
                  <p className="text-xs text-green-800 leading-relaxed">{currentStep.observation}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
