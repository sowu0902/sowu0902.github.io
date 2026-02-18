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
  <link rel="stylesheet" href="scss/page.min.css">
  <!-- js -->
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
  <!-- <script type="text/javascript" src="js/rem.js"></script> -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js" integrity="sha512-jNDtFf7qgU0eH/+Z42FG4fw3w7DM/9zbgNPe3wfJlCylVDTT3IgKW5r92Vy9IHa6U50vyMz5gRByIu4YIXFtaQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>
<body data-page="run">
  <!-- wrapper start -->
  <div class="wrapper">
    <!-- Header / Nav（共用） -->
    <div id="header"></div>
    <!-- 跑馬燈（共用） -->
    <div id="marquee"></div>

    <!-- 浮動報名按鈕（共用） -->
    <div id="fixed-cta"></div>

    <!-- ===== 本頁內容開始 ===== -->
    <main id="run">
        <!-- KV -->
        <section class="section-kv" data-page-kv data-kv-theme>
          <div class="kv-bg section-bg">
            <picture>
              <source media="(max-width: 750px)" data-src-mobile />
              <img data-src-desktop alt="">
            </picture>
          </div>
          <div class="h1" data-aos="fade-down" data-aos-duration="800">
            <picture class="kv-title">
              <source media="(max-width: 750px)" data-title-mobile />
              <img data-title-desktop alt="">
            </picture>
          </div>
        </section>
        
        <!-- 前言 intro -->
        <section class="section-intro" data-page-intro>
          <div class="intro-bg section-bg">
            <picture>
              <source media="(max-width: 750px)" data-bg-mobile />
              <img data-bg-desktop alt="">
            </picture>
          </div>

          <div>
            <div class="intro-text" data-aos="fade-up" data-aos-duration="800" data-intro-text></div>

            <a class="intro-btn btn-primary" data-aos="fade-up" data-aos-duration="800" data-intro-cta>
              <span class="btn-text"></span>
              <span class="btn-icon" aria-hidden="true"></span>
            </a>
          </div>
        </section>

        <!-- rule -->
        <section class="section-rule" data-page-rule>
          <div class="rule-bg section-bg">
            <picture>
              <source media="(max-width: 750px)" data-bg-mobile />
              <img data-bg-desktop alt="">
            </picture>
          </div>

          <div class="container">
            <div class="rule-title section-title" data-aos="fade-down" data-aos-duration="800">
              <picture>
                <source media="(max-width: 750px)" data-title-mobile />
                <img data-title-desktop alt="">
              </picture>
            </div>

            <!-- blocks render here -->
            <div class="rule-blocks" data-aos="fade-up" data-aos-duration="800" data-rule-blocks></div>
          </div>
        </section>


        <!-- 圖文資訊區塊 info -->
        <section class="section-info" data-page-info>
          <div class="container info-inner" data-aos="fade-up" data-aos-duration="800">
              <div class="info-title section-title" data-aos="fade-down" data-aos-duration="800">
                <picture>
                  <source media="(max-width: 750px)" data-title-mobile />
                  <img data-title-desktop alt="">
                </picture>
              </div>
              <ul class="info-cards small-cards" data-cards></ul>
          </div>
        </section>

      </main>

    <!-- FOOTER（共用） -->
    <div id="footer"></div>
  </div>
  <!-- wrapper end -->
  <!-- popup -->
  <div class="popup" data-popup hidden>
    <div class="popup-mask" data-popup-close></div>

    <div class="popup-wrapper">
      <div class="popup-deco">
        <picture>
          <source media="(max-width: 750px)" srcset="./images/common/popup-deco-mb.png">
          <img src="./images/common/popup-deco.png" alt="">
        </picture>
      </div>
      <button class="popup-close" data-popup-close></button>
      <div class="popup-content">
        <div class="img">
          <img class="popup-img" alt="">
          <!-- this page only -->
          <img class="popup-logo" alt="">
        </div>
        <div class="txt">
          <h3 class="popup-title"></h3>
          <p class="popup-desc"></p>

          <a class="popup-cta btn-primary" target="_blank">
            <span class="btn-text" data-i18n="cta.register">立即前往報名</span>
            <span class="btn-icon"></span>
          </a>
        </div>
        
      </div>
    </div>
  </div>

  <script type="module" src="./js/init-page.js"></script>
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