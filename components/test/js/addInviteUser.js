;(function($, window, undefined) {
  'use strict';

  var pluginName = 'add-user',
      member = '<a href="#" class="member" title="#{{full-name}}" data-user-id="#{{user-id}}" data-open-popup data-target="deleteMember" data-set-pos="true" data-follow-parent="true" data-parent data-move-down="30">#{{short-name}}</a>';

  var callAjax = function(that) {
    var ele = this,
        opts = that.options;

    $.ajax({
      type: opts.method,
      url: $(opts.inviteMemberLink).val(),
      dataType: 'json',
      data: {
        board_id: $(opts.boardId).val(),
        member_id: that.vars.memberInfo.data().userId
      },
      success: function(result) {
        if (result.status && that.vars.memberInfo.data().userId.toString() === result.id) {
          var addedMember = member.replace('#{{full-name}}', that.vars.memberInfo.attr('title')).replace('#{{user-id}}',
            that.vars.memberInfo.data().userId).replace('#{{short-name}}', that.vars.memberInfo.data().shortName);
          $('.list-member[data-role=' + result.type + ']').prepend(addedMember);
        } else {
          ele.append('<p class="errorText">' + opts.errorText + '</p>');
          that.vars.memberInfo.next().fadeOut(opts.fadeOutTime, function() {
            $(this).remove();
          });
        }
        ele.parent().addClass(opts.hideClass);
      },
      error: function(xhr) {
        ele.append('<p class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>');
        that.vars.memberInfo.next().fadeOut(opts.fadeOutTime, function() {
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
    init: function() {
      var that = this,
          ele = this.element;
      this.vars = {
        memberInfo: ele.children()
      };

      ele.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
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
    inviteMemberLink: '#invite-member-link',
    // inviteMemberLink: '#get-user-link',
    boardId: '#board-id'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));