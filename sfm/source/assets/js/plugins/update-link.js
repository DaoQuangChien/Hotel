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

  var pluginName = 'updateLink',
      Events = {
        CHANGE: 'change.' + pluginName
      };

  var onChangeHandler = function(that, self) {
    var vars = that.element.vars;

    vars.targetEl.prop('href', $(self).val());
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          opts = this.options,
          el = this.element;

      el.vars = {
        groupEl: $('[name=' + el.attr('name') + ']'),
        targetEl: $(opts.target)
      };

      el.vars.groupEl.off(Events.CHANGE).on(Events.CHANGE, function() {
        onChangeHandler(that, this);
      });
      el.vars.groupEl.filter(':checked').trigger(Events.CHANGE);
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
    url: '#'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
