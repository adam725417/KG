import React, { useState } from 'react';
import { useCourse } from '../../../context/CourseContext';
import GraphCanvas from '../../ui/GraphCanvas';

const graphNodes = [
  { id:'patient',    label:'病人',       type:'Patient', x:300, y:200, r:34 },
  { id:'diabetes',   label:'糖尿病',     type:'Disease', x:150, y:95,  r:28 },
  { id:'hypertension',label:'高血壓',    type:'Disease', x:450, y:95,  r:28 },
  { id:'metformin',  label:'Metformin',  type:'Drug',    x:95,  y:265, r:28 },
  { id:'amlodipine', label:'Amlodipine', type:'Drug',    x:505, y:265, r:28 },
  { id:'highsugar',  label:'高糖飲料',   type:'Food',    x:175, y:355, r:28 },
  { id:'highsalt',   label:'高鹽食品',   type:'Food',    x:425, y:355, r:28 },
];
const graphEdges = [
  { id:'e1', from:'patient',    to:'diabetes',    label:'HAS_DISEASE',  type:'HAS_DISEASE'  },
  { id:'e2', from:'patient',    to:'hypertension',label:'HAS_DISEASE',  type:'HAS_DISEASE'  },
  { id:'e3', from:'metformin',  to:'diabetes',    label:'TREATS',       type:'TREATS'       },
  { id:'e4', from:'amlodipine', to:'hypertension',label:'TREATS',       type:'TREATS'       },
  { id:'e5', from:'diabetes',   to:'highsugar',   label:'SHOULD_AVOID', type:'SHOULD_AVOID' },
  { id:'e6', from:'hypertension',to:'highsalt',   label:'SHOULD_AVOID', type:'SHOULD_AVOID' },
  { id:'e7', from:'patient',    to:'metformin',   label:'TAKES',        type:'TAKES'        },
];

const relExplanations = {
  HAS_DISEASE: '病人罹患某種疾病',
  TREATS: '某藥物用來治療某疾病',
  SHOULD_AVOID: '罹患某疾病時應避免的食物',
  TAKES: '病人正在服用的藥物',
};

const nodeProperties = {
  patient:     { name:'李先生', age:'55歲', gender:'男' },
  diabetes:    { name:'第二型糖尿病', icd:'E11', severity:'中重度' },
  hypertension:{ name:'原發性高血壓', icd:'I10', severity:'中度' },
  metformin:   { name:'Metformin', dosage:'500mg/次', frequency:'每日2次' },
  amlodipine:  { name:'Amlodipine', dosage:'5mg/次',  frequency:'每日1次' },
  highsugar:   { name:'高糖飲料', glycemicIdx:'72（高）', note:'快速升高血糖' },
  highsalt:    { name:'高鹽食品', sodium:'>2000mg', note:'加重血壓負擔' },
};

export default function Scene1_3() {
  const { animStep } = useCourse();
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);

  const visibleNodes = (() => {
    if (animStep === 0) return [];
    if (animStep === 1) return graphNodes.slice(0,1);
    if (animStep === 2) return graphNodes.slice(0,3);
    if (animStep === 3) return graphNodes.slice(0,5);
    return graphNodes;
  })();

  const visibleEdgeCount = animStep <= 1 ? 0 : animStep === 2 ? 2 : animStep === 3 ? 4 : graphEdges.length;
  const selectedNodeData = selectedNode ? graphNodes.find((n) => n.id === selectedNode) : null;

  return (
    <div className="h-full flex gap-0 overflow-hidden" style={{ background: '#eef3fc' }}>
      {/* 圖形舞台 */}
      <div className="flex-1 relative flex items-center justify-center">
        {animStep === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10" style={{ background: '#eef3fc' }}>
            <div className="text-4xl">📊 → 🌐</div>
            <p className="text-slate-500 text-sm text-center max-w-xs leading-relaxed">
              接下來把表格資料轉換成知識圖譜。<br />點擊「下一步」開始動畫。
            </p>
          </div>
        )}
        {animStep >= 1 && (
          <div className="w-full h-full flex items-center justify-center p-4">
            <GraphCanvas
              nodes={visibleNodes} edges={graphEdges}
              visibleEdgeCount={visibleEdgeCount}
              selectedNodeId={selectedNode}
              onNodeClick={(node) => setSelectedNode(selectedNode === node.id ? null : node.id)}
              onEdgeHover={setHoveredEdge}
              width={520} height={390}
            />
          </div>
        )}

        {/* 步驟說明 */}
        {animStep >= 1 && (
          <div className="absolute top-4 left-4 text-xs px-3 py-1.5 rounded-xl shadow-sm"
            style={{ background: '#ffffff', border: '1.5px solid #d1ddf5', color: '#334155' }}>
            {animStep === 1 && '① 病人節點出現 — 知識圖譜的起點'}
            {animStep === 2 && '② 疾病節點展開 — HAS_DISEASE 關係建立'}
            {animStep === 3 && '③ 藥物節點加入 — TREATS 關係建立'}
            {animStep >= 4 && '④ 飲食節點完成 — SHOULD_AVOID 關係建立'}
          </div>
        )}

        {/* Hover 關係說明 */}
        {hoveredEdge && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-4 py-2 rounded-xl shadow-md transition-all"
            style={{ background: '#1d4ed8', color: '#fff', fontWeight: '600' }}>
            <span className="opacity-80">{hoveredEdge.label}</span>
            {' — '}
            {relExplanations[hoveredEdge.type] || hoveredEdge.type}
          </div>
        )}
      </div>

      {/* 右側屬性面板 */}
      <div className="w-56 flex-shrink-0 border-l overflow-y-auto p-4"
        style={{ background: '#ffffff', borderColor: '#d1ddf5' }}>
        {selectedNodeData ? (
          <>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">節點詳情</div>
            <div className="rounded-xl p-3 mb-3 shadow-sm"
              style={{ background: '#f0f6ff', border: '1.5px solid #93c5fd' }}>
              <div className="text-sm font-bold text-slate-800 mb-1">{selectedNodeData.label}</div>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                :{selectedNodeData.type}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">屬性</div>
            {Object.entries(nodeProperties[selectedNodeData.id] || {}).map(([k,v]) => (
              <div key={k} className="flex justify-between items-center py-1.5 border-b text-xs"
                style={{ borderColor: '#f1f5f9' }}>
                <span className="text-slate-400 font-mono">{k}</span>
                <span className="text-slate-700 font-semibold">{v}</span>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-3xl mb-3 mt-8">🖱️</div>
            <p className="text-xs text-slate-400 leading-relaxed">點擊圖中節點<br />查看屬性資訊</p>
            <div className="mt-6 text-xs text-slate-300">— 或 hover 關係邊<br />查看關係說明 —</div>
          </div>
        )}
      </div>
    </div>
  );
}
