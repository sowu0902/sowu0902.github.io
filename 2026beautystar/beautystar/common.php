<?php
require $_SERVER['DOCUMENT_ROOT'] . '/../app/HearstEventSetting.php';

if (!DEVELOPMENT) {
  // 正式機
  $event_id = 2508;
} else {
  // 測試機
  $event_id = 2320;
}

$eventSetting = new HearstEventSetting($event_id, __FILE__);
$eventSetting->og_image = "{$eventSetting->current_url}images/fb.jpg";

if (!DEVELOPMENT && $_SERVER['SERVER_NAME'] != 'localhost') {
  //正式機
  $tetris_id = 'b19e2288-6d5d-4644-857a-09c426574678';
} else {
  // 測試機
  $tetris_id = '0a664e13-fd23-43a2-879d-467b9516ea90';
}