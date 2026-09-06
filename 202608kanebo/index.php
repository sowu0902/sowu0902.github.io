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
  <link rel="stylesheet" href="scss/index.min.css">
  <!-- js -->
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
  <script type="text/javascript" src="js/rem.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js" integrity="sha512-jNDtFf7qgU0eH/+Z42FG4fw3w7DM/9zbgNPe3wfJlCylVDTT3IgKW5r92Vy9IHa6U50vyMz5gRByIu4YIXFtaQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>
<body>
  <!-- wrapper start -->
  <div class="wrapper">
    <div class="bg"></div>
    <!-- kv start -->
    <section class="kv" id="kv">
      <div class="container">
        <div class="top_area">
          <img src="images/kv/logo@2x.png" alt="I HOPE. KANEBO" class="logo" data-aos="fade-up" data-aos-duration="800">
          <img src="images/kv/slogan@2x.png" alt="獨家胎脂養膚科技 凝萃精華保養系列 新品上市" class="slogan" data-aos="fade-down" data-aos-duration="800">
        </div>
        <div class="bottom_area" data-aos="fade-down" data-aos-duration="800">
          <div class="text text--center margin_bottom--30">
            <p>募集潤光美肌大使參與新品搶先體驗發表會</p>
          </div>
          <div class="cta" data-href="data">
            <span>立即報名專屬席位</span>
          </div>
        </div>
      </div>
    </section>
    <!-- kv end -->
    <!-- info start -->
    <section class="info" id="product">
      <div class="container">
        <div class="title-1 title_area">
          <h2 class="margin_bottom--40" data-aos="fade-up" data-aos-duration="800">
            <img src="images/info/KANEBO_logo.png" alt="KANEBO">
            凝萃潤光保養系列
          </h2>
          <div class="subtitle margin_bottom--60 margin_top--30" data-aos="fade-down" data-aos-duration="800">
            <img src="images/info/subtitle@2x.png" alt="42秒精準手舞，重塑未來肌 7 天深層有感・42 天煥然一新">
          </div> 
        </div>

        <!-- 胎脂與KANEBO養膚哲學 -->
        <div class="content-1 content_area content_info-block" data-aos="fade-up" data-aos-duration="800">
          <div class="text">
            <h3 class="white">胎脂與KANEBO養膚哲學</h3>
            <p>
              「你知道嗎？寶寶在媽媽肚子裡、皮膚還沒發育完全時，就有一層神奇的『胎脂』，養護著初生的肌膚！
              <br>
              這層天然屏障能鎖住水分、抵禦外界刺激。」
            </p>
          </div>
          
        </div>

        <!-- TAISHI Lipo 胎脂概念成份 -->
        <div class="content-2 content_area content_info-block" data-aos="fade-up" data-aos-duration="800">
          <div class="text">
            <h3>
              <span class="trademark">TAISHI</span> Lipo 
              <br>
              胎脂概念成份
            </h3>
            <p>胎脂是世界上最完美的高保濕修護膜，富含高濃度神經醯胺，KANEBO歷經數十年獨家研發，將胎脂強大的修護概念注入保養中，完美模擬胎脂高親膚、極保濕的特性，讓肌膚從容面對現代生活的各種壓力。</p>
          </div>
          <img src="images/info/block2_img.png" alt="">
        </div>

        <!-- 凝萃潤光乳 -->
        <div class="content-3 content_area content_product-block">
          <div class="text" data-aos="fade-up" data-aos-duration="800">
            <h3>凝萃潤光乳</h3>
            <p>
              為肌膚充滿水潤彈力
              <br>
              打造盈滿笑容印象的美容乳液
            </p>
          </div>          
          <div class="video padding_top--20 padding_bottom--20" data-aos="fade-up" data-aos-duration="800">
            <div class="video_box">
            <div style="position: relative; width: 100%;">
              <div class="play"></div>
              <!-- <img src="images/info/video-img.jpg" alt="Background image" style="position: absolute; top: 0; left: 0; width: 100%; height: auto; z-index: -1;"> -->
              <video id="my-video" autoplay controls playsinline muted loop style="width: 100%;">
                <source src="kanebo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <script>
              const playButton = document.querySelector(".play");
              const video = document.getElementById("my-video");
              playButton.addEventListener("click", () => {
                video.play();
                playButton.style.display = "none";
              });
            </script>
            </div>
          </div>
          <div class="text" data-aos="fade-down" data-aos-duration="800">
            <p>
              <span class="bigger">獨家胎脂概念成分「<span class="darker"><span class="trademark">TAISHI</span> Lipo b</span>」</span>
              <br>
              搭載<span class="bigger darker">豐潤滿盈技術</span>，有助淡化細紋
            </p>
          </div>
        </div>

        <!-- 凝萃潤光霜 -->
        <div class="content-4 content_area content_product-block">
          <div class="text" data-aos="fade-up" data-aos-duration="800">
            <h3>凝萃潤光霜</h3>
            <p>
              翌日清晨仍綻放光采
              <br>
              打造緊緻水潤、盈透美肌的乳霜
            </p>
          </div>          
          <div class="text bottom_area" data-aos="fade-down" data-aos-duration="800">
            <p>
              <span class="bigger">獨家胎脂概念成分「<span class="darker"><span class="trademark">TAISHI</span> Lipo a</span>」</span>
              <br>
              搭載<span class="bigger darker">緊實塑帶技術</span>，感受輪廓緊實彈力
            </p>
          </div>
        </div>
        
        <!-- 發光奇蹟再翻倍 -->
        <div class="content-5 content_area content_special-block">
          <div class="title-wrap">
            <div class="text">
              <h3>發光奇蹟再翻倍</h3>
            </div>
            <span class="star"></span>
          </div>
          <div class="text margin_top--30" data-aos="fade-up" data-aos-duration="800">
            <p>
              獨家「<span class="bigger darker">42秒微笑拉提</span>」保養手舞
              <br>
              水潤透亮<span class="icon-and"></span>緊緻拉提
              <br>
              全面提升肌膚光采印象
            </p>
          </div>
          
        </div>
      </div>
    </section>
    <!-- info end -->
    <!-- data start -->
    <section class="data" id="data">
      <div class="container">
        <div class="data-infobox">
          <div class="top-text">
            <h2 data-aos="fade-up" data-aos-duration="800">KANEBO凝萃潤光系列<span>新品美肌體驗會</span></h2>
            <div class="date" data-aos="fade-down" data-aos-duration="800">
              <img src="images/data/date.png" alt="10/2 FRI. 16:00-17:30">
            </div>
            <div class="address padding_top--10" data-aos="fade-down" data-aos-duration="800">
              <p>
                Rendezvous 秘點
                <small>臺北市復興北路141 巷 6 弄 9 號</small>
              </p>
            </div>
          </div>
          <div class="bottom-text" data-aos="fade-up" data-aos-duration="800">
            <p>
              <strong>馬上報名成為潤光美肌大使</strong>
              出席新品體驗發表會
            </p>
          </div>
        </div>
        <div class="data-content" data-aos="fade-up" data-aos-duration="800">
          <div class="top-text margin_bottom--40 margin_left--30 margin_right--30 padding_top--40 padding_bottom--40">
            <p>
              先回答幾個問答，<br>
              讓我們了解您目前的肌膚狀態與保養需求。<br>
              若符合條件，我們將<br>
              <strong>現場體驗全新凝萃潤光系列商品<br>享受專業居家SPA保養手法</strong>
              並可獲得保養正貨體驗禮！
            </p>
            <p>
              <small>＊填寫前請先確認個人Instagram為公開帳號且粉絲數高於5000人，入選後能配合出席實體活動，並於活動結束後於個人社群發布1篇現場體驗圖文心得。</small>
            </p>
          </div>
          <div class="data-area margin_left--30 margin_right--30">
            <!-- 套用表單區 開始 -->
            <div class="data_group">
              <p class="tetris" data-id="<?= $tetris_id ?>" data-new-style="1" data-theme="event-theme">Loading...</p>
              <!-- <script src="<?= TETRIS_SERVER ?>app.js"></script>
              <?php
              if (isset($_GET['debug']) && $_GET['debug']) {
                echo '<script type="text/javascript" src="'. TETRIS_SERVER .'debug.js"></script>';
              }
              ?> -->
            </div>
            <!-- 套用表單區 結束 -->
          </div>
          <div class="data-notice margin_top--40 margin_left--20 margin_right--20 margin_bottom--20 padding_left-right--40 padding_top--30 padding_bottom--30">
            <p>注意事項：</p>
            <ol>
              <li>本活動每人限報名乙次，重複申請者系統將自動篩除，不另行通知。</li>
              <li>送出前請確認您的手機門號正確無誤，且可接受廣告簡訊，獲得試用機會者將以簡訊告知。</li>
              <li>本活動限台灣地區居民參加，僅限寄送至台灣本島及澎湖、金門、馬祖地區。</li>
              <li>收到簡訊後，請交付櫃點服務人員按下兌換鈕方才完成兌換。</li>
              <li>ELLE與佳麗寶化粧品集團保留最終修改、取消、停止本活動權利。送出資料前，請詳閱隱私權條款。</li>
            </ol>
          </div>
        </div>
        <div class="elle">
          <img src="images/data/logo-elle@2x.png" alt="ELLE">
        </div>
      </div>
    </section>
    <!-- data end -->
  </div>
  <!-- wrapper end -->
  <script type="text/javascript" src="js/jquery.easing.min.js"></script>
  <script type="text/javascript" src="js/aos.js"></script>
  <script src="js/index.js"></script>
  <script type="module" src="js/render.js"></script>
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