
var transparent = true;

var fixedTop = false;

var navbar_initialized = false;

var scroll;

scroll = ( 2500 - $(window).width() ) / $(window).width();

var window_height;
var window_width;

var content_opacity = 0;
var content_transition = 0;
var no_touch_screen = false;

var burger_menu;

var scroll_distance = 500;

$(document).ready(function(){
    BrowserDetect.init();

    if(BrowserDetect.browser == 'Explorer' && BrowserDetect.version <= 9){
        $('body').html(better_browser);
    }

    window_width = $(window).width();
    window_height = $(window).height();

    burger_menu = $('.navbar').hasClass('navbar-burger') ? true : false;

    if (!Modernizr.touch){
        $('body').addClass('no-touch');
        no_touch_screen = true;
    }

    // Init navigation toggle for small screens
    if(window_width < 992 || burger_menu){
        gaia.initRightMenu();
    }

    if($('.content-with-opacity').length != 0){
        content_opacity = 1;
    }

    $navbar = $('.navbar[color-on-scroll]');
    scroll_distance = $navbar.attr('color-on-scroll') || 500;

    $('.google-map').each(function(){
        var lng = $(this).data('lng');
        var lat = $(this).data('lat');

        gaia.initGoogleMaps(this, lat, lng);
    });

});

//activate collapse right menu when the windows is resized
$(window).resize(function(){
    if($(window).width() < 992){
        gaia.initRightMenu();
        //gaia.checkResponsiveImage();
    }
    if($(window).width() > 992 && !burger_menu){
        $('nav[role="navigation"]').removeClass('navbar-burger');
        gaia.misc.navbar_menu_visible = 1;
        navbar_initialized = false;
    }
});

$(window).on('scroll',function(){

    gaia.checkScrollForTransparentNavbar();


    if(window_width > 992){
        gaia.checkScrollForParallax();
    }

    if(content_opacity == 1 ){
        gaia.checkScrollForContentTransitions();
    }

});

$('a[data-scroll="true"]').click(function(e){
    var scroll_target = $(this).data('id');
    var scroll_trigger = $(this).data('scroll');

    if(scroll_trigger == true && scroll_target !== undefined){
        e.preventDefault();

        $('html, body').animate({
             scrollTop: $(scroll_target).offset().top - 50
        }, 1000);
    }

});

gaia = {
    misc:{
        navbar_menu_visible: 0
    },
    initRightMenu: function(){

         if(!navbar_initialized){
            $toggle = $('.navbar-toggle');
            $toggle.click(function (){

                if(gaia.misc.navbar_menu_visible == 1) {
                    $('html').removeClass('nav-open');
                    gaia.misc.navbar_menu_visible = 0;
                    $('#bodyClick').remove();
                     setTimeout(function(){
                        $toggle.removeClass('toggled');
                     }, 550);

                } else {
                    setTimeout(function(){
                        $toggle.addClass('toggled');
                    }, 580);

                    div = '<div id="bodyClick"></div>';
                    $(div).appendTo("body").click(function() {
                        $('html').removeClass('nav-open');
                        gaia.misc.navbar_menu_visible = 0;
                        $('#bodyClick').remove();
                         setTimeout(function(){
                            $toggle.removeClass('toggled');
                         }, 550);
                    });

                    $('html').addClass('nav-open');
                    gaia.misc.navbar_menu_visible = 1;

                }
            });
            navbar_initialized = true;
        }

    },

    checkScrollForTransparentNavbar: debounce(function() {
            if($(document).scrollTop() > scroll_distance ) {
                if(transparent) {
                    transparent = false;
                    $navbar.removeClass('navbar-transparent');
                }
            } else {
                if( !transparent ) {
                    transparent = true;
                    $navbar.addClass('navbar-transparent');
                }
            }
    }, 17),

    checkScrollForParallax: debounce(function() {
        	$('.parallax').each(function() {
        	    var $elem = $(this);

        	    if(isElementInViewport($elem)){
                  var parent_top = $elem.offset().top;
                  var window_bottom = $(window).scrollTop();
                  var $image = $elem.children('.image');

            	  oVal = ((window_bottom - parent_top) / 3);
                  $image.css('transform','translate3d(0px, ' + oVal + 'px, 0px)');
        	    }
            });

    }, 6),

    checkScrollForContentTransitions: debounce(function() {
         $('.content-with-opacity').each(function() {
             var $content = $(this);

             if(isElementInViewport($content)){
                  var window_top = $(window).scrollTop();
            	  opacityVal = 1 - (window_top / 230);

                  if(opacityVal < 0){
                      opacityVal = 0;
                      return;
                  } else {
                    $content.css('opacity',opacityVal);
                  }

        	    }
         });
    }, 6),

    initGoogleMaps: function($elem, lat, lng){
        var myLatlng = new google.maps.LatLng(lat, lng);

        var mapOptions = {
          zoom: 13,
          center: myLatlng,
          scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
          disableDefaultUI: true,
          styles: [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"},{"gamma":"1.82"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"gamma":"1.96"},{"lightness":"-9"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"on"},{"lightness":"25"},{"gamma":"1.00"},{"saturation":"-100"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#ffaa00"},{"saturation":"-43"},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"},{"hue":"#ffaa00"},{"saturation":"-70"}]},{"featureType":"road.highway.controlled_access","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"on"},{"saturation":"-100"},{"lightness":"30"}]},{"featureType":"road.local","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"40"},{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"gamma":"0.80"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"off"}]}]
        }
        var map = new google.maps.Map($elem, mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            title:"Hello World!"
        });

        // To add the marker to the map, call setMap();
        marker.setMap(map);
    }

}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
};


function isElementInViewport(elem) {
    var $elem = $(elem);

    // Get the scroll position of the page.
    var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
    var viewportTop = $(scrollElem).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    // Get the position of the element on the page.
    var elemTop = Math.round( $elem.offset().top );
    var elemBottom = elemTop + $elem.height();

    return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
}


var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) !== -1) {
                return data[i].identity;
            }
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index === -1) {
            return;
        }

        var rv = dataString.indexOf("rv:");
        if (this.versionSearchString === "Trident" && rv !== -1) {
            return parseFloat(dataString.substring(rv + 3));
        } else {
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        }
    },

    dataBrowser: [
        {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
        {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
        {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
        {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
        {string: navigator.userAgent, subString: "Safari", identity: "Safari"},
        {string: navigator.userAgent, subString: "Opera", identity: "Opera"}
    ]

};

var better_browser = '<div class="container"><div class="better-browser row"><div class="col-md-2"></div><div class="col-md-8"><h3>We are sorry but it looks like your Browser doesn\'t support our website Features. In order to get the full experience please download a new version of your favourite browser.</h3></div><div class="col-md-2"></div><br><div class="col-md-4"><a href="https://www.mozilla.org/ro/firefox/new/" class="btn btn-warning">Mozilla</a><br></div><div class="col-md-4"><a href="https://www.google.com/chrome/browser/desktop/index.html" class="btn ">Chrome</a><br></div><div class="col-md-4"><a href="http://windows.microsoft.com/en-us/internet-explorer/ie-11-worldwide-languages" class="btn">Internet Explorer</a><br></div><br><br><h4>Thank you!</h4></div></div>';






   /**navbar scroll**/
   $(function () {
  $(document).scroll(function () {
    var $nav = $(".navbar-fixed-top");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});



// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


$("#main").append("<footer class='footer footer-big footer-color-black' data-color='black'><div class='container'><div class='row'><div class='col-md-2 col-sm-3'><div class='info'><a href='/about'> <h5 class='title'>About</h5></a></div></div><div class='col-md-3 col-md-offset-1 col-sm-3'><div class='info'><a href='/terms'> <h5 class='title'>Terms of Use</h5></a></div></div><div class='col-md-3 col-sm-3'><div class='info'><a href='/privacy-policy'><h5 class='title'>Privacy Policy</h5></a></div></div><div class='col-md-2 col-md-offset-1 col-sm-3'><div class='info'><h5 class='title'>Follow us on</h5><nav><ul><li><a href='#'><i class='fa fa-facebook-square'></i> Facebook</a></li><li><a href='#' ><i class='fa fa-twitter'></i> Twitter</a></li><li><a href='#'><i class='fa fa-instagram'></i> Instagram</a></li></ul></nav></div></div></div><hr><div class='copyright' id='date'> </div></div></footer>");


document.getElementById("date").innerHTML="&copy; "+new Date().getFullYear()+" Pixground";

$(".karya div").slice(26).hide();

var mincount = 26;
var maxcount = 999999;



$(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 50) {
        $(".karya div").slice(mincount, maxcount).slideDown(1400);

        mincount = mincount + 26;
        maxcount = maxcount + 26

    }
  
     
    
     
});






















/** DOWNLOAD BY SIZE */



const canvas = document.getElementById("result");
const ctx = canvas.getContext("2d");

function loadImage(event) {
  const image = document.getElementById("imgDisplayed");
  image.src = URL.createObjectURL(event.target.files[0]);
}

const preview = document.getElementById("preview");
preview.addEventListener("click", swipe);

function swipe() {
    var largeImage = document.getElementById('imgDisplayed');
   
    largeImage.style.display = 'block';
   
    const imWidth=document.querySelector('input[type="radio"]:checked').name;
    const imHeight =document.querySelector('input[type="radio"]:checked').value;
  
    largeImage.style.width=imWidth;
    largeImage.style.height=imHeight;
    var url=largeImage.getAttribute('src');
  
    window.open(url,'Image','width=largeImage.stylewidth,height=largeImage.style.height,resizable=1');
 }
// function prev() {
//   const image = document.getElementById("imgDisplayed");
  
//   const imWidth=document.querySelector('input[type="radio"]:checked').name;
//   const imHeight =document.querySelector('input[type="radio"]:checked').value;
  

//   canvas.width = imWidth;
//   canvas.height = imHeight;
   
//   ctx.drawImage(image, 0, 0, imWidth, imHeight);
  

//   let form = document.getElementById("form");
//   form.reset();
// }


const down = document.querySelector("#down");
down.addEventListener("click", downloadImage);

function downloadImage(){
    const image = document.getElementById("imgDisplayed");
    const name= image.name;
  const imWidth=document.querySelector('input[type="radio"]:checked').name;
  const imHeight =document.querySelector('input[type="radio"]:checked').value;
  

  canvas.width = imWidth;
  canvas.height = imHeight;

  ctx.drawImage(image, 0, 0, imWidth, imHeight);

  
    
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = canvas.toDataURL();

    a.download = "resizedImage.png";
    a.click();

    document.body.removeChild(a);
  
  form = document.querySelector("form");
  form.reset();
  window.location.reload();
}






