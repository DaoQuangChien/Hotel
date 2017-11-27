;(function($, window, undefined) {
  'use strict';

  var pluginName = 'create-table',
      table = '<div class="col-md-3"><a href="#{{link}}" data-board-id="#{{id}}" data-parent title="#{{mainName}}" class="lieu-block card"><h5 class="title-card">#{{name}}</h5><div class="actions"><span class="edit-board" title="Edit board" data-edit-table data-open-popup data-target="update" data-set-pos="true" data-follow-parent="true">Edit</span><span data-delete-table class="close-board" title="Delete board" data-delete-table data-open-popup data-target="delete" data-set-pos="true" data-follow-parent="true">Delete</span></div><p class="date">#{{date}}</p></a></div>';

  function tableRender(tableItem, name) {
    var result = '',
        tmpName = name.split(' '),
        displayName = name,
        nameLength = 0;

    for (var n in tmpName) {
      if (tmpName[n].length > 40) {
        displayName = name.substring(0, 37) + '...';
        break;
      } else {
        nameLength += tmpName[n].length + parseInt(n);
        if (nameLength > 80) {
          displayName = name.substring(0, 77) + '...';
          break;
        }
      }
    }

    result += table.replace('#{{link}}', tableItem.link).replace('#{{id}}', tableItem.board_id).replace('#{{name}}', name).replace('#{{mainName}}', displayName).replace('#{{date}}', tableItem.created_at);
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
          tableName = '';

      eleSubmit.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (eleInput.val().length === 0) {
          eleInput.focus();
          return false;
        }

        tableName = eleInput.val();
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
              tableCreated = tableRender(data.board, tableName);
              $('[data-company-id="' + ele.data().companyFrom + '"]').find(opts.rowClass).prepend(tableCreated);
              ele.addClass(opts.hideClass);
            }
          },
          error: function(xhr) {
            eleInput.after('<p class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>');
            eleInput.next().fadeOut(opts.fadeOutTime, function() {
              $(this).remove();
            });
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
    createTableLink: '#create-table-link',
    rowClass: '.row',
    fadeOutTime: 1000
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));