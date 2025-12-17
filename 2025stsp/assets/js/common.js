// 引用Aos動態
AOS.init();

// 頁面滾動送datalayer
window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function () {

  dataLayer.push({
    event: 'sendMyEvent',
    eventCategory: 'cwdigiteam',
    eventAction: '2025stsp',
    eventLabel: 'index'
  });

  const sentSections = new Set(['index']);
  const sections = document.querySelectorAll('main section');
  const lastSection = sections[sections.length - 1];

  /* 一般 section：畫面中線 */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        if (!id || sentSections.has(id)) return;

        dataLayer.push({
          event: 'sendMyEvent',
          eventCategory: 'cwdigiteam',
          eventAction: '2025stsp',
          eventLabel: id
        });

        sentSections.add(id);
      });
    },
    {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    }
  );

  /* 最後一個 section：只要出現在畫面 */
  const lastObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        if (!id || sentSections.has(id)) return;

        dataLayer.push({
          event: 'sendMyEvent',
          eventCategory: 'cwdigiteam',
          eventAction: '2025stsp',
          eventLabel: id
        });

        sentSections.add(id);
      });
    },
    {
      threshold: 0
    }
  );

  sections.forEach(section => {
    if (section === lastSection) {
      lastObserver.observe(section);
    } else {
      observer.observe(section);
    }
  });

});

// 點擊scrolldown時滾動到指定錨點
document.querySelectorAll('.scrolldown').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();

    const targetSelector = "#" +this.getAttribute('data-href');
    if (!targetSelector) return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// SHOW NAV
document.querySelector('.hamberger').addEventListener('click', function() {
  document.querySelector('nav').classList.toggle('show')
})

// CLOSE NAV
document.querySelector('nav .close').addEventListener('click', function() {
  document.querySelector('nav').classList.remove('show')
})

// nav 點擊後滾到指定錨點並在mobile時關閉nav
document.querySelectorAll('nav ul li').forEach(function(li) {
    li.addEventListener('click', function() {
      const targetId = li.getAttribute('data-herf');
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
        // 更新網址 hash
        history.replaceState(null, '', '#' + targetId);
        // 點擊後關閉 nav
        document.querySelector('nav').classList.remove('show');
      }
    });
});
// 里程碑drag滑動
const wrapper = document.querySelector('.drag-wrapper');

let isDown = false;
let startX;
let scrollLeft;

wrapper.addEventListener('mousedown', (e) => {
  isDown = true;
  startX = e.pageX;
  scrollLeft = wrapper.scrollLeft;
});

wrapper.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  wrapper.scrollLeft = scrollLeft - (e.pageX - startX);
});

['mouseup', 'mouseleave'].forEach(evt =>
  wrapper.addEventListener(evt, () => isDown = false)
);

// 影片區slider
$('#video .video-group').slick({
  slidesToShow: 2,
  centerMode: false,
  dots: true, //顯示輪播圖片會顯示圓圈
  infinite: true, //重覆輪播
  speed: 700,
  cssEase: 'linear',
  arrows: false, //false隐藏左右按钮
  autoplay: false,
  autoplaySpeed: 2000,
  initialSlide: 0, //滑動開始0為第一張
  responsive: [
    {
      breakpoint: 799,
      settings: {
        slidesToShow: 1.08,
      }
    }
  ]
});
// 文章區slider
$('#article .article-group').slick({
  slidesToShow: 2.7,
  centerMode: false,
  dots: true, //顯示輪播圖片會顯示圓圈
  infinite: true, //重覆輪播
  speed: 700,
  cssEase: 'linear',
  arrows: false, //false隐藏左右按钮
  autoplay: false,
  autoplaySpeed: 2000,
  initialSlide: 0, //滑動開始0為第一張
  responsive: [
    {
      breakpoint: 799,
      settings: {
        slidesToShow: 1.02,
      }
    }
  ]
});