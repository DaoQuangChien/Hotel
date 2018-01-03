;(function($, window, undefined) {
  'use strict';

  var pluginName = 'fluid-height';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var ele = this.element,
          opts = this.options,
          baseHeight = null,
          lineHeight = parseInt(ele.css('line-height')),
          paddingTop = parseInt(ele.css('padding-top')),
          paddingBottom = parseInt(ele.css('padding-bottom')),
          borderHeight = 0,
          is_FF = $('html').hasClass('firefox');

      if (opts.hideParent) {
        ele.parents(opts.dataParent).addClass(opts.hideClass);
      }
      ele
        .off('input.' + pluginName).on('input.' + pluginName, function() {
          $(this).css('height', baseHeight + borderHeight);
          if (is_FF) {
            this.scrollHeight > baseHeight ? $(this).css('height', this.scrollHeight + borderHeight + 1) : $(this).css('height', baseHeight + borderHeight + 1);
          } else {
            this.scrollHeight > baseHeight ? $(this).css('height', this.scrollHeight + borderHeight) : null;
          }
        })
        .one('focus.' + pluginName, function() {
          baseHeight = lineHeight*ele.data().minRows + paddingTop + paddingBottom;
          borderHeight = $(this).outerHeight() - $(this).innerHeight();
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
    hideParent: true,
    dataParent: '[data-target-popup]',
    hideClass: 'hide'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));