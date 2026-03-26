import React from 'react';
import { useCourse } from '../../context/CourseContext';
import { CHAPTER_COLORS } from '../../theme';
import NarrationBox from '../ui/NarrationBox';
import KeyPoints from '../ui/KeyPoints';
import Quiz from '../ui/Quiz';

import Scene1_1 from './ch1/Scene1_1';
import Scene1_2 from './ch1/Scene1_2';
import Scene1_3 from './ch1/Scene1_3';
import Scene2_1 from './ch2/Scene2_1';
import Scene2_2 from './ch2/Scene2_2';
import Scene2_3 from './ch2/Scene2_3';
import Scene3_1 from './ch3/Scene3_1';
import Scene3_2 from './ch3/Scene3_2';
import Scene4_1 from './ch4/Scene4_1';
import Scene4_2 from './ch4/Scene4_2';
import Scene4_3 from './ch4/Scene4_3';
import Scene5_1 from './ch5/Scene5_1';
import Scene5_2 from './ch5/Scene5_2';
import Scene5_3 from './ch5/Scene5_3';
import Scene5_4 from './ch5/Scene5_4';
import Scene6_1 from './ch6/Scene6_1';
import Scene6_2 from './ch6/Scene6_2';
import Scene6_3 from './ch6/Scene6_3';
import Scene6_4 from './ch6/Scene6_4';
import Scene6_5 from './ch6/Scene6_5';
import Scene6_6 from './ch6/Scene6_6';

const SCENE_COMPONENTS = {
  'sc1-1': Scene1_1, 'sc1-2': Scene1_2, 'sc1-3': Scene1_3,
  'sc2-1': Scene2_1, 'sc2-2': Scene2_2, 'sc2-3': Scene2_3,
  'sc3-1': Scene3_1, 'sc3-2': Scene3_2,
  'sc4-1': Scene4_1, 'sc4-2': Scene4_2, 'sc4-3': Scene4_3,
  'sc5-1': Scene5_1, 'sc5-2': Scene5_2, 'sc5-3': Scene5_3, 'sc5-4': Scene5_4,
  'sc6-1': Scene6_1, 'sc6-2': Scene6_2, 'sc6-3': Scene6_3,
  'sc6-4': Scene6_4, 'sc6-5': Scene6_5, 'sc6-6': Scene6_6,
};

export default function SceneWrapper() {
  const { currentScene, showQuiz } = useCourse();
  if (!currentScene) return null;

  const SceneComponent = SCENE_COMPONENTS[currentScene.id];
  const chColor = CHAPTER_COLORS[currentScene.chapterId] || '#2563eb';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 場景頭部 */}
      <div
        className="flex-shrink-0 px-6 py-4 border-b"
        style={{ background: '#ffffff', borderColor: '#d1ddf5' }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: `${chColor}18`, color: chColor, border: `1.5px solid ${chColor}40` }}
              >
                {currentScene.id.replace('sc', 'Scene ')}
              </span>
            </div>
            <h1 className="text-xl font-bold leading-tight" style={{ color: '#0f172a' }}>
              {currentScene.title}
            </h1>
          </div>
        </div>
        <div className="mt-2 flex items-start gap-2">
          <span
            className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-bold"
            style={{ background: '#f1f5f9', color: '#64748b' }}
          >
            目標
          </span>
          <p className="text-xs text-slate-500 leading-relaxed">{currentScene.objective}</p>
        </div>
      </div>

      {/* 主內容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 場景視覺舞台 */}
        <div className="flex-1 overflow-hidden relative" style={{ background: '#eef3fc' }}>
          {SceneComponent
            ? <SceneComponent />
            : <div className="flex items-center justify-center h-full text-slate-400">
                場景 {currentScene.id} 建置中...
              </div>
          }
        </div>

        {/* 右側資訊欄 */}
        <div
          className="flex-shrink-0 w-72 overflow-hidden flex flex-col gap-3 p-3 border-l"
          style={{ background: '#f5f8ff', borderColor: '#d1ddf5' }}
        >
          {!showQuiz && <NarrationBox />}
          {showQuiz ? <Quiz /> : <KeyPoints />}
        </div>
      </div>
    </div>
  );
}
