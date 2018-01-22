;(function($, window, undefined) {
  'use strict';

  var pluginName = 'delete-table';

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
          body = ele.find('.modal-body'),
          idTableForm = '',
          deleteEle = null,
          loadmoreBtn = null,
          company = null,
          is_Click = true;

      execBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        body = ele.find('.modal-body');
        if (!is_Click) {
          return false;
        }
        is_Click = false;
        idTableForm = ele.data().tableFrom;
        deleteEle = $('[data-board-id=' + idTableForm + ']').parent();
        company = deleteEle.parents(opts.dataCompanyId);
        loadmoreBtn = company.find(opts.dataLoadmoreTable);
        $.ajax({
          type: opts.method,
          url: $(opts.deleteTableLink).val(),
          dataType: 'json',
          data: {
            id: idTableForm
          },
          success: function(data) {
            if (data.status) {
              deleteEle.remove();
              if (company.find(opts.dataBoardId).length) {
                if (loadmoreBtn.is(':visible')) {
                  loadmoreBtn.trigger('click', [true]);
                }
              } else {
                company.remove();
              }
              ele.modal('hide');
            } else {
              body.length ? !body.find('p').length ? body.html('<p>' + ele.data().errorText + '</p>') : null : execBtn.parent().before('<div class="modal-body"><p>' + ele.data().errorText + '</p></div>');
            }
          },
          error: function(xhr) {
            body.length ? !body.find('p').length ? body.html('<p>An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>') : null : execBtn.parent().before('<div class="modal-body"><p>An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p></div>');
          },
          complete: function() {
            is_Click = true;
          }
        });
        ele.off('hidden.bs.modal').on('hidden.bs.modal', function() {
          ele.find('.modal-body').length ? ele.find('.modal-body').remove() : null;
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
    deleteTableLink: '#delete-table-link',
    dataLoadmoreTable: '[data-loadmore-table]',
    dataCompanyId: '[data-company-id]',
    dataBoardId: '[data-board-id]',
    fadeOutTime: 1000
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));