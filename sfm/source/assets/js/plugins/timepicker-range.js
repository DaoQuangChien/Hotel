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

  var pluginName = 'timepicker-range',
      Event = {
        CHANGE: 'change.' + pluginName,
        SUBMIT: 'submit.' + pluginName,
        CLICK: 'click.popover'
      },
      errorTag = '<p class="text-error">*',
     // pTag = '<p data-value="{value}">{text}</p>',
      doc = $(document),
      dataDblclick = '[data-dblclick-show-popup]',
      popoverContSel = '.popover-content',
      startTimeSelector = '[data-start-time]',
      endTimeSelector = '[data-end-time]',
      //nextDaySelector = '[data-nextday]',
      timePickerSelector = '[data-timepicker]',
      dataValidateSel = '[data-validateform]',
      ignoreSel = '[data-client]',
      togglePopoverSel = '[data-toggle="popover"]';

  var getValue = function(that) {
    var el = that.element,
        str = Site.getLastEl(el.data('fill-html-target'), '-');
    return '<p data-value="' + str + '">' +  $(dataDblclick).find('option').filter('[value="' + str + '"]').html() + ': ' + el.vars.startTimeInput.val() + '-' + el.vars.endTimeInput.val() + '</p>';
  };
  var filterOpt = function(that) {
    var obj = {},
        el = that.element,
        val = new RegExp('<p data-value="' + $(el.data('fill-html-target').split('-')).get(-1) + '"');

    return  obj = {
              isMatch: val.test(el.data('content')),
              reg: val
            };
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          el = that.element,
          opts = that.options,
          startTimeInput = el.find(startTimeSelector),
          endTimeInput = el.find(endTimeSelector),
          //nextDayChbox = el.find(nextDaySelector),
          timePickerInput = el.find(timePickerSelector),
          errMessEl = el.find(opts.errorMessSelector);
          //reg = new RegExp($(dataDblclick).attr('name').split('[]')[0]);
    el.vars = {
      endTimeInput: endTimeInput,
      startTimeInput: startTimeInput
    };
    el.data('content', $(popoverContSel).html());
    doc.off(Event.SUBMIT).on(Event.SUBMIT, '[data-' + pluginName + ']', function(e) {
      var popoverContent = el.data('content') || '',
          listFillHTMLData = el.data('fill-html-target').split('[]'),
          fillHtmlSelector = listFillHTMLData[0] + listFillHTMLData[1];

      if(el.find(dataValidateSel).jqBootstrapValidation('hasErrors') && $(ignoreSel + ':checked').not(':disabled').length === 0) {
        return;
      }
      e.preventDefault();
      if(Site.timeToSec(startTimeInput.val()) >= Site.timeToSec(endTimeInput.val())) {
        el.addClass('error');
        errMessEl.html('*' + opts.errorMess);

        errMessEl.removeClass('hidden');
        if(!el.find('.text-error').length) {
          timePickerInput.after(errorTag);
        }
        return;
      }
      el.removeClass('error').closest('.modal').modal('hide');
      errMessEl.addClass('hidden');
      $('[name="' + fillHtmlSelector + '-starttime"]').val(startTimeInput.val());
      $('[name="' +  fillHtmlSelector + '-endtime"]').val(endTimeInput.val());
      $(togglePopoverSel).popover('show').off(Event.CLICK);

      if(filterOpt(that).isMatch) {
        var listEl = popoverContent.split('</p>');

        for(var i = 0, l = listEl.length; i < l; i++) {
          if(filterOpt(that).reg.test(listEl[i])) {
            popoverContent = popoverContent.replace(listEl[i] + '</p>', '');
          }
        }
      }
      $(popoverContSel).append(popoverContent + getValue(that));
      var tempTop = ($(togglePopoverSel).outerHeight() - $('.popover').outerHeight()) /2;
      $('.popover').css('top', tempTop);
      el.data('content', $(popoverContSel).html());
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
    errorMessSelector: '.text-errors',
    errorMess: 'fin doit commencer plus âgé',
    fillHtmlTarget: ''
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
