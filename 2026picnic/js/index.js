$(function () {
  document.querySelectorAll('.cta').forEach(el => {
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
  $('#oolang-monochrome_slider .left').slick({
    dots: false, //顯示輪播圖片會顯示圓圈
    infinite: true, //重覆輪播
    speed: 800,
    fade: true, //過場
    cssEase: 'linear',
    arrows: false, //false隐藏左右按钮
    autoplay: true,
    autoplaySpeed: 4800,
    initialSlide: 0, //滑動開始0為第一張
    swipe: false,
    pauseOnFocus: false,
    pauseOnHover: false
  });
  $('#oolang-monochrome_slider .right').slick({
    dots: false, //顯示輪播圖片會顯示圓圈
    infinite: true, //重覆輪播
    speed: 800,
    fade: true, //過場
    cssEase: 'linear',
    arrows: false, //false隐藏左右按钮
    autoplay: true,
    autoplaySpeed: 2000,
    initialSlide: 0, //滑動開始0為第一張
    swipe: false,
    pauseOnFocus: false,
    pauseOnHover: false
  });
  $('.fragrance .monochrome .slide,.fragrance .infini .slide').slick({
    dots: true, //顯示輪播圖片會顯示圓圈
    infinite: true, //重覆輪播
    speed: 1200,
    fade: true, //過場
    cssEase: 'linear',
    arrows: false, //false隐藏左右按钮
    autoplay: true,
    autoplaySpeed: 2200,
    initialSlide: 0, //滑動開始0為第一張
    swipe: true,
    // pauseOnFocus: false,
    // pauseOnHover: false
  });
})