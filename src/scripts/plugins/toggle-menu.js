/**
 *  @name toggleMenu
 *  @description Use menu button to toggle the menu
 *  @version 1.0
 *  @methods
 *    init
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'toggleMenu',
      $window = $(window),
      $document = $(document);

  var responsiveMenu = function(menu, button, width){
    $window.resize(function(){
      if($document.width() > width) {
        menu.show();
        if( button.hasClass('close') ){
          button.removeClass('close');
        }
      }
      if($document.width() <= width) {
        menu.hide();
        if( button.hasClass('close') ){
          button.removeClass('close');
        }
      }
    });
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          width = that.options.width,
          button = that.element.find('button[data-button = btn-menu]'),
          menu = that.element.find('div[data-toggle = btn-menu]');
      responsiveMenu(menu, button, width);
      button.click(function(){
        $(this).toggleClass('close');
        menu.slideToggle();
      });
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {    
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    width : 980
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));