const updateFontSize = (() => {
  return () => {
    let fontSize = 16;
    if (window.innerWidth < 828) {
      fontSize = (16 * window.innerWidth) / 828;
    }
    document.documentElement.style.setProperty('--remBasicSize', fontSize + 'px');
  };
})();

updateFontSize();
window.addEventListener("resize", updateFontSize);
