const iframe = document.querySelector('#contentIframe');

  window.addEventListener('message', event => {
    // 驗證訊息確實來自 iframe 網域
    if (event.origin !== 'https://sowu0902.github.io/') {
      return;
    }

    if (
      event.data?.type === 'iframeResize' &&
      Number.isFinite(event.data.height)
    ) {
      iframe.style.height = `${event.data.height}px`;
    }
  });