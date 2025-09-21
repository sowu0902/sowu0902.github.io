// 引用Aos動態
AOS.init();

// header 變色
window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  if (!header) return;
  if (window.scrollY > window.innerHeight) {
    header.classList.add('fixed');
  } else {
    header.classList.remove('fixed');
  }
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

// 
document.addEventListener('mousemove', function(e) {
  const bg1 = document.querySelector('.author .bg1');
  const bg2 = document.querySelector('.author .bg2');
  if (!bg1) return;
  if (!bg2) return;
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  // 計算滑鼠 X/Y 位置佔視窗的百分比
  const percentX = e.clientX / winW;
  const percentY = e.clientY / winH;
  // 最大移動距離
  const maxMoveX = 40;
  const maxMoveY = 20;
  // 計算要移動的 X/Y 值
  const moveX1 = (percentX - 0.5) * -1 * maxMoveX;
  const moveY1 = (percentY - 0.5) * -1 * maxMoveY;
  const moveX2 = (percentX - 0.5) * maxMoveX;
  const moveY2 = (percentY - 0.5) * maxMoveY;
  bg1.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
  bg2.style.transform = `translate( ${moveX2}px, ${moveY2}px)`;
});