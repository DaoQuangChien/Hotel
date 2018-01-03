;(function($, window, undefined) {
  'use strict';

  var pluginName = 'create-table',
      table = '<div class="col-md-3"><a href="#{{link}}" data-board-id="#{{id}}" data-parent title="#{{name}}" class="lieu-block card"><h5 class="title-card" data-limit-word>#{{name}}</h5><div class="actions"><span class="edit-board" title="Edit board" data-edit-table data-open-popup data-target="update" data-set-pos="true" data-follow-parent="true" data-move-down="-34">#{{text-edit}}</span><span data-delete-table class="close-board" title="Delete board" data-delete-table data-open-popup data-target="delete" data-show-parent=true>#{{text-delete}}</span></div><p class="date">#{{date}}</p></a></div>';

  function tableRender(tableItem, name, opts) {
    var result = '';

    result += table.replace('#{{link}}', tableItem.link).replace('#{{id}}', tableItem.board_id).replace(/#{{name}}/g, name).replace('#{{date}}', new Date(tableItem.created_at.replace(/-/g, '/')).toLocaleDateString()).replace('#{{text-delete}}', opts.textDelete).replace('#{{text-edit}}', opts.textEdit);
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
          eleInput = ele.find('input'),
          eleSubmit = ele.find('button'),
          tableName = '',
          is_Click = true;

      eleSubmit.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (eleInput.val().length === 0) {
          eleInput.focus();
          return false;
        }
        if (!is_Click) {
          return false;
        }
        tableName = eleInput.val();
        is_Click = false;
        $.ajax({
          type: opts.method,
          url: $(opts.createTableLink).val(),
          dataType: 'json',
          data: {
            name: tableName,
            company_id: ele.data().companyFrom
          },
          success: function(data) {
            if (data.status) {
              var tableCreated = '';
              tableCreated = tableRender(data.board, tableName, opts);
              $('[data-company-id="' + ele.data().companyFrom + '"]')
                .find(opts.rowClass).prepend(tableCreated)
                .find(opts.dataLimitWord + ':first')['limit-word']();
              $('[data-company-id="' + ele.data().companyFrom + '"]').find(opts.dataBoardId + ':first [data-open-popup]')['open-popup']();
              ele.addClass(opts.hideClass);
            }
          },
          error: function(xhr) {
            eleInput.after('<p class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>');
            eleInput.next().fadeOut(opts.fadeOutTime, function() {
              $(this).remove();
            });
          },
          complete: function() {
            is_Click = true;
          }
        });
      });

      eleInput.off('keydown.' + pluginName).on('keydown.' + pluginName, function(e) {
        if (e.keyCode === 13) {
          eleSubmit.click();
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
    hideClass: 'hide',
    dataLimitWord: '[data-limit-word]',
    dataBoardId: '[data-board-id]',
    createTableLink: '#create-table-link',
    textEdit: 'Edit',
    textDelete: 'Delete',
    rowClass: '.row',
    fadeOutTime: 1000
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));