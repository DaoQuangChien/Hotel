;(function($, window, undefined) {
  'use strict';

  var pluginName = 'autocomplete-type',
      memberItem = '<li class="user" data-add-user><a href="#" title="#{{name}}" data-user-id="#{{user-id}}" data-short-name="#{{short-name}}">#{{name}}</a></li>';

  var openFullList = function(opts) {
    this.vars.list.find(opts.notFoundClass).hide();
    this.vars.list.html('<li class="not-found">' + opts.requirementText + '</li>');
    this.vars.list.removeClass(opts.hideClass);
  };

  var searchUser = function(value) {
    var that = this,
        ele = this.element,
        opts = this.options,
        resultUsers = '';
    
    if (that.vars.request) {
      that.vars.request.abort();
    }
    that.vars.request = $.ajax({
      type: opts.method,
      url: $(opts.getUserLink).val(),
      data: {
        board_id: $(opts.boardId).val(),
        name: value
      },
      success: function(result) {
        if (result.status) {
          if (result.data.length > 0) {
            result.data.forEach(function(user) {
              resultUsers += memberItem.replace(/#{{name}}/g, user.full_name).replace('#{{user-id}}', user.id).replace('#{{short-name}}', user.short_name);
            });
            that.vars.list.html(resultUsers);
            ele.find('[data-' + opts.dataAddUser + ']').data('method', opts.methodAddUser);
            ele.find('[data-' + opts.dataAddUser + ']')[opts.dataAddUser]();
          } else {
            that.vars.list.html('<li class="not-found">' + opts.notFoundText + '</li>');
          }
        }
      },
      error: function(xhr) {
        that.vars.list.html('<li class="not-found">' + xhr.status + xhr.statusText + '</li>');
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
          input = '';
      this.vars = {
        input: ele.find(opts.input),
        list: ele.find(opts.list),
        request: null,
        timeOutSearch: null
      };

      $('body').off('click.' + pluginName).on('click.' + pluginName, function(e) {
        if (!$(e.target).closest(opts.list).length && !$(e.target).closest(opts.input).length && !$(e.target).closest(opts.closeBtn).length) {
          that.vars.list.not(opts.hideClass).addClass(opts.hideClass);
        }
      });
      this.vars.input.off('keyup.' + pluginName).on('keyup.' + pluginName, function() {
        input = $(this).val().toLowerCase();
        if (input.length) {
          clearTimeout(that.vars.timeOutSearch);
          that.vars.timeOutSearch = setTimeout(function() {
            searchUser.call(that, input);
          }, opts.timeoutSearch);
        } else {
          clearTimeout(that.vars.timeOutSearch);
          that.vars.list.html('<li class="not-found">' + opts.requirementText + '</li>');
        }
      });
      this.vars.input.off('focus.' + pluginName).on('focus.' + pluginName, function() {
        if ($(this).val().length) {
          that.vars.list.removeClass(opts.hideClass);
        } else {
          openFullList.call(that, opts);
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
    methodAddUser: 'GET',
    input: '[data-input-autocomplete]',
    dataAddUser: 'add-user',
    list: '[data-list-invitable]',
    notFoundClass: '.not-found',
    hideClass: 'hide',
    boardId: '#board-id',
    getUserLink: '#get-user-link',
    notFoundText: 'No results found',
    requirementText: 'Enter a name',
    closeBtn: '.icon-close',
    timeoutSearch: 500
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));