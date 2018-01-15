;(function($, window, undefined) {
  'use strict';

  var pluginName = 'search-card',
      cardItem = '<a class="icon-news card-name priority-#{{priority}} hide" href="#" title="#{{name}}" data-card-id="#{{card-id}}" data-phase="#{{phase}}" data-content>#{{name}}</a>';

  var openFullList = function(opts) {
    if (!this.vars.list.find(opts.dataCardId).length) {
      this.vars.list.html('<div class="not-found">' + opts.requirementText + '</div>');  
    }
    this.vars.list.parent().removeClass(opts.hideClass);
  };

  var searchCard = function(value) {
    var that = this,
        opts = this.options,
        resultCards = '';

    if (that.vars.request) {
      that.vars.request.abort();
    }
    that.vars.request = $.ajax({
      type: opts.method,
      url: opts.url,
      data: {
        board_id: $(opts.boardId).val(),
        name: value
      },
      success: function(result) {
        if (result.status) {
          if (result.data.length > 0) {
            that.vars.offset = opts.limit;
            result.data.forEach(function(card) {
              resultCards += cardItem.replace(/#{{name}}/g, card.name).replace('#{{card-id}}', card.id).replace('#{{priority}}', card.priority).replace('#{{phase}}', card.phase);
            });
            that.vars.list.html(resultCards);
            if (result.data.length > opts.limit) {
              that.vars.list.find(opts.dataCardId).filter(function(i) {
                return i < opts.limit;
              }).removeClass(opts.hideClass);
              that.vars.offset += that.vars.limit;
              that.vars.totalResult = result.data.length;
              that.vars.showMore.removeClass(opts.hideClass);
            } else {
              that.vars.list.find(opts.dataCardId).removeClass(opts.hideClass);
            }
          } else {
            that.vars.list.html('<div class="not-found">' + opts.notFoundText + '</div>');
          }
        }
      },
      error: function(xhr) {
        that.vars.list.html('<div class="not-found">' + xhr.status + ' ' + xhr.statusText + '</div>');
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
          opts = this.options,
          input = '',
          maxHeight = $(window).height() - 164;
      this.vars = {
        input: ele.find(opts.input),
        list: ele.find(opts.list),
        showMore: ele.find(opts.showMoreClass),
        request: null,
        timeOutSearch: null,
        totalResult: 0,
        offset: opts.limit,
        limit: opts.limit
      };

      this.vars.list.css('max-height', maxHeight);
      $('body').off('click.' + pluginName).on('click.' + pluginName, function(e) {
        if (!$(e.target).closest(opts.list).length && !$(e.target).closest(opts.input).length && !$(e.target).closest(opts.closeBtn).length) {
          that.vars.list.not(opts.hideClass).parent().addClass(opts.hideClass);
        }
      });
      this.vars.input.off('keyup.' + pluginName).on('keyup.' + pluginName, function() {
        input = $(this).val().toLowerCase().trim();
        that.vars.showMore.addClass(opts.hideClass);
        if (input.length) {
          clearTimeout(that.vars.timeOutSearch);
          that.vars.timeOutSearch = setTimeout(function() {
            searchCard.call(that, input);
          }, opts.timeoutSearch);
        } else {
          clearTimeout(that.vars.timeOutSearch);
          that.vars.list.html('<div class="not-found">' + opts.requirementText + '</div>');
          that.vars.offset = opts.limit;
          !that.vars.showMore.hasClass(opts.hideClass) ? that.vars.showMore.addClass(opts.hideClass) : null;
        }
      });
      this.vars.input.off('focus.' + pluginName).on('focus.' + pluginName, function() {
        openFullList.call(that, opts);
      });
      this.vars.list.off('click.' + pluginName).on('click.' + pluginName, opts.dataCardId, function(e) {
        e.preventDefault();
        that.vars.list.parent().addClass(opts.hideClass);
        that.vars.input.val('');
      });
      this.vars.showMore.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.stopPropagation();
        that.vars.list.find(opts.dataCardId).filter(function(i) {
          return i < that.vars.offset;
        }).removeClass(opts.hideClass);
        if (that.vars.offset > that.vars.totalResult) {
          $(this).addClass(opts.hideClass);
          that.vars.list.css('max-height', maxHeight + 34);
        }
        that.vars.offset += that.vars.limit;
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
    input: '[data-input-autocomplete]',
    list: '[data-list-result]',
    dataCardId: '[data-card-id]',
    notFoundClass: '.not-found',
    showMoreClass: '.show-more',
    hideClass: 'hide',
    boardId: '#board-id',
    closeBtn: '.icon-close',
    limit: 5,
    timeoutSearch: 500
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));