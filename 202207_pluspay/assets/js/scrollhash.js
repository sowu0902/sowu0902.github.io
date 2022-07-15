$(function () {
  var currentHash = "#";
  var blocksArr = jQuery(".label");
  var get_url_year = window.location.href.slice(window.location.href.indexOf('story/') + 1).split('/');
  var _getyear = get_url_year[1];
  let pushtag = _getyear;
  // 判別目前是不是1981-2020
  let numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
  if(numberRegex.test(_getyear)){
      // console.log("是1981-2020")
      // 是1981-2020
      // let pushtag = _getyear;
  } else if (_getyear.includes("pre")) {
    // console.log("是pre")
  } else {
      // console.log("是特企")
      // 是特企
      pushtag = $(".story_kv .year").attr("data-num"); 
  }
  // console.log(_getyear);
  $(document).scroll(function () {
    var currentTop = window.pageYOffset / 1;
    for (var i = 0; blocksArr.length; i++) {
      var currentElementTop = $(blocksArr[i]).offset().top - 1;
      // console.log(currentElementTop);
      var hash = jQuery(blocksArr[i]).attr('id');
      if (currentElementTop <= currentTop && currentTop <= currentElementTop + jQuery(blocksArr[i]).height() && currentHash != hash) {
        if (history.pushState) {
          history.pushState(null, null, '#' + hash);
          // console.log(pushtag + '_scroll_' + hash);
          dataLayer.push({
            'eventCategory': '40cw',
            'eventAction': pushtag + '_scroll_' + hash,
            'eventLabel': '',
            'event': 'sendMyEvent'
          });
        } else {
          location.hash = '#' + hash;
        }
        currentHash = hash;
        // console.log(hash);
      }

    }

  });
});