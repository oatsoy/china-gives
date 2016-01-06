var national_total = 104226;
var current_chart;
var current_data;
var chart_data_res;
var chart_data_months_res;
var is_click_inited = false;
var is_chart_closed = false;
var currentMousePos = { x: -1, y: -1 };

var c_c_h;
var c_c_w;

function is_charts(){
  return window.location.href.indexOf("/charts") > -1;
}

function without_hash(str){
   return str.indexOf("#") > -1 ? str.split('#')[0] : str;
}

function get_param(){
   return window.location.href.indexOf("?") > -1 ? without_hash(window.location.href.split('?')[1]) : '';
}

function get_base_url(){
  return window.location.href.indexOf("?") > -1 ? window.location.href.split('?')[0] : window.location.href;
}

function get_chart_container_sizes(){
  c_c_h = $('#series_chart_div').height();
  c_c_w = $(window).width();
}

function str_starts(full, str){
  return full.slice(0, str.length) == str;
}

function arr_last(arr){
  return arr[arr.length - 1];
}

function resize_charts() {
  redraw_chart(true);
}

function map_height() {
  var map_width = $('#map').width();
  $('#map > svg').css({
    'max-height': (map_width/1.25) + 'px'
  });
}

function must_fix(){
  return $(window).scrollTop() > 40 && $(window).height() >= 600 && $(window).width() >= 768;
}

function will_fix(){
  return $(window).scrollTop() <= 40 && $(window).height() >= 600 && $(window).width() >= 768;
}

function fix_chart(that){
  var wrap = $("#page-top");
  if (must_fix(that)) {
    if (!wrap.hasClass("fix-charts")){
      wrap.addClass("fix-charts");
      $('#chart-tooltip').css('display', 'none');
      get_chart_container_sizes();
      redraw_chart(true);
    }
  } else {
    if (wrap.hasClass("fix-charts")){
      wrap.removeClass("fix-charts");
      get_chart_container_sizes();
      redraw_chart(true);
    }
  }
  if (is_chart_closed) {
    var chart_container = $('#charts-container');
    if ($(that).scrollTop() <= 116 && chart_container.hasClass('closed'))
        chart_container.removeClass('closed');
    else if ($(that).scrollTop() > 116 && !chart_container.hasClass('closed'))
        chart_container.addClass('closed');
  }
}

function auto_hide_fixed_charts() {
  if ($("#charts").length <= 0)
    return;
  var footer_position = $('.site-footer').offset().top;    
  if ($('#page-top').hasClass('fix-charts') && !is_chart_closed) {
    if ( $(document).scrollTop() >= footer_position - 500) {
      $('#charts-container').addClass('closed');
    }
    else if ($(document).scrollTop() < footer_position - 500) {
      $('#charts-container').removeClass('closed');
      $('#charts-container').addClass('reopened');
    }
  }
}

function get_float_from_string(str){
  if (str)
    return parseFloat(str.replace('%', ''));
  return 0;
}


function randomize_axis(){
  return ((Math.floor(Math.random() * 4) - 2)/10);
}

function check_scroll_to_people(){
    if (window.location.href.indexOf('#people') > -1){
        $('html, body').animate({
            scrollTop: $("#people").offset().top - (!will_fix() ? 0 : 400)
        }, 1000);
    }
}

$(function (){

  if (is_charts()){

    check_scroll_to_people();

    get_chart_container_sizes();

    $(window).scroll(function(e) {
      fix_chart(this);
      auto_hide_fixed_charts();
    }); 

    $('#chart-toggle').click(function (){
      var chart_container = $('#charts-container');
      is_chart_closed = !chart_container.hasClass('closed'); 
      if (!is_chart_closed)
        chart_container.removeClass('closed');
      else
        chart_container.addClass('closed');
    });

    auto_hide_fixed_charts();

    // resize_charts();
  }

  map_height();

  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover({
    html : true,
    trigger : 'focus',
    content: function() {
      return $('#qr-code-wrapper').html();
    }
  });

  $(document).mousemove(function(event) {
      currentMousePos.x = event.pageX;
      currentMousePos.y = event.pageY;
  });
});

$(window).on('resize', function(){
  if (is_charts()){
    get_chart_container_sizes();
    resize_charts();
  }
  map_height();
});