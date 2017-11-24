;(function($, window, undefined) {
  'use strict';

  var pluginName = 'create-company';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var ele = this.element,
          opts = this.options,
          eleInput = ele.find('input'),
          eleSubmit = ele.find('button');

      eleInput.off('input.' + pluginName).on('input.' + pluginName, function() {
        if ($(this).val().length) {
          eleSubmit.removeClass(opts.disabledClass);
        } else {
          eleSubmit.hasClass(opts.disabledClass) ? null : eleSubmit.addClass(opts.disabledClass);
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
    disabledClass: 'disabled'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));