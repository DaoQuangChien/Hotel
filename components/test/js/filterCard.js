; (function ($, window, undefined) {
  'use strict';

  var pluginName = 'filter-card';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var ele = this.element,
          opts = this.options,
          filterOpt = ele.find(opts.dataFilter);
      this.vars = {
        loadmoreObj: {
          can_loadmore: true,
          offset: 0,
          limit: opts.limit
        },
        permission: true,
        is_Loadmore: true
      };

      filterOpt.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        var data = $(this).data().filter.split('-');

        filterOpt.parent().removeClass(opts.checkedClass);
        $(this).parent().addClass(opts.checkedClass);
        $('[data-phase=' + ele.data().phaseFrom + '] ' + opts.dataGetListCard)
          .data('last-filter', data)
          ['get-list-card']('callAjax', data);
        $(this).parents('[data-' + pluginName + ']').addClass(opts.hideClass);
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
    dataGetListCard: '[data-get-list-card]',
    dataFilter: '[data-filter]',
    checkedClass: 'checked',
    hideClass: 'hide'
  };

  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));