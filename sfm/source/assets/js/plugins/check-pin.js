/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'pin-check',
      Events = {
        CHANGE: 'change.' + pluginName,
        CLICK: 'click'
      };

  var onChangeHandler = function(that) {
    var opts = that.options,
        isDisabled = true;
    $('[data-' + pluginName + ']').each(function() {
      return isDisabled = !$(this).is(':checked') || $(this).is(':disabled');
    });
    $(opts.target).prop('disabled', isDisabled).trigger(Events.CLICK);
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
          //opts = this.options;

      this.element.vars = {
        groupEl: $('[name=' + this.element.attr('name') + ']')
      };

      this.element.vars.groupEl.off(Events.CHANGE).on(Events.CHANGE, function() {
        onChangeHandler(that);
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
    target: '',
    errorClass: 'error'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
