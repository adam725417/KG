import React from 'react';
import { useCourse } from '../../context/CourseContext';
import { courseData, getAllScenes } from '../../data/courseData';
import { CHAPTER_COLORS } from '../../theme';

const chapterIcons = { ch1: '📊', ch2: '🔗', ch3: '🎯', ch4: '🏥', ch5: '🤖' };

export default function Sidebar() {
  const { currentScene, goToScene, isSidebarOpen, setIsSidebarOpen } = useCourse();

  let sceneCounter = 0;
  const chapterStartIndices = {};
  courseData.chapters.forEach((ch) => {
    chapterStartIndices[ch.id] = sceneCounter;
    sceneCounter += ch.scenes.length;
  });

  return (
    <>
      <aside
        className="relative flex-shrink-0 transition-all duration-300 overflow-hidden"
        style={{ width: isSidebarOpen ? '256px' : '0px' }}
      >
        <div
          className="h-full overflow-y-auto"
          style={{
            width: '256px',
            background: '#1a2744',
            borderRight: '1px solid #2d4070',
          }}
        >
          {/* 標題 */}
          <div className="px-4 py-4 border-b border-slate-700">
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">課程導覽</div>
            <div className="text-sm font-bold text-white">Knowledge Graph</div>
          </div>

          {/* 章節清單 */}
          <nav className="p-2">
            {courseData.chapters.map((chapter) => {
              const startIdx = chapterStartIndices[chapter.id];
              const color = CHAPTER_COLORS[chapter.id];
              const isChapterActive = chapter.scenes.some((s) => s.id === currentScene?.id);

              return (
                <div key={chapter.id} className="mb-2">
                  {/* 章節標頭 */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg mb-1"
                    style={{
                      background: isChapterActive ? `${color}25` : 'transparent',
                      borderLeft: `3px solid ${isChapterActive ? color : 'transparent'}`,
                    }}
                  >
                    <span className="text-base">{chapterIcons[chapter.id]}</span>
                    <div>
                      <div className="text-xs font-bold" style={{ color: isChapterActive ? color : '#94a3b8' }}>
                        {chapter.id.replace('ch', 'Ch.')}
                      </div>
                      <div className="text-xs text-slate-400 leading-tight">{chapter.title}</div>
                    </div>
                  </div>

                  {/* 幕次清單 */}
                  <div className="ml-5 space-y-0.5">
                    {chapter.scenes.map((scene, idx) => {
                      const globalIdx = startIdx + idx;
                      const isActive = scene.id === currentScene?.id;

                      return (
                        <button
                          key={scene.id}
                          onClick={() => goToScene(globalIdx)}
                          className="w-full text-left px-3 py-2 rounded-lg transition-all group flex items-start gap-2"
                          style={{
                            background: isActive ? `${color}30` : 'transparent',
                          }}
                        >
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                            style={{
                              background: isActive ? color : '#2d4070',
                              color: isActive ? '#fff' : '#64748b',
                              fontSize: '10px',
                              fontWeight: '700',
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span
                            className="text-xs leading-snug"
                            style={{
                              color: isActive ? '#fff' : '#94a3b8',
                              fontWeight: isActive ? '600' : '400',
                            }}
                          >
                            {scene.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="p-4 mt-2 border-t border-slate-700">
            <div className="text-xs text-slate-600 text-center">
              Knowledge Graph 互動教學
            </div>
          </div>
        </div>
      </aside>

      {/* 展開/收合 */}
      <button
        onClick={() => setIsSidebarOpen((v) => !v)}
        className="absolute z-20 w-5 h-12 flex items-center justify-center rounded-r-lg transition-all"
        style={{
          left: isSidebarOpen ? '256px' : '0px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#1a2744',
          border: '1px solid #2d4070',
          borderLeft: 'none',
          color: '#94a3b8',
        }}
      >
        <span style={{ fontSize: '11px' }}>{isSidebarOpen ? '◀' : '▶'}</span>
      </button>
    </>
  );
}
