<?php
include_once './common.php';
?>
<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title><?= $eventSetting->meta_title ?></title>
  <meta name="author" content="<?= $eventSetting->author ?>" />
  <meta name="copyright" content="Hearst Magazines Taiwan" />
  <meta name="keywords" content="<?= $eventSetting->meta_keywords ?>" />
  <meta name="description" content="<?= $eventSetting->meta_description ?>" />
  <meta property="minisite_type" content="<?= $eventSetting->minisite_type ?>" />
  <meta name="event_id" content="<?= $event_id ?>" />
  <!-- FB Open Graphic -->
  <meta property="fb:app_id" content="<?= $eventSetting->fb_app_id ?>" />
  <meta property="og:title" content="<?= $eventSetting->meta_title ?>" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="<?= $eventSetting->og_image ?>" />
  <meta property="og:url" content="<?= $eventSetting->url ?>" />
  <meta property="og:site_name" content="<?= $eventSetting->site_name ?>" />
  <meta property="og:description" content="<?= $eventSetting->meta_description ?>" />
  <link rel="image_src" type="image/jpeg" href="<?= $eventSetting->og_image ?>" />
  <!-- Favicons -->
  <link rel="shortcut icon" type="image/x-icon" href="<?= $eventSetting->favicon ?>" />
  <!-- css -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" />
  <link rel="stylesheet" href="https://event.hearst.com.tw/common_support/css/font.css" />
  <link rel="stylesheet" href="css/aos.css">
  <link rel="stylesheet" href="slick/slick-theme.css">
  <link rel="stylesheet" href="css/slick.css">
  <link rel="stylesheet" href="scss/common.min.css">
  <link rel="stylesheet" href="scss/index.min.css">
  <!-- js -->
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
  <!-- <script type="text/javascript" src="js/rem.js"></script> -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js" integrity="sha512-jNDtFf7qgU0eH/+Z42FG4fw3w7DM/9zbgNPe3wfJlCylVDTT3IgKW5r92Vy9IHa6U50vyMz5gRByIu4YIXFtaQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>
<body data-page="home">
  <!-- wrapper start -->
  <div class="wrapper">
    <!-- Header / Nav（共用） -->
    <div id="header"></div>
    <!-- 跑馬燈（共用） -->
    <div id="marquee"></div>

    <!-- 浮動報名按鈕（共用） -->
    <div id="fixed-cta"></div>

    <!-- ===== 首頁內容開始 ===== -->
    <main id="home">
      <!-- KV -->
      <section class="kv">
        <div class="container">
          <div class="h1" data-aos="fade-down" data-aos-duration="800">
            <h1>2026台北花伴野餐</h1>
          </div>
        </div>
      </section>
      <!-- about -->
      <section class="about" id="about">
        <div class="container">
          <h2 data-aos="fade-up" data-aos-duration="800"><span>About Taipei Floral Picnic</span></h2>
          <div class="text" data-about-html data-aos="fade-down" data-aos-duration="800"></div>
        </div>
      </section>
      <!-- timetable -->
      <section class="timetable" id="timetable">
        <div class="container">
          <h2 data-aos="fade-up" data-aos-duration="800"><span>三大野餐區總時間表</span></h2>
          <div class="card" data-aos="fade-down" data-aos-duration="800">
            <div data-timetable></div>
            <div class="cta">
              <a class="btn-primary" target="_blank" rel="noopener noreferrer" data-timetable-cta>
                <span class="btn-text"></span>
                <span class="btn-icon" aria-hidden="true"></span>
              </a>
            </div>
          </div>
        </div>
      </section>
      <!-- video -->
      <section class="video" id="video">
        <div class="container">
          <h2 data-aos="fade-up" data-aos-duration="800"><span>宣傳影片</span></h2>
          <div class="card" data-aos="fade-down" data-aos-duration="800">
            <div style="position: relative; width: 100%;" class="ytiframe-container">
              <!-- <div class="play"></div>
              <img src="images/mv_iframe.jpg" alt="Background image" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;">
              <video id="my-video" autoplay controls playsinline muted loop style="width: 100%;">
                <source src="https://www.youtube.com/watch?v=ZjJj47N8NIM" type="video/mp4" />
                Your browser does not support the video tag.
              </video> -->
              <iframe width="560" height="315" src="https://www.youtube.com/embed/ZjJj47N8NIM?autoplay=1&mute=1&loop=1&playlist=ZjJj47N8NIM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <!-- <script>
              const playButton = document.querySelector(".play");
              const video = document.getElementById("my-video");
              playButton.addEventListener("click", () => {
                video.play();
                playButton.style.display = "none";
              });
            </script> -->
          </div>
        </div>
      </section>
      <!-- news -->
      <section class="news" id="news">
        <div class="container">
          <h2 data-aos="fade-up" data-aos-duration="800"><span>最新消息</span></h2>
          <div class="content" data-aos="fade-down" data-aos-duration="800">
            <ul class="news-list" data-news-list></ul>
            <div class="news-more">
            <div type="button" class="btn-primary" data-news-more>
              <span class="btn-text"></span>
              <span class="btn-icon" aria-hidden="true"></span>
            </div>
            <div class="deco"></div>
          </div>
          </div>
        </div>
      </section>
      <!-- access -->
      <section class="access" id="access">
        <div class="container">
          <h2 data-aos="fade-up" data-aos-duration="800"><span>活動地圖與交通資訊</span></h2>
          <div class="content" data-aos="fade-down" data-aos-duration="800" data-access></div>
          <div class="deco"></div>
        </div>
      </section>
    </main>

    <!-- FOOTER（共用） -->
    <div id="footer"></div>
  </div>
  <!-- wrapper end -->
  <script src="./js/init.js" type="module"></script>
  <script type="text/javascript" src="js/jquery.easing.min.js"></script>
  <script type="text/javascript" src="js/aos.js"></script>
  <script>
    AOS.init({
        offset: 60,
        duration: 1000,
        easing: "ease",
    });
  </script>

  <?php $eventSetting->getTracker(); ?> 
</body>
</html>