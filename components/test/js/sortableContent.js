;(function($, window, undefined) {
  'use strict';

  var pluginName = 'sortable-content';

  function startSort(ui, options, opts) {
    if (options.setWidth) {
      ui.placeholder.width(ui.item.width());  
    }
    if (options.setHeight) {
      if (options.followChildrenHeight) {
        ui.placeholder.height(ui.item.children().height());
      } else {
        ui.placeholder.height(ui.item.height());
      }
    }
    ui.item.addClass(opts.tiltClass);
  }

  function stopSort(ui, opts) {
    ui.item.removeClass(opts.tiltClass);
  }

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var ele = this.element,
          opts = this.options,
          contentWrapper = ele.find(opts.dataSwapContent);

      contentWrapper.sortable({
        connectWith: '[data-phase=' + opts.dataConnect + '] ' + opts.dataSwapContent,
        placeholder: opts.placeholderContentClass,
        tolerance: 'pointer',
        zIndex: 999,
        start: function(e, u) {
          startSort(u, {setWidth: false, setHeight: true, followChildrenHeight: false}, opts);
        },
        stop: function(e, u) {
          stopSort(u, opts);
        }
      });
      // if (opts.isSwapProgress) {
      //   ele.sortable({
      //     placeholder: opts.placeholderProgressClass,
      //     zIndex: 999,
      //     handle: '.list-content',
      //     items: opts.dataSwapProgress,
      //     cancel: opts.cancelSortClass,
      //     tolerance: 'pointer',
      //     start: function (e, u) {
      //       startSort(u, { setWidth: true, setHeight: true, followChildrenHeight: true }, opts);
      //     },
      //     stop: function (e, u) {
      //       stopSort(u, opts);
      //     }
      //   });
      // }
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
    dataSwapContent: '[data-swap-content]',
    // dataSwapProgress: '[data-swap-progress]',
    placeholderContentClass: 'placeholder-content',
    placeholderProgressClass: 'placeholder-progress',
    cancelSortClass: '.no-sort',
    tiltClass: 'tilt',
    dataConnect: '1',
    isSwapProgress: false
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));