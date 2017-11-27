;(function($, window, undefined) {
  'use strict';

  var pluginName = 'get-company',
      company = '<div class="company-block" data-company-id="#{{id}}"><div class="title-line"><span class="icon-users"></span><h4 class="inline">#{{name}}</h4></div><div class="row">',
      board = '<div class="col-md-3"><a href="#{{link}}" data-board-id="#{{id}}" data-parent title="#{{name}}" class="lieu-block card"><h5 class="title-card">#{{name}}</h5><div class="actions"><span class="edit-board" title="Edit board" data-edit-table data-open-popup data-target="update" data-set-pos="true" data-follow-parent="true">Edit</span><span data-delete-table class="close-board" title="Delete board" data-delete-table data-open-popup data-target="delete" data-set-pos="true" data-follow-parent="true">Delete</span></div><p class="date">#{{date}}</p></a></div>',
      create = '<div class="col-md-3"><div class="create-lieu-block card" data-open-popup data-target="create" data-set-pos="true"><h5 class="title-card">Créer un tableau</h5></div></div></div><div class="loadmore-section"><button class="loadmore-btn #{{hide}}" data-loadmore-table data-limit="#{{limit}}">Loadmore</button></div></div></div>';

  function companyBlockRender(companyItem, opt) {
    var companyBlock = '';
        companyBlock += company.replace('#{{name}}', companyItem.company_name).replace('#{{id}}', companyItem.company_id);

    companyItem.boards.forEach(function(boardItem) {
      companyBlock += board.replace('#{{link}}', boardItem.link).replace(/#{{name}}/g, boardItem.name).replace('#{{id}}', boardItem.id).replace('#{{date}}', boardItem.created_at);
    });

    if (companyItem.total > 7) {
      companyBlock += create.replace('#{{hide}}', '').replace('#{{limit}}', opt.limitLoadmore);
    } else {
      companyBlock += create.replace('#{{hide}}', 'hide').replace('#{{limit}}', opt.limitLoadmore);
    }

    return companyBlock;
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
          dataLoadmoreCompany = ele.find(opts.dataLoadmoreCompany);

      $.ajax({
        type: opts.method,
        url: opts.url,
        dataType: 'json',
        data: {
          limit: parseInt(opts.limitLoadpage),
          offset: 0
        },
        success: function(result) {
          if (result.status) {
            var resultListCompany = '';

            result.data.forEach(function(companyItem) {
              resultListCompany += companyBlockRender(companyItem, opts);
            });
            ele.html(resultListCompany);
            $(opts.dataLoadmoreTable)['loadmore-table']();
            $(opts.dataOpenPopup)['open-popup']();
          }
        },
        error: function(xhr) {
          dataLoadmoreCompany.before('<p class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>');
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
    url: '',
    method: 'GET',
    dataLoadmoreTable: '[data-loadmore-table]',
    dataOpenPopup: '[data-open-popup]',
    dataLoadmoreCompany: '[data-loadmore-company]'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));