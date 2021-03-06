;(function($, window, undefined) {
  'use strict';

  var pluginName = 'remove-user';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var ele = this.element,
          opts = this.options,
          execBtn = ele.find('[data-accept]'),
          header = ele.find('header'),
          idTableForm = '',
          deleteEle = null,
          loadmoreBtn = null,
          memberContainer = null,
          is_Click = true;

      execBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (!is_Click) {
          return false;
        }
        is_Click = false;
        idTableForm = ele.data().memberFrom.id;
        deleteEle = $(opts.memberClass + '[data-user-id="' + idTableForm + '"]'),
        loadmoreBtn = deleteEle.siblings('[data-viewmore]'),
        memberContainer = deleteEle.parents('[data-get-list]');
        $.ajax({
          type: opts.method,
          url: $(opts.deleteMemberLink).val(),
          dataType: 'json',
          cache: false,
          data: {
            board_id: $(opts.boardId).val(),
            member_id: idTableForm
          },
          success: function(data) {
            if (data.status) {
              deleteEle.remove();
              loadmoreBtn.is(':visible') ? memberContainer['get-list']('loadOneMore', loadmoreBtn) : null;
              $(opts.dataBoardActivity)['board-activity']('reLoadActivity');
              ele.addClass(opts.hideClass);
            } else {
              header.after('<p class="errorText">' + ele.data().errorText + '</p>');
              header.next().fadeOut(opts.fadeOutTime, function() {
                $(this).remove();
                ele.addClass(opts.hideClass);
              });
            }
          },
          error: function(xhr) {
            header.after('<p class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</p>');
            header.next().fadeOut(opts.fadeOutTime, function() {
              $(this).remove();
            });
          },
          complete: function() {
            is_Click = true;
          }
        });
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
    memberClass: '.member',
    // deleteMemberLink: '#delete-member-link',
    dataBoardActivity: '[data-board-activity]',
    deleteMemberLink: '#get-user-link',
    fadeOutTime: 1000,
    textFail: 'An error occured',
    boardId: '#board-id'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));