;(function($) {
  'use strict';

  var pluginName = 'time-picker';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var ele = this.element,
          opt = this.options,
          icon = ele.next('[data-icon-picker]');
      if(opt.monthYear){
        ele.datepicker({
          dateFormat: 'mm/yy',
          changeMonth: true,
          changeYear: true,
          showButtonPanel: true,
          onClose: function() {
            function isDonePressed(){
              return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
            }
            if (isDonePressed()){
              var month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();
              var year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();
              $(this).datepicker('setDate', new Date(year, month, 1)).trigger('change');
              $('.date-picker').focusout();
            }
          },
          beforeShow : function(input, inst) {
            inst.dpDiv.addClass('month_year_datepicker');
            if ((input = $(this).val()).length > 0) {
              var year = input.substring(input.length-4, input.length),
                  month = input.substring(0, 2);
              $(this).datepicker('option', 'defaultDate', new Date(year, month-1, 1));
              $(this).datepicker('setDate', new Date(year, month-1, 1));
            }
          }
        });
      }else {
        ele.datepicker({
          beforeShow: function(input, inst) {
            inst.dpDiv.hasClass('month_year_datepicker') ? inst.dpDiv.removeClass('month_year_datepicker') : null;
          }
        });
      }
      icon.on('click', function() {
        ele.focus();
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