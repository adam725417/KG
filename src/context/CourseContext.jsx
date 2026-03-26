import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAllScenes } from '../data/courseData';

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const allScenes = getAllScenes();

  // 當前幕次（扁平索引）
  const [currentIndex, setCurrentIndex] = useState(0);
  // 當前幕內動畫步驟
  const [animStep, setAnimStep] = useState(0);
  // 是否正在自動播放
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  // 側邊欄是否展開
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // 是否顯示測驗
  const [showQuiz, setShowQuiz] = useState(false);
  // 測驗答案記錄 { sceneId: { questionIndex: selectedAnswer } }
  const [quizAnswers, setQuizAnswers] = useState({});

  const currentScene = allScenes[currentIndex];
  const totalScenes = allScenes.length;

  // 前往特定幕次
  const goToScene = useCallback((index) => {
    if (index >= 0 && index < totalScenes) {
      setCurrentIndex(index);
      setAnimStep(0);
      setShowQuiz(false);
      setIsAutoPlay(false);
    }
  }, [totalScenes]);

  // 下一幕
  const nextScene = useCallback(() => {
    if (currentIndex < totalScenes - 1) {
      setCurrentIndex((i) => i + 1);
      setAnimStep(0);
      setShowQuiz(false);
    }
  }, [currentIndex, totalScenes]);

  // 上一幕
  const prevScene = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setAnimStep(0);
      setShowQuiz(false);
    }
  }, [currentIndex]);

  // 重播本幕動畫
  const replayScene = useCallback(() => {
    setAnimStep(0);
    setIsAutoPlay(false);
    // 短暫延遲後重新開始，觸發動畫重置
    setTimeout(() => setAnimStep(0), 50);
  }, []);

  // 下一個動畫步驟
  const nextAnimStep = useCallback(() => {
    const maxStep = currentScene?.animationSteps || 1;
    if (animStep < maxStep) {
      setAnimStep((s) => s + 1);
    }
  }, [animStep, currentScene]);

  // 上一個動畫步驟
  const prevAnimStep = useCallback(() => {
    if (animStep > 0) {
      setAnimStep((s) => s - 1);
    }
  }, [animStep]);

  // 自動播放控制
  useEffect(() => {
    if (!isAutoPlay) return;
    const maxStep = currentScene?.animationSteps || 1;
    if (animStep < maxStep) {
      const timer = setTimeout(() => {
        setAnimStep((s) => s + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // 所有步驟播完，停止自動播放
      setIsAutoPlay(false);
    }
  }, [isAutoPlay, animStep, currentScene]);

  // 記錄測驗答案
  const submitQuizAnswer = useCallback((sceneId, questionIndex, answer) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [sceneId]: {
        ...(prev[sceneId] || {}),
        [questionIndex]: answer,
      },
    }));
  }, []);

  const value = {
    // 狀態
    currentIndex,
    currentScene,
    animStep,
    isAutoPlay,
    isSidebarOpen,
    showQuiz,
    quizAnswers,
    totalScenes,
    allScenes,
    // 操作
    goToScene,
    nextScene,
    prevScene,
    replayScene,
    nextAnimStep,
    prevAnimStep,
    setAnimStep,
    setIsAutoPlay,
    setIsSidebarOpen,
    setShowQuiz,
    submitQuizAnswer,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourse() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourse must be used within CourseProvider');
  return ctx;
}
