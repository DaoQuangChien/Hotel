;(function($, window, undefined) {
  'use strict';

  var pluginName = 'dynamic-create',
      companyOpt = '<option value="#{{id}}">#{{name}}</option>',
      company = '<div class="company-block" data-company-id="#{{id}}"><div class="title-line"><span class="icon-users"></span><h4 class="inline">#{{name}}</h4></div><div class="row">',
      board = '<div class="col-md-3"><a href="#{{link}}" data-board-id="#{{id}}" data-parent title="#{{name}}" class="lieu-block card"><h5 class="title-card" data-limit-word>#{{name}}</h5><div class="actions"><span class="edit-board" title="Edit board" data-edit-table data-open-popup data-target="update" data-set-pos="true" data-follow-parent="true" data-move-down="-34">#{{text-edit}}</span><span data-delete-table class="close-board" title="Delete board" data-delete-table data-open-popup data-target="delete" data-show-parent=true>#{{text-delete}}</span></div><p class="date">#{{date}}</p></a></div>',
      create = '<div class="col-md-3"><div class="create-lieu-block card" data-open-popup data-target="create" data-set-pos="true" data-move-down="-34"><h5 class="title-card">Créer un tableau</h5></div></div></div><div class="loadmore-section"><button class="loadmore-btn #{{hide}}" data-loadmore-table data-limit="#{{limit}}" data-text-edit="#{{text-edit}}" data-text-delete="#{{text-delete}}">#{{text-loadmore}}</button></div></div></div>';

  var createTableAjax = function(createBtn) {
    var that = this,
        ele = this.element,
        opts = this.options;

    $.ajax({
      type: opts.methodCreate,
      url: $(opts.createTableLink).val(),
      dataType: 'json',
      data: {
        name: that.vars.nameCompany.val(),
        company_id: that.vars.listCompany.val()
      },
      success: function(result) {
        if (result.status) {
          if ($('[data-company-id=' + that.vars.listCompany.val() + ']').length) {
            $('[data-company-id=' + that.vars.listCompany.val() + '] .row').prepend(board.replace('#{{link}}', result.board.link).replace('#{{id}}', result.board.board_id).replace(/#{{name}}/g, that.vars.nameCompany.val()).replace('#{{text-edit}}', opts.textEdit).replace('#{{text-delete}}', opts.textDelete).replace('#{{date}}', new Date(result.board.created_at.replace(/-/g, '/')).toLocaleDateString()));
          } else {
            that.vars.companyBlock.append(company.replace('#{{id}}', that.vars.listCompany.val()).replace('#{{name}}', that.vars.tmpCompanyName).replace('#{{delete-all}}', opts.textDeleteAll) + board.replace('#{{link}}', result.board.link).replace('#{{id}}', result.board.board_id).replace(/#{{name}}/g, that.vars.nameCompany.val()).replace('#{{text-edit}}', opts.textEdit).replace('#{{text-delete}}', opts.textDelete).replace('#{{date}}', new Date(result.board.created_at.replace(/-/g, '/')).toLocaleDateString()) + create.replace('#{{hide}}', opts.hideClass).replace('#{{limit}}', opts.limit).replace('#{{text-edit}}', opts.textEdit).replace('#{{text-delete}}', opts.textDelete).replace('#{{text-loamore}}', opts.textLoadmore));
          }
          $('[data-company-id=' + that.vars.listCompany.val() + ']').find(opts.dataLimitWord + ':first')['limit-word']();
          $('[data-company-id=' + that.vars.listCompany.val() + ']').find(opts.dataBoardId + ':first ' + opts.dataOpenPopup)['open-popup']();
          ele.modal('hide');
        }
      },
      error: function(xhr) {
        createBtn.after('<span class="errorText">' + opts.textFail + xhr.status + xhr.statusText + '</span>');
        createBtn.next().fadeOut(opts.fadeOutTime, function() {
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
          ele = this.element,
          opts = this.options;
      this.vars = {
        companyBlock: $(opts.dataGetCompany),
        listCompany: ele.find(opts.dataListCompany),
        nameCompany: ele.find(opts.dataNameCompany),
        createBtn: ele.find(opts.dataAccept),
        tmpCompanyName: '',
        canCreate: true
      };

      this.getListCompany();
      this.vars.listCompany.off('change.' + pluginName).on('change.' + pluginName, function() {
        that.vars.tmpCompanyName = $(this).find('option:selected').text();
      });
      this.vars.createBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (that.vars.nameCompany.val() === '' || !that.vars.canCreate) {
          that.vars.nameCompany.focus();
          return;
        }
        createTableAjax.call(that, $(this));
      });
      // ele.off('click.' + pluginName).on('click.' + pluginName, function(e) {
      //   if ($(e.target).is('[data-' + pluginName + ']') && !$(e.target).hasClass(opts.hideClass)) {
      //     $(e.target).addClass(opts.hideClass);
      //   }
      // });
    },
    getListCompany: function() {
      var that = this,
          opts = this.options;

      $.ajax({
        type: opts.method,
        url: opts.url,
        dataType: 'json',
        success: function(result) {
          if (result.status) {
            var listName = '';

            result.data.forEach(function(company, index) {
              if (index === 0) {
                that.vars.tmpCompanyName = company.name;
              }
              listName += companyOpt.replace('#{{id}}', company.id).replace('#{{name}}', company.name);
            });
            that.vars.listCompany.html(listName);
          }
        },
        error: function(xhr) {
          that.vars.listCompany.html('<option>' + opts.textFail + xhr.status + xhr.statusText + '</option>');
          that.vars.canCreate = false;
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
    dataListCompany: '[data-list-company]',
    dataNameCompany: '[data-name-company]',
    dataAccept: '[data-accept]',
    dataGetCompany: '[data-get-company]',
    dataLimitWord: '[data-limit-word]',
    dataBoardId: '[data-board-id]',
    dataOpenPopup: '[data-open-popup]',
    hideClass: 'hide',
    createTableLink: '#create-table-link',
    textFail: 'An error has occured: ',
    limit: 8,
    fadeOutTime: 1000
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));