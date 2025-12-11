#!/usr/bin/env node

/**
 * 分析字體使用情況，找出最常用的字體分片
 *
 * 使用方式：
 * 1. 在瀏覽器 Console 執行此腳本的核心邏輯
 * 2. 或使用 Puppeteer 自動化分析
 */

// 在瀏覽器 Console 中執行以下代碼
const analyzePageFonts = () => {
  const loadedFonts = new Set();

  // 監聽字體載入
  document.fonts.ready.then(() => {
    document.fonts.forEach(font => {
      if (font.family === 'LINE Seed TW') {
        console.log('Loaded font:', font);
      }
    });
  });

  // 或者檢查 Network 面板的字體請求
  console.log('請查看 Network > Font 標籤，查看實際載入的字體文件');
  console.log('將最常載入的 3-5 個文件加入 preload');
};

// 輸出提示
console.log(`
分析步驟：
1. 打開你的應用程式首頁
2. 打開 DevTools > Network > Font
3. 刷新頁面，查看載入的字體文件
4. 將最先載入的 3-5 個文件名加入 index.html 的 preload

範例：
<link rel="preload" href="/fonts/LINESeedTW_TTF_Rg/[文件名].woff2" as="font" type="font/woff2" crossorigin>
`);
