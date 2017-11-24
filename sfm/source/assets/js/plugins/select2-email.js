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

  var pluginName = 'select2-email',
      // Events = {
      //   CHANGE: 'change.' + pluginName,
      //   CLICK: 'click'
      // },
      win = $(window),
      body = $(body),
      //downKey = 40,
      //upKey = 38,
      tabKey = 9,
      spaceKey = 32,
      commaKey = 188,
      enterKey = 13,
      semiColon = 186,
      backspaceKey = 8,
      deleteIcon = '<a href="#" class="multiple-emails-close" title="Supprimer"><span class="glyphicon glyphicon-remove"></span></a>',
      deleteIconSel = '.multiple-emails-close',
      checkDupEmail = true,
      controlTag = '.control-group',
      errorMesSel = '.text-errors',
      errorMessTag = '<p class="text-errors">',
      errorClass = 'error',
     // errroSymbolSel = '.text-error',
      //errorEl = '<p class="text-error">*</p>',
      errorDangerTag = '<div class="alert alert-danger">',
      errorDismis = '<a class="close" data-dismiss="alert" href="#">×</a>',
      //errorEmails = [],
      errorMess = [],
      emailAutoComplete = '[data-email-auto-complete]',
      //dupEmailMess = 'Your input email duplicated',
      emailNotValid = 'Your input not valid';


  var isJsonString = function(str) {
    try {
      JSON.parse(str);
    }
    catch (e) {
      return false;
    }
    return true;
  },
  isHorizontalScrollBar = function() {
    return $(body).width() > $(window).width();
  },
  resizeWidth = function(that, minW) {
    var vars = that.vars,
        eleEmail = vars.emailInputContainer,
        wrapperW = eleEmail.innerWidth(),
        lastEmail = null,
        listEmailObjs = eleEmail.find(vars.listEmailSel),
        listEmailLen = listEmailObjs.length,
        listEmailWidth = null;
        //emailAutoCompleteWidth = eleEmail.find(emailAutoComplete).outerWidth();
    // 16 as a padding + border of parent element
    // 60 as a minimum width of one element
    if(listEmailLen > 0) {
      lastEmail = $(listEmailObjs[listEmailLen - 1]);
      listEmailWidth = lastEmail.position().left + lastEmail.outerWidth();
    }

    if(listEmailWidth && (wrapperW - listEmailWidth) < minW) {
      eleEmail.find(emailAutoComplete).width(wrapperW);
    } else {
      if(isHorizontalScrollBar()) {
        eleEmail.find(emailAutoComplete).width(wrapperW - listEmailWidth - 15);
      } else {
        eleEmail.find(emailAutoComplete).width(wrapperW - listEmailWidth - 5);
      }
    }
  },
  refreshEmails = function (that) {
    var emails = [],
    container = that.element.siblings(that.vars.wrapperSel);
    container.find('.multiple-emails-email span.email-name').each(function() {
      emails.push($(this).text());
    });
    that.element.val(JSON.stringify(emails));
    resizeWidth(that, 15);
  },
  displayError = function(that, errorMess) {
    if(!that.vars.form.find(errorMesSel).length) {
        that.vars.form.prepend(errorMessTag);
      }
    that.vars.form.find(errorMesSel).html(errorDangerTag + errorDismis + '* ' + errorMess);
    resizeWidth(that, 15);
  },
  checkRequired = function(form, el) {
    if(!el.val() || !JSON.parse(el.val())[0]) {
      //e.preventDefault();
      el.closest(controlTag).addClass(errorClass);
      if(errorMess.length === 0) {
        errorMess.push(el.data('email-required-mess') || 'This is required');
      }
    }
  },
  displayEmail = function(that, t, dupEmailCheck) {
    var dupEmailFound = false,
        errorEmails = [],
        // pattern = /\S+@\S+\.\S+/,
        pattern = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/,
        arr = t.val().trim().replace(/^,|,$/g , '').replace(/^;|;$/g , '');
    errorMess = [];
    arr = arr.replace(/"/g,'').split(/[\s,;]+/);
    for (var i = 0, len = arr.length; i < len; i++) {
      if (dupEmailCheck === true && $(that.element).val() && $(that.element).val().indexOf(arr[i]) !== -1) {
        // errorMess.push(dupEmailMess);
        // displayError(that, dupEmailMess);
        // dupEmailFound = true;
      } else if (pattern.test(arr[i]) === true) {
        var liEmail = $('<li class="multiple-emails-email"><span class="email-name" title="' + arr[i] + '">' + arr[i] + '</span></li>');
        liEmail.prepend($(deleteIcon)).insertBefore(that.vars.inputWraperEle);
      } else {
        errorEmails.push(arr[i]);
        errorMess.push(emailNotValid);
        // displayError(that, emailNotValid);
      }
    }
    $(deleteIconSel).click(function(e) {
      $(this).parent().remove();
      refreshEmails(that);
      e.preventDefault();
    });

    if(errorEmails.length > 0 || dupEmailFound === true){
      t.val(errorEmails.join('; '));
      var displayErr = setTimeout(function() {
        t.closest('.control-group').addClass(errorClass);
      }, 300);
      clearTimeout(displayErr);
    } else {
      t.val('').closest('.control-group').removeClass(errorClass);
    }
    refreshEmails(that);
  },
  backspaceToEdit = function(that, event) {
    var listEmailObjs = that.vars.emailInputContainer.find(that.vars.listEmailSel),
        listEmailLen = listEmailObjs.length,
        lastEmailObj = null,
        lastEmail = null;
    if(!that.vars.inputEle.val()) {
      if(listEmailLen > 0) {
        lastEmailObj = $(listEmailObjs[listEmailLen - 1]);
        lastEmail = lastEmailObj.find('.email-name').text();
        lastEmailObj.remove();
        refreshEmails(that);
      }
      lastEmail && that.vars.inputEle.val(lastEmail);
      event.preventDefault();
    }
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
          listSel = '.multiple-emails-ul',
          //vars = this.vars,
          listWrapper = $('<ul class="multiple-emails-ul"/>'),
          // input = '<div class="email-input"><input type="text" class="form-control multiple-emails-input text-left" /></div>',
          inputSel = '.multiple-emails-input';

      this.vars = {
        wrapperSel: '.multiple-emails-container',
        listEmailSel: '.multiple-emails-email',
        listSel: '.multiple-emails-ul',
        inputWraperSel: '.multiple-emails-input-wrapper',
        inputWraperEle: null,
        form: that.element.closest('form'),
        listSelEle: $('.multiple-emails-ul'),
        wrapper: $('<div class="multiple-emails-container" />'),
        listEle: null,
        inputEle: null,
        emailInputContainer: null,
        hideAutoCompleteTimeout: null,
        elVal: el.val()
      };

      that.vars.emailInputContainer = that.element.next(that.vars.wrapperSel);
      that.vars.inputWraperEle = that.vars.emailInputContainer.find(that.vars.inputWraperSel);
      that.vars.emailInputContainer.prepend(listWrapper);
      that.vars.listEle = el.closest(controlTag).find(listSel);
      that.vars.inputEle = el.closest(controlTag).find(inputSel);
      that.vars.inputWraperEle.appendTo(that.vars.listEle);
      var inpFontSize = that.vars.inputEle.css('font-size').split('px')[0];
      el.hide();
      // init email value
      if (that.vars.elVal !== ''  && isJsonString(that.vars.elVal)) {
        $.each(jQuery.parseJSON(that.vars.elVal), function(index, val) {
          $('<li class="multiple-emails-email"><span class="email-name" title="' + val + '">' + val + '</span></li>').prepend($(deleteIcon)).insertBefore(that.vars.inputWraperEle);
        });
        $(deleteIconSel).click(function(e) {
          $(this).parent().remove();
          refreshEmails(that);
          e.preventDefault();
        });
      }
      resizeWidth(that, 7);

      that.vars.inputEle.off('keydown.' + pluginName).on('keydown.' + pluginName, function(e) {
        var keynum;
        if(window.event){ // IE
          keynum = e.keyCode;
        } else if(e.which){
          keynum = e.which;
        }
        if (keynum === backspaceKey) {
          backspaceToEdit(that, e);
        } else if(inpFontSize && (inpFontSize*$(this).val().length)>10) {
          resizeWidth(that, 100);
        }
      });
      that.vars.inputEle.off('keyup.' + pluginName).on('keyup.' + pluginName, function(e) {
        var ele = $(this);
        ele.closest('.control-group').removeClass(errorClass);
        // var inputLength = ele.val().length,
        var keynum;
        if(window.event){ // IE
          keynum = e.keyCode;
        } else if(e.which){
          keynum = e.which;
        }
        if(keynum === tabKey || keynum === spaceKey || keynum === commaKey || keynum === semiColon) {
          displayEmail(that, ele, checkDupEmail);
        }
        else if (keynum === enterKey) {
          e.preventDefault();
          displayEmail(that, ele, checkDupEmail);
          return;
        }
      }).on('focus', function() {
        var ele = $(this);
        if(that.vars.emailInputContainer.hasClass('initing-ajax')) {
          that.vars.emailInputContainer.find(emailAutoComplete).removeClass('open');
        }
        if(ele.val()) {
          displayEmail(that, ele, checkDupEmail);
        }
        that.vars.hideAutoCompleteTimeout && clearTimeout(that.vars.hideAutoCompleteTimeout);
        that.vars.emailInputContainer.addClass('focus');
        ele.closest('.control-group').removeClass(errorClass);
        that.vars.form.find(errorMesSel).empty();
      }).on('focusout.'+pluginName, function() {
        that.vars.emailInputContainer.removeClass('focus');
        that.vars.hideAutoCompleteTimeout = setTimeout(function() {
          that.vars.emailInputContainer.find(emailAutoComplete).removeClass('open');
        }, opts.timesDelayEmail);
      }).on('blur', function() {
        var ele = $(this);
        if(that.vars.emailInputContainer.hasClass('initing-ajax')) {
          that.vars.elVal = el.val();
          if (that.vars.elVal !== ''  && isJsonString(that.vars.elVal)) {
            $.each(jQuery.parseJSON(that.vars.elVal), function(index, val) {
              $('<li class="multiple-emails-email"><span class="email-name" title="' + val + '">' + val + '</span></li>').prepend($(deleteIcon)).insertBefore(that.vars.inputWraperEle);
            });
            $(deleteIconSel).click(function(e) {
              $(this).parent().remove();
              refreshEmails(that);
              e.preventDefault();
            });
          }
          resizeWidth(that, 7);
          that.vars.emailInputContainer.removeClass('initing-ajax');
        } else {
          if(ele.val()) {
            displayEmail(that, ele, checkDupEmail);
          }
        }
      });

      that.vars.emailInputContainer.off('click').on('click',function() {
        that.vars.inputEle.focus();
      });

      that.vars.form.off('submit').on('submit', function(e) {
        $(this).find('input[data-required]').each(function() {
          checkRequired(that.vars.form, $(this));
        });
        if(errorMess.length > 0){
          e.preventDefault();
          displayError(that, errorMess[0]);
        }
      });
      // auto complete ha
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
    timesDelayEmail: 200,
    required: null
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
    win.bind('keydown.' + pluginName, function(event){
      if(event.keyCode === enterKey && $('.multiple-emails-container.focus').length > 0) {
        event.preventDefault();
        //displayEmail($('.multiple-emails-input'), $('.multiple-emails-input'), true);
      }
    });
  });

}(jQuery, window));
