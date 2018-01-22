; (function($, window, undefined) {
  'use strict';

  var pluginName = 'delete-card-type';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var ele = this.element,
          opts = this.options,
          deleteBtn = ele.find(opts.dataAccept);

      deleteBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        $.ajax({
          type: opts.method,
          url: opts.url,
          dataType: 'json',
          cache: false,
          data: {
            type_id: ele.data().cardType.id
          },
          success: function(result) {
            if (result.status) {
              $(opts.dataCardType)['card-type']('deleteType', ele.data().cardType.id);
              ele.modal('hide');
            }
          }
        });
      });
      ele.off('hide.bs.modal.' + pluginName).on('hide.bs.modal.' + pluginName, function() {
        $(this).removeData('card-type');
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
    dataAccept: '[data-accept]',
    dataCardType: '[data-card-type]'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));