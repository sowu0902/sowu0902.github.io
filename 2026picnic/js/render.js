// DOM 套資料

/**
 *  套共用
 */

// 共用工具
function getValue(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

// 套語系文字
export function renderI18n(data) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const keys = el.dataset.i18n.split('.');
    let value = data;
    keys.forEach(k => value = value?.[k]);
    if (value) el.textContent = value;
  });
}
// 變更語系時，變更樣式
export function renderLanguageSwitcher(lang) {
  const zh = document.querySelector('.language-zh');
  const en = document.querySelector('.language-en');

  if (!zh || !en) return;

  zh.classList.toggle('is-active', lang === 'zh');
  en.classList.toggle('is-active', lang === 'en');

  // 把語系狀態掛到 html，讓 CSS 可針對語系覆寫
  const root = document.documentElement; // <html>
  root.dataset.lang = lang;              // <html data-lang="en">
  root.classList.toggle('lang-zh', lang === 'zh');
  root.classList.toggle('lang-en', lang === 'en');
  root.setAttribute('lang', lang === 'zh' ? 'zh-Hant' : 'en');
}

// 套 meta（title / description / og / favicon ...）
// common.metaCommon + page.meta 合併，page 優先
export function renderMeta(commonData, pageData) {
  const common = commonData?.metaCommon || {};
  const page = pageData?.meta || {};

  // 合併（page 覆蓋 common）
  const merged = {
    ...common,
    ...page,
    og: {
      ...(common.og || {}),
      ...(page.og || {})
    }
  };

  /* ===============================
   * helpers
   * =============================== */

  // 建立或取得 meta
  const ensureMeta = (attrs) => {
    const selector = Object.entries(attrs)
      .map(([k, v]) => `meta[${k}="${v}"]`)
      .join('');

    let el = document.head.querySelector(selector);

    if (!el) {
      el = document.createElement('meta');
      Object.entries(attrs).forEach(([k, v]) => {
        el.setAttribute(k, v);
      });
      document.head.appendChild(el);
    }

    return el;
  };

  const setMetaContent = (attrs, value) => {
    if (typeof value !== 'string' || value.trim() === '') return;
    const el = ensureMeta(attrs);
    el.setAttribute('content', value);
  };

  const ensureLink = (rel) => {
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    return el;
  };

  const setLinkHref = (rel, href) => {
    if (typeof href !== 'string' || href.trim() === '') return;
    const el = ensureLink(rel);
    el.setAttribute('href', href);
  };

  /* ===============================
   * title
   * =============================== */

  if (typeof merged.title === 'string' && merged.title.trim() !== '') {
    document.title = merged.title;
  }

  /* ===============================
   * 基本 meta
   * =============================== */

  setMetaContent({ name: 'description' }, merged.description);
  setMetaContent({ name: 'keywords' }, merged.keywords);
  setMetaContent({ name: 'author' }, merged.author);

  /* ===============================
   * FB / Open Graph
   * =============================== */

  setMetaContent({ property: 'fb:app_id' }, merged.fb_app_id);

  setMetaContent(
    { property: 'og:title' },
    merged.og?.title ?? merged.title
  );

  setMetaContent(
    { property: 'og:description' },
    merged.og?.description ?? merged.description
  );

  setMetaContent({ property: 'og:image' }, merged.og?.image);
  setMetaContent({ property: 'og:url' }, merged.og?.url);
  setMetaContent({ property: 'og:site_name' }, merged.og?.site_name);
  setMetaContent({ property: 'og:type' }, merged.og?.type || 'website');

  /* ===============================
   * Twitter Card（加分項）
   * =============================== */

  setMetaContent({ name: 'twitter:card' }, 'summary_large_image');
  setMetaContent(
    { name: 'twitter:title' },
    merged.og?.title ?? merged.title
  );
  setMetaContent(
    { name: 'twitter:description' },
    merged.og?.description ?? merged.description
  );
  setMetaContent({ name: 'twitter:image' }, merged.og?.image);

  /* ===============================
   * favicon
   * =============================== */

  if (merged.favicon) {
    setLinkHref('shortcut icon', merged.favicon);
    setLinkHref('icon', merged.favicon);
  }

  /* ===============================
   * canonical（可選）
   * =============================== */

  if (merged.og?.url) {
    const canonical = ensureLink('canonical');
    canonical.setAttribute('href', merged.og.url);
  }
}

// 自動補 nav href（含 lang）
export function renderNavLinks(lang) {
  const routes = {
    home: 'index.html',
    coffee: 'coffee.html',
    sports: 'sports.html',
    pets: 'pets.html',
    market: 'market.html',
    run: 'run.html',
    pokemon: 'pokemon.html'
  };

  document.querySelectorAll('[data-nav-link]').forEach(el => {
    const key = el.dataset.navLink;
    const base = routes[key];
    if (!base) return;

    el.href = `${base}?lang=${lang}`;
  });
}

// 套跑馬燈資料
export function renderMarquee(data) {
  const items = data?.marquee;
  if (!Array.isArray(items) || items.length === 0) return;

  const track = document.querySelector('[data-marquee-track]');
  if (!track) return;

  // 避免重複渲染
  track.innerHTML = '';

  const makeItem = (item) => {
    const a = document.createElement('a');
    a.className = 'marquee-item';
    a.href = item.link || '#';
    a.textContent = item.text || '';
    // 如果你想支援新開視窗，可在 json 加 target
    if (item.target) {
      a.target = item.target;
      if (item.target === '_blank') a.rel = 'noopener noreferrer';
    }
    return a;
  };

  // 第一份
  const frag1 = document.createDocumentFragment();
  items.forEach((it) => frag1.appendChild(makeItem(it)));
  track.appendChild(frag1);

  // 第二份（無縫）
  const frag2 = document.createDocumentFragment();
  items.forEach((it) => frag2.appendChild(makeItem(it)));
  track.appendChild(frag2);

  // 可選：依內容長度調速度（避免字很少時太慢、字很多時太快）
  requestAnimationFrame(() => {
    const halfWidth = track.scrollWidth / 2; // 一份內容寬度
    const pxPerSecDesktop = 60;
    const pxPerSecMobile = 60;

    const durationDesktop = Math.max(10, Math.round(halfWidth / pxPerSecDesktop));
    const durationMobile = Math.max(8, Math.round(halfWidth / pxPerSecMobile));

    // 用 CSS 變數丟給 SCSS 裡的 var()
    track.style.setProperty('--marquee-duration', `${durationDesktop}s`);
    track.style.setProperty('--marquee-duration-m', `${durationMobile}s`);
  });
}

// 套 footer 資料 
export function renderFooter(data, lang) {
  if (!data.footer) return;

  const logoContainer = document.querySelector('[data-footer-logos]');
  const linkContainer = document.querySelector('[data-footer-links]');

  /* ===============================
   * Logo 區塊
   * =============================== */
  if (logoContainer && Array.isArray(data.footer.logos)) {
    logoContainer.innerHTML = data.footer.logos
      .map(group => {

        // 如果是純文字類型
        if (group.type === 'text') {
          const names = group.items
            .map((item, index) => {
              const isLast = index === group.items.length - 1;

              return `<span class="footer-text-item">${item.name}${!isLast ? '、' : ''}</span>`;
            })
            .join('');

          return `
            <div class="footer-logo-group footer-logo-group--text ${group.id ? `footer-logo-group--${group.id}` : ''}">
              <h3 class="footer-logo-title">${group.title}</h3>
              <p class="footer-logo-text">${names}</p>
            </div>
          `;
        }

        // 預設：原本的 logo 圖片組
        return `
          <div class="footer-logo-group ${group.id ? `footer-logo-group--${group.id}` : ''}">
            <h3 class="footer-logo-title">${group.title}</h3>
            <ul class="footer-logo-list">
              ${group.items
                .map(item => {
                  if (item.url) {
                    return `
                      <li class="footer-logo-item">
                        <a
                          href="${item.url}"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src="${item.logo}" alt="${item.name}">
                        </a>
                      </li>
                    `;
                  }

                  return `
                    <li class="footer-logo-item">
                      <img src="${item.logo}" alt="${item.name}">
                    </li>
                  `;
                })
                .join('')}
            </ul>
          </div>
        `;
      })
      .join('');
  }


  /* ===============================
   * 友善連結（含 icon）
   * =============================== */
  if (linkContainer && Array.isArray(data.footer.links)) {
    linkContainer.innerHTML = data.footer.links
      .map(group => `
        <div class="footer-link-group content">
          <h3 class="footer-link-title">${group.title}</h3>
          <ul class="footer-link-list">
            ${group.items
              .map(item => {
                // 有連結 → 包 a
                if (item.url) {
                  return `
                    <li class="footer-link-item">
                      <a
                        href="${item.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src="${item.logo}" alt="${item.name}">
                      </a>
                    </li>
                  `;
                }

                // 沒連結 → 只放 img
                return `
                  <li class="footer-link-item">
                    <img src="${item.logo}" alt="${item.name}">
                  </li>
                `;
              })
              .join('')}
          </ul>
        </div>
      `)
      .join('');
  }
}

// 套固定按鈕資料 
export function renderFixedBtn(data, lang) {
  if (!data.fixedBtn) return;

  const container = document.querySelector('[data-fixed-btn]');
  const linkEl = document.querySelector('[data-fixed-btn-link]');
  const imgEl = document.querySelector('[data-fixed-btn-img]');

  if (!container || !linkEl || !imgEl) return;

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const deviceKey = isMobile ? 'mobile' : 'desktop';

  const imgSrc = data.fixedBtn.images?.[deviceKey];
  if (imgSrc) {
    imgEl.src = imgSrc;
  }

  // 路由（沿用全站 routes）
  const routes = {
    home: 'index.html',
    register: 'https://www.accupass.com/organizer/detail/2602030409361972209177'
  };

  const base = routes[data.fixedBtn.route];
  if (base) {
    linkEl.href = `${base}?lang=${lang}`;
  }
}

/**
 *  套INDEX
 */
// render 套INDEX about 區塊資料
export function renderAbout(data) {
  const el = document.querySelector('[data-about-html]');
  if (!el || !data.about || !data.about.html) return;
  el.innerHTML = data.about.html;
}

// render 套INDEX三大野餐區總時間表資料
export function renderTimetable(data, lang) {
  const imgContainer = document.querySelector('[data-timetable]');
  const ctaEl = document.querySelector('[data-timetable-cta]');
  if (!imgContainer) return;

  const timetable = data.timetable;
  if (!timetable || !timetable.images) return;

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const deviceKey = isMobile ? 'mobile' : 'desktop';

  const images = timetable.images[deviceKey];
  if (Array.isArray(images)) {
    imgContainer.innerHTML = images
      .map(
        img => `
          <div class="timetable-item">
            <img src="${img.src}" alt="${img.alt || ''}">
          </div>
        `
      )
      .join('');
  }

  // CTA
  if (ctaEl && timetable.cta) {
  const textEl = ctaEl.querySelector('.btn-text');
  if (textEl) {
    textEl.textContent = timetable.cta.text;
  }

  const routes = {
    home: 'index.html',
    register: 'https://www.accupass.com/organizer/detail/2602030409361972209177'
  };

  const base = routes[timetable.cta.route];
  if (base) {
    ctaEl.href = `${base}?lang=${lang}`;
  }
}
}

// render INDEX最新消息區塊資料
export function renderNews(data, lang) {
  const listEl = document.querySelector('[data-news-list]');
  const moreBtn = document.querySelector('[data-news-more]');
  if (!listEl || !data.news || !Array.isArray(data.news.items)) return;

  const { items, moreText } = data.news;
  const MAX_VISIBLE = 5;

  const routes = {
    home: 'index.html',
    market: 'market.html',
    info: 'info.html',
    register: 'register.html'
  };

  let expanded = false;

  function buildLink(item) {
    // 外連
    if (item.url) {
      return {
        href: item.url,
        target: '_blank',
        rel: 'noopener noreferrer'
      };
    }

    // 內連
    if (item.route && routes[item.route]) {
      return {
        href: `${routes[item.route]}?lang=${lang}`
      };
    }

    return null;
  }

  function render() {
    const visibleItems = expanded ? items : items.slice(0, MAX_VISIBLE);

    listEl.innerHTML = visibleItems
      .map(item => {
        const link = buildLink(item);

        if (!link) {
          return `
            <li class="news-item">
              <time class="news-date">${item.date}</time>
              <span class="news-text">${item.text}</span>
            </li>
          `;
        }

        return `
          <li class="news-item">
            <time class="news-date">${item.date}</time>
            <a
              href="${link.href}"
              class="news-link"
              ${link.target ? `target="${link.target}"` : ''}
              ${link.rel ? `rel="${link.rel}"` : ''}
            >
              ${item.text}
            </a>
          </li>
        `;
      })
      .join('');

    // More 按鈕顯示邏輯
    if (!expanded && items.length > MAX_VISIBLE) {
      moreBtn.style.display = 'block';
      moreBtn.querySelector('.btn-text').textContent = moreText;
    } else {
      moreBtn.style.display = 'none';
    }
  }

  render();

  moreBtn.addEventListener('click', () => {
    expanded = true;
    render();
  });
}

// render INDEX 交通資訊區塊資料
export function renderAccess(data) {
  const container = document.querySelector('[data-access]');
  if (!container || !data.access || !Array.isArray(data.access.cards)) return;

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const deviceKey = isMobile ? 'mobile' : 'desktop';

  container.innerHTML = data.access.cards
    .map(card => `
      <div class="access-card" data-access-card>
        <div class="access-title">
          <img src="${card.titleImage[deviceKey]}" alt="">
        </div>

        <button
          type="button"
          class="access-toggle"
          data-access-toggle
        >
          <span class="btn-text">${card.buttonText}</span>
          <span class="btn-icon" aria-hidden="true"></span>
        </button>

        <div class="access-content" hidden>
          <img src="${card.contentImage[deviceKey]}" alt="">
        </div>
      </div>
    `)
    .join('');

  // toggle 行為（只控制 icon + content）
  container.querySelectorAll('[data-access-card]').forEach(cardEl => {
    const toggleBtn = cardEl.querySelector('[data-access-toggle]');
    const contentEl = cardEl.querySelector('.access-content');

    toggleBtn.addEventListener('click', () => {
      const opened = !contentEl.hasAttribute('hidden');
      contentEl.hidden = opened;
      toggleBtn.classList.toggle('is-open', !opened);
    });
  });
}

// render內頁的kv資料
export function renderPageKV(kv) {
  const kvEl = document.querySelector('[data-page-kv]');
  if (!kvEl || !kv) return;

  kvEl.querySelector('[data-src-desktop]').src = kv.bg.desktop;
  kvEl.querySelector('[data-src-mobile]').srcset = kv.bg.mobile;

  kvEl.querySelector('[data-title-desktop]').src = kv.title.desktop;
  kvEl.querySelector('[data-title-mobile]').srcset = kv.title.mobile;
}

// render內頁的intro資料
export function renderIntro(intro, selector) {
  const el = document.querySelector(selector);
  if (!el || !intro) return;

  // bg
  const bgDesktop = el.querySelector('[data-bg-desktop]');
  const bgMobile = el.querySelector('[data-bg-mobile]');
  if (bgDesktop && intro.bg?.desktop) bgDesktop.src = intro.bg.desktop;
  if (bgMobile && intro.bg?.mobile) bgMobile.srcset = intro.bg.mobile;

  // title(非必填)
  const titleDesktop = el.querySelector('[data-title-desktop]');
  const titleMobile = el.querySelector('[data-title-mobile]');
  if (titleDesktop && intro.title?.desktop) titleDesktop.src = intro.title.desktop;
  if (titleMobile && intro.title?.mobile) titleMobile.srcset = intro.title.mobile;

  // image（非必填）
  const pic = el.querySelector('[data-intro-image]');
  const imgDesktop = el.querySelector('[data-intro-image-desktop]');
  const srcMobile = el.querySelector('[data-intro-image-mobile]');

  const hasImage = !!(intro.image?.desktop || intro.image?.mobile);

  if (pic && imgDesktop && srcMobile) {
    if (hasImage) {
      if (intro.image?.desktop) imgDesktop.src = intro.image.desktop;
      if (intro.image?.mobile) srcMobile.srcset = intro.image.mobile;

      // alt 
      imgDesktop.alt = intro.image?.alt || '';

      pic.hidden = false;
    } else {
      pic.hidden = true;
      imgDesktop.removeAttribute('src');
      srcMobile.removeAttribute('srcset');
    }
  }

  // text
  const textEl = el.querySelector('[data-intro-text]');
  if (textEl) textEl.innerHTML = intro.text;

  // cta
  const ctaEl = el.querySelector('[data-intro-cta]');
  if (ctaEl) {
    const hasCta = intro?.cta && typeof intro.cta.link === 'string' && intro.cta.link.trim() !== '';

    if (hasCta) {
      ctaEl.href = intro.cta.link;
      // 如果你有 span.btn-text
      const textEl = ctaEl.querySelector('.btn-text') || ctaEl.querySelector('[data-cta-text]');
      if (textEl && intro.cta.text) textEl.textContent = intro.cta.text;

      ctaEl.hidden = false;
    } else {
      ctaEl.hidden = true;
      ctaEl.removeAttribute('href');
    }
  }
}

// render內頁的schedule資料
export function renderSchedule(schedule, selector) {
  const el = document.querySelector(selector);
  if (!el || !schedule) return;

  el.querySelector('[data-bg-desktop]').src = schedule.bg.desktop;
  el.querySelector('[data-bg-mobile]').srcset = schedule.bg.mobile;

  el.querySelector('[data-title-desktop]').src = schedule.title.desktop;
  el.querySelector('[data-title-mobile]').srcset = schedule.title.mobile;

  if (schedule.image) {
    el.querySelector('[data-schedule-desktop]').src = schedule.image.desktop;
    el.querySelector('[data-schedule-mobile]').srcset = schedule.image.mobile;
  }
}

// render內頁的有popup的info資料
let _popupEventsBound = false;
export function renderInfoSections(sections, selector) {
  const container = document.querySelector(selector);
  if (!container || !Array.isArray(sections)) return;

  const parent = container.parentNode;
  const anchor = container.nextElementSibling;
  if (!parent) return;

  const popup = document.querySelector('[data-popup]');
  if (!popup) return;

  const popupImg = popup.querySelector('.popup-img');
  const popupTitle = popup.querySelector('.popup-title');
  const popupDesc = popup.querySelector('.popup-desc');
  const popupCta = popup.querySelector('.popup-cta');
  // const popupLogo = popup.querySelector('.popup-logo');

  function openPopup() {
    popup.hidden = false;
    requestAnimationFrame(() => popup.classList.add('is-active'));
    document.body.classList.add('is-popup-open');
  }

  function closePopup() {
    popup.classList.remove('is-active');
    document.body.classList.remove('is-popup-open');
    setTimeout(() => {
      popup.hidden = true;
    }, 300);
  }

  // popup close
  if (!_popupEventsBound) {
    popup.querySelectorAll('[data-popup-close]').forEach(btn => {
      btn.addEventListener('click', closePopup);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !popup.hidden) closePopup();
    });
    _popupEventsBound = true;
  }

  sections.forEach(section => {
    const sectionEl = container.cloneNode(true);

    if (section.id) sectionEl.id = section.id;

    // 背景(非必填)
    if (section.bg) {
      const bgDesktop = sectionEl.querySelector('[data-bg-desktop]');
      const bgMobile = sectionEl.querySelector('[data-bg-mobile]');
      if (bgDesktop && section.bg.desktop) bgDesktop.src = section.bg.desktop;
      if (bgMobile && section.bg.mobile) bgMobile.srcset = section.bg.mobile;
    }

    // title(非必填)
    if (section.title) {
      const titleDesktop = sectionEl.querySelector('[data-title-desktop]');
      const titleMobile = sectionEl.querySelector('[data-title-mobile]');
      if (titleDesktop && section.title.desktop) titleDesktop.src = section.title.desktop;
      if (titleMobile && section.title.mobile) titleMobile.srcset = section.title.mobile;
    }

    // desc(非必填)
    if (section.desc) {
      const descEl = sectionEl.querySelector('[data-desc]');
      if (descEl) descEl.innerHTML = section.desc;
    }

    // cards 容器
    const cardsEl = sectionEl.querySelector('[data-cards]');
    if (!cardsEl) {
      // console.warn('renderInfoSections: missing [data-cards] in template:', selector);
      parent.insertBefore(sectionEl, anchor);
      return;
    }

    // market 純文字 title
    if (section.textTitle) {
      const textTitleEl = document.createElement('h3');
      textTitleEl.className = 'info-text-title';

      const span = document.createElement('span');
      span.textContent = section.textTitle;

      textTitleEl.appendChild(span);

      // cardsEl
      cardsEl.before(textTitleEl);
    }

    // 清空 cards
    cardsEl.innerHTML = '';

    const cards = Array.isArray(section.cards) ? section.cards : [];
    const DEFAULT_CARD_IMAGE = './images/common/card-placeholder.png';

    cards.forEach(card => {
      const li = document.createElement('li');
      li.className = 'info-card';

      const imgSrc =
        typeof card.image === 'string' && card.image.trim() !== ''
          ? card.image
          : DEFAULT_CARD_IMAGE;

      // nation flag 圖
      let nationHtml = '';
      if (typeof card.nation === 'string' && card.nation.trim() !== '') {
        const nation = card.nation.trim().toLowerCase();
        const flagSrc = `./images/market/flag/flag-${nation}.png`;
        nationHtml = `
          <div class="nation">
            <img src="${flagSrc}" alt="${nation}">
          </div>
        `;
      }

      li.innerHTML = `
        ${nationHtml}
        <div class="card-img">
          <img src="${imgSrc}" alt="${card.title || ''}">
        </div>
        <h4 class="card-title">${card.title || ''}</h4>
        <button class="card-more" aria-hidden="true">MORE</button>
      `;

      li.addEventListener('click', () => {
        // 圖
        if (popupImg) popupImg.src = imgSrc;

        // logo（可選）
        const popupLogo = popup.querySelector('.popup-logo');
        if (popupLogo) {
          const logoSrc = typeof card.logo === 'string' ? card.logo.trim() : '';
          if (logoSrc) {
            popupLogo.src = logoSrc;
            popupLogo.hidden = false;
          } else {
            popupLogo.hidden = true;
            popupLogo.removeAttribute('src');
          }
        }

        // 文字
        if (popupTitle) popupTitle.textContent = card.title || '';
        if (popupDesc) popupDesc.innerHTML = card.desc || '';

        // CTA
        const hasRegister = typeof card.registerLink === 'string' && card.registerLink.trim() !== '';
        if (popupCta) {
          if (hasRegister) {
            popupCta.href = card.registerLink;

            const btnTextEl = popupCta.querySelector('.btn-text');
            if (btnTextEl && card.btnText) btnTextEl.textContent = card.btnText;

            popupCta.hidden = false;
          } else {
            popupCta.hidden = true;
            popupCta.removeAttribute('href');
          }
        }

        openPopup();
      });


      cardsEl.appendChild(li);
    });

    parent.insertBefore(sectionEl, anchor);
  });

  // 移除 template
  container.remove();
}

// render內頁的marketMap資料
export function renderMarketMap(map, selector) {
  const el = document.querySelector(selector);
  if (!el || !map) return;

  el.querySelector('[data-title-desktop]').src = map.title.desktop;
  el.querySelector('[data-title-mobile]').srcset = map.title.mobile;

  if (map.image) {
    el.querySelector('[data-map-desktop]').src = map.image.desktop;
    el.querySelector('[data-map-mobile]').srcset = map.image.mobile;
  }
}

// render內頁的runRule資料
export function renderRule(rule, selector = '[data-rule]') {
  const root = document.querySelector(selector);
  if (!root || !rule) return;

  // bg
  const bgDesktop = root.querySelector('[data-bg-desktop]');
  const bgMobile = root.querySelector('[data-bg-mobile]');
  if (bgDesktop && rule.bg?.desktop) bgDesktop.src = rule.bg.desktop;
  if (bgMobile && rule.bg?.mobile) bgMobile.srcset = rule.bg.mobile;

  // title
  const titleDesktop = root.querySelector('[data-title-desktop]');
  const titleMobile = root.querySelector('[data-title-mobile]');
  if (titleDesktop && rule.title?.desktop) titleDesktop.src = rule.title.desktop;
  if (titleMobile && rule.title?.mobile) titleMobile.srcset = rule.title.mobile;

  // blocks
  const blocksWrap = root.querySelector('[data-rule-blocks]');
  if (!blocksWrap) return;

  blocksWrap.innerHTML = '';

  const blocks = Array.isArray(rule.blocks) ? rule.blocks : [];
  blocks.forEach(block => {
    const blockEl = document.createElement('div');
    blockEl.className = 'rule-block';
    if (block.id) blockEl.id = block.id;

    // subtitle (optional)
    let subtitleHtml = '';
    if (block.subtitle?.desktop || block.subtitle?.mobile) {
      const d = block.subtitle?.desktop || '';
      const m = block.subtitle?.mobile || '';
      subtitleHtml = `
        <div class="rule-subtitle">
          <picture>
            ${m ? `<source media="(max-width: 750px)" srcset="${m}">` : ''}
            ${d ? `<img src="${d}" alt="">` : `<img alt="">`}
          </picture>
        </div>
      `;
    }

    // content (HTML)
    const contentHtml = typeof block.contentHtml === 'string' ? block.contentHtml : '';

    blockEl.innerHTML = `
      ${subtitleHtml}
      <div class="rule-content">${contentHtml}</div>
    `;

    blocksWrap.appendChild(blockEl);
  });
}

// render內頁的event資料(POKEMON ONLY)
export function renderEvent(event, selector = '[data-page-event]') {
  if (!event) return;

  const root = document.querySelector(selector);
  if (!root) return;

  // ---------- helpers ----------
  const setPictureFromPayload = (container, desktopSel, mobileSel, payload) => {
    const d = container.querySelector(desktopSel);
    const m = container.querySelector(mobileSel);

    const has = !!(payload?.desktop || payload?.mobile);
    if (!has) return false;

    if (d && payload?.desktop) d.src = payload.desktop;
    if (m && payload?.mobile) m.srcset = payload.mobile;
    return true;
  };

  const createPicture = ({ desktop, mobile, alt = '' }, { mobileQuery = '(max-width: 750px)' } = {}) => {
    const pic = document.createElement('picture');

    if (mobile) {
      const source = document.createElement('source');
      source.media = mobileQuery;
      source.srcset = mobile;
      pic.appendChild(source);
    }

    const img = document.createElement('img');
    if (desktop) img.src = desktop;
    img.alt = alt;
    pic.appendChild(img);

    return pic;
  };

  const setHtmlOrHide = (el, html) => {
    if (!el) return;
    if (typeof html === 'string' && html.trim() !== '') {
      el.innerHTML = html;
      el.hidden = false;
    } else {
      el.innerHTML = '';
      el.hidden = true;
    }
  };

  // ---------- section bg/title ----------
  setPictureFromPayload(root, '[data-event-bg-desktop]', '[data-event-bg-mobile]', event.bg);
  setPictureFromPayload(root, '[data-event-title-desktop]', '[data-event-title-mobile]', event.title);

  // ---------- intro html ----------
  const introEl = root.querySelector('[data-event-intro]');
  setHtmlOrHide(introEl, event.introHtml);

  // ---------- cards ----------
  const cardsWrap = root.querySelector('[data-event-cards]');
  if (!cardsWrap) return;

  cardsWrap.innerHTML = '';

  const cards = Array.isArray(event.cards) ? event.cards : [];
  cards.forEach((card, index) => {
    // 若整張 card 完全沒資料就略過
    const hasAnything =
      !!(card?.bg?.desktop || card?.bg?.mobile ||
         card?.title?.desktop || card?.title?.mobile ||
         (typeof card?.textHtml === 'string' && card.textHtml.trim() !== '') ||
         card?.image?.desktop || card?.image?.mobile ||
         (Array.isArray(card?.blocks) && card.blocks.length));

    if (!hasAnything) return;

    const cardId = card?.id ? String(card.id) : `card-${index + 1}`;

    const article = document.createElement('article');
    article.className = `event-card event-card--${cardId}`;
    article.dataset.cardId = cardId;
    article.setAttribute('data-aos', 'fade-up');
    article.setAttribute('data-aos-duration', '800');

    // --- card bg (optional) ---
    if (card?.bg?.desktop || card?.bg?.mobile) {
      const bg = document.createElement('div');
      bg.className = 'event-card-bg';
      bg.appendChild(createPicture({ desktop: card.bg.desktop || '', mobile: card.bg.mobile || '', alt: '' }));
      article.appendChild(bg);
    }

    const inner = document.createElement('div');
    inner.className = 'event-card-inner';
    article.appendChild(inner);

    // --- content area: blocks OR single ---
    const blocks = Array.isArray(card?.blocks) ? card.blocks : null;

    if (blocks && blocks.length) {
      blocks.forEach((b, i) => {
        const block = document.createElement('div');
        block.className = `event-card-block event-card-block--${i + 1}`;

        // title (optional)
        if (b?.title?.desktop || b?.title?.mobile) {
          const titleWrap = document.createElement('div');
          titleWrap.className = 'event-card-title';
          // titleWrap.setAttribute('data-aos', 'fade-down');
          // titleWrap.setAttribute('data-aos-duration', '800');
          titleWrap.appendChild(createPicture({ desktop: b.title.desktop || '', mobile: b.title.mobile || '', alt: '' }));
          block.appendChild(titleWrap);
        }

        // text (optional)
        if (typeof b?.textHtml === 'string' && b.textHtml.trim() !== '') {
          const text = document.createElement('div');
          text.className = 'event-card-text';
          text.innerHTML = b.textHtml;
          block.appendChild(text);
        }

        inner.appendChild(block);
      });
    } else {
      // title (optional)
      if (card?.title?.desktop || card?.title?.mobile) {
        const titleWrap = document.createElement('div');
        titleWrap.className = 'event-card-title';
        // titleWrap.setAttribute('data-aos', 'fade-down');
        // titleWrap.setAttribute('data-aos-duration', '800');
        titleWrap.appendChild(createPicture({ desktop: card.title.desktop || '', mobile: card.title.mobile || '', alt: '' }));
        inner.appendChild(titleWrap);
      }

      // text (optional)
      if (typeof card?.textHtml === 'string' && card.textHtml.trim() !== '') {
        const text = document.createElement('div');
        text.className = 'event-card-text';
        text.innerHTML = card.textHtml;
        inner.appendChild(text);
      }
    }

    // --- media image (optional) ---
    if (card?.image?.desktop || card?.image?.mobile) {
      const media = document.createElement('div');
      media.className = 'event-card-media';
      // media.setAttribute('data-aos', 'fade-up');
      // media.setAttribute('data-aos-duration', '800');
      media.appendChild(createPicture({ desktop: card.image.desktop || '', mobile: card.image.mobile || '', alt: '' }));
      inner.appendChild(media);
    }

    cardsWrap.appendChild(article);
  });
}

// render內頁的notice資料(POKEMON ONLY)
export function renderNotice(notice, selector = '[data-page-notice]') {
  if (!notice) return;

  const el = document.querySelector(selector);
  if (!el) return;

  /* ===========================
   * 背景圖（非必填）
   * =========================== */
  const bgDesktop = el.querySelector('[data-notice-bg-desktop]');
  const bgMobile = el.querySelector('[data-notice-bg-mobile]');
  const hasBg = !!(notice.bg?.desktop || notice.bg?.mobile);

  if (hasBg) {
    if (bgDesktop && notice.bg?.desktop) bgDesktop.src = notice.bg.desktop;
    if (bgMobile && notice.bg?.mobile) bgMobile.srcset = notice.bg.mobile;
  }

  /* ===========================
   * 標題圖（非必填）
   * =========================== */
  const titleDesktop = el.querySelector('[data-notice-title-desktop]');
  const titleMobile = el.querySelector('[data-notice-title-mobile]');
  const hasTitle = !!(notice.title?.desktop || notice.title?.mobile);

  if (hasTitle) {
    if (titleDesktop && notice.title?.desktop) titleDesktop.src = notice.title.desktop;
    if (titleMobile && notice.title?.mobile) titleMobile.srcset = notice.title.mobile;
  } else {
    const titleWrap = el.querySelector('.notice-title');
    if (titleWrap) titleWrap.hidden = true;
  }

  /* ===========================
   * 注意事項列表
   * =========================== */
  const listEl = el.querySelector('[data-notice-list]');
  if (listEl) {
    const items = Array.isArray(notice.items) ? notice.items : [];

    if (items.length) {
      listEl.innerHTML = items
        .map(item => `<li class="notice-item">${item}</li>`)
        .join('');
      listEl.hidden = false;
    } else {
      listEl.innerHTML = '';
      listEl.hidden = true;
    }
  }

  /* ===========================
   * container 外備註文字（非必填）
   * =========================== */
  const noteEl = el.querySelector('[data-notice-note]');
  if (noteEl) {
    if (typeof notice.noteHtml === 'string' && notice.noteHtml.trim() !== '') {
      noteEl.innerHTML = notice.noteHtml;
      noteEl.hidden = false;
    } else {
      noteEl.innerHTML = '';
      noteEl.hidden = true;
    }
  }
}

