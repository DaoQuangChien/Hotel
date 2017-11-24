; (function ($, window, undefined) {
  'use strict';

  var pluginName = 'fluid-height';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var ele = this.element,
          opts = this.options,
          baseHeight = null,
          lineHeight = parseInt(ele.css('line-height'));

      if (opts.hideParent) {
        ele.parents(opts.dataParent).addClass(opts.hideClass);
      }
      ele
        .one('focus.' + pluginName, function() {
          baseHeight = lineHeight*ele.data().minRows;
        })
        .off('input.' + pluginName).on('input.' + pluginName, function() {
          var minRows = ele.data().minRows,
              rows = null;

          this.rows = minRows;
          rows = Math.ceil((this.scrollHeight - baseHeight - opts.basePadding*2) / lineHeight);
          this.rows = minRows + rows;
        });
    },
    destroy: function () {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
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
    hideParent: true,
    dataParent: '[data-target-popup]',
    hideClass: 'hide',
    basePadding: 10
  };

  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));