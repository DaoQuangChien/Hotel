; (function($, window, undefined) {
  'use strict';

  var pluginName = 'loadmore-table',
      table = '<div class="col-md-3"><a href="#{{link}}" data-board-id="#{{id}}" data-parent title="#{{name}}" class="lieu-block card"><h5 class="title-card">#{{name}}</h5><div class="actions"><span class="edit-board" title="Edit board" data-edit-table data-open-popup data-target="update" data-set-pos="true" data-follow-parent="true">Edit</span><span data-delete-table class="close-board" title="Delete board" data-delete-table data-open-popup data-target="delete" data-set-pos="true" data-follow-parent="true">Delete</span></div><p class="date">#{{date}}</p></a></div>';

  function tableRender(boardItem) {
    var result = '';

    boardItem.forEach(function(board) {
      result += table.replace('#{{link}}', board.link).replace('#{{id}}', board.id).replace(/#{{name}}/g, board.name).replace('#{{date}}', board.created_at);
    });
    return result;
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
          offset = 1,
          link = ele.closest(opts.dataGetCompany).data().linkLoadmore,
          companyId = ele.closest(opts.dataCompanyId).data().companyId;

      ele.on('click.' + pluginName, function() {
        $.ajax({
          type: opts.method,
          url: link,
          dataType: 'json',
          data: {
            limit: limit,
            offset: offset,
            company_id: companyId
          },
          success: function(result) {
            if (result.status) {
              var tableCreated = '';
              offset++;
              tableCreated = tableRender(result.data);
              $('[data-company-id="' + companyId + '"]').find(opts.dataOpenPopup).parent().before(tableCreated);
              if (result.total <= 8) {
                ele.addClass(opts.hideClass);
              }
            }
          },
          error: function(xhr) {
            ele.after('<p class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>');
            ele.next().fadeOut(1000, function() {
              $(this).remove();
            });
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
    dataOpenPopup: '[data-open-popup].card'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));