// render野餐頁的kv
export function renderPicnicKV(kv) {
  const kvEl = document.querySelector('[data-picnic-kv]');
  if (!kvEl || !kv) return;

  kvEl.querySelector('[data-src-desktop]').src = kv.bg.desktop;
  kvEl.querySelector('[data-src-mobile]').srcset = kv.bg.mobile;

  kvEl.querySelector('[data-title-desktop]').src = kv.title.desktop;
  kvEl.querySelector('[data-title-mobile]').srcset = kv.title.mobile;
}

// render野餐頁的intro
export function renderPicnicIntro(intro) {
  const el = document.querySelector('[data-picnic-intro]');
  if (!el || !intro) return;

  // 背景圖
  el.querySelector('[data-bg-desktop]').src = intro.bg.desktop;
  el.querySelector('[data-bg-mobile]').srcset = intro.bg.mobile;

  // 文字（允許 HTML）
  const textEl = el.querySelector('[data-intro-text]');
  if (textEl) textEl.innerHTML = intro.text;

  // CTA
  const cta = el.querySelector('[data-intro-cta]');
  if (cta) {
    cta.href = intro.cta.link;
    cta.querySelector('span').textContent = intro.cta.text;
  }
}

// render野餐頁的schedule
export function renderPicnicSchedule(schedule) {
  const el = document.querySelector('[data-picnic-schedule]');
  if (!el || !schedule) return;

  // 背景
  el.querySelector('[data-bg-desktop]').src = schedule.bg.desktop;
  el.querySelector('[data-bg-mobile]').srcset = schedule.bg.mobile;

  // title
  el.querySelector('[data-title-desktop]').src = schedule.title.desktop;
  el.querySelector('[data-title-mobile]').srcset = schedule.title.mobile;

  // schedule image
  el.querySelector('[data-schedule-desktop]').src = schedule.image.desktop;
  el.querySelector('[data-schedule-mobile]').srcset = schedule.image.mobile;
}

// render野餐頁的info
export function renderPicnicInfoSections(sections) {
  const container = document.querySelector('[data-picnic-info]');

  if (!container || !Array.isArray(sections)) return;

  const popup = document.querySelector('[data-popup]');
  const popupImg = popup.querySelector('.popup-img');
  const popupTitle = popup.querySelector('.popup-title');
  const popupDesc = popup.querySelector('.popup-desc');
  const popupCta = popup.querySelector('.popup-cta');

  function openPopup() {
    popup.hidden = false;
    requestAnimationFrame(() => {
      popup.classList.add('is-active');
    });
    document.body.classList.add('is-popup-open');
  }

  function closePopup() {
    popup.classList.remove('is-active');
    document.body.classList.remove('is-popup-open');
    setTimeout(() => {
      popup.hidden = true;
    }, 300);
  } 

  sections.forEach(section => {
    const sectionEl = container.cloneNode(true);

    if (section.id) {
      sectionEl.id = section.id;
    }

    // 背景
    sectionEl.querySelector('[data-bg-desktop]').src = section.bg.desktop;
    sectionEl.querySelector('[data-bg-mobile]').srcset = section.bg.mobile;

    // title
    sectionEl.querySelector('[data-title-desktop]').src = section.title.desktop;
    sectionEl.querySelector('[data-title-mobile]').srcset = section.title.mobile;

    // desc
    sectionEl.querySelector('[data-desc]').innerHTML = section.desc;

    // cards
    const cardsEl = sectionEl.querySelector('[data-cards]');
    cardsEl.innerHTML = '';

    section.cards.forEach(card => {
      const li = document.createElement('li');
      li.className = 'info-card';

      const DEFAULT_CARD_IMAGE = './images/common/card-placeholder.gif';

      const imgSrc = card.image && card.image.trim()
        ? card.image
        : DEFAULT_CARD_IMAGE;

      li.innerHTML = `
        <div class="card-img">
          <img src="${imgSrc}" alt="${card.title}">
        </div>
        <h4 class="card-title">${card.title}</h4>
        <button class="card-more">MORE</button>
      `;

      li.addEventListener('click', () => {
        popupImg.src = imgSrc; 
        popupTitle.textContent = card.title;
        popupDesc.innerHTML = card.desc || '';

        if (card.registerLink) {
          popupCta.href = card.registerLink;
          popupCta.querySelector('.btn-text').textContent = card.btnText;
          popupCta.hidden = false;
        } else {
          popupCta.hidden = true;
        }

        openPopup();
      });


      cardsEl.appendChild(li);
    });

    container.parentNode.insertBefore(sectionEl, container);
  });

  container.remove();

  // popup close
  popup.querySelectorAll('[data-popup-close]').forEach(btn => {
    btn.addEventListener('click', closePopup);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !popup.hidden) {
      closePopup();
    }
  });
}

// render野餐頁的intro2
export function renderPicnicIntro2(intro) {
  const el = document.querySelector('[data-picnic-intro2]');
  if (!el || !intro) return;

  // 背景圖
  el.querySelector('[data-bg-desktop]').src = intro.bg.desktop;
  el.querySelector('[data-bg-mobile]').srcset = intro.bg.mobile;

  // 文字（允許 HTML）
  const textEl = el.querySelector('[data-intro-text]');
  if (textEl) textEl.innerHTML = intro.text;

  // title
  el.querySelector('[data-title-desktop]').src = intro.title.desktop;
  el.querySelector('[data-title-mobile]').srcset = intro.title.mobile;

}

// render野餐頁的schedule2
export function renderPicnicSchedule2(schedule) {
  const el = document.querySelector('[data-picnic-schedule2]');
  if (!el || !schedule) return;

  // 背景
  el.querySelector('[data-bg-desktop]').src = schedule.bg.desktop;
  el.querySelector('[data-bg-mobile]').srcset = schedule.bg.mobile;

  // title
  el.querySelector('[data-title-desktop]').src = schedule.title.desktop;
  el.querySelector('[data-title-mobile]').srcset = schedule.title.mobile;

  // schedule image
  el.querySelector('[data-schedule-desktop]').src = schedule.image.desktop;
  el.querySelector('[data-schedule-mobile]').srcset = schedule.image.mobile;
}

// render野餐頁的info2
export function renderPicnicInfoSections2(sections) {
  const container = document.querySelector('[data-picnic-info2]');

  if (!container || !Array.isArray(sections)) return;

  const popup = document.querySelector('[data-popup]');
  const popupImg = popup.querySelector('.popup-img');
  const popupTitle = popup.querySelector('.popup-title');
  const popupDesc = popup.querySelector('.popup-desc');
  const popupCta = popup.querySelector('.popup-cta');

  function openPopup() {
    popup.hidden = false;
    requestAnimationFrame(() => {
      popup.classList.add('is-active');
    });
    document.body.classList.add('is-popup-open');
  }

  function closePopup() {
    popup.classList.remove('is-active');
    document.body.classList.remove('is-popup-open');
    setTimeout(() => {
      popup.hidden = true;
    }, 300);
  } 

  sections.forEach(section => {
    const sectionEl = container.cloneNode(true);

    if (section.id) {
      sectionEl.id = section.id;
    }

    // 背景
    sectionEl.querySelector('[data-bg-desktop]').src = section.bg.desktop;
    sectionEl.querySelector('[data-bg-mobile]').srcset = section.bg.mobile;

    // title
    sectionEl.querySelector('[data-title-desktop]').src = section.title.desktop;
    sectionEl.querySelector('[data-title-mobile]').srcset = section.title.mobile;

    // cards
    const cardsEl = sectionEl.querySelector('[data-cards]');
    cardsEl.innerHTML = '';

    section.cards.forEach(card => {
      const li = document.createElement('li');
      li.className = 'info-card';

      const DEFAULT_CARD_IMAGE = './images/common/card-placeholder.gif';

      const imgSrc = card.image && card.image.trim()
        ? card.image
        : DEFAULT_CARD_IMAGE;

      li.innerHTML = `
        <div class="card-img">
          <img src="${imgSrc}" alt="${card.title}">
        </div>
        <h4 class="card-title">${card.title}</h4>
        <button class="card-more">MORE</button>
      `;

      li.addEventListener('click', () => {
        popupImg.src = imgSrc; 
        popupTitle.textContent = card.title;
        popupDesc.innerHTML = card.desc || '';

        if (card.registerLink) {
          popupCta.href = card.registerLink;
          popupCta.querySelector('.btn-text').textContent = card.btnText;
          popupCta.hidden = false;
        } else {
          popupCta.hidden = true;
        }

        openPopup();
      });


      cardsEl.appendChild(li);
    });

    container.parentNode.insertBefore(sectionEl, container);
  });

  container.remove();

  // popup close
  popup.querySelectorAll('[data-popup-close]').forEach(btn => {
    btn.addEventListener('click', closePopup);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !popup.hidden) {
      closePopup();
    }
  });
}



