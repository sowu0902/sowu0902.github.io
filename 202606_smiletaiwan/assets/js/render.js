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
    const shortText = sanitizeReviewHtml(item?.shortText ?? "");
    const fullText = sanitizeReviewHtml(item?.fullText ?? "");
    const photo = item?.photo ?? "";

    const hasMore = !!(item?.fullText && String(item.fullText).trim());

    const el = document.createElement("div");
    el.className = "reviews-item";

    el.setAttribute("data-aos", "fade-up");
    el.setAttribute("data-aos-delay", String(i * 120));
    el.setAttribute("data-aos-once", "true");

    el.innerHTML = `
      <div class="reviews-avatar">
        <img src="${photo}" alt="${name}">
      </div>

      <div class="reviews-short-content">
        <div class="reviews-name">${name}</div>

        <div class="reviews-text-wrap">
          <p class="reviews-text">${shortText}</p>
          ${
            hasMore
              ? `<button type="button" class="reviews-toggle" data-action="open">
                  查看完整版心得
                </button>`
              : ""
          }
        </div>
      </div>

      ${
        hasMore
          ? `
          <div class="reviews-full-content" hidden>
            <p class="reviews-text">${fullText}</p>
            <button type="button" class="reviews-toggle" data-action="close">
              隱藏完整版心得
            </button>
          </div>
        `
          : ""
      }
    `;

    frag.appendChild(el);
  });

  list.appendChild(frag);

  bindReviewToggle(list);

  if (window.AOS?.refreshHard) {
    window.AOS.refreshHard();
  } else if (window.AOS?.refresh) {
    window.AOS.refresh();
  }
}

function bindReviewToggle(container) {
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".reviews-toggle");
    if (!btn) return;

    const item = btn.closest(".reviews-item");
    if (!item) return;

    const shortBtn = item.querySelector('[data-action="open"]');
    const shortBlock = item.querySelector(".reviews-short-content");
    const fullBlock = item.querySelector(".reviews-full-content");

    if (!shortBtn || !fullBlock) return;

    const action = btn.dataset.action;

    if (action === "open") {
      fullBlock.hidden = false;
      shortBtn.hidden = true;
      item.classList.add("is-expanded");
      fullBlock.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (action === "close") {
      fullBlock.hidden = true;
      shortBtn.hidden = false;
      item.classList.remove("is-expanded");
      shortBlock.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}


export async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`JSON fetch failed: ${res.status}`);
  return res.json();
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeReviewHtml(html = "") {
  const template = document.createElement("template");
  template.innerHTML = html;

  const allowedTags = new Set(["BR", "STRONG", "SPAN"]);
  const allowedAttrs = {
    SPAN: ["class"]
  };

  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tag = child.tagName;

        // 不在白名單內的標籤：改成純文字
        if (!allowedTags.has(tag)) {
          const textNode = document.createTextNode(child.textContent || "");
          child.replaceWith(textNode);
          return;
        }

        // 移除不允許的屬性
        [...child.attributes].forEach((attr) => {
          const allowList = allowedAttrs[tag] || [];
          if (!allowList.includes(attr.name)) {
            child.removeAttribute(attr.name);
          }
        });

        walk(child);
      }
    });
  };

  walk(template.content);
  return template.innerHTML;
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
