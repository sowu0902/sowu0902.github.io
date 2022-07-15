$(document).ready(function() {
//preload
$(window).load(function() { // makes sure the whole site is loaded
			$('#status').fadeOut(); // will first fade out the loading animation
			$('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
			$('body').delay(350).css({'overflow':'visible'});
});







$('.scroll_btn').click(function(){
    var ta_value = $(this).attr('data');
    $('html,body').animate({scrollTop:$(ta_value).offset().top}, 400); 
    // $("html,body").animate({scrollTop:$('#sec2').offset().top}, 400);
});
// $('#NAV .scroll_btn').click(function(){
//     $('#NAV').removeClass('reveal');
//     $('#nav-icon3').removeClass('open');
// });

function resize_layout(){
	var window_width = $(window).outerWidth();
    var window_height = $(window).outerHeight();
	
	// $('#width_num').html(window_width);
	// $('#height_num').html(window_height);

  
var born_chart_wrap_height = $('.chart_body').outerHeight();
  $('.chart_content_wrap').height(born_chart_wrap_height);

    if(window_width< 640){

        $('.text_flip').width(window_width);
    

        $('.friedman_cover img').each(function(){

            var rpc_img = $(this).attr('data');
            $(this).attr('src', rpc_img)

        });


        $('.brand_cover img').each(function(){

            var rpc_img = $(this).attr('data');
            $(this).attr('src', rpc_img)

        });




    }else{



  var wang_wrap_height = $('.wang_profolio').outerHeight();
  $('.wang_info_box').height(wang_wrap_height);

    }






    var coverflow = $("#flipster").flipster({
        scrollwheel: false,
        loop: true,
        start: 0,
        nav: true
    });


$('.famous_prev').click(function(){ 
    coverflow.flipster('prev');
});
$('.famous_next').click(function(){ 
      coverflow.flipster('next');
});




}



/**init**/
resize_layout();

/**resize**/
$(window).resize(function() {
	
  resize_layout();

});




//goTop

$(window).scroll(function(){
		// if ($(this).scrollTop() > 100) {
		// 	$('.goTop').fadeIn();
		// } else {
		// 	$('.goTop').fadeOut();
		// }



  var kv_height = $('#kv').outerHeight();
  var headerHeight = $('#HEADER').outerHeight();
  if($(this).scrollTop() >= headerHeight){
      $('#HEADER').addClass('reveal');
  }else{
      $('#HEADER').removeClass('reveal');
  }


	});
	
//Click event to scroll
	// $('.goTop').click(function(){
	// 	$('html, body').animate({scrollTop : 0},800);
	// 	return false;
	// });

    $(".kv_bg_mb").imagesLoaded(function() {
      $(".kv_bg_mb").imagefill(); 
  });

 $(".wang_bg").imagesLoaded(function() {
      $(".wang_bg").imagefill(); 
  });
  $(".born_bg").imagesLoaded(function() {
      $(".born_bg").imagefill(); 
  });







    var friedmanSlider = $("#friedman_slider").lightSlider({
        item:1,
        adaptiveHeight: false,
        slideMargin:0,
        loop:true,
        // auto:true,
        pager:true,
        enableTouch:false,
        enableDrag:false,
        controls:false,
        pause: 3000,
        speed: 1000,
        responsive : [
            {
                breakpoint:680,
                settings: {
                  enableTouch:true,
                    enableDrag:true,
                  }
            }
        ]
    });



   

$('.friedman_prev').on('click', function () {
    friedmanSlider.goToPrevSlide();
});
$('.friedman_next').on('click', function () {
    friedmanSlider.goToNextSlide();
});






    var wangSlider = $("#wang_slider").lightSlider({
        item:1,
        adaptiveHeight:true,
        slideMargin:0,
        loop:true,
        // auto:true,
        pager:true,
        enableTouch:false,
        enableDrag:false,
        controls:false,
        pause: 3000,
        speed: 1000,
        responsive : [
            {
                breakpoint:680,
                settings: {
                  enableTouch:true,
                    enableDrag:true,
                  }
            }
        ]
    });

   

$('.wang_prev').on('click', function () {
    wangSlider.goToPrevSlide();
});
$('.wang_next').on('click', function () {
    wangSlider.goToNextSlide();
});





    var brandSlider = $("#brand_slider").lightSlider({
        item:1,
        adaptiveHeight:true,
        slideMargin:0,
        loop:true,
        // auto:true,
        pager:true,
        enableTouch:false,
        enableDrag:false,
        controls:false,
        pause: 3000,
        speed: 1000,
        responsive : [
            {
                breakpoint:680,
                settings: {
                    enableTouch:true,
                    enableDrag:true,
                  }
            }
        ]
    });

   

$('.brand_prev').on('click', function () {
    brandSlider.goToPrevSlide();
});
$('.brand_next').on('click', function () {
    brandSlider.goToNextSlide();
});


 

    var maSlider = $("#magazine_slider").lightSlider({
        item:1,
        adaptiveHeight:true,
        slideMargin:0,
        loop:true,
        // auto:true,
        pager:true,
        enableTouch:false,
        enableDrag:false,
        controls:false,
        pause: 3000,
        speed: 1000,
        responsive : [
            {
                breakpoint:680,
                settings: {
                    enableTouch:true,
                    enableDrag:true,
                  }
            }
        ]
    });

   

$('.ma_prev').on('click', function () {
    maSlider.goToPrevSlide();
});
$('.ma_next').on('click', function () {
    maSlider.goToNextSlide();
});



    var famousSlider = $("#famous_slider").lightSlider({
        item:1,
        adaptiveHeight:true,
        slideMargin:0,
        loop:true,
        // auto:false,
        pager:true,
        enableTouch:false,
        enableDrag:false,
        controls:false,
        pause: 3000,
        speed: 1500,
        responsive : [
            {
                breakpoint:680,
                settings: {
                    enableTouch:true,
                    enableDrag:true,
                  }
            }
        ]
    });

   

$('.famous_prev2').on('click', function () {
    famousSlider.goToPrevSlide();
});
$('.famous_next2').on('click', function () {
    famousSlider.goToNextSlide();
});






//rwd menu


// var navlist = [];
// $("nav div").each(function(i) {
//     var thisLink = $(this);
//     var thisId = thisLink.attr('data');
//     var thisTarget = $(thisId);
//     navlist.push({
//         'anchor': thisLink,
//         'id': thisId,
//         'target': thisTarget
//     });
//     //console.log(navlist);
//     thisLink.on('click', function(e) {
//         e.preventDefault();
//         $('html, body').animate({
//             scrollTop: thisTarget.offset().top + 60
//         }, 800);
//        $('#NAV').toggleClass('reveal');
//        $('#nav-icon3').toggleClass('open');
//     });
// });


var green_box_arr = [ ".green_box_fadeIn1", ".green_box_fadeIn2" ];

             var height_arr =[
              "96.0%",
              "94.87%",
              "88.60%",
              "84.60%",
              "79.61%",
              "70.68%",
              "71.84%",
              "78.60%",
              "72.15%",
              "77.05%",
              "73.75%",
              "73.68%",
              "74.64%",
              "73.99%",
              "75.60%",
              "74.62%",
              "74.73%",
              "61.56%",
              "64.51%",
              "69.73%",
              "58.88%",
              "55.78%",
              "50.84%",
              "48.27%",
              "45.71%",
              "45.38%",
              "45.37%",
              "44.00%",
              "42.20%",
              "36.30%",
              "43.49%",
              "51.42%",
              "44.09%",
              "46.81%",
              "47.59%",
              "46.34%",
              "42.81%",
              "39.86%",
              "38.93%"];


   var start_time = 0;   


$(window).on('scroll', function(e) {
    // $.each(navlist, function(e, elem) {
    //     var placement = elem.target[0].getBoundingClientRect();
    //     if( placement.top<window.innerHeight && placement.bottom>0 ) {
    //         history.pushState({}, '', elem.id);
    //         // $(elem.id).addClass('show')
    //         // $(elem.id).find('.slider_green_box').addClass('show');
    //         //console.log('Hash: ' + elem.id);
    //         return false; /* Exit $.each loop */
    //     };
    // });
  
    $('.intro_ani').each(function(){
        var scrol_view_screen_height = $(window).outerHeight() / 2;
        var placement = $(this).get(0).getBoundingClientRect();
        if( placement.top + scrol_view_screen_height < window.innerHeight && placement.bottom>0 ) {
            $('.motion_fix_container').addClass('active');
        }else{
            $('.motion_fix_container').removeClass('active');
        };
   });

    $(function(){
        var scrol_view_screen_height = $(window).outerHeight() / 2;
        var placement = $('.wangAni').get(0).getBoundingClientRect();
        if( placement.top + scrol_view_screen_height < window.innerHeight && placement.bottom>0 ) {
            $('.motion_fix_container2').addClass('active');
        }else{
            $('.motion_fix_container2').removeClass('active');
        };
   });


 

   $('.scroll_fadeIn').each(function(){
        var scrol_view_screen_height = $(window).outerHeight()/2;
        var placement = $(this).get(0).getBoundingClientRect();
        if( placement.top + scrol_view_screen_height < window.innerHeight && placement.bottom>0 ) {
            $(this).addClass('show');
        }else{
           $(this).removeClass('show');
        };
   });
  

   

   $('.green_box_fadeIn').each(function(){
        var scrol_view_screen_height = $(window).outerHeight() / 2;
        var placement = $(this).get(0).getBoundingClientRect();
        if( placement.top + scrol_view_screen_height <window.innerHeight && placement.bottom>0 ) {
            $(this).find('.slider_green_box').addClass('show');
        }else{
           $(this).find('.slider_green_box').removeClass('show');
        };
   });




   $(function(){
        var scrol_view_screen_height = $(window).outerHeight() / 2;
        var placement = $('.born_ani_sec').get(0).getBoundingClientRect();



        if( placement.top + scrol_view_screen_height <window.innerHeight && placement.bottom>0 ) {
          runChart();
 
        }else{

          $('.born_vor_bar').stop();
          $('.born_vor_bar').css('height', '0%');

        };


        function runChart(){

             

              for (var i = 0; i < 39; i++) {
                  var delay_time = start_time + (i * 10)
                  $('.born_vor_bar').eq(i).delay(delay_time).animate({
                  height: height_arr[i]
                  }, 1000);
              }

        }

   });




   $(function(){
        var salaryTa = $('.salary_ani');
        var scrol_view_screen_height = $(window).outerHeight();
        var placement = salaryTa.get(0).getBoundingClientRect();

        // console.log(scrol_view_screen_height);
    //   console.log(placement.top);


        if( placement.top + scrol_view_screen_height < window.innerHeight && placement.bottom>0 ) {
           
          salaryTa.find('#vor_f_1').addClass('active1');
          salaryTa.find('#vor_b_1').addClass('active2');
          salaryTa.find('#vor_f_2').addClass('active3');
          salaryTa.find('#vor_b_2').addClass('active4');
          salaryTa.find('#vor_f_3').addClass('active5');
          salaryTa.find('#vor_b_3').addClass('active6');
          salaryTa.find('#vor_f_4').addClass('active7');
          salaryTa.find('#vor_b_4').addClass('active8');
          salaryTa.find('#vor_f_5').addClass('active9');
          salaryTa.find('#vor_b_5').addClass('active10');
          salaryTa.find('.vor_bar_line_mask_ani').addClass('active');
        }else{
          salaryTa.find('#vor_f_1').removeClass('active1');
          salaryTa.find('#vor_b_1').removeClass('active2');
          salaryTa.find('#vor_f_2').removeClass('active3');
          salaryTa.find('#vor_b_2').removeClass('active4');
          salaryTa.find('#vor_f_3').removeClass('active5');
          salaryTa.find('#vor_b_3').removeClass('active6');
          salaryTa.find('#vor_f_4').removeClass('active7');
          salaryTa.find('#vor_b_4').removeClass('active8');
          salaryTa.find('#vor_f_5').removeClass('active9');
          salaryTa.find('#vor_b_5').removeClass('active10');
          salaryTa.find('.vor_bar_line_mask_ani').removeClass('active');
        };
   });
   



});




$(".vor_back").hover(function(){
    $(this).parent('.vor_item').css('z-index','4').siblings('.vor_item').css('z-index','3');
    $(this).find('.detail_info').addClass('reveal');
},function(){
    $(this).find('.detail_info').removeClass('reveal');
});



// $('.NAV_btn_wrap').on('click', function(e) {
//       e.stopPropagation();
//       $('#nav-icon3').toggleClass('open');
// 	    $('#NAV').toggleClass('reveal');
//     });


    


    $(document).on('click','.detail_info', function() {
       $('.detail_info').removeClass('reveal');
    });








});