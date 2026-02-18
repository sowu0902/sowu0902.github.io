import { getLang, loadJSON } from './i18n.js';
import {
  renderI18n,
  renderLanguageSwitcher,
  renderNavLinks,
  renderMarquee,
  renderFooter,
  renderFixedBtn,
  renderPageKV,
  renderIntro,
  renderSchedule,
  renderInfoSections,
  renderMarketMap,
  renderRule
} from './render.js';


const page = document.body.dataset.page; // coffee / sports / pets
const lang = getLang();

// 加 body class 表示目前頁面
if (page) {
  document.body.classList.add(`page-${page}`);
}

async function loadPartial(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;
  const html = await fetch(path).then(res => res.text());
  el.innerHTML = html;
}

function initSiteNav() {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.site-nav');
  const openBtn = document.querySelector('.hamburger');
  const closeBtn = document.querySelector('.site-nav-close');

  if (!nav || !openBtn) return;

  const openNav = () => {
    nav.classList.add('active');
    header?.classList.add('nav-open');
    openBtn.classList.add('active');
  };

  const closeNav = () => {
    nav.classList.remove('active');
    header?.classList.remove('nav-open');
    openBtn.classList.remove('active');
  };

  // hamburger → 開
  openBtn.addEventListener('click', openNav);

  // close button → 關
  closeBtn?.addEventListener('click', closeNav);

  // 點 nav 內的連結 → 關（手機 UX）
  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      closeNav();
    }
  });

  // ESC 鍵關閉
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeNav();
    }
  });
}

async function init() {
  // ① 共用區塊
  await Promise.all([
    loadPartial('#header', 'partials/header.html'),
    loadPartial('#marquee', 'partials/marquee.html'),
    loadPartial('#fixed-cta', 'partials/fixed-cta.html'),
    loadPartial('#footer', 'partials/footer.html')
  ]);

  // ② JSON
  const common = await loadJSON(`data/common/common.${lang}.json`);
  const pageAll = await loadJSON(`data/pages/page.${lang}.json`);
  const pageData = pageAll?.[page];

  if (!pageData) {
    console.warn(`No data for page: ${page}`);
    return;
  }

  // ③ render
  renderI18n(common);
  renderLanguageSwitcher(lang);
  renderNavLinks(lang);
  renderMarquee(common);
  renderFooter(common, lang);
  renderFixedBtn(common, lang);

  renderPageKV(pageData.kv);
  renderIntro(pageData.intro, '[data-page-intro]');
  renderSchedule(pageData.schedule, '[data-page-schedule]');
  renderInfoSections(pageData.infoSections, '[data-page-info]');
  renderIntro(pageData.intro2, '[data-page-intro2]');
  renderSchedule(pageData.schedule2, '[data-page-schedule2]');
  renderInfoSections(pageData.infoSections2, '[data-page-info2]');
  renderMarketMap(pageData.map, '[data-page-map]');
  renderRule(pageData.rule, '[data-page-rule]');

  // 最後再跑頁面文字 i18n
  renderI18n(pageData);

  // 初始化 hamburger
  initSiteNav();
}

init();