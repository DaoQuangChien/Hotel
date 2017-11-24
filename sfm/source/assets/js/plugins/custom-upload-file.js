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

  var pluginName = 'customUpload',
      Events = {
        CHANGE: 'change.' + pluginName,
        CLICK: 'click.' + pluginName,
        MODAL_HIDDEN: 'hidden.bs.modal'
      },
      body = $('body'),
      dataHasUpdate = 'has-updatehtml',
      confirmPopupSel = '#confirm-upload-popup',
      messageContainerSel = '.modal-title',
      hasUploadModalSel = '[data-has-customupload]',
      // loadingEl = '<div class="loading"><img src="img/loading.gif"></div>',
     // hiddenClass = 'hidden',
      loadingModalSel = '#loading-modal',
      liTag = '<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;" data-value="{value}">{text}</a></li>',
      previewBlockSel = '.custom-upload-preview',
      previewBlock = '<div class="custom-upload-preview margin-top-1"><img class="preview-image" alt="" src="{src}"></div>',
      hiddenInptTag = '<input type="hidden" name="upload-key" id="upload-key" >',
      hiddenInptSel = '#upload-key',
      confirmPopupHtml = '<div id="confirm-upload-popup" data-address-modal="" class="modal fade">' +
        '<div class="modal-dialog">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
              '<h4 class="modal-title">Position de ce temps</h4>' +
            '</div>' +
            '<div class="modal-body"><a href="javascript:;" title="OK" class="btn btn-success" data-dismiss="modal">OK</a></div>';

  var initPopup = function() {
    if(!$(confirmPopupSel).length) {
      body.append(confirmPopupHtml);
    }
    $(confirmPopupSel).modal('show');
    $(hasUploadModalSel).modal('hide');
  };
  var changeMess = function(that, mess) {
    $(confirmPopupSel).find(messageContainerSel).html(mess);
  };
  var onModalHideHandler = function(that) {
    if($(confirmPopupSel).data(dataHasUpdate)) {
      $(that.options.handlerSel).find('li:first-child() a').trigger('click');
      $(confirmPopupSel).data(dataHasUpdate, false);
    }
  };
  var initHiddenInp = function(that, value) {
    if(!$(hiddenInptSel).length) {
      that.element.vars.parent.append(hiddenInptTag);
    }
    $(hiddenInptSel).val(value);
  };
  var replaceData = function(data) {
    return liTag.replace('{value}', data.id).replace('{text}', data.value);
  };
  var verifyFileType = function(that, data) {
    var canUpload = true,
        uploadFile = data.files[0],
        opts = that.options;
    if(!opts.imgReg.test(uploadFile.name)) {
      canUpload = false;
      initPopup();
      changeMess(that, opts.imageTypeMessage);
    }
    if(canUpload) {
      data.submit();
    }
  };
  var initPreview = function(that) {
    if(!$(previewBlockSel).length) {
      that.element.vars.parent.append(previewBlock.replace('{src}', that.options.imageSource));
    }
  };
  var changeImgUrl = function(url) {
    $(previewBlockSel).find('img').attr('src', url);
  };
  var previewImage = function(that, url) {
    initPreview(that);
    changeImgUrl(url);
  };
  var updateAutocomplete = function(that, data) {
    var ul = $(that.options.handlerSel),
        li = '';

    ul.find('li').not(':first-child()').remove();
    for(var i = 0, l = data.length; i < l; i++) {
      li +=  replaceData(data[i]);
    }
    ul.append(li);
  };
  var onStartHandler = function() {
    $(loadingModalSel).modal('show');
  };
  var onSuccessHandler = function(that, data) {
    var opts = that.options;
    if(!opts.imagesOnly || (opts.imagesOnly && !data.status) ) {
      initPopup();
    }
    if(data) {
      if(data.message) {
        changeMess(that, data.message);
      }
      if(data.returnData) {
        updateAutocomplete(that, data.returnData);
      }
      if(opts.hasPreview && data.status) {
        previewImage(that, data.url);
        initHiddenInp(that, data.input);
      }
      $(confirmPopupSel).data(dataHasUpdate, data.status);
    }
    $(loadingModalSel).modal('hide');
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
          el = this.element;
      el.vars = {
        parent: $(that.options.parentSelector)
      };
      el.fileupload({
        dataType: 'json',
        add: function(e, data) {
          if(opts.imagesOnly) {
            verifyFileType(that, data);
          }
        },
        start: function() {
          onStartHandler(that);
        },
        done: function (e, data) {
          onSuccessHandler(that, data.result);
        }
      });
      if(opts.imageSource) {
        initPreview(this);
      }
      if(opts.inputValue) {
        initHiddenInp(this, opts.inputValue);
      }
      body.on(Events.MODAL_HIDDEN, confirmPopupSel, function() {
        onModalHideHandler(that);
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
    handlerSel: '#ul-destinataire',
    imagesOnly: false,
    hasPreview: false,
    imgReg: /\.(gif|jpg|jpeg|tiff|png)$/i,
    imageTypeMessage: l10n.customUpload.wrongType,
    imageSource: '',
    inputValue: '',
    parentSelector: '.custom-upload'
  };


  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
