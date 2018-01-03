;(function($, window, undefined) {
  'use strict';

  var pluginName = 'create-card',
      card = '<a data-content class="card" data-card-id=#{{card-id}} data-priority="#{{priority}}" title="#{{title}}"><div class="card-description"><span class="detail priority-#{{priority}}" data-limit-word>#{{name}}</span><ul class="icons"><li title="#{{description-title}}"><span class="icon-descrip "></span></li><li title="#{{comment-title}}"><span class="icon-comment">0</span></li><li title="#{{attachment-title}}"><span class="icon-attachment">0</span></li></ul></div></a>';

  var callAjax = function() {
    var that = this,
        opts = this.options,
        parentEle = this.element.parents('[data-' + opts.dataParent + ']'),
        cardContainer = this.element.prev(),
        name = that.vars.textArea.val();

    that.vars.is_Click = false;
    $.ajax({
      type: opts.method,
      url: $(opts.createCardLink).val(),
      dataType: 'json',
      data: {
        name: name,
        priority: opts.defaultPriority,
        phase: parentEle.data(opts.dataParent),
        board_id: $(opts.boardId).val()
      },
      success: function(result) {
        if (result.status) {
          var cardCreated = card.replace('#{{card-id}}', result.data.id).replace(/#{{priority}}/g, opts.defaultPriority).replace('#{{name}}', name).replace('#{{description-title}}', opts.descriptionTitle).replace('#{{title}}', name);

          cardContainer
            .append(cardCreated)
            .find(opts.dataLimitWord + ':last')['limit-word']();
          that.vars.textArea.val('');
          that.element.addClass(opts.hideClass);
          $(opts.dataBoardActivity)['board-activity']('reLoadActivity');
        }
      },
      error: function(xhr) {
        that.vars.textArea.after('<p class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</p>');
        that.vars.textArea.next().fadeOut(opts.fadeOutTime, function() {
          $(this).remove();
        });
      },
      complete: function() {
        that.vars.is_Click = true;
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
          ele = this.element,
          opts = this.options;
      this.vars = {
        is_Click: true,
        textArea: ele.find(opts.dataInput),
        addBtn: ele.find(opts.dataAccept)
      };

      this.vars.addBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (!that.vars.textArea.val().trim().length) {
          that.vars.textArea.focus();
          return;
        }
        if (!that.vars.is_Click) {
          return false;
        }
        callAjax.call(that);
        that.vars.textArea[0].rows = that.vars.textArea.data().minRow;
      });

      this.vars.textArea.off('keydown.' + pluginName).on('keydown.' + pluginName, function(e) {
        if (e.keyCode === 13) {
          that.vars.addBtn.click();
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
    method: 'GET',
    createCardLink: '#create-card-link',
    hideClass: 'hide',
    fadeOutTime: 1000,
    dataInput: '[data-input]',
    dataAccept: '[data-accept]',
    dataLimitWord: '[data-limit-word]',
    dataBoardActivity: '[data-board-activity]',
    dataParent: 'phase',
    defaultPriority: 1,
    descriptionTitle: 'This card has a description',
    textFail: 'An error occured',
    boardId: '#board-id'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));