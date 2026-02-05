// 語系 / JSON 載入
export function getLang() {
  const params = new URLSearchParams(location.search);
  return params.get('lang') || 'zh';
}

export async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}
