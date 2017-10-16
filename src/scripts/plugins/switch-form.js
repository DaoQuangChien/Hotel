;(function($) {
  'use strict';
  var pluginName = 'switch-form';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var ele = this.element,
          checkboxes = ele.find('input[name=time]'),
          forms = ele.find('[data-time]');
      this.setUp(checkboxes, forms);
      checkboxes.on('change', function() {
        forms.hide();
        var active = $(this).prop('id');
        forms.filter(function() {
          return $(this).data('time') === active;
        }).show();
      });
    },
    setUp: function(checkboxes, forms) {
      forms.hide();
      var active = checkboxes.filter(function() {
        return $(this).prop('checked') === true;
      }).prop('id');
      forms.filter(function() {
        return $(this).data('time') === active;
      }).show();
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
    monthYear: false
  };
  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });
}(jQuery));