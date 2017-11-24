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

  var pluginName = 'transport',
      OPT_TAG = '<option value="{value}">{text}</option>',
      intputTag = '<div class="control-group"><input class="hiden-time-input" name={name} type="hidden" data-ctrlgroup="{ctrl}"  required="true" data-validation-required-message="Doit estimer le temps"></div>',
      containtValSel = '[data-value="{value}"]',
      tprangeSel = '[data-timepicker-range]',
      Event = {
        CLICK: 'click.' + pluginName,
        SUBMIT: 'submit.' + pluginName,
        CHANGE: 'change.' + pluginName
      },
     // dataGetVal = 'get-value',
      togglePopoverSel = '[data-toggle="popover"]',
      checkTimmingSel = '#temp-site',
      hiddenInpWrapSel = '#timing-input',

      //popoverContentSel = '.popover-content',
      popoverSel = '.popover',
      //dataCtrlGrSel = '[data-ctrlgroup]',
      ctrlgroupSel = '.control-group',
      maxLength;
  var sortByKey = function(array, key) {
    return array.sort(function(a, b) {
        var x = a[key], y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  };
  var updateHTML = function(el, data) {
    var listHTML = '';
    data = sortByKey(data, 'value');
    for(var i = 0, l = data.length; i < l; i++) {
      listHTML += OPT_TAG.replace('{value}', data[i].value).replace('{text}', data[i].text);
    }

    el.find('option').remove().end().append(listHTML);
  };
  var triggerEvt = function(listSel, e, data, arr) {
    for(var i = 0, l = listSel.length; i < l; i++) {
      var idx = arr.indexOf($(listSel[i]).data('get-value'));
      if(data[idx]) {
        //validateTimedOpt($(listSel[i]).data('get-value'), data[idx]);
      }
      $(listSel[i]).trigger(e);
    }
  };
  var fixHeightPopover = function() {
    var tempTop = ($(togglePopoverSel).outerHeight() - $(popoverSel).outerHeight()) /2;
    $(popoverSel).css('top', tempTop);
  };
  // var validateTimedOpt = function(sel, data) {

  //   for(var i = 0, len = data.length; i < len; i++) {
  //     $(sel).find('option').filter('[value="' +  data[i].value + '"]').remove();
  //     $(sel).find('option').prop('selected', true);
  //   }
  // };
  var checkTimming = function() {
    var listOptVals = $(checkTimmingSel).find('option'),
        // startName = '',
        // endName = '',
        listInpSel = [],
        listVal = [],
        listPopContents = [],
        listValDels = [],
        popoverContentEl = $('.popover-content'),
        namePrefix = $(checkTimmingSel).attr('name').split('[]')[0],
        listTimmingInpl = $(hiddenInpWrapSel).find('input[name$="-starttime"]'),
        listPops = $('.popover-content').find('p');

    listOptVals.each(function() {
      listVal.push(parseInt($(this).val()));
    });
    listPops.each(function() {
      listPopContents.push($(this).data('value'));
    });
    listTimmingInpl.each(function(){
      listPopContents.push(parseInt($(this).attr('name').split(namePrefix +'-')[1].split('-starttime')[0]));
    });

    listValDels = listPopContents.filter(function(elem) {
      return listVal.indexOf(elem) === -1;
    });
    for(var k in listValDels) {
      listInpSel.push('[name="' + namePrefix + '-' + listValDels[k] + '-starttime"]');
      listInpSel.push('[name="' + namePrefix + '-' + listValDels[k] + '-endtime"]');
    }

    for(var i = 0, l = listInpSel.length; i < l; i++) {
      $(listInpSel[i]).closest(ctrlgroupSel).remove();
      $(listInpSel[i]).remove();
      popoverContentEl.find(containtValSel.replace('{value}', listValDels[i])).remove();
      $(tprangeSel).data('content', popoverContentEl.html());
    }
    var tempTop = ($(togglePopoverSel).outerHeight() - $(popoverSel).outerHeight()) /2;
    $(popoverSel).css('top', tempTop);
  };
  var callAjaxHandler = function(that) {
    var dataCallAjax = that.options.callAjax,
        url = dataCallAjax.url,
        listGetValSel = dataCallAjax.getValueTarget,
        //fillAjaxEl = $(dataCallAjax.fillAjaxTarget),
        opts = that.options,
        listSel = {};
    for(var i = 0, l = listGetValSel.length; i < l; i++){
      listSel['a' + i] = listGetValSel[i].split;
    }
    Site.getDataAjaxDefault({
      url: url,
      postData: Site.getPostData(listGetValSel, true),
      selector: listSel,
      successHandler: function(data) {
        if(data) {
          if($.isArray(dataCallAjax.fillAjaxTarget)) {
            for (var j = 0, len = dataCallAjax.fillAjaxTarget.length; j < len; j++) {
              updateHTML($(dataCallAjax.fillAjaxTarget[j]), data[j]);
            }
          } else {
            updateHTML($(dataCallAjax.fillAjaxTarget), data);
          }
          if(dataCallAjax.triggerEvtSel && dataCallAjax.triggerEvtSel.length) {
            if(opts.hasRemove){
              triggerEvt(dataCallAjax.triggerEvtSel, 'click', data, dataCallAjax.fillAjaxTarget);
            }
            fixHeightPopover();
          }
          if(opts.checkTimming) {
            checkTimming();
          }
        }
      }
    });
  };
  var handlerClickEvent = function(that) {
    //var el = that.element,
    var opts = that.options,
        vars = that.element.vars,
        //listOpt = vars.getValEl.find('option'),
        listSelectedOpt = vars.getValEl.find('option').filter(':selected'),
        listInp = [],
        listInpSel = [],
        listVal = [],
        hiddenInp = intputTag.replace('{ctrl}', opts.ctrlgroup),
        //form = el.closest('form'),
        popoverContentEl = $('.popover-content');
    if(!listSelectedOpt.length) {
      return;
    }
    if(vars.maxLengthEl.length && maxLength && (vars.tarEl.find('option').length >= maxLength || listSelectedOpt.length > maxLength)){
      return;
    }

    listSelectedOpt.remove();
    vars.tarEl.append(listSelectedOpt).focus();

    if(opts.ctrlgroup) {
      listSelectedOpt.each(function () {
        var startName = vars[opts.ctrlgroup === 'remove' ? 'getValEl' : 'tarEl'].attr('name').split('[]')[0] + '-' + $(this).val() + '-starttime',
            endName = vars[opts.ctrlgroup === 'remove' ? 'getValEl' : 'tarEl'].attr('name').split('[]')[0] + '-' + $(this).val() + '-endtime';

        listVal.push($(this).val());
        listInp.push(hiddenInp.replace('{name}', startName));
        listInp.push(hiddenInp.replace('{name}', endName));
        listInpSel.push('[name="' + startName + '"]');
        listInpSel.push('[name="' + endName + '"]');
      });
      if(opts.ctrlgroup === 'remove') {
        for(var i = 0, l = listInpSel.length; i < l; i++) {
          $(listInpSel[i]).closest(ctrlgroupSel).remove();
           $(listInpSel[i]).remove();
          popoverContentEl.find(containtValSel.replace('{value}', listVal[i])).remove();
          $(tprangeSel).data('content', popoverContentEl.html());
        }
        var tempTop = ($(togglePopoverSel).outerHeight() - $(popoverSel).outerHeight()) /2;
        $(popoverSel).css('top', tempTop);
      } else {
        var hiddenInpWrap = $(hiddenInpWrapSel);
        for(var j = 0, len = listInpSel.length; j < len; j++) {
          if(!hiddenInpWrap.find(listInpSel[j]).length) {
            if($('[data-client]:checked').not(':disabled').length) {
              hiddenInpWrap.append(listInp[j]).find('.hiden-time-input').attr('disabled', true);
              // $(listInp[j]).find('input').attr('disabled', true);
            } else {
              hiddenInpWrap.append(listInp[j]);
            }
          }
          $(listInpSel[j])['validateForm']();
        }
      }
    }

    if(opts.callAjax) {
      callAjaxHandler(that);
    }
  };

  var setMaxLength = function(value){
    maxLength = value;
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
          opts = that.options;

      el.vars = {
        getValEl: $(opts.getValue),
        tarEl: $(opts.target),
        maxLengthEl: $(opts.maxlengthEl)
      };

      this.element.off(Event.CLICK).on(Event.CLICK, function () {
        handlerClickEvent(that);
      });

      if(el.vars.maxLengthEl.length){
        setMaxLength(el.vars.maxLengthEl.val());
        el.vars.maxLengthEl.off(Event.CHANGE).on(Event.CHANGE, function(){
          setMaxLength($(this).val());
        });
      }
      fixHeightPopover();
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
    getValue: '',
    target: '',
    maxlengthEl: '',
    checkTimming: false,
    hasRemove: false
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
