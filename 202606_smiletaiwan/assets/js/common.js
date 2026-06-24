// 引用Aos動態
AOS.init({
  once: true,
  offset: 100,
});

/* ========================================
 * AOS 共用更新
 * ======================================== */

function refreshAOS() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (
        typeof AOS !== 'undefined' &&
        typeof AOS.refreshHard === 'function'
      ) {
        AOS.refreshHard();
      }
    });
  });
}

/* ========================================
 * datalayer.push 相關設定
 * ======================================== */
window.dataLayer = window.dataLayer || [];

// 閱讀進度
function initReadingProgressTracking() {
  const progressSections = document.querySelectorAll('main section[id]');

  if (!progressSections.length) return;

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        dataLayer.push({
          event: 'GAEventTrigger',
          eventCategory: '2026smiletaiwan_25',
          eventAction: '閱讀進度',
          eventLabel: entry.target.id,
        });
        console.log(entry.target.id);
        // 每個 section 只送出一次
        currentObserver.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.001,
      rootMargin: '0px',
    }
  );

  progressSections.forEach((section) => {
    observer.observe(section);
  });
}

/* ========================================
 * header / fixedbtn 相關設定
 * ======================================== */
const header = document.querySelector('header');
const fixedBtn = document.querySelector('.fixedbtn');
const gameSection = document.querySelector('#interactive-game');

let isTicking = false;

function updateFixedElementsState() {
  // 頁面滾動超過 1px 時，只有 header 加上 scrolled
  header?.classList.toggle('scrolled', window.scrollY > 1);

  if (!gameSection) return;

  const gameRect = gameSection.getBoundingClientRect();
  const viewportMiddle = window.innerHeight *0.67;

  // 遊戲區塊進入並涵蓋瀏覽器1/3時隱藏
  const shouldHide =
    gameRect.top <= viewportMiddle &&
    gameRect.bottom > viewportMiddle;

  header?.classList.toggle('hide', shouldHide);
  fixedBtn?.classList.toggle('hide', shouldHide);
}

function handleScroll() {
  if (isTicking) return;

  isTicking = true;

  requestAnimationFrame(() => {
    updateFixedElementsState();
    isTicking = false;
  });
}

window.addEventListener('scroll', handleScroll, {
  passive: true
});

window.addEventListener('resize', updateFixedElementsState);

// 頁面載入時先執行一次
updateFixedElementsState();

/* ========================================
 * NAV 相關設定
 * ======================================== */
const nav = document.querySelector('nav');

document.querySelector('.hamberger')?.addEventListener('click', () => {
  nav?.classList.toggle('show');
});

document.querySelector('nav .close')?.addEventListener('click', () => {
  nav?.classList.remove('show');
});

nav?.addEventListener('click', (event) => {
  const link = event.target.closest('a');

  if (!link) return;

  nav.classList.remove('show');
});

/* ========================================
 * kv scrolldown 設定
 * ======================================== */
function initScrollDown() {
  const scrollDownButton = document.querySelector('.scrolldown');
  const gameSection = document.querySelector('#interactive-game');

  if (!scrollDownButton || !gameSection) return;

  scrollDownButton.addEventListener('click', (event) => {
    event.preventDefault();

    gameSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
}

/* ========================================
 * Google Sheet 共用設定
 * ======================================== */

const SPREADSHEET_ID =
  '1Wti0IThT9RAUljbTm64qsQIpfJuFymKd321vfvaWbvU';

const SHEETS = {
  sponsors: '384166322',
  articles: '940466796',
  analysis: '0',
  gameRoutes: '563313715',

  // 可以繼續加入其他工作表
};


/* ========================================
 * 共用：取得 Google Sheet 資料
 * ======================================== */

/**
 * 取得指定工作表的資料
 *
 * @param {string} gid Google Sheet 工作表 gid
 * @returns {Promise<Object>} Google Visualization API 回傳的資料
 */
async function fetchSheetData(gid) {
  const sheetURL =
    `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}` +
    `/gviz/tq?tqx=out:json&headers=1&gid=${gid}`;

  const response = await fetch(sheetURL);

  if (!response.ok) {
    throw new Error(
      `Google Sheet 載入失敗，HTTP status：${response.status}`
    );
  }

  const text = await response.text();

  /*
   * Google 回傳格式：
   *
   * google.visualization.Query.setResponse({...});
   *
   * 因此需要先移除外層文字，才能 JSON.parse。
   */
  const jsonText = text
    .replace(/^.*?google\.visualization\.Query\.setResponse\(/s, '')
    .replace(/\);?\s*$/s, '');

  return JSON.parse(jsonText);
}


/**
 * 取得指定儲存格的值
 *
 * 優先使用格式化後的 f，
 * 沒有 f 時再使用原始值 v。
 *
 * @param {Object} row Google Sheet row
 * @param {number} index 欄位索引
 * @returns {string}
 */
function getSheetCellValue(row, index) {
  const cell = row.c?.[index];

  if (!cell) {
    return '';
  }

  return String(cell.f ?? cell.v ?? '').trim();
}

/* ========================================
 * 遊戲初始畫面姓名input 相關設定
 * ======================================== */
/* ========================================
 * 姓名輸入框
 * ======================================== */
function initNameInput() {
  const inputWrap = document.querySelector('.name-input-wrap');
  const input = inputWrap?.querySelector('#userName');
  const limitHint = document.querySelector('.name-limit-hint');

  if (!inputWrap || !input) return;

  const maxFullWidthLength = 7;
  let isComposing = false;
  let hintTimer = null;

  function getCharacterWidth(character) {
    return /^[\x00-\x7F]$/.test(character) ? 0.5 : 1;
  }

  function getValueWidth(value) {
    return Array.from(value).reduce((total, character) => {
      return total + getCharacterWidth(character);
    }, 0);
  }

  function getLimitedValue(value) {
    let result = '';
    let currentLength = 0;

    for (const character of Array.from(value)) {
      const characterWidth = getCharacterWidth(character);

      if (
        currentLength + characterWidth >
        maxFullWidthLength
      ) {
        break;
      }

      result += character;
      currentLength += characterWidth;
    }

    return result;
  }

  function updatePlaceholderState() {
    inputWrap.classList.toggle(
      'has-value',
      input.value.trim().length > 0
    );
  }

  function showLimitHint() {
    if (!limitHint) return;

    limitHint.classList.add('show');

    clearTimeout(hintTimer);

    hintTimer = window.setTimeout(() => {
      limitHint.classList.remove('show');
    }, 2000);
  }

  function hideLimitHint() {
    if (!limitHint) return;

    clearTimeout(hintTimer);
    limitHint.classList.remove('show');
  }

  function limitInputValue() {
    const originalValue = input.value;
    const originalWidth = getValueWidth(originalValue);
    const limitedValue = getLimitedValue(originalValue);

    if (originalWidth > maxFullWidthLength) {
      input.value = limitedValue;
      showLimitHint();
    } else {
      hideLimitHint();
    }

    updatePlaceholderState();
  }

  input.addEventListener('compositionstart', () => {
    isComposing = true;
  });

  input.addEventListener('compositionend', () => {
    isComposing = false;

    window.setTimeout(() => {
      limitInputValue();
    }, 0);
  });

  input.addEventListener('input', (event) => {
    if (isComposing || event.isComposing) {
      updatePlaceholderState();
      return;
    }

    limitInputValue();
  });

  input.addEventListener('focus', () => {
    inputWrap.classList.add('is-active');
  });

  input.addEventListener('blur', () => {
    inputWrap.classList.remove('is-active');
    hideLimitHint();

    if (!isComposing) {
      limitInputValue();
    } else {
      updatePlaceholderState();
    }
  });

  updatePlaceholderState();
}

/* ========================================
 * 遊戲測驗設定
 * ======================================== */

const GAME_TOTAL_QUESTIONS = 7;

/*
 * 部署完成後的 Google Apps Script Web App URL。
 * (曉亞的sheet的api url=https://script.google.com/macros/s/AKfycbzufOsveWoNJlKFYnO6dNqdSvimPNUNJ-lqnMRMEEX8tQW1peHpU2M9Q8VdEes_RAuw/exec)
 * (微笑的sheet的api url=https://script.google.com/macros/s/AKfycbxeCi5u_B-Y9M3pgN4nRSzW0TtG5otQxNLkF3ByscPOnkze3OIiB9ZydJE1yaM_d3Gw8Q/exec)
 */
const GAME_RECORD_API_URL = 'https://script.google.com/macros/s/AKfycbzufOsveWoNJlKFYnO6dNqdSvimPNUNJ-lqnMRMEEX8tQW1peHpU2M9Q8VdEes_RAuw/exec';

const gameState = {
  userName: '',
  currentQuestion: 1,
  answers: {},
  allRoutes: [],
  candidateRoutes: [],
  resultCardNumber: '',
  isChangingQuestion: false,
  isDownloading: false,

  // 圖片暫存
  resultImageBlob: null,
  resultImageFile: null,
};


/* ========================================
 * 遊戲區塊切換時滾到top
 * ======================================== */
function scrollToGameTop(behavior = 'smooth') {
  const gameSection = document.querySelector('#interactive-game');

  if (!gameSection) return;

  const gameTop =
    gameSection.getBoundingClientRect().top +
    window.scrollY;

  window.scrollTo({
    top: gameTop,
    behavior,
  });

  console.log("SCROLL new");
}

/* ========================================
 * 初始化遊戲
 * ======================================== */

async function initGameQuiz() {
  const gameSection = document.querySelector('#interactive-game');
  if (!gameSection) return;

  const gameIntro = gameSection.querySelector('.game-entro');
  const gameMain = gameSection.querySelector('.game-main');
  const gameResult = gameSection.querySelector('.game-result');

  const startButton = gameSection.querySelector('.game-start-btn');
  const answerBox = gameSection.querySelector('.answer-box');
  const retryButton = gameSection.querySelector('.game-retry');
  const downloadButton = gameSection.querySelector('.game-download');

  if (
    !gameIntro ||
    !gameMain ||
    !gameResult ||
    !startButton ||
    !answerBox ||
    !retryButton ||
    !downloadButton
  ) {
    console.warn('遊戲 HTML 結構不完整');
    return;
  }

  // 初始顯示狀態
  showGameScreen('intro');

  // Sheet 尚未讀取完成前禁止開始
  startButton.disabled = true;

  try {
    const data = await fetchSheetData(SHEETS.gameRoutes);
    const routes = convertGameSheetToObjects(data.table);

    gameState.allRoutes = routes.filter(isValidGameRoute);
    gameState.candidateRoutes = [...gameState.allRoutes];

    if (!gameState.allRoutes.length) {
      throw new Error('測驗 Sheet 中沒有可使用的路徑資料');
    }

    startButton.disabled = false;
  } catch (error) {
    console.error('測驗資料載入失敗：', error);

    startButton.disabled = true;
    startButton.textContent = '測驗資料載入失敗';
    return;
  }

  startButton.addEventListener('click', startGame);

  answerBox.addEventListener('click', (event) => {
    const answerButton = event.target.closest(
      '.answer-card[data-choice]'
    );

    if (!answerButton) return;

    handleGameAnswer(answerButton);
  });

  retryButton.addEventListener('click', retryGame);
  downloadButton.addEventListener('click', downloadGameResult);

  initGameButtonTracking();
}


/* ========================================
 * Sheet 轉換
 * ======================================== */

function convertGameSheetToObjects(table) {
  const columns = table?.cols ?? [];
  const rows = table?.rows ?? [];

  const labels = columns.map((column, index) => {
    return String(column.label || `column_${index}`).trim();
  });

  return rows.map((row) => {
    const item = {};

    labels.forEach((label, index) => {
      item[label] = getSheetCellValue(row, index);
    });

    return item;
  });
}


function isValidGameRoute(route) {
  const isHeaderRow =
    route['Q1題目'] === 'Q1題目' ||
    route['結果卡編號'] === '結果卡編號';

  return (
    !isHeaderRow &&
    route['Q1題目'] &&
    route['Q1_A選項'] &&
    route['Q1_B選項'] &&
    route['結果卡編號']
  );
}


/* ========================================
 * 畫面切換
 * ======================================== */

function showGameScreen(
  screenName,
  {
    shouldScroll = false,
    scrollBehavior = 'smooth',
  } = {}
) {
  const gameSection = document.querySelector('#interactive-game');

  if (!gameSection) return;

  const gameIntro = gameSection.querySelector('.game-entro');
  const gameMain = gameSection.querySelector('.game-main');
  const gameResult = gameSection.querySelector('.game-result');

  if (!gameIntro || !gameMain || !gameResult) return;

  gameIntro.hidden = screenName !== 'intro';
  gameMain.hidden = screenName !== 'main';
  gameResult.hidden = screenName !== 'result';

  /*
   * 等 hidden 狀態完成版面重排後再捲動，
   * 避免取得切換前的位置。
   */
  if (shouldScroll) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToGameTop(scrollBehavior);
      });
    });
  }

  refreshAOS();
}


/* ========================================
 * 開始遊戲
 * ======================================== */

function startGame() {
  const userNameInput = document.querySelector('#userName');

  /*
   * 姓名可留空。
   * trim() 會去掉前後空白。
   */
  gameState.userName = userNameInput?.value.trim() ?? '';

  resetGameProgress();
  showGameScreen('main', {
    shouldScroll: true,
    scrollBehavior: 'auto',
  });
  renderCurrentQuestion();
}


function resetGameProgress() {
  gameState.currentQuestion = 1;
  gameState.answers = {};
  gameState.candidateRoutes = [...gameState.allRoutes];
  gameState.resultCardNumber = '';
  gameState.isChangingQuestion = false;

  updateGameProgress(1);
}


/* ========================================
 * 顯示目前題目
 * ======================================== */

function renderCurrentQuestion() {
  const questionNumber = gameState.currentQuestion;
  const route = gameState.candidateRoutes[0];

  if (!route) {
    handleGameError('找不到符合目前答案的題目路徑');
    return;
  }

  const numberElement = document.querySelector(
    '#interactive-game .question-box .number'
  );

  const questionTextElement = document.querySelector(
    '#interactive-game .question-text'
  );

  const answerAButton = document.querySelector(
    '#interactive-game .answer-card[data-choice="A"]'
  );

  const answerBButton = document.querySelector(
    '#interactive-game .answer-card[data-choice="B"]'
  );

  const answerA = answerAButton?.querySelector('.answer');
  const answerB = answerBButton?.querySelector('.answer');

  if (
    !numberElement ||
    !questionTextElement ||
    !answerAButton ||
    !answerBButton ||
    !answerA ||
    !answerB
  ) {
    handleGameError('題目或選項 HTML 結構不完整');
    return;
  }

  numberElement.textContent = `Q${questionNumber}`;

  questionTextElement.textContent =
    route[`Q${questionNumber}題目`] || '';

  answerA.textContent =
    route[`Q${questionNumber}_A選項`] || '';

  answerA.dataset.type =
    route[`Q${questionNumber}_A面向`] || '';

  answerB.textContent =
    route[`Q${questionNumber}_B選項`] || '';

  answerB.dataset.type =
    route[`Q${questionNumber}_B面向`] || '';

  updateQuestionImage(questionNumber);
  updateGameProgress(questionNumber);

  updateAnswerTrackingAttributes(
    answerAButton,
    questionNumber,
    'A'
  );

  updateAnswerTrackingAttributes(
    answerBButton,
    questionNumber,
    'B'
  );

  answerAButton.disabled = false;
  answerBButton.disabled = false;
}


/* ========================================
 * 題目圖片
 * ======================================== */

function updateQuestionImage(questionNumber) {
  const image = document.querySelector(
    '#interactive-game .question-image'
  );

  if (!image) return;

  const imageNumber = String(questionNumber).padStart(2, '0');

  image.src =
    `assets/images/game-main_img${imageNumber}.png`;

  image.alt = `第 ${questionNumber} 題情境圖`;
}


/* ========================================
 * 回答題目
 * ======================================== */

function handleGameAnswer(answerButton) {
  if (gameState.isChangingQuestion) return;

  const choice = answerButton.dataset.choice;
  const questionNumber = gameState.currentQuestion;

  if (!['A', 'B'].includes(choice)) return;

  gameState.isChangingQuestion = true;

  disableAnswerButtons();

  gameState.answers[`Q${questionNumber}`] = choice;

  const choiceColumn = `Q${questionNumber}選擇`;

  gameState.candidateRoutes =
    gameState.candidateRoutes.filter((route) => {
      return normalizeGameChoice(route[choiceColumn]) === choice;
    });

  if (!gameState.candidateRoutes.length) {
    gameState.isChangingQuestion = false;
    handleGameError('這組回答沒有對應的測驗結果');
    return;
  }

  answerButton.classList.add('is-selected');

  /*
   * 若不需要選中動畫，可把 timeout 改成 0。
   */
  window.setTimeout(() => {
    answerButton.classList.remove('is-selected');

    if (questionNumber === GAME_TOTAL_QUESTIONS) {
      finishGame();
      return;
    }

    gameState.currentQuestion += 1;
    gameState.isChangingQuestion = false;

    renderCurrentQuestion();
  }, 300);
}


function normalizeGameChoice(value) {
  return String(value || '')
    .trim()
    .toUpperCase();
}


function disableAnswerButtons() {
  document
    .querySelectorAll('#interactive-game .answer-card')
    .forEach((button) => {
      button.disabled = true;
    });
}


/* ========================================
 * 進度條
 * ======================================== */

function updateGameProgress(questionNumber) {
  const progressItems = document.querySelectorAll(
    '#interactive-game .game-percent span'
  );

  if (!progressItems.length) return;

  progressItems.forEach((item, index) => {
    /*
     * Q1：第 1 格亮
     * Q2：前 2 格亮
     * ...
     * Q7：全部亮
     */
    item.classList.toggle(
      'is-active',
      index < questionNumber
    );
  });
}


/* ========================================
 * 完成測驗
 * ======================================== */
function finishGame() {
  const resultRoute = gameState.candidateRoutes[0];

  if (!resultRoute) {
    handleGameError('找不到測驗結果');
    return;
  }

  gameState.resultCardNumber =
    String(resultRoute['結果卡編號']).trim();

  renderGameResult();

  showGameScreen('result', {
    shouldScroll: true,
    scrollBehavior: 'auto',
  });

  prepareGameResultFile();

  saveGameRecord({
    submittedAt: new Date().toISOString(),
    userName: gameState.userName,
    resultCardNumber: gameState.resultCardNumber,
    answerPath: getGameAnswerPath(),
  });

  gameState.isChangingQuestion = false;
}


/* ========================================
 * 顯示結果
 * ======================================== */

function renderGameResult() {
  const resultName = document.querySelector(
    '#interactive-game .game-result .name'
  );

  const resultImage = document.querySelector(
    '#interactive-game .game-result .card-box img'
  );

  const retryButton = document.querySelector(
    '#interactive-game .game-retry'
  );

  const downloadButton = document.querySelector(
    '#interactive-game .game-download'
  );

  if (!resultImage) return;

  /* 因實際檔案是 game-result_01.png，所以補0 */
  const fileNumber =
  gameState.resultCardNumber.padStart(2, '0');

  resultImage.src =
    `assets/images/game-result/game-result_${fileNumber}.png`;

  resultImage.alt =
    `村長測驗結果 ${gameState.resultCardNumber}`;

  if (resultName) {
    resultName.textContent = gameState.userName;
  }

  updateResultTrackingAttributes(
    retryButton,
    downloadButton,
    gameState.resultCardNumber
  );
}


/* ========================================
 * 再玩一次
 * ======================================== */
function retryGame() {
  resetGameProgress();

  const userNameInput = document.querySelector('#userName');
  const nameWrap = document.querySelector('.name-input-wrap');

  if (userNameInput) {
    userNameInput.value = '';
  }

  nameWrap?.classList.remove('is-active', 'has-value');

  gameState.userName = '';

  showGameScreen('intro', {
    shouldScroll: true,
    scrollBehavior: 'auto',
  });
}

/* ========================================
 * 產生含姓名的 Canvas
 * ======================================== */
async function createGameResultCanvas() {
  const resultImage = document.querySelector(
    '#interactive-game .game-result .card-box img'
  );

  if (!resultImage) {
    throw new Error('找不到結果底圖');
  }

  await waitForImage(resultImage);

  if (document.fonts?.load) {
    await document.fonts.load(
      '400 32px "Noto Sans TC"'
    );
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('無法建立 Canvas context');
  }

  canvas.width = resultImage.naturalWidth;
  canvas.height = resultImage.naturalHeight;

  context.drawImage(
    resultImage,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const userName = gameState.userName || '';

  await document.fonts.load('400 32px "Noto Sans TC"');
  await document.fonts.ready;

  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.fillStyle = 'white';
  context.font = '400 32px "Noto Sans TC", sans-serif';

  context.fillText(
    userName,
    canvas.width * 0.04,
    canvas.height * 0.03
  );

  return canvas;
}

/* ========================================
 * Canvas 轉 Blob
 * ======================================== */
function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('圖片轉換失敗'));
        }
      },
      'image/png',
      1
    );
  });
}
/* ========================================
 * 進入結果頁時先準備圖片檔
 * ======================================== */
async function prepareGameResultFile() {
  const downloadButton = document.querySelector(
    '#interactive-game .game-download'
  );

  gameState.resultImageBlob = null;
  gameState.resultImageFile = null;

  if (downloadButton) {
    downloadButton.disabled = true;
  }

  try {
    const canvas = await createGameResultCanvas();
    const blob = await canvasToBlob(canvas);

    const fileNumber = String(
      gameState.resultCardNumber
    ).padStart(2, '0');

    const fileName =
      `village-chief-result-${fileNumber}.png`;

    const file = new File(
      [blob],
      fileName,
      {
        type: 'image/png',
      }
    );

    gameState.resultImageBlob = blob;
    gameState.resultImageFile = file;
  } catch (error) {
    console.error('結果圖片準備失敗：', error);
  } finally {
    if (downloadButton) {
      downloadButton.disabled = false;
    }
  }
}

/* ========================================
 * 一般下載共用函式
 * ======================================== */
function downloadBlob(blob, fileName) {
  const objectURL = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectURL;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectURL);
  }, 1000);
}


// 裝置判斷函式
function shouldUseNativeShare(file) {
  const isMobileOrTablet =
    window.matchMedia('(pointer: coarse)').matches &&
    window.matchMedia('(hover: none)').matches;

  return (
    isMobileOrTablet &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({
      files: [file],
    })
  );
}
/* ========================================
 * 下載結果圖
 * ======================================== */
async function downloadGameResult() {
  if (gameState.isDownloading) return;

  const downloadButton = document.querySelector(
    '#interactive-game .game-download'
  );

  gameState.isDownloading = true;

  if (downloadButton) {
    downloadButton.disabled = true;
  }

  try {
    if (
      !gameState.resultImageBlob ||
      !gameState.resultImageFile
    ) {
      const canvas = await createGameResultCanvas();
      const blob = await canvasToBlob(canvas);

      const fileNumber = String(
        gameState.resultCardNumber
      ).padStart(2, '0');

      const fileName =
        `village-chief-result-${fileNumber}.png`;

      gameState.resultImageBlob = blob;
      gameState.resultImageFile = new File(
        [blob],
        fileName,
        {
          type: 'image/png',
        }
      );
    }

    const file = gameState.resultImageFile;

    if (shouldUseNativeShare(file)) {
      await navigator.share({
        files: [file],
      });

      return;
    }

    // Mac、Windows 等桌機環境皆走一般下載
    downloadBlob(
      gameState.resultImageBlob,
      file.name
    );
  } catch (error) {
    if (error?.name !== 'AbortError') {
      console.error('結果圖片儲存失敗：', error);

      if (
        gameState.resultImageBlob &&
        gameState.resultImageFile
      ) {
        downloadBlob(
          gameState.resultImageBlob,
          gameState.resultImageFile.name
        );
      }
    }
  } finally {
    gameState.isDownloading = false;

    if (downloadButton) {
      downloadButton.disabled = false;
    }
  }
}

function waitForImage(image) {
  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    image.addEventListener('load', resolve, {
      once: true,
    });

    image.addEventListener(
      'error',
      () => {
        reject(new Error('結果圖載入失敗'));
      },
      {
        once: true,
      }
    );
  });
}


function waitForCardImage(cardBox) {
  const image = cardBox.querySelector('img');

  if (!image) {
    return Promise.resolve();
  }

  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    image.addEventListener('load', resolve, {
      once: true,
    });

    image.addEventListener(
      'error',
      () => reject(new Error('結果底圖載入失敗')),
      {
        once: true,
      }
    );
  });
}


/* ========================================
 * 寫入結果紀錄
 * ======================================== */

async function saveGameRecord(record) {
  if (!GAME_RECORD_API_URL) {
    console.warn(
      '尚未設定 GAME_RECORD_API_URL，測驗紀錄未寫入 Sheet',
      record
    );
    return;
  }

  try {
    /*
     * no-cors 適合 Apps Script Web App 的單純寫入。
     * 前端無法讀取實際回傳內容，但不會阻擋遊戲流程。
     */
    await fetch(GAME_RECORD_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(record),
      keepalive: true,
    });
  } catch (error) {
    console.error('測驗紀錄寫入失敗：', error);
  }
}


function getGameAnswerPath() {
  return Array.from(
    {
      length: GAME_TOTAL_QUESTIONS,
    },
    (_, index) => {
      return gameState.answers[`Q${index + 1}`] || '';
    }
  ).join('');
}


/* ========================================
 * 所有遊戲按鈕的追蹤參數
 * ======================================== */

function updateAnswerTrackingAttributes(
  button,
  questionNumber,
  choice
) {
  const answerText =
    button.querySelector('.answer')?.textContent.trim() || '';

  button.setAttribute(
    'gtm-name',
    `第${questionNumber}題回答`
  );

  button.setAttribute(
    'eventaction',
    `bn${questionNumber}-link`
  );

  /*
   * 加入題號、A/B 與實際回答文字，
   * 比單純「回答bn1」更容易分析。
   */
  button.setAttribute(
    'eventlabel',
    `Q${questionNumber}-${choice}-${answerText}`
  );
}


function updateResultTrackingAttributes(
  retryButton,
  downloadButton,
  resultCardNumber
) {
  if (retryButton) {
    retryButton.setAttribute(
      'eventlabel',
      `再玩一次-${resultCardNumber}`
    );
  }

  if (downloadButton) {
    downloadButton.setAttribute(
      'eventlabel',
      `下載結果-${resultCardNumber}`
    );
  }
}


/*
 * 監聽所有遊戲內帶有 .game-link-click 的 button。
 */
function initGameButtonTracking() {
  const gameSection = document.querySelector('#interactive-game');

  if (!gameSection) return;

  gameSection.addEventListener('click', (event) => {
    const button = event.target.closest(
      'button.game-link-click'
    );

    if (!button) return;

    const trackingData = {
      event: 'GAEventTrigger',
      eventCategory: '2026smiletaiwan_25',
      eventAction:
        button.getAttribute('eventaction') || '',
      eventLabel:
        button.getAttribute('eventlabel') || '',
      gtmName:
        button.getAttribute('gtm-name') || '',
      gameQuestion:
        button.classList.contains('answer-card')
          ? gameState.currentQuestion
          : undefined,
      gameChoice:
        button.dataset.choice || undefined,
      gameResultCard:
        gameState.resultCardNumber || undefined,
    };

    console.log('遊戲按鈕點擊事件：', trackingData);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(trackingData);
  });
}


/* ========================================
 * 錯誤處理
 * ======================================== */

function handleGameError(message) {
  console.error(message);

  const gameMain = document.querySelector(
    '#interactive-game .game-main .wrap-container'
  );

  if (!gameMain) return;

  let errorElement = gameMain.querySelector('.game-error');

  if (!errorElement) {
    errorElement = document.createElement('p');
    errorElement.className = 'game-error';
    gameMain.appendChild(errorElement);
  }

  errorElement.textContent = message;
}

/* ========================================
 * 數據地圖 MAP 相關設定
 * ======================================== */
function initDataStory() {
  const story = document.querySelector('.map');

  if (!story) return;

  const items = story.querySelectorAll('.data-item[data-index]');
  const images = story.querySelectorAll('.data-image[data-image]');

  if (!items.length || !images.length) return;

  function setActiveItem(index) {
    items.forEach((item) => {
      item.classList.toggle(
        'is-active',
        item.dataset.index === index
      );
    });

    images.forEach((image) => {
      image.classList.toggle(
        'is-active',
        image.dataset.image === index
      );
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          return b.intersectionRatio - a.intersectionRatio;
        });

      if (!visibleEntries.length) return;

      const activeItem = visibleEntries[0].target;
      const index = activeItem.dataset.index;

      setActiveItem(index);
    },
    {
      root: null,

      /*
       * 只把瀏覽器中間區域當成判斷範圍。
       * 當文字進入畫面中央附近時切換圖片。
       */
      rootMargin: '-45% 0px -45% 0px',

      threshold: [0, 0.1, 0.25, 0.5],
    }
  );

  items.forEach((item) => {
    observer.observe(item);
  });

  setActiveItem(items[0].dataset.index);
}


/* ========================================
 * Analysis 資料取得
 * ======================================== */

async function loadAnalysis() {
  const analysisList = document.querySelector('.analysis-list');

  if (!analysisList) {
    console.warn('找不到 .analysis-list');
    return;
  }

  setAnalysisLoading(analysisList);

  try {
    const data = await fetchSheetData(SHEETS.analysis);
    const sheetRows = data.table?.rows ?? [];

    /*
     * Sheet 欄位順序：
     *
     * A：color
     * B：tag
     * C：imgURL
     * D：alt
     * E：name
     * F：title
     * G：content
     * H：site
     * I：url
     */
    const analysisItems = sheetRows
      .map((row) => ({
        color: getSheetCellValue(row, 0),
        tag: getSheetCellValue(row, 1),
        imgURL: getSheetCellValue(row, 2),
        alt: getSheetCellValue(row, 3),
        name: getSheetCellValue(row, 4),
        title: getSheetCellValue(row, 5),
        content: getSheetCellValue(row, 6),
        site: getSheetCellValue(row, 7),
        url: getSheetCellValue(row, 8),
      }))
      .filter((item) => {
        const isHeaderRow =
          item.color.toLowerCase() === 'color' &&
          item.tag.toLowerCase() === 'tag' &&
          item.imgURL.toLowerCase() === 'imgurl';

        return (
          item.tag &&
          item.imgURL &&
          item.name &&
          !isHeaderRow
        );
      });

    renderAnalysis(analysisItems, analysisList);

    if (analysisItems.length) {
      initAnalysisSlider(analysisList);
    }
  } catch (error) {
    console.error('Analysis 資料載入失敗：', error);
    renderAnalysisError(analysisList);
  }
}


/* ========================================
 * Analysis 畫面生成
 * ======================================== */

function renderAnalysis(items, analysisList) {
  /*
   * 若已初始化 Slick，先解除後再重建內容。
   */
  if (
    window.jQuery &&
    jQuery.fn.slick &&
    jQuery(analysisList).hasClass('slick-initialized')
  ) {
    jQuery(analysisList).slick('unslick');
  }

  analysisList.replaceChildren();

  if (!items.length) {
    renderAnalysisEmpty(analysisList);
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    fragment.appendChild(createAnalysisCard(item));
  });

  analysisList.appendChild(fragment);
}


/**
 * 生成單張 Analysis 卡片
 *
 * @param {Object} item
 * @returns {HTMLDivElement}
 */
function createAnalysisCard(item) {
  const card = document.createElement('div');
  card.className = 'analysis-card';

  if (isValidHexColor(item.color)) {
    card.style.setProperty('--card-color', item.color);
  }

  const tag = document.createElement('div');
  tag.className = 'tag';
  tag.textContent = `${item.tag}`;

  const imageWrap = document.createElement('div');
  imageWrap.className = 'img';

  const image = document.createElement('img');
  image.src = item.imgURL;
  image.alt = item.alt || item.name || '';
  image.loading = 'lazy';
  image.decoding = 'async';

  image.addEventListener('error', () => {
    card.classList.add('is-image-error');
  });

  imageWrap.appendChild(image);

  const contentWrap = document.createElement('div');
  contentWrap.className = 'content-wrap';

  // const name = createTextElement('p', 'name', item.name);
  const name = document.createElement('p');
  name.className = 'name';
  name.textContent = `${item.site}｜${item.name}`;
  const title = createTextElement('p', 'title', item.title);
  const content = createTextElement('p', 'content', item.content);
  // const site = createTextElement('p', 'site', item.site);

  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  arrow.setAttribute('aria-hidden', 'true');

  contentWrap.append(
    name,
    title,
    content,
    arrow
  );

  card.append(
    tag,
    imageWrap,
    contentWrap
  );

  if (item.url) {
    const link = document.createElement('a');

    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    link.setAttribute(
      'aria-label',
      `${item.name}${item.title ? `：${item.title}` : ''}`
    );

    card.appendChild(link);
  } else {
    card.classList.add('has-no-link');
  }

  return card;
}


/**
 * 建立含 class 的文字元素。
 */
function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);

  element.className = className;
  element.textContent = text || '';

  return element;
}


/**
 * 檢查是否為合法 HEX 色碼。
 */
function isValidHexColor(color) {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color);
}


/* ========================================
 * Analysis Slick 初始化
 * ======================================== */

function initAnalysisSlider(analysisList) {
  if (!window.jQuery || !jQuery.fn.slick) {
    console.error('Slick 尚未載入，無法初始化 .analysis-list');
    return;
  }

  const $analysisList = jQuery(analysisList);

  if ($analysisList.hasClass('slick-initialized')) {
    return;
  }

  const cardCount =
    analysisList.querySelectorAll('.analysis-card').length;

  // 必須在 slick() 初始化前綁定
  $analysisList.one('init', () => {
    refreshAOS();
  });

  $analysisList.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: true,

    /*
     * 卡片數量不足 slidesToShow 時，
     * 不建議啟用 infinite，避免 Slick 複製卡片後排版異常。
     */
    infinite: cardCount > 4,

    speed: 500,
    autoplay: false,
    adaptiveHeight: false,

    responsive: [
      {
        breakpoint: 1730,
        settings: {
          slidesToShow: 3,
          infinite: cardCount > 3,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          infinite: cardCount > 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          infinite: cardCount > 1,
        },
      },
    ],
  });
}


/* ========================================
 * Analysis 狀態畫面
 * ======================================== */

function setAnalysisLoading(analysisList) {
  const message = document.createElement('p');

  message.className = 'analysis-loading';
  message.textContent = '資料載入中⋯⋯';

  analysisList.replaceChildren(message);
}


function renderAnalysisError(analysisList) {
  const message = document.createElement('p');

  message.className = 'analysis-error';
  message.textContent = '深度解析資料目前無法載入';

  analysisList.replaceChildren(message);
}


function renderAnalysisEmpty(analysisList) {
  const message = document.createElement('p');

  message.className = 'analysis-empty';
  message.textContent = '目前沒有深度解析資料';

  analysisList.replaceChildren(message);
}


/* ========================================
 * Article 資料取得
 * ======================================== */

async function loadArticles() {
  const articleList = document.querySelector('.article-list');

  if (!articleList) {
    console.warn('找不到 .article-list');
    return;
  }

  setArticleLoading(articleList);

  try {
    const data = await fetchSheetData(SHEETS.articles);
    const sheetRows = data.table?.rows ?? [];

    /*
     * Sheet 欄位順序：
     * A：imgURL
     * B：alt
     * C：title
     * D：url
     */
    const articles = sheetRows
      .map((row) => ({
        imgURL: getSheetCellValue(row, 0),
        alt: getSheetCellValue(row, 1),
        title: getSheetCellValue(row, 2),
        url: getSheetCellValue(row, 3),
      }))
      .filter((item) => {
        const isHeaderRow =
          item.imgURL.toLowerCase() === 'imgurl' &&
          item.title.toLowerCase() === 'title';

        return (
          item.imgURL &&
          item.title &&
          item.url &&
          !isHeaderRow
        );
      });

    renderArticles(articles, articleList);
    initArticleSlider(articleList);
  } catch (error) {
    console.error('Article 資料載入失敗：', error);
    renderArticleError(articleList);
  }
}


/* ========================================
 * Article 畫面生成
 * ======================================== */

function renderArticles(articles, articleList) {
  /*
   * 如果 Slick 已初始化，先解除。
   * 避免重新 render 時殘留 slick 結構。
   */
  if (
    window.jQuery &&
    jQuery.fn.slick &&
    jQuery(articleList).hasClass('slick-initialized')
  ) {
    jQuery(articleList).slick('unslick');
  }

  articleList.replaceChildren();

  if (!articles.length) {
    renderArticleEmpty(articleList);
    return;
  }

  const fragment = document.createDocumentFragment();

  articles.forEach((article) => {
    fragment.appendChild(createArticleCard(article));
  });

  articleList.appendChild(fragment);
}


function createArticleCard(article) {
  const card = document.createElement('div');
  card.className = 'article-card';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'img';

  const imageLink = createArticleLink(article.url);
  const image = document.createElement('img');

  image.src = article.imgURL;
  image.alt = article.alt || article.title;
  image.loading = 'lazy';
  image.decoding = 'async';

  image.addEventListener('error', () => {
    card.classList.add('is-image-error');
  });

  imageLink.appendChild(image);
  imageWrap.appendChild(imageLink);

  const title = document.createElement('p');
  const titleLink = createArticleLink(article.url);

  titleLink.textContent = article.title;
  title.appendChild(titleLink);

  card.append(imageWrap, title);

  return card;
}


function createArticleLink(url) {
  const link = document.createElement('a');

  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  return link;
}


/* ========================================
 * Slick 初始化
 * ======================================== */

function initArticleSlider(articleList) {
  if (!window.jQuery || !jQuery.fn.slick) {
    console.error('Slick 尚未載入');
    return;
  }

  const $articleList = jQuery(articleList);

  if ($articleList.hasClass('slick-initialized')) {
    return;
  }

  // 必須在 slick() 初始化前綁定
  $articleList.one('init', () => {
    refreshAOS();
  });

  $articleList.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: false,
    adaptiveHeight: false,

    responsive: [
      {
        breakpoint: 1051,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
}


/* ========================================
 * Article 狀態畫面
 * ======================================== */

function setArticleLoading(articleList) {
  const message = document.createElement('p');

  message.className = 'article-loading';
  message.textContent = '資料載入中⋯⋯';

  articleList.replaceChildren(message);
}


function renderArticleError(articleList) {
  const message = document.createElement('p');

  message.className = 'article-error';
  message.textContent = '報導資料目前無法載入';

  articleList.replaceChildren(message);
}


function renderArticleEmpty(articleList) {
  const message = document.createElement('p');

  message.className = 'article-empty';
  message.textContent = '目前沒有報導資料';

  articleList.replaceChildren(message);
}

/* ========================================
 * 贊助企業 Sponsor 資料取得
 * ======================================== */

/**
 * 取得 Sponsor 工作表資料並生成畫面
 */
async function loadSponsors() {
  const container = document.querySelector('#sponsors .container');

  if (!container) {
    console.warn('找不到 #sponsors .container');
    return;
  }

  setSponsorLoading(container);

  try {
    const data = await fetchSheetData(SHEETS.sponsors);

    const sheetRows = data.table?.rows ?? [];

    /*
     * Sponsor Sheet 欄位順序：
     *
     * A：type
     * B：imgURL
     * C：alt
     * D：url
     */
    const sponsors = sheetRows
      .map((row) => {
        return {
          type: getSheetCellValue(row, 0),
          imgURL: getSheetCellValue(row, 1),
          alt: getSheetCellValue(row, 2),
          url: getSheetCellValue(row, 3),
        };
      })
      .filter((item) => {
        /*
         * type 和 imgURL 是生成 Sponsor 的必要資料。
         * 缺少其中一項就不生成該筆。
         */
        const isHeaderRow =
          item.type.toLowerCase() === 'type' &&
          item.imgURL.toLowerCase() === 'imgurl';
        return item.type && item.imgURL && !isHeaderRow;
      });

    renderSponsors(sponsors, container);
  } catch (error) {
    console.error('Sponsor 資料載入失敗：', error);
    renderSponsorError(container);
  }
}


/* ========================================
 * 贊助企業 Sponsor 畫面生成
 * ======================================== */

/**
 * 生成 Sponsor 區塊
 *
 * @param {Array} sponsors Sponsor 資料
 * @param {HTMLElement} container Sponsor 容器
 */
function renderSponsors(sponsors, container) {
  container.replaceChildren();

  if (!sponsors.length) {
    renderSponsorEmpty(container);
    return;
  }

  /*
   * 依 type 分組。
   *
   * Map 會依照資料第一次出現的順序排列，
   * 所以 Sheet 裡的 type 順序也會反映在畫面上。
   */
  const sponsorGroups = new Map();

  sponsors.forEach((sponsor) => {
    if (!sponsorGroups.has(sponsor.type)) {
      sponsorGroups.set(sponsor.type, []);
    }

    sponsorGroups.get(sponsor.type).push(sponsor);
  });

  /*
   * 使用 DocumentFragment，
   * 全部生成完成後再一次放入 DOM。
   */
  const fragment = document.createDocumentFragment();

  sponsorGroups.forEach((groupItems, type) => {
    const sponsorSection = createSponsorGroup(type, groupItems);
    fragment.appendChild(sponsorSection);
  });

  container.appendChild(fragment);

  refreshAOS();
}


/**
 * 生成單一 Sponsor 分組
 *
 * @param {string} type 分組名稱
 * @param {Array} items 分組內 Sponsor
 * @returns {HTMLElement}
 */
function createSponsorGroup(type, items) {
  const sponsorList = document.createElement('div');
  sponsorList.classList.add('sponsor-list');

  /*
   * 保留你原本「主辦單位」使用的 host class。
   */
  if (type === '主辦單位') {
    sponsorList.classList.add('host');
  }

  const title = document.createElement('h2');
  title.textContent = type;

  const list = document.createElement('ul');
  list.classList.add('flex', 'wrap');

  items.forEach((item) => {
    const listItem = createSponsorItem(item);
    list.appendChild(listItem);
  });

  sponsorList.append(title, list);

  return sponsorList;
}


/**
 * 生成單一 Sponsor 項目
 *
 * @param {Object} sponsor Sponsor 資料
 * @returns {HTMLLIElement}
 */
function createSponsorItem(sponsor) {
  const listItem = document.createElement('li');
  const image = document.createElement('img');

  image.src = sponsor.imgURL;
  image.alt = sponsor.alt || '';
  image.loading = 'lazy';
  image.decoding = 'async';

  /*
   * 圖片讀取失敗時加上 class，
   * 可依需求用 CSS 隱藏或顯示替代樣式。
   */
  image.addEventListener('error', () => {
    listItem.classList.add('is-image-error');
  });

  /*
   * 有網址時才生成 a。
   * 沒有網址時直接顯示圖片，避免產生 href="#"。
   */
  if (sponsor.url) {
    const link = document.createElement('a');

    link.href = sponsor.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.title = sponsor.alt || '';

    link.appendChild(image);
    listItem.appendChild(link);
  } else {
    listItem.appendChild(image);
  }

  return listItem;
}


/* ========================================
 * 贊助企業 Sponsor 狀態畫面
 * ======================================== */

function setSponsorLoading(container) {
  const loading = document.createElement('p');

  loading.className = 'sponsor-loading';
  loading.textContent = '資料載入中⋯⋯';

  container.replaceChildren(loading);
}


function renderSponsorError(container) {
  const errorMessage = document.createElement('p');

  errorMessage.className = 'sponsor-error';
  errorMessage.textContent = '合作單位資料目前無法載入';

  container.replaceChildren(errorMessage);

  refreshAOS();
}


function renderSponsorEmpty(container) {
  const emptyMessage = document.createElement('p');

  emptyMessage.className = 'sponsor-empty';
  emptyMessage.textContent = '目前沒有合作單位資料';

  container.replaceChildren(emptyMessage);
}


/* ========================================
 * 頁面初始化
 * ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // datalayer.push閱讀進度
  initReadingProgressTracking();

  // ui
  initScrollDown();
  initNameInput();
  initDataStory();

  // GAME
  initGameQuiz();


  // 讀取sheet工作表
  loadSponsors();
  loadArticles();
  loadAnalysis();
});