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
        },
        toggleChangePriority: ele.find(opts.dataChangePriority),
        get changePriority() {
          return this.toggleChangePriority.find(opts.dataPriority);
        },
        cardName: ele.find(opts.dataDetailName)
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

      // this.vars.editDescriptionBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
      //   that.vars.descriptionEle.html(that.vars.editDescriptionInput.val().trim());
      //   that.vars.descriptionEle.removeClass(opts.hideClass);
      //   that.vars.editDescriptionEle.addClass(opts.hideClass);
      // });

      this.vars.closeEditDescriptionBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        that.vars.editDescriptionInput.val('');
        that.vars.descriptionEle.removeClass(opts.hideClass);
        that.vars.editDescriptionEle.addClass(opts.hideClass);
      });

      this.vars.toggleChangePriority.off('click.' + pluginName).on('click.' + pluginName, function() {
        $(this).find(opts.dataListPriority).toggleClass(opts.hideClass);
      });

      this.vars.changePriority.off('click.' + pluginName).on('click.' + pluginName, function() {
        var priorityBtn = $(this);

        $.ajax({
          type: opts.methodPriority,
          url: $(this).parent().data().url,
          dataType: 'json',
          data: {
            card_id: ele.data().cardFrom.id,
            priority: $(this).data().priority
          },
          success: function(result) {
            if (result.status) {
              that.vars.cardName.removeClass(function(index, className) {
                return (className.match(/(^|\s)priority-\S+/g) || []).join(' ');
              }).addClass('priority-' + priorityBtn.data().priority);
              $('[data-card-id=' + ele.data().cardFrom.id + '] .detail').removeClass(function(index, className) {
                return (className.match(/(^|\s)priority-\S+/g) || []).join(' ');
              }).addClass('priority-' + priorityBtn.data().priority);
              priorityBtn.parent().addClass(opts.hideClass);
            }
          },
          error: function(xhr) {
            priorityBtn.after('<li class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</li>');
            priorityBtn.next().fadeOut(opts.fadeOutTime, function() {
              $(this).remove();
              priorityBtn.parent().addClass(opts.hideClass);
            });
          }
        });
      });

      this.vars.editDescriptionBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        var saveBtn = $(this);

        $.ajax({
          type: opts.methodDescription,
          url: saveBtn.parents(opts.dataTargetEdit).data().url,
          dataType: 'json',
          data: {
            card_id: ele.data().cardFrom.id,
            name: that.vars.cardName.text(),
            description: that.vars.editDescriptionInput.val(),
            priority: ele.data().cardFrom.priority,
            phase: ele.data().cardFrom.phase,
            board_id: $(opts.board_id).val()
          },
          success: function(result) {
            if (result.status) {
              that.vars.descriptionEle.html(that.vars.editDescriptionInput.val().trim());
              that.vars.descriptionEle.removeClass(opts.hideClass);
              that.vars.editDescriptionEle.addClass(opts.hideClass);
            }
          },
          error: function(xhr) {
            saveBtn.parent().append('<span class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</span>');
            saveBtn.siblings('.errorText').fadeOut(opts.fadeOutTime, function() {
              $(this).remove();
            });
          }
        });
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
    methodPriority: 'GET',
    methodDescription: 'GET',
    dataCardDetail: '[data-card-detail]',
    dataCardDescription: '[data-card-description]',
    dataEditDescription: '[data-edit-description]',
    dataTargetEdit: '[data-target-edit]',
    dataAccept: '[data-accept]',
    dataClose: '[data-close]',
    dataInput: '[data-fluid-height]',
    dataChangePriority: '[data-change-priority]',
    dataListPriority: '[data-list-priority]',
    dataPriority: '[data-priority]',
    dataDetailName: '[data-detail-name]',
    hideClass: 'hide',
    baseLineHeight: 14,
    fadeOutTime: 1000,
    overlayClass: 'screen-overlay',
    board_id: '#board-id'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));