;(function($, window, undefined) {
  'use strict';

  var pluginName = 'get-list',
      member_cat = '<p class="member-category"><span class="icon-male"></span>#{{cat-name}}:</p><div class="list-member" data-role="#{{role}}">',
      member = '<a href="#" class="member" title="#{{full-name}}" data-user-id="#{{user-id}}" data-open-popup data-target="deleteMember" data-set-pos="true" data-follow-parent="true" data-parent data-move-down="30">#{{short-name}}</a>';
  function renderMember(data) {
    var result = '';
    
    data.users.forEach(function (user) {
      result += member.replace('#{{full-name}}', user.full_name).replace('#{{short-name}}', user.short_name).replace('#{{user-id}}', user.id);
    });
    return result;
  }
  function renderMemberList(data) {
    var result = '';

    result += member_cat.replace('#{{role}}', data.type).replace('#{{cat-name}}', data.type_name);
    result += renderMember(data);
    result += '</div>';
    return result;
  }

  var callAjax = function() {
    var that = this,
        ele = this.element,
        opts = this.options,
        total = 0,
        listUser = '';

    $.ajax({
      type: opts.method,
      url: $(opts.getAvailableUserLink).val(),
      dataType: 'json',
      data: {
        board_id: $(opts.boardIdEle).val(),
        limit: that.vars.loadmoreObj.limit,
        offset: that.vars.loadmoreObj.offset
      },
      success: function(result) {
        if (result.status) {
          result.data.forEach(function (dataList) {
            listUser += renderMemberList(dataList);
            total += dataList.users.length;
          });
          ele.prepend(listUser);
          ele.find(opts.dataUserId)['open-popup']();
          if (result.total > total) {
            that.vars.viewmoreBtn.removeClass(opts.hideClass);
          }
          that.vars.loadmoreObj.offset++;
        } else {
          ele.html('<p class="errorText">' + opts.errorText + '</p>');
        }
      },
      error: function(xhr) {
        ele.html('<p class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>');
      }
    });
  };

  var loadmoreAjax = function(btn) {
    var that = this,
        opts = this.options,
        container = btn.parent(),
        total = 0,
        listUser = '';

    $.ajax({
      type: opts.method,
      url: $(opts.getAvailableUserLink).val(),
      dataType: 'json',
      data: {
        board_id: $(opts.boardIdEle).val(),
        limit: that.vars.loadmoreObj.limit,
        offset: that.vars.loadmoreObj.offset
      },
      success: function(result) {
        if (result.status) {
          result.data.forEach(function(dataList) {
            listUser = renderMember(dataList);
            container.find('[data-role=' + dataList.type + ']').append(listUser);
            total += dataList.users.length;
          });
          if (result.total <= total) {
            that.vars.viewmoreBtn.addClass(opts.hideClass);
          }
          container.find(opts.dataUserId)['open-popup']();
          that.vars.loadmoreObj.offset++;
        }
      },
      error: function(xhr) {
        container.after('<li class="' + opts.notFoundClass + '">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</li>');
        container.next().fadeOut(opts.fadeOutTime, function () {
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
        viewmoreBtn: ele.find(opts.dataViewmore),
        loadmoreObj: {
          offset: 0,
          limit: opts.limit
        }
      };

      callAjax.call(this);
      this.vars.viewmoreBtn.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        loadmoreAjax.call(that, $(this));
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
    getAvailableUserLink:'#get-available-user-link',
    // getAvailableUserLink:'#get-user-link',
    method: 'GET',
    noResultText: 'No results found',
    boardIdEle: '#board-id',
    member: '[data-add-user]',
    dataUserId: '[data-user-id]',
    dataViewmore: '[data-viewmore]',
    fadeOutTime: 1000,
    limit: 10,
    hideClass: 'hide'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));