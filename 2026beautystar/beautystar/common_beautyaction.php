<?php
require $_SERVER['DOCUMENT_ROOT'] . '/../app/HearstEventSetting.php';

if (!DEVELOPMENT) {
  // 正式機
  $event_id = 2510;
} else {
  // 測試機
  $event_id = 2322;
}

$eventSetting = new HearstEventSetting($event_id, __FILE__);
$eventSetting->og_image = "{$eventSetting->current_url}images/fb_beautyaction.jpg";

if (!DEVELOPMENT && $_SERVER['SERVER_NAME'] != 'localhost') {
  //正式機
  $tetris_id = '0f329abc-5113-47d2-bcdf-64666a598e6b';
} else {
  // 測試機
  $tetris_id = 'eebf8008-2bca-4949-9bea-7ab7670230bc';
}