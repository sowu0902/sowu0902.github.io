document.querySelectorAll('.kv .cta').forEach(el => {
  el.addEventListener('click', () => {
    const targetId = el.getAttribute('data-href');
    const target = document.getElementById(targetId);

    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.scrollY;
      const offset = 1; // 偏移量（往下 1px）

      window.scrollTo({
        top: targetPosition + offset,
        behavior: 'smooth'
      });
    }
  });
});

function initPopup() {
  const triggers = document.querySelectorAll(".go-popup");
  const body = document.body;

  let scrollY = 0;

  function openPopup(id) {
    const popup = document.querySelector(`[data-popup="${id}"]`);
    if (!popup) return;

    popup.hidden = false;
    requestAnimationFrame(() => {
      popup.classList.add("is-active");
    });

    lockScroll();
    trapFocus(popup);
  }

  function closePopup(popup) {
    popup.classList.remove("is-active");

    popup.addEventListener("transitionend", function handler(e) {
      if (e.propertyName !== "opacity") return;

      popup.hidden = true;
      popup.removeEventListener("transitionend", handler);
    });

    unlockScroll();
  }

  // let scrollY = 0;

  function lockScroll() {
    scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add("is-lock");
  }

  function unlockScroll() {
    document.body.classList.remove("is-lock");
    const y = document.body.style.top;
    document.body.style.top = "";
    window.scrollTo(0, parseInt(y || "0") * -1);
  }

  // 開啟
  triggers.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.popupTarget;
      if (id) openPopup(id);
    });
  });

  // 點擊關閉
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-popup-close]");
    if (!closeBtn) return;

    const popup = closeBtn.closest(".popup");
    if (popup) closePopup(popup);
  });

  // ESC 關閉
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    const opened = document.querySelector(".popup:not([hidden])");
    if (opened) closePopup(opened);
  });
}

document.addEventListener("DOMContentLoaded", initPopup);