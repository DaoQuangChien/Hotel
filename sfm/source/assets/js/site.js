var Site = (function($, window, undefined) {
  var dpSelector = '[data-datepicker]',
      tpSelector = '[data-timepicker]',
      dtSelector = '[data-datetimepicker]',
      dtpickerNotSecond = '[data-datetimepicker-notsecond]',
      timeSpinnerSel = '[data-timespinner]',
      changeRequireCheckbox = '[data-change-require-checkbox]',
      dataChangeSelector = '[data-change-selector]',
      ajaxLoadSelector = '.ajax-loading',
      errModalSelector  = '#error-modal',
      modalContentSelector = '.content',
      errorSel = '.text-errors',
      messSel = '.alert-success',
      errorCaretSel = '.text-error',
      OPT_TAG = '<option value={value}>{text}</option>',
      OPT_TAG_1 = '<option value={value} {selected}>{text}</option>',
      goToDatepickerSelector = '[data-goto]',
      hiddenClass = 'hidden',
      Keys = {
        ENTER: 13
      },
      Event = {
        SHOW_MODAL: 'show.bs.modal',
        HIDE_MODAL: 'hide.bs.modal',
        SHOWN_MODAL: 'shown.bs.modal',
        HIDDEN_MODAL: 'hidden.bs.modal',
        DBCLICK:'dblclick.showpopup',
        SUBMIT: 'submit.autoselect',
        CHANGE_SUBMIT: 'change.changtosubmit',
        CHANGE_ADDREGEX: 'change.addregex',
      },
      dataSubmitSelector = '[data-submit]',
      searchBtnSelector = '.input-group-addon',
      dataHideToShowModal = '[data-dismiss-show-popup]',
      body = $('body'),
      loginUrl = '/login',
      dataDblclick = '[data-dblclick-show-popup]',
      // dataAutoSelect = '[data-autoselect]',
      popoverValueInp = $('[data-popover-content]'),
      popoverSel = $('.popover'),
      dataPopoverContent = 'popover-content',
      popoverToggleEl = $('[data-toggle="popover"]'),
      pTag = '<p data-value="{value}">{text}</p>',
      changeToSubmitSel = '[data-change-to-submit]',
      errorEle = '<p class="text-error">*</p>',
      errorDangerTag = '<div class="alert alert-danger">',
      errorDismis = '<a class="close" data-dismiss="alert" href="#">×</a>',
      altFieldSel = '[data-altfield]',
      pinPopupEl = $('#pin-modal'),
      errorEl = $('#error'),
      frenchDate = {
        Mon: 'Lundi ',
        Tue: 'Mardi',
        Wed: 'Mercredi',
        Thu: 'Jeudi',
        Fri: 'Vendredi',
        Sat: 'Samedi',
        Sun: 'Dimanche'
      };
  var Message = {
    show: function(message) {
      var messagePopupContent = errorEl.find('.alert-text');
      messagePopupContent.html(message);
      errorEl.modal('show');
    },
    hide: function(){
      errorEl.modal('hide');
    }
  };
  var validClient = function(sel, e) {
    var el = $(sel),
        errMess = el.closest('form').find('.text-errors'),
        thisError = el.not(':disabled, :checked').closest('.form-group').prev('.control-group'),
        checkClient = $(sel + ':checked').not(':disabled'),
        allClient  = el.not(':disabled');
    if(checkClient.length > 0 && allClient.length > checkClient.length) {
      e.preventDefault();
      thisError.append(errorEle).addClass('error');
      errMess.html(errorDangerTag + errorDismis + '* ' + (el.data('valid-client-mess')|| l10n.errMess.client_role_err));
    }
  };
  // var validSociete = function(sel, e) {
  //   var el = $(sel),
  //       errMess = el.closest('form').find('.text-errors'),
  //       thisError = el.closest('.control-group'),
  //       checkClient = $('[data-client]:checked').not(':disabled');
  //   if(checkClient.length && el.find('option').length > 1) {
  //     e.preventDefault();
  //     thisError.append(errorEle).addClass('error');
  //     errMess.html(errorDangerTag + errorDismis + '* ' + (el.data('max-societe-mess')||l10n.errMess.societe_err));
  //   }
  // };
  var changeToSubmitHandler = function() {
    $('[name="' + $(changeToSubmitSel).attr('name') + '"]').off(Event.CHANGE_SUBMIT).on(Event.CHANGE_SUBMIT, function() {
      $(this).closest('form').submit();
    });
  };
  var changeAltField = function() {
    $(altFieldSel).html($('#datepicker-control').val());
  };
  var onSelectDateHandler = function (params) {
    $(params.data.selector).trigger(params.data.evt);
  };
  var getLastEl = function(str, spliter) {
    return $(str.split(spliter)).get(-1);
  };
  var removeLastEl = function(str, spliter) {
    return str.replace(spliter + getLastEl(str, spliter), '');
  };
  var removeSecOfTime = function (str, spliter) {
    if(str.split(spliter).length > 2) {
      return removeLastEl(str, spliter);
    }
    return str;
  };
  var filterPopover = function () {
    if(popoverValueInp.length) {
      var listContent = '', showPopover = false;

      popoverValueInp.each(function() {
        var ele = $(this),
            nextEle = ele.parent('.control-group').next();
        if(!nextEle.length) {
          return;
        }
        if(ele.prop('name').replace(/-starttime|-endtime/g, '') === nextEle.find('[data-popover-content]').prop('name').replace(/-starttime|-endtime/g, '')) {

          var inpName = removeLastEl(ele.data(dataPopoverContent), '-'),
              val = getLastEl(ele.data(dataPopoverContent), '-');
          if(ele.val()) {
            showPopover = true;
            listContent += pTag.replace('{value}', val).replace('{text}', $('[name="' + inpName + '"]').find('option').filter('[value="' + val + '"]').text() + ': ' + removeSecOfTime(ele.val(), ':') + '-' + removeSecOfTime(nextEle.find('[data-popover-content]').val(), ':'));
          }
        }
      });
      if(showPopover) {
        popoverToggleEl.popover('show').off('click.popover');
        $('.popover-content').append(listContent);
        var tempTopval = (popoverToggleEl.outerHeight() - popoverSel.outerHeight()) /2;
        popoverSel.css('top', tempTopval);
      }

    }
  };
  var goToDatepicker = function(params) {
    var date = $(dpSelector).datepicker('getDate');
        // newDate = new Date();
    if(params === 'next') {
      date.setTime(date.getTime() + 1000 * 60 * 60 * 24);
    } else {
      date.setTime(date.getTime() - 1000 * 60 * 60 * 24);
    }
    $(dpSelector).datepicker('setDate', date);
    onSelectDateHandler({el:  $(dpSelector), data:  $(dpSelector).data('trigger-on-select')});
    changeAltField();
  };
  var checkLogin = function(data) {
    try {
      data = $.parseJSON(data);
      // console.log(data && data.session === 'expired');
    } catch(err) {
      //console.log('data is not JSON format');
    }
    if(data.session && data.session === 'expired') {
      window.location.replace(loginUrl);
      return;
    }
  };
  var validGetValTar = function (targetEl) {
    // var errs = [];
    for (var i = 0, l = targetEl.length; i < l; i++) {
      if($(targetEl[i]).jqBootstrapValidation('hasErrors')) {
        return false;
      }
    }
    return true;
  };
  var showAjaxErr = function(params) {
    if($(errModalSelector).length) {
      $(errModalSelector).modal('show').find(modalContentSelector).text(params.text);
      return;
    }
    $('body').append('<div class="modal fade error-modal" id="error-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><button type="button" class="close" data-dismiss="modal" aria-label="close"><span aria-hidden="true">&times;</span></button><p class="content">data error<p>');
    $(errModalSelector).modal('show').find(modalContentSelector).text(params.text);
  };
  var ajaxErrCallBack = function(err, timeout) {
    if(timeout === 'timeout') {
      showAjaxErr({text: l10n.ajaxErr.TIMEOUT});
      return;
    }
    if(err && err.responseText) {
      showAjaxErr({text: err.responseText});
    }
  };
  var getDataAjaxDefault = function(params) {
    var paramsTag = params.selector;
    $.ajax({
      url: params.url,
      type: params.ajaxType || 'POST',
      dataType: params.dataType || 'json',
      timeout: params.timeout || 15000,
      data: params.postData || {},
      error: function(err, timeout) {
        $(ajaxLoadSelector).addClass(hiddenClass);
        ajaxErrCallBack(err, timeout);
      },
      beforeSend: params.beforeSendCallback || function() {
        for(var i in paramsTag) {
          var paramsTagParent = $(paramsTag[i]);
          if($(paramsTag[i])[0]) {
            if($(paramsTag[i])[0].nodeName !== 'DIV') {
              paramsTagParent = $(paramsTag[i]).closest('div');
            }
          }
          if(paramsTagParent.find(ajaxLoadSelector).length) {
            paramsTagParent.find(ajaxLoadSelector).removeClass(hiddenClass);
          }else {
            paramsTagParent.append('<div class="' + ajaxLoadSelector.split('.')[1] + '">');
          }
        }

      },
      success:  function(data) {
        checkLogin(data);
        for(var i in paramsTag) {
          $(paramsTag[i]).closest('div').find(ajaxLoadSelector).addClass(hiddenClass);
        }
        params.successHandler(data);
      },
      async: false
    });
  };
  var showMessage = function(eleSel, message, type) {
    var errTag = '<div class="alert alert-{type}"><a class="close" data-dismiss="alert" href="#">×</a>* {message}</div>',
        errHtml = '';
    if(!eleSel) {
      eleSel = '.text-errors';
    }
    errHtml = errTag.replace('{type}', type||'danger').replace('{message}', message||'');
    $(eleSel).eq(0).html(errHtml);
  };

  var showMessageForm = function(form, eleSel, message, type) {
    var errTag = '<div class="alert alert-{type}"><a class="close" data-dismiss="alert" href="#">×</a>* {message}</div>',
        errHtml = '';
    if(!eleSel) {
      eleSel = '.text-errors';
    }
    errHtml = errTag.replace('{type}', type||'danger').replace('{message}', message||'');
    $(eleSel, form).html(errHtml);
  };

  var submitSuccessCallback = function(form, event) {
    if(form.data('confirm') && !form.data('success')) {
      event.preventDefault();
      var btn = form.find('[data-confirm-button]');
      $(btn.data('target')).data('not-return', false);
      btn.trigger('click.bs.data-api.modal');
      form.closest('[data-address-modal]').modal('hide');
    } else {
      form.trigger($.Event('success.validate', { eventSubmitForm: event}));
      form.removeData('success');
    }
    $(errorSel, form).empty();
  };
  var submitErrorCallback = function(form, event, errors) {
    event.isDefaultPrevented();
    event.preventDefault();
    var i,
      j,
      err,
      errs = [];
    $(errorSel, form).html('');
    for(i in errors){
      if(errors.hasOwnProperty(i)) {
        for(j = 0; j < errors[i].length; j++){
            err = errors[i][j].replace(/<\!--.*-->$/, '');
            if(!!$.inArray(err, errs)) {
                errs.push(err);
            }
        }
      }
    }
    showMessageForm(form, errorSel, errs[0]);
    $(errorSel, form).removeClass('hidden');
  };
  // var hideMessage = function(eleSel) {
  //   if(!eleSel) {
  //     eleSel = errorMessageSel;
  //   }
  //   $(eleSel).empty();
  //   body.find('.control-group').removeClass('error');
  // };
  var settingJqBootstrapValidation = function($validatedTarget) {
    $validatedTarget.jqBootstrapValidation({
      filter: function() {
        // console.log($(this).attr('id') + ' =>> ' + !$(this).is(':disabled'));
        return !$(this).is(':disabled');
      },
      submitSuccess: function (form, event) {
        // console.log('success');
        submitSuccessCallback(form, event);
      },
      submitError: function(form, event, errors){
        // console.log('fail');
        submitErrorCallback(form, event, errors);
      }
    });
  };
  var changeRequireFields = function($curItem, flag){
    var $changedTarget = $($curItem.attr('data-changed-target'));
    var $controlGroup = $changedTarget.closest('[data-control-selector="control-group"]');
    if($curItem.is(':checked')) {
      if(flag === true) {
        if(!$controlGroup.hasClass('control-group')) {
          $controlGroup.addClass('control-group');
          $(errorSel).empty();
          $controlGroup.find(errorCaretSel).css('display', '');
          $changedTarget.removeClass('error');
        }
      }
    } else {
      if($controlGroup.hasClass('control-group')) {
        $controlGroup.removeClass('control-group');
        $(errorSel).empty();
        $controlGroup.find(errorCaretSel).css('display', '');
        $changedTarget.removeClass('error');
      }
    }
  };
  var handlingChangeSelector = function($curItem, flag) {
    var listDisabledTarget = $curItem.data('disabled-target');
    var listCheckedTarget = $curItem.data('checked-target');
    var i, len;
    if($curItem.is(':checked')) {
      if(typeof listDisabledTarget !== 'undefined') {
        for (i = 0, len = listDisabledTarget.length; i < len; i++) {
          $(listDisabledTarget[i]).prop('disabled', true);
        }
      }
      if(typeof listCheckedTarget !== 'undefined') {
        for (i = 0, len = listCheckedTarget.length; i < len; i++) {
          $(listCheckedTarget[i]).prop('checked', true);
        }
      }
    } else {
      if(flag) {
        if(typeof listDisabledTarget !== 'undefined') {
          for (i = 0, len = listDisabledTarget.length; i < len; i++) {
            $(listDisabledTarget[i]).prop('disabled', false);
          }
        }
        if(typeof listCheckedTarget !== 'undefined') {
          for (i = 0, len = listCheckedTarget.length; i < len; i++) {
            $(listCheckedTarget[i]).prop('checked', false);
          }
        }
      }
    }
  };
  var init = function() {
    $.datepicker.regional.fr = $.extend(true, $.datepicker.regional.en, {
        dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
      });

    $.datepicker.setDefaults($.datepicker.regional.fr);
    $.each($(dpSelector), function() {
      var curDatepicker = $(this);
      curDatepicker.datepicker({
        dateFormat: curDatepicker.data('date-format') || 'yy-mm-dd',
        altField: '#datepicker-control',
        altFormat: 'DD, d MM, yy',
        onSelect: function(selectedDate) {
          var self = $(this),
              range = self.data('datepicker-range'),
              triggerData = self.data('trigger-on-select');
              // ,
              // date = self.datepicker('getDate');
          changeAltField();

          if(range){
            $('[data-datepicker-range="' + (range === 'minDate'? 'maxDate' : 'minDate') + '"]').datepicker('option', range, selectedDate);
          }
          if(triggerData) {
            onSelectDateHandler({el: $(this), data: triggerData});
          }
        }
      });
    });
    $.widget('ui.timespinner', $.ui.spinner, {
      options: {
        step: 60 * 1000,
        page: 60
      },

      _parse: function( value ) {
        if ( typeof value === 'string' ) {
          if (Number(value) === value) {
            return Number( value );
          }
          return +Globalize.parseDate(value);
        }
        return value;
      },

      _format: function(value) {
        return Globalize.format(new Date(value), 't');
      }
    });

    Globalize.culture('de-DE');

    $(timeSpinnerSel).timespinner();
    if($(dpSelector).data('auto-setdate')) {
      $(dpSelector).datepicker('setDate', new Date());
      changeAltField();
    }
    $(goToDatepickerSelector).off('click.goTo').on('click.goTo', function() {
      goToDatepicker($(this).data('goto'));
    });
    $.timepicker.regional.fr = $.extend(true, $.timepicker.regional.en, {currentText: 'Maintenant', closeText: 'Fini', timeText: 'Temps', hourText: 'Heure', secondText: 'deuxième'});
    $.timepicker.setDefaults($.timepicker.regional.fr);
    $(tpSelector).timepicker();
    $(dtSelector).datetimepicker({
      dateFormat: 'yy-mm-dd',
      timeFormat: 'HH:mm:ss'
    });
    $(dtpickerNotSecond).datetimepicker({
      dateFormat: 'yy-mm-dd',
      timeFormat: 'HH:mm'
    });
    $(searchBtnSelector).off('click.toSubmit').on('click.toSubmit', function() {
      $(this).closest('form').submit();
    });
    $(dataSubmitSelector).off('keypress.toSubmit').on('keypress.toSubmit', function(e) {
      if(e.keyCode === Keys.ENTER) {
        $(this).siblings(searchBtnSelector).trigger('click.toSubmit');
      }
    });

    body.off(Event.HIDDEN_MODAL).on(Event.HIDDEN_MODAL, dataHideToShowModal, function () {
      body.addClass('open').css('padding-right', 0);
      if($(this).data('dismiss-call-back') && !$(this).find('form').find('input,select').not('[type="submit"]').jqBootstrapValidation('hasErrors')) {
        $($(this).data('dismiss-call-back').selector).trigger($(this).data('dismiss-call-back').events);
        return;
      }
      $($(this).data('dismiss-show-popup')).modal('show');
    });

    $(document).on('submit', function (e) {
      if ($('[data-client]').length) {
        validClient('[data-client]', e);
        // validSociete('#temp-company', e);
      }
    });

    // js from dev
    $('#rp_btn_excel').click(function() {
       $('#rp_hide_chanel').val(1);
       //$('#frm_report').submit();
    });
    $('#rp_btn_pdf').click(function() {
       $('#rp_hide_chanel').val(2);
       //$('#frm_report').submit();
    });

    $(dataDblclick).off(Event.DBCLICK).on(Event.DBCLICK, 'option',function() {
      var btn = $($(this).closest(dataDblclick).data('target'));
      btn.trigger('click');
      $(btn.data('modal-target')).find('[data-timepicker-range]').data('fill-html-target', $(this).closest(dataDblclick).attr('name') + '-' + $(this).val());
    });

    filterPopover();
    changeToSubmitHandler();

    $('[name="' + $(changeToSubmitSel).attr('name') + '"]').prop('checked', false);

    $('.nav-tabs').find('li:not(".disabled") a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    });

    // handle check mission status
    $('[data-check-mission]').on('click.checkMission', function(e) {
      e.preventDefault();
      var el = $(this),
          urlSel = el.data('check-mission-url'),
          missionId = el.data('check-mission')||-1,
          hrefLink = el.attr('href')||'#';

      getDataAjaxDefault({
        selector: {selector: 'body'},
        url: urlSel ||'#',
        postData: {'mission': missionId},
        dataType: 'text',
        successHandler: function(data) {
          if(data==='false') {
            $(el.data('check-mission-popup')||'#modal-mission').modal('show');
          } else {
            window.open(hrefLink, '_self');
          }
        }
      });
    });

    //change spec of transport when click
    var listchangeCheckbox = $(dataChangeSelector);
    if(typeof listchangeCheckbox !== 'undefined' && listchangeCheckbox.length !== 0){
      $.each(listchangeCheckbox, function() {
        handlingChangeSelector($(this), false);
        $(this).off('click.dataChangeSelector').on('click.dataChangeSelector',function() {
          handlingChangeSelector($(this), true);
        });
      });
    }
    // check client checked and remove timing off the site
    var inputTimmingSels = $('[data-client]').parents('.radio').siblings('.radio').andSelf().find('input');

    inputTimmingSels.on('change.client', function() {
      var listInpSel = $('#timing-input').find('.hiden-time-input');
      var inputTimming = $(this);
      if((inputTimming.data('client') && inputTimming.not(':disabled').length && inputTimming.is(':checked')) ||
          (inputTimming.data('radio-force-disable') && inputTimming.prop('checked'))) {
        // if($('[data-client]:checked').not(':disabled').length){
        // $('.popover-content').empty();
        // var popoverSel = $('.popover');
        var tempTopval = (popoverToggleEl.outerHeight() - popoverSel.outerHeight()) /2;
        popoverSel.css('top', tempTopval);
        listInpSel.each(function() {
          $(this).attr('disabled', 'true');
        });
      } else {
        listInpSel.each(function() {
          $(this).removeAttr('disabled');
        });
      }
    });
    // init default jqBootstrapValidation
    var $validatedTarget = $('[data-setting-validation]');
    if(typeof $validatedTarget !== 'undefined' && $validatedTarget.length !== 0) {
      settingJqBootstrapValidation($validatedTarget);
    }
    //check required for fields
    var $changeRequireCheckbox = $(changeRequireCheckbox);
    if(typeof $changeRequireCheckbox !== 'undefined' && $changeRequireCheckbox.length !== 0) {
      $changeRequireCheckbox.each(function(){
        var $curItem = $(this);
        $($curItem.attr('data-changed-target')).closest('.control-group').attr('data-control-selector', 'control-group');
        changeRequireFields($curItem, false);
        $curItem.off('change.change-require-checkbox').on('change.change-require-checkbox', function(){
          changeRequireFields($(this), true);
        });
      });
      var $form = $($changeRequireCheckbox[0].closest('form'));
      if(!$form.hasClass('disabled-required')) {
        $form.addClass('disabled-required');
        var controlList = $form.find('[data-control-selector="control-group"]');
        $.each(controlList, function(){
          var $field = $(this).find('input, select, textarea').not('[type="submit"]');
          if(typeof $field !== 'undefined' && $field.length === 1) {
            $field.off('focus.disabledRequired').on('focus.disabledRequired', function(){
              var $controlGroup = $(this).closest('[data-control-selector="control-group"]');
              if(!$controlGroup.hasClass('control-group')) {
                $controlGroup.find(errorCaretSel).css('display', '');
              }
            });
          }
        });
        $form.on('submit.disabledRequired', function (e) {
          var checkedList = $form.find('[data-control-selector="control-group"]');
          $.each(checkedList, function(){
            var $controlGroup = $(this);
            if(!$controlGroup.hasClass('control-group')) {
              var $field = $controlGroup.find('input, select, textarea').not('[type="submit"]');
              if(typeof $field !== 'undefined' && $field.length === 1) {
                var errors = $field.triggerHandler('validation.validation', {submitting: true});
                if(errors.length !== 0) {
                  e.preventDefault();
                  showMessage(errorSel, errors[0]);
                  $controlGroup.find(errorCaretSel).show();
                }
              }
            }
          });
        });
      }
    }
    // handle exxport in reporting page
    body.off('change.getDate')
        .on('change.getDate', '[data-set-default-datepicker]', function() {
      var self = $(this);
      if(!self.val().length) {
        self.datepicker('setDate', new Date());
      }
      self.closest('[data-datepicker-parent]')
        .find('[data-get-date]')
        .text(self.datepicker('getDate') && frenchDate[self.datepicker('getDate').toString().split(' ')[0]]);
    });
    $('[data-set-default-datepicker]').trigger('change.getDate');
    // confirm
    body.off('click.confirm').on('click.confirm', '[data-confirm-modal]', function() {
      var that = $(this),  modal = that.closest('[data-modal]');
      if(modal.data('not-return')) {
        $(this).closest('form').submit();
        modal.modal('hide');
        return;
      }
      $(that.data('confirm-modal'))
        .find('form')
        .data('success', true).submit();
      modal.data('close-all-modal', true).modal('hide');
    }).on('click.transport', '[data-id-transport]', function() {
      var that = $(this);
      $(that.data('target')).find('[data-id-store]').val(that.data('id-transport'));
    }).on('click.bs.modal.data-api', '[data-popup-return]', function() {
      $($(this).data('target')).data('not-return', true);
    });
    //event show/hide popup
    pinPopupEl.on(Event.SHOW_MODAL, function () {
      var verticalMiddle = $(this).find('[data-vertical-middle]');
      if (verticalMiddle.length) {
        setTimeout(function () {
          verticalMiddle.css('margin-top', -(verticalMiddle.outerHeight() / 2));
        });
      }
    });
    errorEl.on(Event.SHOW_MODAL, function () {
      pinPopupEl.modal('hide');
    }).on('hidden.bs.modal', function() {
      pinPopupEl.modal('show');
      body.css('padding-right', '');
    });
    body.on(Event.HIDE_MODAL, '#confirm-modal', function(){
      var that = $(this),
          modal = that.find('[data-confirm-modal]');
      if(that.data('close-all-modal')) {
        that.removeData('close-all-modal');
        return;
      }
      if(that.data('not-return')) {
        that.removeData('not-return');
        return;
      }
      $(modal.data('confirm-modal')).modal('show');
    }).on(Event.HIDE_MODAL, '[data-address-modal]',function (e) {
      var that = $(this),
          thisId = '#' + this.id;
      if($(this).data('loading') && $(this).data('confirm-download')) {
        e.preventDefault();
        return;
      }
      if(that.attr('data-address')) {
        $(that.attr('data-address')).modal('show');
      }
      // handle select tag to call popup
      $('[data-select-show-popup]').each(function () {
        var selectObject = $(this).attr('data-select-show-popup'),
            thatId = null;
        if(selectObject.length) {
          try {
            thatId = $.parseJSON($(this).attr('data-select-show-popup')).id;
          } catch(err) {
            // console.log(err.message);
            thatId = null;
          }
        }
        if (thisId === thatId) {
          $(this).find('option:selected').prop('selected', false);
        }
      });
    });

  };


  var getMutilSelectTagVal = function (el, isGetAll) {
    var listVal = '',
        listOpt =  [],
        optEl = el.find('option');
    if(!optEl.length) {
      return listVal;
    }
    optEl.each(function() {
      listOpt.push($(this).val());
    });
    for (var i = 0, l = (isGetAll ? listOpt : el.val()).length; i < l; i++) {
      listVal += (isGetAll ? listOpt : el.val())[i] + (i === l - 1 ? '' : ',');
    }
    return listVal;
  };
  var getPostData = function(listSelector, isGetAll, idx) {
    var listVal = '';
    if(!listSelector) {
      return;
    }
    for (var i = 0, l = listSelector.length; i < l; i++) {
      var el = $(listSelector[i]);
      if(el && el.length) {
        if(el[0].nodeName === 'FORM') {
          return listVal = el.serialize();
        }
        if(el[0].nodeName === 'TD') {
          listVal += listSelector[i].replace('[data-', '').replace(']', '') + '=' + idx[i].find(listSelector[i]).text() + (i === l - 1 ? '' : '&');
        } else {
          listVal += el.attr('name') + '=' + (el.prop('multiple') ? getMutilSelectTagVal(el, isGetAll) : el.val()) + (i === l - 1 ? '' : '&');
        }
      }
    }
    return listVal;
  };

  var requiredTarget = function(el, e) {
    var result = true;
    el.each(function() {
      var input = $(this);
      var formEl =  input.closest('form');
      var inputTarget = formEl.find(input.data('required-target')),
      thisError = inputTarget.nextAll().filter('.text-error').closest('.control-group'),
      errMess = el.closest('form').find(errorSel);

      //Custom validate required target. When having data-container-valid-exits, it will ignore validtion
      if(input.attr('data-container-valid-exits')) {
        thisError = thisError.length === 0 ? $(input.attr('data-container-valid-exits')).closest('.control-group') : thisError;
        thisError = thisError.length === 0 ? input.closest('.control-group') : thisError;
        if(inputTarget.length>0) {
          thisError.removeClass('error');
        } else {
          e.preventDefault();
          thisError.addClass('error');
          showMessage(errMess, el.data('required-target-message')||'Required Message');
           result = false;
        }
      } else if(input && input.val() && input.val().trim() !== ''){
        if (inputTarget && inputTarget.val() && inputTarget.val().trim() !== '') {
          thisError.removeClass('error');
        } else {
          e.preventDefault();
          thisError.addClass('error');
          showMessage(errMess, el.data('required-target-message')||'Required Message');
          result = false;
        }
      }
    });
    return result;
  };

  var timeToSec = function(params) {
    var arrTime = params.split(':');
    return parseInt(arrTime[0]) * 3600 + parseInt(arrTime[1]) * 60 + (parseInt(arrTime[2]) || 0) ;
  };

  var getDifTime = function(params) {
    var time1 = timeToSec(params.earlyTime),
        time2 = timeToSec(params.lateTime),
        totalTime;
    return totalTime = (time2 > time1 ? time2 : time2 + 24 * 3600) - time1;
  };

  var convertTime = function(totalTime) {
    var hh, mm, ss;
    hh = Math.floor(totalTime / 3600);
    totalTime -= hh * 3600;
    mm = Math.floor(totalTime / 60);
    totalTime -= mm * 60;
    ss = totalTime;
    return (hh.toString().length > 1 ? hh : ('0' + hh)) + ':' + (mm.toString().length > 1 ? mm : ('0' + mm)) + ':' + (ss.toString().length > 1 ? ss : ('0' + ss));
  };
  var convertDate = function(d) {
    var tmpArr;
    tmpArr = d.split('/');
    return new Date(parseInt(tmpArr[2].trim()), parseInt(tmpArr[1].trim())-1, parseInt(tmpArr[0].trim()));
  };
  var convertToDate = function(d) {
    return d.getDate() + '/' + d.getMonth() + '/' + d.getUTCFullYear();
  };


  // var fillDataToForm = function(fillDatas) {
  //   var data = fillDatas.data;
  //     var selectors = fillDatas.selectors;
  //     selectors.forEach(function(idx) {

  //     });
  //     if(data.category_id) {
  //       that.vars.id.val(data.category_id);
  //     }
  //     if(data.title) {
  //       that.vars.titleSel.val(data.title);
  //     }
  //     if(data.description) {
  //       that.vars.contentSel.val(data.description);
  //     }
  //     if(data.unit && that.vars.unitSel.length > 0) {
  //       var i = 0,
  //           uLen = data.unit.length,
  //           unitOpt = '';
  //       for(i; i< uLen; i++) {
  //         unitOpt += OPT_TAG.replace('{value}', data.unit[i].value).replace('{text}', data.unit[i].text).replace('{selected}', data.unit[i].selected?'selected':'');
  //       }
  //       that.vars.unitSel.html(unitOpt);
  //     }
  // };
  /**
   * [hideErrors to hide the error/info message and caret]
   * @param  {[object]} target [selector]
   */
  var hideErrors = function(target) {
    target.find(errorSel).empty();
    $(messSel).remove();
    target.find(errorCaretSel).remove();
  };
  /**
   * [showForm showForm to add/edit onpage]
   * @param  {[object]} params []
   * @return {[null]}
   */
  var showForm = function(params) {
    var  targetSel = $(params.target);
      // errorMessageEles = targetSel.find(errorSel),
      // messageEles = $(messSel),
      // errorCarets = targetSel.find(errorCaretSel);

    hideErrors(targetSel);

    targetSel[0].reset();

    if(params.resetValue) {
      if(params.resetValue.indexOf('#') !== -1 || params.resetValue.indexOf('.') !== -1) {
        targetSel.find(params.resetValue).val('');
      } else {
        targetSel.find('input[name="'+ params.resetValue +'"]').val('');
      }
    }
    targetSel.removeClass('hide');
    targetSel.find((params.closeBtnSel || '#cancel')).off('click').on('click',function(e) {
      e.preventDefault();
      targetSel.addClass('hide');
    });

    body.stop().animate({scrollTop: targetSel.offset().top}, 250);
  };
  /**
   * [editPlanningHandler description]
   * @param  {[object]} params [description]
   */
  var editPlanningHandler = function(params) {
    var today = new Date(),
          data = params.data,
          target = params.target,
          targetSel = $(target),
          planningIdSel = target.find('#planning-id'),
          companySel = target.find( '#company'),
          siteSel = target.find('#site'),
          dateTypeInput = target.find('[data-date-type] input:radio'),
          startDateEles = target.find('#start-date-input'),
          endDateEles = target.find('#end-date-input'),
          listDateInput = target.find('#multi-dates-picker.list-date'),
          listDateSel = target.find('#specific-dates'),
          startTimeEles = target.find('#start-time'),
          endTimeEles = target.find('#end-time'),
          // missionSel = target.find('#mission'),
          presenceEles = target.find('#presence-input'),
          siteTimeEles = target.find('#site-time-input'),
          dateRangeSel = target.find('#date-range'),
          dateSpecificEles = target.find('#specific-date'),
          commentBlock = target.find('#comment'),
          tomorrow = new Date();

      tomorrow.setDate(today.getDate()+1); // next-date;

      if(data.id) {
        planningIdSel.val(data.id);
      }
      if(data.comment) {
        commentBlock.val(data.comment);
      }
      if(data.company) {
        var companyList ='',
            companySelected = 0;
        for(var i = 0, len = data.company.length; i < len; i++) {
          if(data.company[i].selected) {
            companySelected = i;
          }
          companyList += OPT_TAG.replace('{value}', data.company[i].value).replace('{text}',data.company[i].text);
        }
        companySel.html(companyList).find('option').eq(companySelected).prop('selected', true);
      }

      if(data.site) {
        var siteList = '', siteSelected = 0;
        for(var i3 = 0, len3 = data.site.length;i3 < len3; i3++) {
          if(data.site[i3].selected) {
            siteSelected = i3;
          }
          siteList += OPT_TAG.replace('{value}', data.site[i3].value).replace('{text}',data.site[i3].text);
        }
        siteSel.empty().append(siteList).find('option').eq(siteSelected).prop('selected', true);
        if(data.site[siteSelected]) {
          siteTimeEles.val(data.site[siteSelected].time);
        } else {
          siteTimeEles.val('');
        }
      }
      if(data.presence) {
        presenceEles.val(data.presence);
      }

      if(data.datetime) {
        var dateTime = data.datetime[0] || data.datetime;
        if(dateTime.type.trim() === 'range') {
          var startDateTmp = Site.convertDate(dateTime.startDate),
              endDateTmp = Site.convertDate(dateTime.endDate);
          dateRangeSel.prop('checked', true);
          if(startDateTmp < today) {
            startDateEles.attr('disabled','true').datepicker('option', {minDate: null, maxDate: null})
              .datepicker('setDate', startDateTmp);
            endDateEles.datepicker('option', {minDate: today});
            dateTypeInput.eq(0).removeAttr('disabled').attr('readonly', 'true');
            dateTypeInput.eq(1).removeAttr('readonly').attr('disabled', 'true');
            companySel.attr('disabled', 'true');
            siteSel.attr('disabled', 'true');
          } else {
            companySel.removeAttr('disabled');
            siteSel.removeAttr('disabled');
            dateTypeInput.removeAttr('readonly disabled');
            startDateEles.removeAttr('disabled').datepicker('setDate', startDateTmp);
            startDateEles.datepicker('option', {
                minDate: today
            });
            endDateEles.datepicker('option', {
              minDate: today
            });
          }
          endDateEles.removeAttr('disabled').datepicker('setDate', endDateTmp);

          listDateInput.val('')
            .attr('disabled','true')
            .multiDatesPicker('resetDates')
            .next().attr('disabled','true');
          listDateSel.attr('disabled','true').empty();
        } else {
          var listDateOpt = '',
              dateArr = dateTime.listDate.split(';');
          dateSpecificEles.prop('checked', true);
          startDateEles.val('').attr('disabled', 'true');
          endDateEles.val('').attr('disabled', 'true');

          for(var i4 = 0, len4 = dateArr.length; i4 < len4; i4++) {
            dateArr[i4] = dateArr[i4].trim();
            listDateOpt += OPT_TAG.replace('{value}', '').replace('{text}', dateArr[i4]);
            dateArr[i4] = Site.convertDate(dateArr[i4]);
          }
          if(dateArr[0] < today) {
            companySel.attr('disabled', 'true');
            siteSel.attr('disabled', 'true');
            dateTypeInput.eq(1).removeAttr('disabled').attr('readonly', 'true');
            dateTypeInput.eq(0).removeAttr('readonly').attr('disabled', 'true');
          } else {
            companySel.removeAttr('disabled');
            siteSel.removeAttr('disabled');
            dateTypeInput.removeAttr('readonly disabled');
          }
          listDateInput.removeAttr('disabled').next().removeAttr('disabled');
          listDateInput.multiDatesPicker('addDates', dateArr);
          listDateSel.removeAttr('disabled').html(listDateOpt).find('option').prop('selected', true);
        }

        dateTime.startTime && startTimeEles.val(dateTime.startTime);
        dateTime.endTime && endTimeEles.val(dateTime.endTime);
      }
      targetSel.removeClass('hide');
      body.stop().animate({scrollTop: targetSel.offset().top}, 250);
  };

  /**
   * [show/hide form in add-category]
   */
  $('[data-add-category]').each(function() {
    var params = {};
    params.target = '#category-form';
    params.resetValue = 'category_id';
    params.closeBtnSel = '#cancel';
    $(this).on('click.addCategory', function() {
      showForm(params);
    });
  });

  $('[data-edit-category]').each(function() {
    var ele = $(this), params = {}, index = ele.data('edit-category') || 0,
      targetSel = $('#category-form'),
      id = targetSel.find('#catid-input'),
      titleSel = targetSel.find('#title-input'),
      contentSel = targetSel.find('#description-content'),
      unitRequireCheck = targetSel.find('#unit_require'),
      unitSel = targetSel.find('#unit');
    params.target = '#category-form';
    // params.resetValue = 'category_id';
    params.closeBtnSel = '#cancel';

    ele.on('click.editCategory', function() {
      showForm(params);
      getDataAjaxDefault({
          postData: {'id': index},
          timeout: 100,
          // selector: opts.target,
          url: ele.data('url'),
          successHandler: function(data) {
            var fillData = data.data;
            if(fillData) {
              if(fillData.category_id) {
                id.val(fillData.category_id);
              }
              if(fillData.title) {
                titleSel.val(fillData.title);
              }
              if(fillData.description) {
                contentSel.val(fillData.description);
              }
              if(fillData.unit && unitSel.length > 0) {
                var i = 0,
                    uLen = fillData.unit.length,
                    unitOpt = '';
                for(i; i< uLen; i++) {
                  unitOpt += OPT_TAG_1.replace('{value}', fillData.unit[i].value)
                                    .replace('{text}', fillData.unit[i].text)
                                    .replace('{selected}', fillData.unit[i].selected? 'selected':'');
                }
                unitSel.html(unitOpt);
              }
              if(fillData.unit_require) {
                if(fillData.unit_require === '1') {
                  unitRequireCheck.prop('checked', true);
                }
              }
              if(ele.data('autoTrigger')) {
                ele.trigger('change.editCategory');
              }
            }
          } //
       });
    });
  });
  /**
   * [show/hide form in handler for add/edit planning]
   */
  $('[data-add-mission-planning]').each(function() {
    var ele = $(this),
          userId = ele.data('add-mission-planning') || 0,
          targetSel = $('#planning-mission-form'),
          siteSel = targetSel.find('#site'),
          dateTypeSelector = '[data-date-type]',
          dateTypeInput = targetSel.find(dateTypeSelector + ' input:radio'),
          startDateEles = targetSel.find('#start-date-input'),
          endDateEles = targetSel.find('#end-date-input'),
          today = new Date(),
          tomorrow = new Date(),
          params = {};
          params.target = '#planning-mission-form';
          params.resetValue = '#planning-id';
          params.closeBtnSel = '#cancel';

    tomorrow.setDate(today.getDate()+1);

    // handle on click to Ajouter Btn
    ele.on('click', function() {
      var target = ele.data('target');
      showForm(params);
      hideErrors(targetSel);
      getDataAjaxDefault({
        postData: {'user-id': userId},
        timeout: 100,
        selector: target,
        url: ele.data('url'),
        successHandler: function(data) {
          var optCallback = ele.data('call-back'),
                select = $(target.select);
          if(data && data.length > 0) {
            var missionOpt = '';
            for(var i=0, len=data.length;i<len;i++) {
              missionOpt+=OPT_TAG.replace('{text}', data[i].text).replace('{value}', data[i].value);
            }
            select.html(missionOpt);
          }
          if(optCallback) {
            if(optCallback[1] === 'clear') {
              $(optCallback[0]).find('option').remove();
              return;
            }
            select.trigger(optCallback);
          }
          select.removeAttr('disabled').removeClass('hide');
          siteSel.removeAttr('disabled').removeClass('hide');
          dateTypeInput.removeAttr('readonly disabled');
          $('[data-date-type]:first').find('input:radio').prop('checked', true).trigger('change.dateType');
          startDateEles.datepicker('option', {
              minDate: today
          });
          endDateEles.datepicker('option', {
              minDate: today
          });
        }
      });
    });
  });

  $('[data-edit-planning-load-ajax]').each(function() {
    var ele = $(this),
        missionIndex = ele.data('edit-planning-load-ajax') || 0,
         targetSel = $('#planning-mission-form');

    ele.on('click', function() {
      // hide some error messages
      hideErrors(targetSel);
      targetSel[0].reset();
      getDataAjaxDefault({
        postData: {'mission-id': missionIndex},
        timeout: 100,
        url: ele.data('url'),
        successHandler: function(data) {
          // tempData = data;
          editPlanningHandler({data: data, target: targetSel});
        }
      });
      targetSel.find('#cancel').off('click').on('click',function(e) {
        e.preventDefault();
        targetSel.addClass('hide');
      });
    });

    if(ele.data('autoTrigger')) {
      ele.trigger('change.editPlanning');
    }
  });

  return {
    init: init,
    getDataAjaxDefault: getDataAjaxDefault,
    timeToSec: timeToSec,
    getDifTime: getDifTime,
    convertTime: convertTime,
    showAjaxErr: showAjaxErr,
    getPostData: getPostData,
    getLastEl: getLastEl,
    convertDate: convertDate,
    convertToDate: convertToDate,
    validGetValTar: validGetValTar,
    showMessage: showMessage,
    Message: Message,
    requiredTarget:requiredTarget,
    checkLogin: checkLogin
  };

})(jQuery, window);

jQuery(function() {
  Site.init();
});
