/**
 * 全站共用色彩主題 — 淺色鮮明風格
 * 所有元件統一從此檔案 import 顏色常數
 */

// ── 基礎背景 ──────────────────────────────────────────
export const BG = {
  main:    '#eef3fc',   // 主背景：淡藍白
  card:    '#ffffff',   // 卡片白
  panel:   '#f5f8ff',   // 面板淡藍
  hover:   '#e8f0fe',   // hover 背景
  code:    '#1e2d4a',   // 程式碼區塊（保留深色）
  sidebar: '#1a2744',   // 側欄深藍（與內容區對比）
};

// ── 邊框 ──────────────────────────────────────────────
export const BORDER = {
  subtle: '#d1ddf5',
  normal: '#b8ccf0',
  active: '#2563eb',
};

// ── 文字 ──────────────────────────────────────────────
export const TEXT = {
  primary:   '#0f172a',
  secondary: '#334155',
  muted:     '#64748b',
  light:     '#94a3b8',
  code:      '#c7d2fe',  // 程式碼文字
};

// ── 節點顏色（淺底高對比版）─────────────────────────────
export const NODE_COLORS = {
  Disease: {
    fill:   '#fde8e8',
    stroke: '#dc2626',
    text:   '#991b1b',
    label:  '疾病',
    badge:  { bg: '#fde8e8', color: '#dc2626' },
  },
  Drug: {
    fill:   '#dbeafe',
    stroke: '#1d4ed8',
    text:   '#1e3a8a',
    label:  '藥物',
    badge:  { bg: '#dbeafe', color: '#1d4ed8' },
  },
  Food: {
    fill:   '#dcfce7',
    stroke: '#15803d',
    text:   '#14532d',
    label:  '食物',
    badge:  { bg: '#dcfce7', color: '#15803d' },
  },
  Patient: {
    fill:   '#fef3c7',
    stroke: '#b45309',
    text:   '#92400e',
    label:  '病人',
    badge:  { bg: '#fef3c7', color: '#b45309' },
  },
  Nutrient: {
    fill:   '#f3e8ff',
    stroke: '#7c3aed',
    text:   '#4c1d95',
    label:  '營養素',
    badge:  { bg: '#f3e8ff', color: '#7c3aed' },
  },
  Symptom: {
    fill:   '#e0f2fe',
    stroke: '#0369a1',
    text:   '#075985',
    label:  '症狀',
    badge:  { bg: '#e0f2fe', color: '#0369a1' },
  },
  Table: {
    fill:   '#f8fafc',
    stroke: '#475569',
    text:   '#334155',
    label:  '資料表',
    badge:  { bg: '#f1f5f9', color: '#475569' },
  },
  Chunk: {
    fill:   '#f1f5f9',
    stroke: '#64748b',
    text:   '#475569',
    label:  '文件段落',
    badge:  { bg: '#f1f5f9', color: '#64748b' },
  },
};

// ── 關係線顏色（深色，確保在淺底可見）──────────────────────
export const REL_COLORS = {
  TREATS:         '#1d4ed8',
  SHOULD_AVOID:   '#dc2626',
  INTERACTS_WITH: '#b45309',
  HAS_DISEASE:    '#b45309',
  TAKES:          '#15803d',
  WORSENS:        '#dc2626',
  CONTAINS:       '#7c3aed',
  CAUSES:         '#ea580c',
  JOIN:           '#475569',
  default:        '#4f46e5',
};

// ── 章節顏色 ──────────────────────────────────────────
export const CHAPTER_COLORS = {
  ch1: '#2563eb',
  ch2: '#7c3aed',
  ch3: '#15803d',
  ch4: '#b45309',
  ch5: '#dc2626',
  ch6: '#06b6d4',
};

// ── 強調色 ─────────────────────────────────────────────
export const ACCENT = {
  blue:   '#2563eb',
  purple: '#7c3aed',
  green:  '#15803d',
  amber:  '#b45309',
  red:    '#dc2626',
  sky:    '#0369a1',
};
