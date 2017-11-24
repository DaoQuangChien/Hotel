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
  var pluginName = 'clickShowPopup',
      body = $('body'),
      Event = {
        CLICK: 'click.' + pluginName
      },
      //optionTag = '<option value="{val}">{text}</option>',
      //validateSelector = '[data-validateform]',
      dataUrl = 'url-value',
      //dataIdVal = 'id-value',
      dataId = 'id',
      //dataChkShowPop = '[data-client]',
      clickfillajaxSelector = '[data-click-fill-ajax]';

  var validGetValTar = function (that) {
   // var isValid;
    for (var i = 0, l = that.options.getValueTarget.length; i < l; i++) {
      if($(that.options.getValueTarget[i]).jqBootstrapValidation('hasErrors')) {
        return false;
      }
    }
    return true;
  };
  var onSuccessHandler = function(that, data) {
    var el = that.element,
        opts = that.options,
        modalTarget = opts.modalTarget;

    body.append(data);
    if(opts.confirmDelete) {
      $(modalTarget).find('[data-' + dataUrl + ']').prop('href', opts.confirmDelete);
    }
    if(el.data('delete')) {
      $(modalTarget).find(clickfillajaxSelector).data('value', 'id=' + el.closest('tr').find('[data-' + dataId +']').text());
    }
    $(modalTarget).modal('show');
    for(var i = 0, l = opts.pluginInit.length; i < l; i++) {
      var initEl = $(modalTarget).find('[data-' + opts.pluginInit[i] + ']');
      if(initEl.length) {
        initEl[opts.pluginInit[i]]();
      }
    }
  };
  var getIdx = function (that) {
    var listIdx = [];
    for(var i = 0, l = that.options.getValueTarget.length; i < l; i++) {
      listIdx.push(that.element.closest('tr'));
    }
    return listIdx;
  };
  var onClickHandler = function(that) {
    var opts = that.options;
    body.find(opts.modalTarget).remove();
    if(that.element.data('passValidate') || validGetValTar(that)) {
      Site.getDataAjaxDefault({
        selector: {selector: 'body'},
        url: opts.url,
        ajaxType: 'GET',
        postData: Site.getPostData(opts.getValueTarget, null, getIdx(that)),
        dataType: 'text',
        successHandler: function(data) {
          onSuccessHandler(that, data);
        }
      });
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
          opts = this.options,
          hasPopup;

      this.element.off(Event.CLICK).on(Event.CLICK, function() {
        if(opts.callAjaxOnce && hasPopup) {
          $(opts.modalTarget).modal('show');
          return;
        }
        // if($(dataChkShowPop + ':checked').not(':disabled').length >0) {
        //   return;
        // }
        hasPopup = true;
        onClickHandler(that);
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
    modalTarget: '#add-modal',
    getValueTarget: '',
    confirmDelete: '',
    callAjaxOnce: '',
    pluginInit: [pluginName, 'click-fill-ajax', 'timepicker-range', 'timespinner', 'transport', 'select-load-ajax', '', 'autoSelect', 'validateForm'],
    popupType: '',
    isListEdit: null
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({});
  });

}(jQuery, window));
