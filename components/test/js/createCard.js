; (function ($, window, undefined) {
  'use strict';

  var pluginName = 'create-card',
      card = '<a data-content class="card" data-card-id=#{{card-id}}><div class="card-description"><span class="detail priority-#{{priority}}">#{{name}}</span><ul class="icons"><li title="#{{description-title}}"><span class="icon-descrip "></span></li></ul></div></a>';

  var callAjax = function() {
    var that = this,
        opts = this.options,
        parentEle = this.element.parents('[data-' + opts.dataParent + ']'),
        cardContainer = this.element.prev();

    $.ajax({
      type: opts.method,
      url: $(opts.createCardLink).val(),
      dataType: 'json',
      data: {
        name: that.vars.textArea.val(),
        priority: opts.defaultPriority,
        phase: parentEle.data(opts.dataParent),
        board_id: $(opts.boardId).val()
      },
      success: function(result) {
        if (result.status) {
          var cardCreated = card.replace('#{{card-id}}', result.id).replace('#{{priority}}', opts.defaultPriority).replace('#{{name}}', that.vars.textArea.val()).replace('#{{description-title}}', opts.descriptionTitle);

          cardContainer.append(cardCreated);
          that.vars.textArea.val('');
          that.element.addClass(opts.hideClass);
        }
      },
      error: function(xhr) {
        that.vars.textArea.after('<p class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>');
        that.vars.textArea.next().fadeOut(opts.fadeOutTime, function() {
          $(this).remove();
        });
      }
    });
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var that = this,
          ele = this.element,
          opts = this.options;
      this.vars = {
        textArea: ele.find(opts.dataInput),
        addBtn: ele.find(opts.dataAccept)
      };

      this.vars.addBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (!that.vars.textArea.val().length) {
          that.vars.textArea.focus();
          return;
        }
        callAjax.call(that);
        that.vars.textArea[0].rows = that.vars.textArea.data().minRow;
      });
    },
    destroy: function () {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
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
    method: 'GET',
    createCardLink: '#create-card-link',
    hideClass: 'hide',
    fadeOutTime: 1000,
    dataInput: '[data-input]',
    dataAccept: '[data-accept]',
    dataParent: 'phase',
    defaultPriority: 1,
    descriptionTitle: 'This card has a description',
    boardId: '#board-id'
  };

  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));