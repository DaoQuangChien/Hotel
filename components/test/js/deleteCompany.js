;(function($, window, undefined) {
  'use strict';

  var pluginName = 'delete-company';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var ele = this.element,
          opts = this.options;
      
      ele.find(opts.dataAccept).off('click.' + pluginName).on('click.' + pluginName, function() {
        var self = $(this),
            company = $('[data-company-id=' + ele.data().companyFrom + ']');

        $.ajax({
          type: opts.method,
          url: opts.url,
          dataType: 'json',
          data: {
            company_id: company.data().companyId
          },
          success: function(result) {
            if (result.status) {
              company.remove();
              ele.parent().addClass(opts.hideClass);
            } else {
              self.parent().after('<p class="errorText">' + opts.errorText + '</p>');
              self.parent().next().fadeOut(opts.fadeOutTime, function() {
                $(this).remove();
              });
            }
          },
          error: function(xhr) {
            self.parent().after('<p class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>');
            self.parent().next().fadeOut(opts.fadeOutTime, function() {
              $(this).remove();
            });
          }
        });
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
    hideClass: 'hide',
    fadeOutTime: 1000
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));