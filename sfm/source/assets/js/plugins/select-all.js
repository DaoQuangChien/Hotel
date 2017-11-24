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

  var pluginName = 'select-all',
      dataCTE = 'check-to-enable',
      dataTarget = 'target',
      dataTargetType = 'target-type',
      dataChkPinSel = '[data-admin]',
      Events = {
        CHANGE: 'change.' + pluginName
      };
  var selectAllChangeHandler = function(that) {
    var isChecked = that.element.prop('checked');
    if(that.element.data(dataTargetType) && that.element.data(dataTargetType) === 'select') {
      var targetSel = that.element.data(dataTarget);
      if(targetSel){
        $(targetSel).find('option').prop('selected', isChecked).end().focus();
        $(targetSel).off('change.' + pluginName).on('change.' + pluginName, function() {
          isChecked && that.element.prop('checked', false);
        });
      }
    } else {
      if(isChecked) {
        $(dataChkPinSel).prop('checked', isChecked);
      }
      that.element.vars.tarEl.prop('checked', isChecked).trigger(Events.CHANGE);
    }
  };
  var getChecked = function(that) {
    var isChecked = true,
        isNotDisabled = true;
    that.element.vars.tarEl.each(function() {
      if(!$(this).is(':checked')) {
        isChecked = false;
      }
    });
    $(dataChkPinSel).each(function() {
      if(!$(this).is(':checked')) {
        isNotDisabled = false;
      }
    });
    return isChecked && isNotDisabled;
  };
  var chbChangeHandler = function(that, self) {
    var selfEl = $(self),
        isChecked = selfEl.is(':checked'),
        isCheckedAll = getChecked(that);
    if(selfEl.data(dataCTE)) {
      $('[name=' + selfEl.data(dataTarget) + ']').prop('disabled', !isChecked).closest('.radio')[!isChecked ? 'addClass' : 'removeClass']('disabled').find('input[type="radio"]').trigger('change');
      that.element.prop('checked', isCheckedAll);
    }
  };
  var chbChangeHandlerOnSelect = function (that, sel){
    var optsEle = $(sel).find('option');
    if(optsEle.length > 0 && optsEle.length === optsEle.filter(':selected').length) {
      that.element.prop('checked', true);
    } else {
      that.element.prop('checked', false);
    }
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;

      this.element.vars = {
        tarEl: $('[name=' + that.options.target + ']')
      };
      this.element.off(Events.CHANGE).on(Events.CHANGE, function() {
        selectAllChangeHandler(that);
      });
      // select on report setting
      if(that.element.data(dataTargetType) && that.element.data(dataTargetType) === 'select') {
        if($(this.options.target).length === 1) {
          $(this.options.target).off('change.select').on('change.select', function() {
            chbChangeHandlerOnSelect(that, this);
          }).trigger('change.select');
        }
      }
      //
      this.element.vars.tarEl.off(Events.CHANGE).on(Events.CHANGE, function() {
        chbChangeHandler(that, this);
      });
      this.element.vars.tarEl.each(function() {
       $('[name=' + $(this).data('target') +']').off(Events.CHANGE).on(Events.CHANGE, function() {
        that.element.prop('checked', getChecked(that));
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
    target: ''
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
