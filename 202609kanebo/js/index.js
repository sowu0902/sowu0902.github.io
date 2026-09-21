document.querySelectorAll('.kv .cta').forEach(el => {
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

// feedback

async function initReviewsSlider() {

  const slider = document.querySelector(".reviews-slider");

  if (!slider) return;

  try {

    const response = await fetch("./data/reviews.json");

    if (!response.ok) {
      throw new Error("Reviews JSON 載入失敗");
    }

    const reviews = await response.json();

    if (!Array.isArray(reviews) || !reviews.length) {
      return;
    }

    // 1. 動態產生卡片
    reviews.forEach((item) => {

      const slide = document.createElement("div");
      slide.className = "reviews-slide";

      const reviewItem = document.createElement("div");
      reviewItem.className = "reviews-item";

      // 照片
      const image = document.createElement("img");
      image.className = "reviews-photo";
      image.src = item.image;
      image.alt = item.name || "";

      // 藍色卡片
      const card = document.createElement("div");
      card.className = "reviews-card";

      // 姓名
      const name = document.createElement("h3");
      name.className = "reviews-name";
      name.textContent = item.name || "";

      // 心得
      const review = document.createElement("p");
      review.className = "reviews-review";

      const fullText = item.review || "";

      // 保留完整文字供截斷計算使用
      review.dataset.fullReview = fullText;

      review.appendChild(
        document.createTextNode(fullText)
      );

      // ...more 連結
      if (item.link) {

        try {

          const url = new URL(item.link);

          if (["http:", "https:"].includes(url.protocol)) {

            const more = document.createElement("a");

            more.className = "reviews-more";
            more.href = url.href;
            more.target = "_blank";
            more.rel = "noopener noreferrer";
            more.textContent = "...more";

            review.appendChild(more);

          }

        } catch (error) {
          console.warn("無效的連結：", item.link);
        }

      }

      card.append(name, review);
      reviewItem.append(image, card);
      slide.appendChild(reviewItem);
      slider.appendChild(slide);

    });

    // 2. 初始化 Slick
    const $slider = $(slider);

    $slider.on("init reInit setPosition", function () {

      requestAnimationFrame(fitReviews);

    });

    $slider.slick({
      centerMode: true,
      centerPadding: "0",
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      infinite: reviews.length >= 4,
      initialSlide: reviews.length > 1 ? 1 : 0,
      arrows: false,
      dots: true,
      speed: 700,
      autoplay: true,
      draggable: true

    });

    // 字型載入後重新計算
    if (document.fonts) {
      document.fonts.ready.then(fitReviews);
    }

  } catch (error) {

    console.error("Reviews Slider 初始化失敗：", error);

  }

}


// 3. 將心得限制在六行以內
function fitReviews() {

  const reviews = document.querySelectorAll(
    ".reviews-slider .reviews-review"
  );

  reviews.forEach((review) => {

    const more = review.querySelector(".reviews-more");

    // 沒有 more 連結就不處理
    if (!more) return;

    const fullText = review.dataset.fullReview || "";

    const textNode = review.firstChild;

    const chars = Array.from(fullText);

    // 先還原完整文字
    textNode.nodeValue = fullText;

    // 取得實際行高
    const style = window.getComputedStyle(review);

    const lineHeight = parseFloat(style.lineHeight);

    const maxHeight = lineHeight * 6 + 1;

    // 加上 more 後仍未超過六行，不需截斷
    if (review.offsetHeight <= maxHeight) {
      return;
    }

    // 超過六行：二分搜尋可容納的字數
    let low = 0;
    let high = chars.length;

    while (low < high) {

      const mid = Math.ceil((low + high) / 2);

      textNode.nodeValue = chars
        .slice(0, mid)
        .join("")
        .trimEnd();

      const currentHeight = review.offsetHeight;

      if (currentHeight <= maxHeight) {

        low = mid;

      } else {

        high = mid - 1;

      }

    }

    // 套用截斷後的文字
    textNode.nodeValue = chars
      .slice(0, low)
      .join("")
      .trimEnd();

  });

}

initReviewsSlider();