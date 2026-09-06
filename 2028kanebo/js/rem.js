const updateFontSize = (() => {
  return () => {
    let fontSize = 16;
    if (window.innerWidth < 750) {
      fontSize = (16 * window.innerWidth) / 750;
    }
    document.documentElement.style.setProperty('--remBasicSize', fontSize + 'px');
  };
})();

updateFontSize();
window.addEventListener("resize", updateFontSize);
