;(function ($, window, Site) {

  'use strict';

  var validateAjaxTrigger = '[data-validate-ajax]',
      attributeAjaxTrigger = 'data-validate-ajax',
      hasSubmit = false,
      hasValid = false,
      validateAjax;
  var showComfirmPopup = function(form, modal, data) {
    // if(formSelector.find(errroSymbolSel)) {
    //   formSelector.find(errroSymbolSel).empty();
    //   formSelector.find(errorMesSel).empty();
    // }
    if(data.message) {
      modal.find('.modal-title').empty().html(data.message);
    }
    modal.find('a.confirm').off('click.confirm').on('click.confirm', function() {
      form.data('valid-ajax', true);
      form.submit();
    });
    modal.modal('show');
    return;
  };

  /**
   * Check some value input contain in data of custom plugin or not.
   * @param  {Object} chkArray Object of data-check-value-exist
   * @return {Boolean}          Return true if there is any value exist
   */
  var checkDataExist = function(chkArray) {
    var isValid = true;
    var idx = 0;
    var msg = '';
    $.each(chkArray, function(index, chkObj) {
      switch (chkObj.type) {
        case 'autocomplete':
          var sourceSel = $(chkObj.sourceSel);
          var targetSelArr = $(chkObj.targetCheckSel);
          msg = chkObj.messageExist;
          if (sourceSel.size() > 0 && targetSelArr.size() > 0) {
            var autoComplete = sourceSel.data('autoComplete');
            var txt = autoComplete.inputControl.val();
            autoComplete.filterAutoComplete(txt);
            var src = autoComplete.listValsJSON.map(function(itemList) {
              return itemList.value;
            });
            $.each(targetSelArr, function(i, targetSel) {
              var firstVal = $(targetSel).val() ? $(targetSel).val().split(';') : [];
              if ($.inArray(firstVal[idx], src) === -1) {
                isValid = false;
                $(targetSel).closest('.control-group').addClass('error');
              }
            });
          }
          break;
      }
    });
    return {msg:msg,isValid:isValid};
  };

  function ValidateAjax() {}

  ValidateAjax.prototype.ajaxCall = function(link, that) {
    var dataPost = that.serialize();
    var params = {};
        // params.selector = ['form'];
        params.url = link;
        params.postData = dataPost;
        // params.async = true;
        params.successHandler = function(data) {
          if (data.status === 'OK') {
            window.location = data.href;
          } else if (data.status === true || data.status === 'true'){
            hasValid = true;
            that.trigger('submit.send');
          } else if(data.status === false || data.status === 'false') {
            hasValid = false;
            Site.showMessage(null, data.message);
            return;
          } else
          if(data.status && data.status === 'confirm') {
            var confirmModalElement = $('#confirm-modal');
            showComfirmPopup(that, confirmModalElement, data);
          } else {
            Site.Message.show(data.message);
          }
        };
    Site.getDataAjaxDefault(params);
  },

  ValidateAjax.prototype.submit = function(e) {
    if($(this).data('valid-ajax')) {
      return;
    }
    e.preventDefault();
    var inputSels = $(this).find('input, select');
    var chkArray = $(this).data('checkValueExist');
    if(!window.Site.validGetValTar(inputSels)) {
      return;
    }
    if(!window.Site.requiredTarget($(this).find('[data-required-target]'), e)) {
      return;
    }
    if (chkArray !== undefined) {
      var result = checkDataExist(chkArray);
      if (!result.isValid) {
        var errMess = $(this).find('.text-errors');
        window.Site.showMessage(errMess, result.msg);
        return;
      }
    }

    var that = $(e.target),
        link = that.attr(attributeAjaxTrigger) || that.attr('action');
    hasSubmit = true;
    validateAjax.ajaxCall(link, that);
  };

  $(function() {
    validateAjax = new ValidateAjax();
    // $(validateAjaxTrigger).on('submit.valid', function(e) {
    //   if(!hasValid) {
    //     hasSubmit = false;
    //     e.preventDefault();
    //     $(this)
    //       .on('success.validate', validateAjax.submit);
    //   }
    // });
    $(document)
      .on('submit.valid', validateAjaxTrigger, validateAjax.submit);
  });

}(window.jQuery, window, window.Site));
