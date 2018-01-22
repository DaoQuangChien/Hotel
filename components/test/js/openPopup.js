;(function($, window, undefined) {
  'use strict';

  var pluginName = 'open-popup';

  var popUp = function(target) {
    var that = $(this),
        opts = this.optsPrivate,
        setPos = opts.setPos || false,
        followParent = opts.followParent || false,
        moveDown = parseInt(opts.moveDown) || 0,
        win = $(window),
        limitLeft = win.width(),
        limitBottom = win.scrollTop() + win.height(),
        targetWidth = target.outerWidth(),
        targetHeight = target.outerHeight(),
        dataParent = $(that.closest('[data-parent]')),
        moveToMiddle = 0;

    if (setPos) {
      if (followParent) {
        if (dataParent.offset().left + targetWidth > limitLeft) {
          target.css({left: limitLeft - targetWidth + 'px'});
        } else {
          moveToMiddle = dataParent.offset().left + (Math.round(dataParent.outerWidth()) - target.outerWidth())/2;
          target.css({left: moveToMiddle  + 'px'});
        }

        if (dataParent.offset().top + targetHeight > limitBottom) {
          if (target.data().targetPopup === 'update') {
            target.css({ top: limitBottom - targetHeight - 34 + 'px' });
          } else {
            target.css({ top: limitBottom - targetHeight + 'px' });
          }
        } else {
          target.css({top: dataParent.offset().top + moveDown + 'px'});
        }
      } else {
        if (that.offset().left + targetWidth > limitLeft) {
          target.css({left: limitLeft - targetWidth + 'px'});
        } else {
          if (opts.leftAligned) {
            target.css({left: that.offset().left + 'px'});
          } else {
            moveToMiddle = that.offset().left + (Math.round(that.outerWidth()) - target.outerWidth())/2;
            target.css({left: moveToMiddle + 'px'});
          }
        }

        if (that.offset().top + targetHeight > limitBottom) {
          if (target.data().targetPopup === 'create') {
            target.css({top: limitBottom - targetHeight - 34 + 'px'});
          } else {
            target.css({top: limitBottom - targetHeight + 'px'});
          }
        } else {
          target.css({ top: that.offset().top + moveDown + 'px'});
        }
      }
    } else {
      that.next('[data-target-popup]')
        .removeClass('hide')
        .find('input').eq(0).focus();
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
          ele = this.element,
          opts = that.options;

      ele.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (opts.authority && $(opts.isAdminId).val() !== '1') {
          $('#access-denied-modal').modal('show');
        } else {
          var ele = $(this),
              memberEle = ele.is(opts.dataUserId) ? ele : ele.find(opts.dataUserId),
              currentCardType = ele.closest('tr'),
              companyId = '',
              tableId = '',
              phaseItem = {},
              memberItem = {},
              typeItem = {};
  
          ele.closest(opts.dataCompanyId).length ? companyId = ele.closest(opts.dataCompanyId).data().companyId : null;
          ele.closest(opts.dataBroadId).length ? tableId = ele.closest(opts.dataBroadId).data().boardId : null;
          if (currentCardType.length) {
            typeItem.type_id = currentCardType.find('[data-type-id]').text();
            typeItem.type_name = currentCardType.find('[data-type-name]').text();
          }
          this.optsPrivate = $.extend({}, ele.data());
          var target = $('[data-target-popup="' + this.optsPrivate.target + '"]');

          $(opts.dataTargetPopup).not(opts.modalClass).not(target)
            .removeData('type-from')
            .addClass(opts.hideClass)
            .filter('[data-create-card]').trigger('hide.create-card');
          if (memberEle.length) {
            memberItem.full_name = memberEle.attr('title');
            memberItem.id = memberEle.data().userId;
          }
          if (opts.showParent) {
            target.modal('show');
            $(opts.dataTargetPopup).not(opts.modalClass).addClass(opts.hideClass);
          } else {
            target.removeClass(opts.hideClass);
            popUp.call(this, target);
          }
          if (ele.closest(opts.dataPhase).length) {
            phaseItem.phaseId = ele.closest(opts.dataPhase).data().phase;
            phaseItem.sortItem = ele;
            target.find(opts.filterOptionItem).removeClass(opts.checkedClass);
            if (ele.data().sort) {
              target.find('[data-filter=' + ele.data().sort.type + '-' + ele.data().sort.direction + ']').parent().addClass(opts.checkedClass);
            }
          }
          target.data('company-from', companyId);
          target.data('table-from', tableId);
          target.data('phase-from', phaseItem);
          target.data('member-from', memberItem);
          target.data('type-from', typeItem);
          if (!opts.notClearInput) {
            target.find('input').eq(0).val('').focus();
          } else {
            target.find('input').eq(0).val(target.find('input').eq(0).data().cardType);
          }
          if ($('html').attr('class').indexOf(' ie') > -1) {
            var contentContainer = $(this).siblings('[data-swap-content]');

            contentContainer.css({'max-height': parseInt(contentContainer.css('max-height')) - 106});
          }
          if (this.optsPrivate.target === opts.targets.update) {
            target.find('input').eq(0).val(ele.closest(opts.dataParent).attr('title')).select();
          }
          if (this.optsPrivate.target === opts.targets.filterCard) {
            target.find('input').eq(0).val('');
          }
          if (opts.hide) {
            ele.addClass(opts.hideClass);
            target.data('hide-event', ele);
          }
        }
      });

      $('body')
        .off('keydown.not-focus').on('keydown.not-focus', function(e) {
          if (e.keyCode === 27) {
            $(opts.dataTargetPopup).not(opts.modalClass)
              .removeData('type-from')
              .addClass(opts.hideClass);
            $(opts.dataTargetPopup).filter('[data-create-card]').trigger('hide.create-card');
            $('#delete-board-modal').modal('hide');
            $('#dynamic-create-modal').modal('hide');
          }
        })
        .off('click.not-focus').on('click.not-focus', function(e) {
          if ($(e.target).closest(opts.dataTargetPopup).length === 0) {
            if ($('html').attr('class').indexOf(' ie') > -1) {
              var contentContainer = $(opts.dataTargetPopup).not('.hide').siblings('[data-swap-content]');

              contentContainer.css({'max-height': parseInt(contentContainer.css('max-height')) + 106});
            }
            $(opts.dataTargetPopup).not(opts.modalClass)
              .removeData('type-from')
              .addClass(opts.hideClass);
            if ($(e.target).is(opts.overLayClass)) {
              $(e.target).addClass(opts.hideClass);
            }
            $(opts.dataTargetPopup).filter('[data-create-card]').trigger('hide.create-card');
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
      }
    });
  };

  $.fn[pluginName].defaults = {
    hideClass: 'hide',
    modalClass: '.modal',
    dataOpenPopup: '[data-open-popup]',
    dataTargetPopup: '[data-target-popup]',
    dataParent: '[data-parent]',
    dataCompanyId: '[data-company-id]',
    dataBroadId: '[data-board-id]',
    dataUserId: '[data-user-id]',
    dataPhase: '[data-phase]',
    overLayClass: '.screen-overlay',
    filterOptionItem: '.filter-option-item',
    checkedClass: 'checked',
    isAdminId: '#is-admin',
    targets: {
      update: 'update',
      filterCard: 'filterCard'
    }
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));