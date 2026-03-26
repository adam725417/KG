import React from 'react';
import { CourseProvider } from './context/CourseContext';
import Sidebar from './components/layout/Sidebar';
import ProgressBar from './components/layout/ProgressBar';
import Controls from './components/layout/Controls';
import SceneWrapper from './components/scenes/SceneWrapper';
import HomePage from './components/HomePage';
import { useCourse } from './context/CourseContext';

// 內部容器（可訪問 CourseContext）
function AppInner() {
  const { currentIndex } = useCourse();
  const [showHome, setShowHome] = React.useState(true);

  if (showHome) {
    return <HomePage onStart={() => setShowHome(false)} />;
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#0d1117' }}
    >
      {/* 側邊欄 */}
      <div className="relative flex-shrink-0 flex">
        <Sidebar />
      </div>

      {/* 主要內容區 */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* 進度條 */}
        <ProgressBar />

        {/* 場景主舞台 */}
        <div className="flex-1 flex overflow-hidden">
          <SceneWrapper />
        </div>

        {/* 控制列 */}
        <Controls />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CourseProvider>
      <AppInner />
    </CourseProvider>
  );
}
