<?php
include_once './common.php';
?>
<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <!-- <title><?= $eventSetting->meta_title ?></title> -->
  <title>【ELLE 2026美妝之星】美妝種子限時招募中！加入美的認知計畫，再抽限量好禮</title>
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
  <link rel="stylesheet" href="scss/index.min.css">
  <!-- js -->
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
  <script type="text/javascript" src="js/rem.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js" integrity="sha512-jNDtFf7qgU0eH/+Z42FG4fw3w7DM/9zbgNPe3wfJlCylVDTT3IgKW5r92Vy9IHa6U50vyMz5gRByIu4YIXFtaQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>
<body>
  <!-- wrapper start -->
  <div class="wrapper">
    <div class="bg" data-aos="custom-anim1" data-aos-duration="600"></div>
    <!-- main content start -->
    <section class="main">
        <div class="container">
          <!-- 照片 -->
          <div class="photo" data-aos="custom-anim1" data-aos-duration="600"><img src="images/entro_photo-apng.png" alt=""></div>
          <!-- 裝飾們 -->
          <div class="decos">
            <img src="images/lips1.png" alt="" class="lips lips_1">
            <img src="images/lips2.png" alt="" class="lips lips_2">
            <img src="images/lips3.png" alt="" class="lips lips_3">
            <img src="images/post-it_left.png" alt="" class="post-it post-it_left">
            <img src="images/post-it_right.png" alt="" class="post-it post-it_right">
            <img src="images/post-it_down.png" alt="" class="post-it post-it_down">
          </div>
          <!-- 美妝之星logo -->
          <div class="logo" data-aos="fade-up" data-aos-duration="800"><h1>2026美妝之星</h1></div>
          <!-- 按鈕便利貼們 -->
          <div class="post-its">
            <!-- GO美妝種子 -->
            <div class="post-it-card beautystar">
              <a href="beautystar.php" target="_blank"></a>
            </div>
            <!-- GO美的意識大調查 -->
            <div class="post-it-card beautyaction">
              <img src="images/entro_bubble.png" alt="" class="post-it-card_bubble">
              <a href="beautyaction.php" target="_blank"></a>
            </div>
          </div>
        </div>
    </section>
    <!-- main content end -->
    <section class="footer">
      <img src="images/footer.png" alt="ELLE BEAUTY STAR AWARDS 2026">
    </section>
  </div>
  <!-- wrapper end -->
  <script type="text/javascript" src="js/jquery.easing.min.js"></script>
  <script type="text/javascript" src="js/aos.js"></script>
  <script>
    AOS.init({
        offset: 60,
        duration: 1000,
        easing: "ease",
    });
  </script>
</body>
</html>