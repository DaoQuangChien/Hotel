;(function($, window, undefined) {
  'use strict';

  var pluginName = 'get-list',
      member_cat = '<p class="member-category"><span class="icon-male"></span>#{{cat-name}}:</p><div class="list-member" data-role="#{{role}}">',
      member = '<a href="#" class="member" title="#{{full-name}}" data-user-id="#{{user-id}}" data-open-popup data-target="deleteMember" data-set-pos="true" data-follow-parent="true" data-parent #{{data-authority}}>#{{short-name}}</a>';
  function renderMember(data, opts) {
    var result = '';
    
    data.users.forEach(function(user) {
      result += member.replace('#{{full-name}}', user.full_name).replace('#{{short-name}}', user.short_name).replace('#{{user-id}}', user.id).replace('#{{data-authority}}', function() {
        if ($(opts.isAdminId).val() !== '1') {
          return 'data-authority=true';
        } else {
          return '';
        }
      });
    });
    return result;
  }
  function renderMemberList(data, opts) {
    var result = '';

    result += member_cat.replace('#{{role}}', data.type).replace('#{{cat-name}}', data.type_name);
    result += renderMember(data, opts);
    if (data.users.length < data.total) {
      result += '<a href="#" title="' + opts.textViewmore + '" data-viewmore class="view-more">' + opts.textViewmore + '</a></div>';
    } else {
      result += '</div>';
    }
    return result;
  }

  var callAjax = function() {
    var that = this,
        ele = this.element,
        opts = this.options,
        listUser = '';

    $.ajax({
      type: opts.method,
      url: $(opts.getAvailableUserLink).val(),
      dataType: 'json',
      cache: false,
      data: {
        board_id: $(opts.boardIdEle).val(),
        limit: that.vars.loadmoreObj.limit,
        offset: that.vars.loadmoreObj.offset
      },
      success: function(result) {
        if (result.status) {
          result.data.forEach(function(dataList) {
            listUser += renderMemberList(dataList, opts);
            that.vars['loadmore_' + dataList.type] = {
              limit: opts.limit,
              offset: opts.limit
            };
          });
          ele.prepend(listUser);
          ele.find(opts.dataUserId)['open-popup']();
        } else {
          ele.html('<p class="errorText">' + opts.errorText + '</p>');
        }
      },
      error: function(xhr) {
        ele.html('<p class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</p>');
      }
    });
  };

  var loadmoreAjax = function(btn, isDelete) {
    var that = this,
        opts = this.options,
        container = btn.parent(),
        type = container.data().role,
        listUser = '',
        data = {
          board_id: $(opts.boardIdEle).val(),
          limit: isDelete ? 1 : that.vars['loadmore_' + type].limit,
          offset: isDelete ? that.vars['loadmore_' + type].offset - 1 : that.vars['loadmore_' + type].offset,
          type: type
        };

    that.vars.is_Click = false;
    $.ajax({
      type: opts.method,
      url: $(opts.getAvailableUserLink).val(),
      dataType: 'json',
      cache: false,
      data: data,
      success: function(result) {
        if (result.status) {
          if (!isDelete) {
            that.vars['loadmore_' + type].offset += that.vars['loadmore_' + type].limit;
          }
          result.data.forEach(function(dataList) {
            if (dataList.type.toString() !== container.data().role.toString()) {
              return;
            }
            listUser = renderMember(dataList, opts);
            btn.before(listUser);
            if (dataList.total <= that.vars['loadmore_' + type].offset) {
              btn.addClass(opts.hideClass);
            }
          });
          container.find(opts.dataUserId)['open-popup']();
        }
      },
      error: function(xhr) {
        container.after('<p class="' + opts.notFoundClass + '">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</p>');
        container.next().fadeOut(opts.fadeOutTime, function() {
          $(this).remove();
        });
      },
      complete: function() {
        that.vars.is_Click = true;
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
        is_Click: true,
        loadmoreObj: {
          offset: 0,
          limit: opts.limit
        }
      };

      callAjax.call(this);
      ele.off('click.' + pluginName).on('click.' + pluginName, opts.dataViewmore, function(e) {
        e.preventDefault();
        if (that.vars.is_Click) {
          loadmoreAjax.call(that, $(this));
        }
      });
    },
    loadOneMore: function(btn) {
      loadmoreAjax.call(this, btn, true);
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
    // getAvailableUserLink:'#get-available-user-link',
    getAvailableUserLink:'#get-user-link',
    method: 'GET',
    noResultText: 'No results found',
    boardIdEle: '#board-id',
    member: '[data-add-user]',
    dataUserId: '[data-user-id]',
    dataViewmore: '[data-viewmore]',
    fadeOutTime: 1000,
    limit: 8,
    textFail: 'An error occured',
    textViewmore: 'View more...',
    isAdminId: '#is-admin',
    hideClass: 'hide'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));