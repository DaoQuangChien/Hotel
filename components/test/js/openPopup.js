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
        dataParent = $(that.closest('[data-parent]'));

    if (setPos) {
      if (followParent) {
        if (dataParent.offset().left + targetWidth > limitLeft) {
          target.css({left: limitLeft - targetWidth + 'px'});
        } else {
          target.css({left: dataParent.offset().left + 'px'});
        }

        if (dataParent.offset().top + targetHeight > limitBottom) {
          target.css({top: limitBottom - targetHeight + 'px'});
        } else {
          target.css({top: dataParent.offset().top + moveDown + 'px'});
        }
      } else {
        if (that.offset().left + targetWidth > limitLeft) {
          target.css({left: limitLeft - targetWidth + 'px'});
        } else {
          target.css({left: that.offset().left + 'px'});
        }

        if (that.offset().top + targetHeight > limitBottom) {
          target.css({top: limitBottom - targetHeight + 'px'});
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
          opts = that.options;

      $(document).off('click.' + pluginName).on('click.' + pluginName, opts.dataOpenPopup, function(e) {
        e.preventDefault();
        var ele = $(this),
            memberEle = ele.is(opts.dataUserId) ? ele : ele.find(opts.dataUserId),
            companyId = '',
            tableId = '',
            memberItem = {};

        ele.closest(opts.dataCompanyId).length ? companyId = ele.closest(opts.dataCompanyId).data().companyId : null;
        ele.closest(opts.dataBroadId).length ? tableId = ele.closest(opts.dataBroadId).data().boardId : null;
        this.optsPrivate = $.extend({}, ele.data());
        var target = $('[data-target-popup="' + this.optsPrivate.target + '"]');
        if (memberEle.length) {
          memberItem.full_name = memberEle.attr('title');
          memberItem.id = memberEle.data().userId;
        }
        target.removeClass(opts.hideClass);
        target.data('company-from', companyId);
        target.data('table-from', tableId);
        target.data('member-from', memberItem);
        target.find('input').eq(0).val('').focus();

        if (this.optsPrivate.target === opts.targets.update) {
          target.find('input').eq(0).val(ele.closest(opts.dataParent).attr('title')).select();
        }
        popUp.call(this, target);
      });

      $('body').off('click.not-focus').on('click.not-focus', function(e) {
        if ($(e.target).closest(opts.dataTargetPopup).length === 0) {
          $(opts.dataTargetPopup).not(opts.hideClass).addClass(opts.hideClass);
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
    dataOpenPopup: '[data-open-popup]',
    dataTargetPopup: '[data-target-popup]',
    dataParent: '[data-parent]',
    dataCompanyId: '[data-company-id]',
    dataBroadId: '[data-board-id]',
    dataUserId: '[data-user-id]',
    targets: {
      update: 'update'
    }
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));