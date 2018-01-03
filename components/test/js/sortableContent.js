;(function($, window, undefined) {
  'use strict';

  var pluginName = 'sortable-content';

  function startSort(ui, options, opts) {
    if (options.setWidth) {
      ui.placeholder.width(ui.item.width());  
    }
    if (options.setHeight) {
      if (options.followChildrenHeight) {
        ui.placeholder.height(ui.item.children().height());
      } else {
        ui.placeholder.height(ui.item.height());
      }
    }
    ui.item.addClass(opts.tiltClass);
  }

  function stopSort(ui, opts) {
    ui.item.removeClass(opts.tiltClass);
  }

  function updateUi(opts, ui, sortable) {
    $.ajax({
      type: opts.method,
      url: opts.url,
      dataType: 'json',
      data: {
        card_id: ui.item.data().cardId,
        phase_id: ui.item.parents(opts.dataPhase).data().phase,
        position: ui.item.index() + 1
      },
      success: function() {
        $(opts.dataBoardActivity)['board-activity']('reLoadActivity');
      },
      error: function() {
        sortable.sortable('cancel');
      },
      complete: function() {
        $(opts.dataSwapContent).sortable('enable');
      }
    });
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
          contentWrapper = ele.find(opts.dataSwapContent),
          connect = [],
          currentPos = 0;

      if ($('html').attr('class').indexOf(' ie') > -1) {
        contentWrapper.css('max-height', ele.height() - ele.find(opts.listHeaderClass).innerHeight() - ele.find(opts.addCardClass).innerHeight() - parseInt(contentWrapper.css('margin-bottom')));
      }
      opts.connect.forEach(function(con) {
        var tmpConnect = '[data-phase=' + con + '] ' + opts.dataSwapContent;
        connect.push(tmpConnect);
      });
      contentWrapper.sortable({
        connectWith: connect,
        placeholder: opts.placeholderContentClass,
        tolerance: 'pointer',
        zIndex: 999,
        start: function(e, u) {
          startSort(u, {setWidth: false, setHeight: true, followChildrenHeight: false}, opts);
          $(opts.dataSwapContent).sortable('disable');
          currentPos = u.item.index();
        },
        stop: function(e, u) {
          stopSort(u, opts);
          if (u.item.index() === currentPos) {
            $(opts.dataSwapContent).sortable('enable');
          }
        },
        update: function(e, u) {
          var tmpEle = $(this);
          
          if (this === u.item.parent()[0]) {
            updateUi(opts, u, tmpEle, contentWrapper);
          } else {
            $(this)['get-list-card']('callAjax', 'sort');
          }
        }
      });
      // if (opts.isSwapProgress) {
      //   ele.sortable({
      //     placeholder: opts.placeholderProgressClass,
      //     zIndex: 999,
      //     handle: '.list-content',
      //     items: opts.dataSwapProgress,
      //     cancel: opts.cancelSortClass,
      //     tolerance: 'pointer',
      //     start: function(e, u) {
      //       startSort(u, { setWidth: true, setHeight: true, followChildrenHeight: true }, opts);
      //     },
      //     stop: function(e, u) {
      //       stopSort(u, opts);
      //     }
      //   });
      // }
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
    dataSwapContent: '[data-swap-content]',
    dataDisableSortable: '[data-disable-sortable]',
    dataPhase: '[data-phase]',
    dataGetDetail: '[data-get-detail]',
    dataBoardActivity: '[data-board-activity]',
    listHeaderClass: '.list-header',
    addCardClass: '.add-card',
    // dataSwapProgress: '[data-swap-progress]',
    placeholderContentClass: 'placeholder-content',
    placeholderProgressClass: 'placeholder-progress',
    cancelSortClass: '.no-sort',
    tiltClass: 'tilt',
    hideClass: 'hide',
    url: 'data/update-card.json',
    isSwapProgress: false
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));