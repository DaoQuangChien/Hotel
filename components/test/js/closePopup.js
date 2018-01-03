;(function($, window, undefined) {
  'use strict';

  var pluginName = 'close-popup';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var ele = this.element,
          opts = this.options,
          dataTargetPopup = ele.closest(opts.dataTargetPopup);

      ele.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (!dataTargetPopup.hasClass(opts.hideClass)) {
          if (ele.data().hideParent) {
            dataTargetPopup.parent().addClass(opts.hideClass);  
          }
          dataTargetPopup.addClass(opts.hideClass);
        }
        if ($('[data-delete].high-light').length) {
          $('[data-delete].' + opts.highLightClass).removeClass(opts.highLightClass);
        }
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
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    dataTargetPopup: '[data-target-popup]',
    highLightClass: 'high-light',
    hideClass: 'hide'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));