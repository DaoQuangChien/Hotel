;(function($, window, undefined) {
  'use strict';

  var pluginName = 'loadmore-table',
      table = '<div class="col-md-3"><a href="#{{link}}" data-board-id="#{{id}}" data-parent title="#{{name}}" class="lieu-block card"><h5 class="title-card" data-limit-word>#{{name}}</h5><div class="actions"><span class="edit-board" title="Edit board" data-edit-table data-open-popup data-target="update" data-set-pos="true" data-follow-parent="true" data-move-down="-34">#{{text-edit}}</span><span data-delete-table class="close-board" title="Delete board" data-open-popup data-target="delete" data-show-parent="true">#{{text-delete}}</span></div><p class="date">#{{date}}</p></a></div>';

  function tableRender(boardItem, opts) {
    var result = '';

    boardItem.forEach(function(board) {
      result += table.replace('#{{link}}', board.link).replace('#{{id}}', board.id).replace(/#{{name}}/g, board.name).replace('#{{date}}', new Date(board.created_at.replace(/-/g, '/')).toLocaleDateString()).replace('#{{text-edit}}', opts.textEdit).replace('#{{text-delete}}', opts.textDelete);
    });
    return result;
  }

  function oneTableRender(boardItem, opts) {
    return table.replace('#{{link}}', boardItem[0].link).replace('#{{id}}', boardItem[0].id).replace(/#{{name}}/g, boardItem[0].name).replace('#{{date}}', new Date(boardItem[0].created_at.replace(/-/g, '/')).toLocaleDateString()).replace('#{{text-edit}}', opts.textEdit).replace('#{{text-delete}}', opts.textDelete);
  }

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var ele = this.element,
          opts = this.options,
          limit = opts.limit,
          offset = 7,
          link = ele.closest(opts.dataGetCompany).data().linkLoadmore,
          companyId = ele.closest(opts.dataCompanyId).data().companyId,
          is_Click = true,
          offsetData = 0;

      ele.on('click.' + pluginName, function(e, is_Deleted) {
        if (!is_Click) {
          return false;
        }
        is_Click = false;
        offsetData = is_Deleted ? offset - 1 : offset;
        $.ajax({
          type: opts.method,
          url: link,
          dataType: 'json',
          data: {
            limit: limit,
            offset: offsetData,
            company_id: companyId
          },
          success: function(result) {
            if (result.status && result.data.length) {
              var tableCreated = '';
              if (is_Deleted) {
                tableCreated = oneTableRender(result.data, opts);
              } else {
                offset += limit;
                tableCreated = tableRender(result.data, opts);
              }
              $('[data-company-id="' + companyId + '"]').find(opts.dataOpenPopup).parent().before(tableCreated);
              $('[data-company-id="' + companyId + '"] [data-board-id]').filter(function(i) {
                return i > offsetData - 1;
              }).find('[data-open-popup]')['open-popup']();
              $('[data-company-id="' + companyId + '"]').find('.title-card').filter(function(index) {
                return index >= limit - 1;
              })['limit-word']();
              if (result.total <= offset) {
                ele.addClass(opts.hideClass);
              }
            }
          },
          error: function(xhr) {
            ele.after('<p class="errorText">' + opts.textError + ': ' + xhr.status + ' ' + xhr.statusText + '</p>');
            ele.next().fadeOut(1000, function() {
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
    url: '',
    method: 'GET',
    hideClass: 'hide',
    dataGetCompany: '[data-get-company]',
    dataCompanyId: '[data-company-id]',
    dataOpenPopup: '[data-open-popup].card',
    textError: 'An error occured',
    textEdit: 'Edit',
    textDelete: 'Delete'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));