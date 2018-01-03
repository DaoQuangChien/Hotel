;(function($, window, undefined) {
  'use strict';

  var pluginName = 'add-user',
      member = '<a href="#" class="member" title="#{{full-name}}" data-user-id="#{{user-id}}" data-open-popup data-target="deleteMember" data-set-pos="true" data-follow-parent="true" data-parent data-move-down="30">#{{short-name}}</a>';

  var callAjax = function(that) {
    var ele = this,
        opts = that.options;

    that.vars.is_Click = false;
    $.ajax({
      type: opts.method,
      url: $(opts.inviteMemberLink).val(),
      dataType: 'json',
      data: {
        board_id: $(opts.boardId).val(),
        member_id: that.vars.memberInfo.data().userId
      },
      success: function(result) {
        if (result.status && that.vars.memberInfo.data().userId.toString() === result.data.id.toString()) {
          var addedMember = member.replace('#{{full-name}}', that.vars.memberInfo.attr('title')).replace('#{{user-id}}',
            that.vars.memberInfo.data().userId).replace('#{{short-name}}', that.vars.memberInfo.data().shortName);
          $('.list-member[data-role=' + result.data.type + ']').prepend(addedMember);
          ele.parent().addClass(opts.hideClass);
          $(opts.dataBoardActivity)['board-activity']('reLoadActivity');
          ele.remove();
        } else {
          ele.append('<p class="errorText">' + ele.parent().data().errorText + '</p>');
          that.vars.memberInfo.next().fadeOut(opts.fadeOutTime, function() {
            $(this).remove();
          });
        }
      },
      error: function(xhr) {
        ele.append('<p class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</p>');
        that.vars.memberInfo.next().fadeOut(opts.fadeOutTime, function() {
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
          ele = this.element;
      this.vars = {
        is_Click: true,
        memberInfo: ele.children()
      };

      ele.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        if (!that.vars.is_Click) {
          return false;
        }
        callAjax.call($(this), that);
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
    hideClass: 'hide',
    fadeOutTime: 1000,
    // inviteMemberLink: '#invite-member-link',
    dataBoardActivity: '[data-board-activity]',
    inviteMemberLink: '#get-user-link',
    textFail: 'An error occured',
    boardId: '#board-id'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));