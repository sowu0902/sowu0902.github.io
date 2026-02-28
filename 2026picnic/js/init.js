// 頁面初始化
import { getLang, loadJSON } from './i18n.js';
import { renderMeta,renderI18n, renderLanguageSwitcher, renderNavLinks, renderMarquee, renderFooter, renderFixedBtn, renderAbout, renderTimetable, renderNews, renderAccess } from './render.js';


const lang = getLang();

async function loadPartial(selector, path) {
  const html = await fetch(path).then(res => res.text());
  document.querySelector(selector).innerHTML = html;
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
  // ① 載入共用區塊
  await Promise.all([
    loadPartial('#header', 'partials/header.html'),
    loadPartial('#marquee', 'partials/marquee.html'),
    loadPartial('#fixed-cta', 'partials/fixed-cta.html'),
    loadPartial('#footer', 'partials/footer.html')
  ]);

  // ② 載入語系資料
  const common = await loadJSON(`data/common/common.${lang}.json`);
  const homeData = await loadJSON(`data/pages/home.${lang}.json`);

  // ③ 套內容
  renderMeta(common, homeData);
  renderI18n(common);
  renderLanguageSwitcher(lang);
  renderNavLinks(lang);
  renderMarquee(common);
  renderFooter(common, lang);
  renderFixedBtn(common, lang);
  renderAbout(homeData);
  renderTimetable(homeData, lang);
  renderNews(homeData, lang);
  renderAccess(homeData);

  // ④ 初始化 hamburger
  initSiteNav();
  
}

init();