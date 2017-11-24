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

  var pluginName = 'validateForm',
      //editPlanning = $.['edit-planning-load-ajax']('getTempData'),
      optTag = '<option value="{value}">{text}</option>',
      //liTag = '<li><a href="javascript:" data-value="{value}">{text}</a></li>',
      errorClass = 'error',
      errroSymbolSel = '.text-error',
      errorMesSel = '.text-errors',
      validateTimeRangeSel = '[data-timerange-point]',
      dataValidateTimeRange = 'validate-timerange',
      //dataTimeRangePnt = 'timerange-point',
      dataValidateTimeRangeMess = 'validate-timerage-message',
      ctrlGroupSel = '.control-group',
      errorSymbolTag = '<p class="text-error">*',
      errorMessTag = '<p class="text-errors">',
      errorDangerTag = '<div class="alert alert-danger">',
      errorDismis = '<a class="close" data-dismiss="alert" href="#">×</a>',
      dataPlus = 'plusdata',
      dataUpdateHTML = 'updateHtml',
      validAjaxSel = '[data-validajax]',
      validFormAjaxSel = '[data-valid-form-ajax]',
      validFormAjaxTarget = 'valid-form-ajax',
      validAjaxUrl = 'validajax-url',
      dataPassValidAjax = 'pass-validajax',
      dataValidAjaxMess = 'validajax-message',
      dataValidAjaxId = 'validajax-id',
      formValidSel = '#planning-mission-form',
      validAjaxEleSel = '[data-valid-elements]',
      prefix = 'validate_';

  // var getOptTag = function(data) {
  //   var listOpt = '';
  //   for(var i = 0, l = data.length; i < l; i++) {
  //     listOpt += optTag.replace('{value}', data[i].value).replace('{text}', data[i].text);
  //   }
  //   return listOpt;
  // };
  // var getLiTag = function(data) {
  //   var li = '';
  //   for(var i = 0, l = data.length; i < l; i++) {
  //     li += liTag.replace('{value}', data[i].value).replace('{text}', data[i].text);
  //   }
  //   return li;
  // };
  var submitErrorCallback = function(form, event, errors, that) {
    var i,
        j,
        err,
        errs = [],
        opts = that.options;

    event.preventDefault();
    for(i in errors) {
      var ele = form.find('[name="' + i.toString() + '"]'),
          dataCtrlgroup = ele.data('ctrlgroup'),
          ctrlEle = dataCtrlgroup ? $(dataCtrlgroup) : ele.closest(opts.ctrlSelector);
      if(errors[i].length) {
        if(!ctrlEle.find(opts.errorSelector).length) {
          ctrlEle.append('<p class="text-error">*');
        }
        ctrlEle.addClass(errorClass);
      }
      for(j = errors[i].length - 1; j >= 0; j--) {
        err = errors[i][j].replace(/<\!--.*-->$/, '');
        errs.push(err);
      }
    }
    if(!form.find(opts.errorTextSelector).length) {
      form.prepend(errorMessTag);
    }
    form.find(opts.errorTextSelector).html(errorDangerTag + errorDismis + '* ' + errs[0]);
    //.html("* " + errs[0]);
    if(form.data(dataValidateTimeRange)) {
      var minInp = form.find('[data-timerange-point="min"]'),
          maxInp = form.find('[data-timerange-point="max"]');
      if((Site.timeToSec(maxInp.val()) - Site.timeToSec(minInp.val())) <= 0) {
        form.find(validateTimeRangeSel).each(function() {
          var parent = $(this).closest(ctrlGroupSel);
          if(!parent.find(errroSymbolSel).length) {
            parent.append(errorSymbolTag);
          }
          parent.addClass(errorClass);
        });
      }
    }
  };
  var checkEditedOpt = function(el, data) {
    var editedOpt = el.find('option[value="' + data.value + '"]');
    if(editedOpt.length) {
      editedOpt.html(data.text);
    } else {
      el.append(optTag.replace('{value}', data.val).replace('{text}', data.text));
    }
  };
  var updateHTML = function(form, data) {
    var listSelector = form.data(dataUpdateHTML);
    if(data.hasCompany) {
      if($.isArray(data) && $.isArray(listSelector)) {
        for(var i = 0, l = listSelector.length; i < l; i++) {
          checkEditedOpt($(listSelector[i]), data[i]);
        }
      } else if($.isArray(listSelector) && !$.isArray(data)){
        for(var i2 = 0, l2 = listSelector.length; i2 < l2; i2++) {
          checkEditedOpt($(listSelector[i2]), data);
        }
      } else {
        checkEditedOpt($(listSelector), data);
      }
    }
  };
  var getPlusData = function(form) {
    var plusData = form.data(dataPlus);
    return Site.getPostData(plusData, true) ? '&' + prefix + Site.getPostData(plusData, true) : '';
  };
  // Use for validation after call ajax
  var validAjax = function(form, data, inp) {
    var modalSel = $('#confirm-modal'), formSelector = $(formValidSel);
    form.data(dataPassValidAjax, data.status);
    if(!data.status) {
      if(data.type && data.type === 'confirm') {
        if(formSelector.find(errroSymbolSel)) {
          formSelector.find(errroSymbolSel).empty();
          formSelector.find(errorMesSel).empty();
        }
        modalSel.modal('show');
        if(data.message) {
          modalSel.find('.modal-title').empty().html(data.message);
        }
        modalSel.find('a.confirm').off('click.confirm').on('click.confirm', function() {
          form.data(dataPassValidAjax, true);
          form.submit();
        });
        return;
      } else {
        data.message = errorDangerTag + errorDismis + data.message + '</div>';
        if(!inp.closest(ctrlGroupSel).find(errroSymbolSel).length) {
          inp.closest(ctrlGroupSel).append(errorSymbolTag);
        }
        if(!form.find(errorMesSel).length) {
          form.append(errorMessTag);
        }
        inp.closest(ctrlGroupSel).addClass(errorClass);
        form.find(errorMesSel).html(inp.data(dataValidAjaxMess) || data.message);
      }
      return;
    } else {
      form.submit();
    }
  };
  //send serialize of the form and handler ajax call to server and validation result
  var onValidFormAjaxHandler = function(form, data, inp) {
    Site.getDataAjaxDefault({
      postData: $(inp.data(validFormAjaxTarget)).serialize(),
      selector: {select: formValidSel},
      url: inp.data(validAjaxUrl),
      successHandler: function(data) {
        validAjax(form, data, inp);
      }
    });
  };

  var arrayLookupAttr = function(array, prop, val) {
    for (var i = 0, len = array.length; i < len; i++) {
      var itemSelect=$(array[i]);
        if (itemSelect.attr(prop) === val) {
            return itemSelect;
        }
    }
    return null;
  };

  var onValidAjaxEle = function(form, ele) {
    var eles = $(ele).data('valid-elements');
    var buttonShowPopup=arrayLookupAttr($(document.activeElement), 'data-showpopupbeforesubmit', '');
    if ( buttonShowPopup!== null && buttonShowPopup.data().showPopupBeforeSubmit.isChangeCheckbox()) {
      return;
    }
    Site.getDataAjaxDefault({
      postData: $(eles).serialize(),
      url: ele.data(validAjaxUrl),
      successHandler: function(data) {
        validAjax(form, data, $(eles));
      }
    });
  };

  //handler ajax call to server and validation result
  var onValidAjaxHandler = function(form, that, inp) {
    var hiddenInp = inp.data(dataValidAjaxId);
    var getValTarget = {};
    if($.isArray(hiddenInp)) {
      var l = hiddenInp.length;
      while(l--) {
        getValTarget[$(hiddenInp[l]).prop('name')] = $(hiddenInp[l]).val();
      }
    } else {
      getValTarget[$(hiddenInp).prop('name')] = $(hiddenInp).val();
    }
    getValTarget[inp.prop('name')] = inp.val();

    Site.getDataAjaxDefault({
        // postData: inp.prop('name') + '=' + inp.val() + '&' + hiddenInp.prop('name') + '=' + hiddenInp.val(),
        postData: getValTarget,
        selector: {select: 'body'},
        url: inp.data(validAjaxUrl),
        successHandler: function(data) {
          validAjax(form, data, inp);
        }
      });
  };
  var submitSuccessCallback = function(form, e, that) {
    if(form.data('updateHtml')) {
      e.preventDefault();
      form.find(that.options.errorTextSelector).empty();
      getPlusData(form);
      Site.getDataAjaxDefault({
        postData: form.serialize() + getPlusData(form),
        selector: {select: 'body'},
        url: form.data('url'),
        successHandler: function(data) {
          // var listVer = form.data('compare-version');
          form.closest('.modal').modal('hide');
          if(form.data('pass-update')) {
            $(form.data('show-popup')).modal('show');
            return;
          }
          updateHTML(form, data);
        }
      });
    }
    if(form.data(dataValidateTimeRange)) {
      var minInp = form.find('[data-timerange-point="min"]'),
          maxInp = form.find('[data-timerange-point="max"]');
      if((Site.timeToSec(maxInp.val()) - Site.timeToSec(minInp.val())) <= 0) {
        e.preventDefault();
        form.find(validateTimeRangeSel).each(function() {
          var parent = $(this).closest(ctrlGroupSel);
          if(!parent.find(errroSymbolSel).length) {
            parent.append(errorSymbolTag);
          }
          parent.addClass(errorClass);
          form.find(errorMesSel).html(form.data(dataValidateTimeRangeMess));
        });
      }
    }
    // valid ajax for login form and Gestion des points
    if(form.find(validAjaxSel).length && !form.data(dataPassValidAjax)) {
      e.preventDefault();
      onValidAjaxHandler(form, that, form.find(validAjaxSel));
    }
    // valid ajax for the List planning mission
    if(form.find(validFormAjaxSel).length > 0 && !form.data(dataPassValidAjax)){
      e.preventDefault();
      onValidFormAjaxHandler(form, that, form.find(validFormAjaxSel));
    }
    // valid mission working
    if(form.find(validAjaxEleSel).length > 0 && !form.data(dataPassValidAjax)){
      e.preventDefault();
      onValidAjaxEle(form, form.find(validAjaxEleSel));
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
      this.element.jqBootstrapValidation({
        filter: function() {
          return !$(this).is(':disabled');
        },
        submitError: function(form, event, errors) {
          submitErrorCallback(form, event, errors, that);
        },
        submitSuccess: function(form, event) {
          submitSuccessCallback(form, event, that);
        }
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
    formSelector: '',
    errorSelector: '.text-error',
    errorTextSelector: '.text-errors',
    ctrlSelector: '.control-group',
    submitLoadAjax: {},
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
