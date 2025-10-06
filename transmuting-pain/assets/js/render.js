// 通用 JSON 載入與渲染函式
async function loadAndRender(jsonPath, container, renderFn) {
  try {
    const res = await fetch(jsonPath, { cache: 'no-store' });
    if (!res.ok) throw new Error('載入失敗: ' + res.status + ' ' + res.statusText);

    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('JSON 格式錯誤，應為陣列');

    container.innerHTML = ''; // 清空舊內容
    data.forEach(item => container.appendChild(renderFn(item)));

  } catch (err) {
    container.innerHTML = `<p class="error">發生錯誤：${err.message}</p>`;
    console.error(err);
  }
}

// === JSON渲染 ===
// 生成購買通路清單 <li><a>...</a></li>
function renderListItem(item) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = item.url || '#';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = item.title || '—';
  li.appendChild(a);
  return li;
}

// === 初始化 ===
loadAndRender('assets/js/buyData.json', document.getElementById('buylist'), renderListItem);

// === 線上藝廊 及其 Lightbox 功能 ===
let allData = [];       // 全部 artworkData.json 的資料
let currentChapter = []; // 當前章節的資料
let currentIndex = 0;    // 當前 index

// DOM 元素
const chapterList = document.querySelector("#chapterlist");
const lightbox = document.querySelector("#lightbox");
const imgEl = lightbox.querySelector(".img img");
const chapterSpan = lightbox.querySelector(".chapter span:first-child");
const chapterTitleSpan = lightbox.querySelector(".chapter span:last-child");
const titleEl = lightbox.querySelector("h2");
const contentEl = lightbox.querySelector(".content");
const closeBtn = lightbox.querySelector(".close");
const arrowPrev = lightbox.querySelector(".arrow-prev");
const arrowNext = lightbox.querySelector(".arrow-next");
const loadingEl = lightbox.querySelector(".loading");

// 載入 artworkData.jso
fetch("assets/js/artworkData.json")
  .then(res => res.json())
  .then(data => {
    allData = data;
    renderChapters();
  });

// 依 chapter_id 分組，產生卡片
function renderChapters() {
  const chapters = {};
  allData.forEach(item => {
    if (!chapters[item.chapter_id]) {
      chapters[item.chapter_id] = item.chapter_title;
    }
  });

  chapterList.innerHTML = Object.entries(chapters).map(([id, title]) => `
    <div class="card" data-num="${id}">
      <div class="img"><img src="assets/images/chapter/img${id}.png" loading="lazy"></div>
      <div class="text">
        <span>Chapter ${id}</span>
        ${title}
      </div>
    </div>
  `).join("");
}

// 點擊卡片 → 顯示 Lightbox
chapterList.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;

  const chapterId = parseInt(card.dataset.num);

  // 篩選出同章節的所有資料
  currentChapter = allData.filter(item => item.chapter_id === chapterId);
  currentIndex = 0;

  showLightbox();
});

const container = lightbox.querySelector(".container");

// 更新 Lightbox 顯示內容。改成可接受參數，等圖片 onload 後再顯示
function updateContent(onReady) {
  const item = currentChapter[currentIndex];
  console.log("🔄 updateContent() 開始載入圖片", item.img);

  const tempImg = new Image();
  tempImg.onload = () => {
    console.log("✅ 圖片載入完成", tempImg.src);

    imgEl.src = tempImg.src;
    imgEl.alt = item.title;

    chapterSpan.textContent = `Chapter ${item.chapter_id}`;
    chapterTitleSpan.textContent = item.chapter_title;
    titleEl.textContent = item.title;
    contentEl.innerHTML = item.text.replace(/\n/g, "<br>");

    arrowPrev.style.display = currentIndex > 0 ? "block" : "none";
    arrowNext.style.display = currentIndex < currentChapter.length - 1 ? "block" : "none";

    console.log("✨ updateContent() 已更新 DOM");

    if (typeof onReady === "function") {
      loadingEl.style.display = "none"; // ❌ 停止顯示
      onReady(); // ✅ 確保只有在有傳入 callback 時才執行
    }
  };

  tempImg.src = `assets/images/artwork/img${item.img}.jpg`;

  if (tempImg.complete) {
    console.log("⚡ tempImg.complete == true，直接觸發 onload");
    tempImg.onload();
  }
}

function showLightbox() {
  container.classList.add("fade-out"); // 先透明
  lightbox.classList.add("show");

  updateContent(() => {
    requestAnimationFrame(() => {
      container.classList.remove("fade-out"); // ✅ 淡入
    });
  });
}

function switchContent(newIndex) {
  if (newIndex < 0 || newIndex >= currentChapter.length) return;

  container.classList.add("fade-out");

  function doSwitch() {
    loadingEl.style.display = "block"; // ✅ 顯示 Loading
    console.log("🟡 Loading should be visible now");
    container.removeEventListener("transitionend", doSwitch);

    currentIndex = newIndex;

    updateContent(() => {
      requestAnimationFrame(() => {
        container.classList.remove("fade-out");
      });
    });
  }

  container.addEventListener("transitionend", doSwitch);

  // ✅ 萬一 transition 沒觸發（例如快速連點 或 無法 transition），保底 400ms
  setTimeout(() => {
    if (container.classList.contains("fade-out")) doSwitch();
  }, 400);
}

// 箭頭事件
arrowPrev.addEventListener("click", () => switchContent(currentIndex - 1));
arrowNext.addEventListener("click", () => switchContent(currentIndex + 1));

// 關閉 Lightbox
closeBtn.addEventListener("click", () => {
  lightbox.classList.remove("show");
});
