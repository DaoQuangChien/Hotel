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
  var pluginName = 'submitLoadAjax',
      body = $('body'),
      Event = {
        SUBMIT: 'submit.' + pluginName,
        CLICK: 'click.' + pluginName
      },
      containerSel = '#container',
      hasValidateEl = '[data-validateform]';
  var validForm = function(that) {
    var hasErr = true;
    that.element.find(hasValidateEl).each(function() {
      if($(this).jqBootstrapValidation('hasErrors')) {
        hasErr = false;
        return;
      }
    });
    return hasErr;
  };
  var showMessage = function(that, stt, message) {
    var messageBlock = that.element.find('.text-errors'),
        dismissBtn = '<a class="close" data-dismiss="alert" href="#">×</a>',
        errorsClassName = '<div class="alert alert-danger">',
        successClassName = '<div class="alert alert-success">';

    if(stt === true) {
      messageBlock.empty().append($(successClassName).text(message));
    } else {
      messageBlock.empty().append($(errorsClassName).text(message));
    }
    that.element.find('.alert').append(dismissBtn);
  };
  var submitCallBack = function (that) {
    var el = that.element,
        opts = that.options;

    if($(opts.target).length) {
      $(opts.target).modal('show');
      return;
    }
    Site.getDataAjaxDefault({
      selector: {selector: containerSel},
        url: opts.url || el.attr('action'),
        postData: el.serialize() || '',
        dataType: 'text',
        successHandler: function(data) {
          try{
            data = $.parseJSON(data);
            if(typeof data.message !== typeof undefined) {
              showMessage(that, data.status, data.message);
            }
          } catch (err) {
            body.append(data);
            if($(opts.target).length) {
              $(opts.target).modal('show');
            }
          }
        }
    });
  };
  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          el = this.element;

      el.off(Event.SUBMIT).on(Event.SUBMIT, function (e) {
        if(validForm(that)) {
          if(el.data('pass-submit')) {
            return;
          }
          e.preventDefault();
          submitCallBack(that);
        }
      });
      body.off(Event.CLICK).on(Event.CLICK, that.options.confirmBtnSel, function() {
        el.data('pass-submit', true);
        el.trigger(Event.SUBMIT);
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
    target: '#export-confirm-modal',
    confirmBtnSel: '[data-confirm-submit]',
    passSubmit: null
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({});
  });

}(jQuery, window));
