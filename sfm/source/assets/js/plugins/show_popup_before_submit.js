/**
 *  @name showPopupBeforeSubmit
 *  @description Check checkbox and radio button change to show confirm popup
 *  @version 1.0
 *  @options (for HTML)
 *    data-selector-detect-radio-change: Jquery selector of checkbox and radio button you want to detect them change value or not
 *    data-target: The Jquery selector for popup. Ex: if you popup has id="confirm-popup", you should set arrtibute data-target="#confirm-popup" in element contain this plugin
 *    data-url: The url of popup. Don't use it if you already defined attribute data-target
 *    data-url-check-logging: Url checking another user is logging or not. If not logging don't show popup confirm when change value radio button and checkbox
 *    data-selector-for-check: contain selector of object which you want to post with data-url-check-logging
 *  @events
 *  @methods
 *    init: Init plugin showPopupBeforeSubmit
 *    isChangeCheckbox: Return true if checkbox or radio button change
 *    destroy: Destroy plugin
 */
;(function($, window, undefined) {
  var pluginName = 'showPopupBeforeSubmit',
    Event = {
      SUBMIT: 'submit.' + pluginName,
      CLICK: 'click.' + pluginName
    },
    containerSel = '#container',
    hasValidateEl = '[data-validateform]';

  /**
   * Check form is valid or not before show popup
   * @param  {Object} pluginObj Current plugin show_popup_before_submit
   * @return {Boolean}      True if form is valid
   */
  var isValidForm = function(pluginObj) {
    var isValid = true;
    pluginObj.element.closest('form').find(hasValidateEl + ':enabled').each(function() {
      if ($(this).jqBootstrapValidation('hasErrors')) {
        isValid = false;
        return;
      }
    });
    return isValid;
  };
  /**
   * Append content message into block text error
   * @param  {Object} pluginObj Current plugin show_popup_before_submit
   * @param  {Boolean} stt     Status (true if this is a message inform success)
   * @param  {String} message Message
   * @return {void}         void
   */
  var showMessage = function(pluginObj, stt, message) {
    var messageBlock = pluginObj.element.closest('form').find('.text-errors'),
      dismissBtn = '<a class="close" data-dismiss="alert" href="#">×</a>',
      errorsClassName = '<div class="alert alert-danger">',
      successClassName = '<div class="alert alert-success">';

    if (stt === true) {
      messageBlock.empty().append($(successClassName).text(message));
    } else {
      messageBlock.empty().append($(errorsClassName).text(message));
    }
    pluginObj.element.closest('form').find('.alert').append(dismissBtn);
  };

  /**
   * Excute some tasks after you click submit
   * @param  {Object} pluginObj Current plugin show_popup_before_submit
   * @return {void}      void
   */
  var submitCallBack = function(pluginObj) {
    var el = pluginObj.element,
      opts = pluginObj.options;

    if ($(opts.target).length) {
      $(opts.target).modal('show');
      return;
    }
    Site.getDataAjaxDefault({
      selector: { selector: containerSel },
      url: opts.url || el.attr('action'),
      postData: el.serialize() || '',
      ajaxType: 'GET',
      dataType: 'text',
      successHandler: function(data) {
        try {
          data = $.parseJSON(data);
          if (typeof data.message !== typeof undefined) {
            pluginObj.func.showMessage(pluginObj, data.status, data.message);
          }
        } catch (err) {
          console.log(err);
          $('body').append(data);
          if ($(opts.target).length) {
            $(opts.target).modal('show');
          }
        }
      }
    });
  };
  /**
   * Get ID of checkbox and radion button which are checked
   * @param  {Object} pluginObj Current plugin show_popup_before_submit
   * @return {String Array}           Array contain id of element checked
   */
  var getIDCheckboxAndRadio = function(pluginObj) {
    var opts = pluginObj.options,
      arrID = [];

    if (opts.selectorDetectRadioChange) {
      arrID = $(opts.selectorDetectRadioChange).map(function() {
        return this.id;
      }).get();
    }
    return arrID;
  };

  /**
   * Send ajax post to server before show popup
   *  @param  {Object} pluginObj Current plugin show_popup_before_submit
   * @return {Promise | undefined}           Return a promise if current element define attribute data-url-check-logging: 
   */
  var sendRequestPost = function(pluginObj) {
    if (pluginObj.options.urlCheckLogging) {
      var objPost = $(pluginObj.options.selectorForCheck);
      var defer = $.Deferred();
      Site.getDataAjaxDefault({
        selector: { selector: containerSel },
        url: pluginObj.options.urlCheckLogging,
        postData: objPost || '',
        ajaxType: 'POST',
        successHandler: function(data) {
          defer.resolve(data);
        }
      });
      return defer.promise();
    }
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    /**
     * Check checkbox and radion button (not disabled) have change value
     * @return {Boolean} True if them have already changed.
     */
    isChangeCheckbox: function() {
      var currentArrID = this.func.getIDCheckboxAndRadio.call(this, this);
      return currentArrID.toString() !== this.originArrID.toString();
    },
    init: function() {

      this.func = { //inject function to make unit test
        getIDCheckboxAndRadio: getIDCheckboxAndRadio,
        isValidForm: isValidForm,
        sendRequestPost: sendRequestPost,
        showMessage: showMessage,
        submitCallBack: submitCallBack
      };
      var that = this,
        el = that.element,
        isElClick = false, //flag to know your submit form come from submit button contain this plugin or not
        form = el.closest('form'),
        originArrID = that.func.getIDCheckboxAndRadio(that);
      that.originArrID = originArrID;
      form.off(Event.SUBMIT).on(Event.SUBMIT, function(event) {
        var currentArrID = that.func.getIDCheckboxAndRadio(that);//mock
        var defer = that.func.sendRequestPost(that);//mock
        var privateCallPopup = function() {
          isElClick = false;
          event.preventDefault();
          that.func.submitCallBack(that);
        };
        if (that.func.isValidForm(that) && isElClick && currentArrID.toString() !== originArrID.toString()) {
          if (defer) {
            defer.done(function(data) {
              if (data.is_login === true) {
                privateCallPopup();
              } else {
                that.originArrID = currentArrID;
              }
            });
          } else {
            privateCallPopup();
          }
        }
      });
      el.off(Event.CLICK).on(Event.CLICK, function() {
        isElClick = true;
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
    url: null,
    target: '#confirm-change-modal',
    urlCheckLogging: undefined,
    selectorForCheck: undefined
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({});
  });

}(jQuery, window));
