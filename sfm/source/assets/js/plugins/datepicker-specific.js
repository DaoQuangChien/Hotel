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
    var pluginName = 'datepicker-specific',
        dateTypeSelector = '[data-date-type]',
       // rangeDateName = 'range',
        specificDateName = 'specific',
        specificDateSel = '.specific-dates',
        startDateSelector = '#start-date-input',
        endDateSelector = '#end-date-input',
        datepickerBtn = '<span class="glyphicon glyphicon-calendar"></span>',
        datepickerBtnSel = '.ui-datepicker-trigger',
        specificDateSelector = '[data-specific-date]';

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
            toDay = new Date(),
            errMessEls = el.find(opts.errorMessSelectors);
        that.vars = {
          dateTypeInput: el.find(dateTypeSelector + ' input:radio'),
          startDateInput: el.find(startDateSelector),
          endDateInput: el.find(endDateSelector),
          specificDateInput: el.find(specificDateSelector)
        };
        // if(that.vars.specificDateInput.length > 0) {
        //   // toDay.setDate(toDay.getDate()+1);
        //   $('#multi-dates-picker').multiDatesPicker({
        //     showButtonPanel: true,
        //     showOn: 'both',
        //     dateFormat: 'dd/mm/yy',
        //     buttonText: datepickerBtn,
        //     minDate: toDay,
        //     onClose: function(selectedDate){
        //       selectedDate = selectedDate.split(',');
        //       var dates ='';
        //       for(var i = 0; i < selectedDate.length; i++) {
        //         if(selectedDate[i].length > 0) {
        //           dates += '<option>' + selectedDate[i] + '</option>';
        //         }
        //       }
        //       $(specificDateSel).html(dates).find('option').prop('selected', true);
        //     }
        //   });
        //   !el.find(datepickerBtnSel).is('.btn') && el.find(datepickerBtnSel).addClass('btn btn-default right');
        // }
        that.initMultidatePicker($('#multi-dates-picker'), toDay);

        if(that.vars.dateTypeInput.length > 0) {
          $(that.vars.dateTypeInput).on('change.dateType', function() {
            if($(this).val() === specificDateName) {
              that.vars.startDateInput.attr('disabled','true').val('').datepicker('setDate');
              that.vars.endDateInput.attr('disabled','true').val('').datepicker('setDate');
              el.find(datepickerBtnSel).removeAttr('disabled');
              that.vars.specificDateInput.removeAttr('disabled');
              el.find(specificDateSel).removeAttr('disabled');
              errMessEls.empty();
              el.find(opts.errorMessSelector).remove();
            } else {
              that.vars.specificDateInput.attr('disabled', 'true').val('').multiDatesPicker('resetDates');
              el.find(datepickerBtnSel).attr('disabled', 'true');
              that.vars.startDateInput.removeAttr('disabled').datepicker('option', {minDate: toDay, maxDate: null});
              that.vars.endDateInput.removeAttr('disabled').datepicker('option', {minDate: toDay, maxDate: null});
              el.find(specificDateSel).empty().attr('disabled', 'true');
              errMessEls.empty();
              el.find(opts.errorMessSelector).remove();
            }
          });
        }
      },
      initMultidatePicker: function (ele, minDate) {
        var that = this,
            el = that.element;
        if(that.vars.specificDateInput.length > 0) {
          ele.multiDatesPicker({
            showButtonPanel: true,
            showOn: 'both',
            dateFormat: 'dd/mm/yy',
            buttonText: datepickerBtn,
            minDate: minDate,
            onClose: function(selectedDate){
              selectedDate = selectedDate.split(',');
              var dates ='';
              for(var i = 0; i < selectedDate.length; i++) {
                if(selectedDate[i].length > 0) {
                  dates += '<option>' + selectedDate[i] + '</option>';
                }
              }
              $(specificDateSel).html(dates).find('option').prop('selected', true);
            }
          });
          !el.find(datepickerBtnSel).is('.btn') && el.find(datepickerBtnSel).addClass('btn btn-default right');
        }
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
        errorMessSelectors: '.text-errors',
        errorMessSelector: '.text-error',
        errorMess: 'Choose a date',
    };
    $(function() {
        $('[data-' + pluginName + ']')[pluginName]();
    });
}(jQuery, window));
