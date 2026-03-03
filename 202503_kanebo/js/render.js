// 總分區
export function renderRatingScore(data) {
  const root = document.querySelector("[data-rating]");
  const badgesWrap = document.querySelector("[data-rating-badges]");
  if (!root || !badgesWrap) return;

  const items = data?.score;
  if (!Array.isArray(items) || items.length === 0) {
    root.hidden = true;
    badgesWrap.innerHTML = "";
    return;
  }

  root.hidden = false;
  badgesWrap.innerHTML = "";

  const posClassMap = ["pos-top", "pos-left", "pos-right", "pos-bl", "pos-br"];

  items.slice(0, 5).forEach((item, i) => {
    const text = String(item?.text ?? "").trim();
    const pointNum = Number(item?.point);

    if (!text) return;

    const safePoint = Number.isFinite(pointNum)
      ? Math.max(0, Math.min(100, Math.round(pointNum)))
      : 0;

    const el = document.createElement("div");
    el.setAttribute("data-aos", "zoom-in");
    el.setAttribute("data-aos-duration", "600");
    el.setAttribute("data-aos-delay", String(i * 150)); // 依序出場
    el.setAttribute("data-aos-once", "true");
    el.className = `rating-badge ${posClassMap[i] ?? ""} ${i === 2 ? "is-overlay" : ""}`;

    el.innerHTML = `
      <div>
        <div class="badge-text">${escapeHtml(text)}</div>
        <div class="badge-score">
          <span data-score-num data-target="${safePoint}">0</span><small>%</small>
        </div>
      </div>
    `;

    badgesWrap.appendChild(el);
  });
  // animation for number
  function animateNumber(el, to, duration = 900) {
    const from = 0;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (to - from) * eased);
      el.textContent = String(value);

      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function setupScoreCountUpOnce(root) {
    if (!root) return;

    let hasRun = false;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasRun) return;

        hasRun = true;

        // 找到所有分數元素（你下面 render 時要加 data-score-num）
        const nums = root.querySelectorAll("[data-score-num]");
        nums.forEach((numEl) => {
          const target = Number(numEl.getAttribute("data-target"));
          if (!Number.isFinite(target)) return;

          animateNumber(numEl, target, 900);
        });

        io.disconnect();
      },
      { threshold: 0.35 } // 進入 35% 才開始跑，可調
    );

    io.observe(root);
  }

  // AOS 需要 refresh 才會吃到「動態新增」的元素
  if (window.AOS && typeof window.AOS.refreshHard === "function") {
    window.AOS.refreshHard();
  } else if (window.AOS && typeof window.AOS.refresh === "function") {
    window.AOS.refresh();
  }

  // 分數進場才開始跑（只跑一次）
  setupScoreCountUpOnce(root);


}

// 回饋區
export function renderReviews(data) {
  const root = document.querySelector("[data-reviews]");
  const list = document.querySelector("[data-reviews-list]");
  if (!root || !list) return;

  const items = data?.reviews;
  if (!Array.isArray(items) || items.length === 0) {
    root.hidden = true;
    return;
  }

  root.hidden = false;
  list.innerHTML = "";

  const frag = document.createDocumentFragment();

  items.slice(0, 5).forEach((item, i) => {
    const name = escapeHtml(item?.name ?? "");
    const text = escapeHtml(item?.text ?? "");
    const photo = item?.photo ?? "";

    const el = document.createElement("div");
    el.className = "reviews-item";

    // AOS
    el.setAttribute("data-aos", "fade-up");
    el.setAttribute("data-aos-delay", String(i * 120));
    el.setAttribute("data-aos-once", "true");

    el.innerHTML = `
      <div class="reviews-avatar">
        <img src="${photo}" alt="${name}">
      </div>
      <div class="reviews-content">
        <div class="reviews-name">${name}</div>
        <p class="reviews-text">${text}</p>
      </div>
    `;

    frag.appendChild(el);
  });

  list.appendChild(frag);

  // AOS refresh（動態生成必須）
  if (window.AOS?.refreshHard) {
    window.AOS.refreshHard();
  } else if (window.AOS?.refresh) {
    window.AOS.refresh();
  }
}


export async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`JSON fetch failed: ${res.status}`);
  return res.json();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]
  ));
}

async function init() {
  try {
    const data = await loadJSON("./data/data.json");
    renderRatingScore(data);
    renderReviews(data);
  } catch (err) {
    console.error(err);
  }
}

// 等 DOM 好了再跑
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
