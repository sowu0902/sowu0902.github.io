// DOM 套資料
// 共用工具
function getValue(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

/**
 * 套語系文字
 */
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
}


/**
 * 自動補 nav href（含 lang）
 */
export function renderNavLinks(lang) {
  const routes = {
    home: 'index.html',
    'picnic-a': 'picnic.html?type=picnic-a',
    'picnic-b': 'picnic.html?type=picnic-b',
    'picnic-c': 'picnic.html?type=picnic-c',
    market: 'market.html',
    store: 'store.html',
    pokemon: 'pokemon.html'
  };

  document.querySelectorAll('[data-nav-link]').forEach(el => {
    const key = el.dataset.navLink;
    const base = routes[key];
    if (!base) return;

    const hasQuery = base.includes('?');
    el.href = `${base}${hasQuery ? '&' : '?'}lang=${lang}`;
  });
}

/**
 * 套跑馬燈資料
 */
export function renderMarquee(data) {
  const textEl = document.querySelector('[data-marquee-text]');
  const linkEl = document.querySelector('[data-marquee-link]');

  if (!textEl || !linkEl) return;

  const marquee = data.marquee;
  if (!marquee || !marquee.text) return;

  textEl.textContent = marquee.text;
  linkEl.href = marquee.link || '#';
}

/**
 *  套 footer 資料 
 */
export function renderFooter(data, lang) {
  if (!data.footer) return;

  const logoContainer = document.querySelector('[data-footer-logos]');
  const linkList = document.querySelector('[data-footer-links]');

  /* ===============================
   * Logo 區塊
   * =============================== */
  if (logoContainer && Array.isArray(data.footer.logos)) {
    logoContainer.innerHTML = data.footer.logos
      .map(group => `
        <div class="footer-logo-group">
          <h3 class="footer-logo-title">${group.title}</h3>
          <ul class="footer-logo-list">
            ${group.items
              .map(item => {
                // 有連結 → 包 a
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

                // 沒連結 → 只放 img
                return `
                  <li class="footer-logo-item">
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

  /* ===============================
   * 友善連結（含 icon）
   * =============================== */
  if (linkList && Array.isArray(data.footer.links)) {
    const routes = {
      home: 'index.html',
      info: 'info.html',
      market: 'market.html',
      register: 'register.html'
    };

    linkList.innerHTML = data.footer.links
      .map(link => {
        let href = '#';
        let extraAttr = '';

        // 外連
        if (link.url) {
          href = link.url;
          extraAttr = 'target="_blank" rel="noopener noreferrer"';
        }

        // 內連（支援 hash）
        if (link.route) {
          const [page, hash] = link.route.split('#');
          if (routes[page]) {
            href = `${routes[page]}?lang=${lang}${hash ? `#${hash}` : ''}`;
          }
        }

        return `
          <li class="footer-link-item">
            <a href="${href}" ${extraAttr}>
              ${link.icon
                ? `<img src="${link.icon}" alt="${link.text}" aria-hidden="true">`
                : ''}
            </a>
          </li>
        `;
      })
      .join('');
  }
}

/**
 *  套固定按鈕資料 
 */
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
    register: 'register.html'
  };

  const base = routes[data.fixedBtn.route];
  if (base) {
    linkEl.href = `${base}?lang=${lang}`;
  }
}


/** 
 * 套INDEX about 區塊資料
 */
export function renderAbout(data) {
  const el = document.querySelector('[data-about-html]');
  if (!el || !data.about || !data.about.html) return;
  el.innerHTML = data.about.html;
}

/**
 * 套INDEX三大野餐區總時間表
 */
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
    register: 'register.html'
  };

  const base = routes[timetable.cta.route];
  if (base) {
    ctaEl.href = `${base}?lang=${lang}`;
  }
}
}

/**
 * 套INDEX最新消息區塊資料
 */
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

/** 套INDEX 交通資訊區塊資料
 */
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

