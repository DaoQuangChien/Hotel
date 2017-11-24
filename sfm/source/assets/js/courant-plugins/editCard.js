;(function($, window, undefined) {
  'use strict';

  var pluginName = 'edit-card';

  function setUp(that) {
    that.vars.openEditDescriptionEle.css('cursor', 'pointer');
  }

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          ele = this.element,
          opts = this.options;
      this.vars = {
        openEditDescriptionEle: ele.find(opts.dataEditDescription),     // show edit field
        descriptionEle: ele.find(opts.dataCardDescription),             // content description
        editDescriptionEle: ele.find(opts.dataTargetEdit),              // edit feild
        get editDescriptionBtn() {                                      // save edit btn
          return this.editDescriptionEle.find(opts.dataAccept);
        },
        get closeEditDescriptionBtn() {                                 // abort edit
          return this.editDescriptionEle.find(opts.dataClose);
        },
        get editDescriptionInput() {                                    // text area
          return this.editDescriptionEle.find(opts.dataInput);
        }
      };

      setUp(this);
      this.vars.openEditDescriptionEle.off('click.' + pluginName).on('click.' + pluginName, function() {
        that.vars.editDescriptionInput.val(that.vars.descriptionEle.html().replace(/<br>/g, '\n'));
        that.vars.descriptionEle.addClass(opts.hideClass);
        that.vars.editDescriptionEle.removeClass(opts.hideClass);
        that.vars.editDescriptionInput[0].rows = that.vars.editDescriptionInput.data().minRows;
        if (that.vars.editDescriptionInput[0].scrollHeight > that.vars.editDescriptionInput.innerHeight()) {
          that.vars.editDescriptionInput[0].rows = that.vars.editDescriptionInput[0].rows + Math.ceil((that.vars.editDescriptionInput[0].scrollHeight - that.vars.editDescriptionInput.innerHeight()) / opts.baseLineHeight);
        }
      });

      this.vars.editDescriptionBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        that.vars.descriptionEle.html(that.vars.editDescriptionInput.val().trim());
        that.vars.descriptionEle.removeClass(opts.hideClass);
        that.vars.editDescriptionEle.addClass(opts.hideClass);
      });

      this.vars.closeEditDescriptionBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        that.vars.editDescriptionInput.val('');
        that.vars.descriptionEle.removeClass(opts.hideClass);
        that.vars.editDescriptionEle.addClass(opts.hideClass);
      });





      ele.parent().off('click.' + pluginName).on('click.' + pluginName, function(e) {
        if ($(e.target).is('.' + opts.overlayClass)) {
          $(this).addClass(opts.hideClass);
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
    dataCardDescription: '[data-card-description]',
    dataEditDescription: '[data-edit-description]',
    dataTargetEdit: '[data-target-edit]',
    dataAccept: '[data-accept]',
    dataClose: '[data-close]',
    dataInput: '[data-fluid-height]',
    hideClass: 'hide',
    baseLineHeight: 14,
    overlayClass: 'screen-overlay'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));