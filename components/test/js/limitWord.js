;(function($, window, undefined) {
  'use strict';

  var pluginName = 'limit-word';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.updateText();
    },
    updateText: function() {
      var ele = this.element,
          opts = this.options,
          lineHeight = parseInt(ele.css('line-height'));

      while (ele.height() > lineHeight * opts.line) {
        ele.text(ele.text().slice(0, ele.text().length - 4) + '...');
      }
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
    line: 2
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));