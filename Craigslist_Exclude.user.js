// ==UserScript==
// @name           Craigslist Exclude
// @namespace      http://redndahead.com/craigslistExclude
// @include        http://*.craigslist.org/search/*
// @require        http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js
// 
// ==/UserScript==

var hiddenCities = ['gilroy', 'hollister', 'milpitas', 'morgan-hill', 'san-jose-east', 'mountain-house--Tracy'];

jQuery("form#searchform").after('<div id="city-checkboxes"></div><br /><br /><div id="extra-options"><input id="hide-no-pets" type="checkbox" value="show pets" checked="checked" /> Hide records that don\'t allow pets</div>');


var cities = [];
jQuery("font").each(function(index) {
    var city = jQuery(this).text().replace('(', '').replace(')', '').trim();
      
        var cityClass = city.split(' ').join('-').split('/').join('-').replace(',', '-');
          jQuery(this).parent().addClass(cityClass);
            
              if (jQuery.inArray(city, cities) == -1) {
                    cities.push(city);
                      }
                        cities.sort();
                          
});

// Create checkboxes
for(var city in cities) {
    var cityClass = cities[city].split(' ').join('-').split('/').join('-');
      var checkState = " checked='checked'";
        if (jQuery.inArray(cityClass, hiddenCities) != -1) {
              checkState = '';
                }
                  jQuery('#city-checkboxes').append("<input type='checkbox' name='" + cityClass + "' value='" + cityClass + "'" + checkState + " /> " + cities[city] + '&nbsp;&nbsp;');
}


for (var index=0; index < hiddenCities.length; index++) {
    jQuery("." + hiddenCities[index]).hide();
}

jQuery('#city-checkboxes input').click(function() {
    var city = jQuery(this).attr('name');

      if (jQuery(this).attr('checked') == 'checked') {
            jQuery("p." + city).each(function() {
                    if ((jQuery(this).hasClass('nopets') && jQuery('#hide-no-pets').attr('checked') != 'checked') || jQuery(this).hasClass('nopets') === false) {
                              jQuery(this).show();
                                    }
                                        });
              }
                else {
                      jQuery("p." + city).hide();
                        }
});

jQuery('#hide-no-pets').click(function() {
    var className = jQuery("p.nopets").attr('class');
      className = className.replace('nopets', '');
        var city = className.replace(' ', '');
          
            if (jQuery(this).attr('checked') == 'checked') {
                  jQuery("p.nopets").hide();
                    }
                      else if (jQuery(this).attr('checked') != 'checked') {
                            jQuery("p.nopets").each(function() {
                                    if (jQuery('input[name="' + city + '"]').attr('checked') == 'checked') {
                                              jQuery(this).show();
                                                    }
                                                        });
                              }
});

jQuery('p a').each(function(index, value) {
    var record = jQuery(this);
      
        record.parent().prepend('<a id="open-link-' + index + '" class="closed open-link" href="#">Open </a>');
         
           var link = jQuery(this).attr('href');
             
               jQuery.get(link, function(data) {
                     data = data.toLowerCase();
                         if (data.search('no pet') >= 0 || data.search('no smoking or pet') >= 0 || data.search('pets are not allowed') >= 0 || data.search('no dog') >= 0 || data.search('no cat') >= 0) {
                                 record.after(' - <span style="color:red">No Pets! </span>');
                                       record.parent().addClass('nopets').hide(); 
                                           }
                                               
                                                   if (data.search('purrr') >= 0) {
                                                           record.after(' - <span style="color:green">Cats OK! </span>');
                                                               }
                                                                   
                                                                       if (data.search('wooof') >= 0) {
                                                                               record.after(' - <span style="color:green">Dogs OK! </span>');
                                                                                   }
                                                                                       
                                                                                           if (data.search('pets negotiable') >= 0) {
                                                                                                   record.after(' - <span style="color:green">Pets Negotiable! </span>');
                                                                                                       }
                                                                                                           
                                                                                                               if (data.search('pet allowed') >= 0) {
                                                                                                                       record.after(' - <span style="color:green">Pet Allowed! </span>');
                                                                                                                           }
                                                                                                                               
                                                                                                                                   if (data.search('pet policy') >= 0) {
                                                                                                                                           record.after(' - <span style="color:green">Has Pet Policy! </span>');
                                                                                                                                               }
                                                                                                                                                 });
                 
                   jQuery('#open-link-' + index).click(function() {
                         // Set the iframe src to our url.
                             jQuery('.overlayContent iframe').attr('src', link);

                                 // Open the overlay.
                                     doOverlayOpen();
                                         
                                             record.css({'color':'#800080'});
                                                 
                                                     return false;
                                                       })
});


////////////////////////////////////////
// Overlay
/////////////////////////////////////// 

//the status of overlay box
var isOpen = false;

//function to display the box
function showOverlayBox() {
    //if box is not set to open then don't do anything
      if( isOpen == false ) return;
        // set the properties of the overlay box, the left and top positions
          jQuery('.overlayBox').css({
                display:'block',
                    left:( jQuery(window).width() - jQuery('.overlayBox').width() )/2,
                        top: '0',
                            position:'fixed'
                              });
            // set the window background for the overlay. i.e the body becomes darker
              jQuery('.bgCover').css({
                    display:'block',
                        width: jQuery(window).width(),
                            height:"100%"
                              });
}

// Launches the overlay
function doOverlayOpen() {
    //set status to open
      isOpen = true;
        showOverlayBox();
          jQuery('.bgCover').css({opacity:0}).animate( {opacity:0.5, backgroundColor:'#000'} );
            // dont follow the link : so return false.
              return false;
}

// Closes the overlay
function doOverlayClose() {
    //set status to closed
      isOpen = false;
        jQuery('.overlayBox').css( 'display', 'none' );
          // now animate the background to fade out to opacity 0
            // and then hide it after the animation is complete.
              jQuery('.bgCover').animate( {opacity:0}, null, null, function() {
                    jQuery(this).hide();
                      });
                //window.location.reload()
                  return false;
}

var overlayHeight = jQuery(window).height() - 50;
var overlayWidth = jQuery(window).width() - 40

// Attach overlay to the body.
jQuery('body').append('<div class="bgCover">&nbsp;</div><div class="overlayBox"><div class="overlayContent"><div class="controls"><a class="overlay-close" href="#">Close</a></div><iframe src="" width="100%" height="' + (overlayHeight - 20) + '"></iframe></div></div>');

// Style the overlay
jQuery('.overlayBox').css({
    'border': '5px solid #09F',
      'position': 'absolute',
        'display': 'none',
          'width': overlayWidth,
            'height': overlayHeight,
              'background': '#fff',
                'z-index': 40
});

jQuery('.bgCover').css({
    'background': '#000',
      'position': 'absolute',
        'left': '0',
          'top': '0',
            'display': 'none',
              'overflow': 'hidden',
                'z-index' : 40
});


// Make close link actually close.
jQuery('a.overlay-close').click(doOverlayClose);

// Close if the user hits escape
jQuery(document).keyup(function(e) {
    if (e.keyCode == 27 && isOpen) { doOverlayClose() }
});
