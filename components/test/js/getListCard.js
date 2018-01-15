;(function($, window, undefined) {
  'use strict';

  var pluginName = 'get-list-card',
      card = '<a data-content class="card" data-card-id=#{{card-id}} data-priority="#{{priority}}" title="#{{title}}"><div class="card-description"><span class="detail priority-#{{priority}}" data-limit-word>#{{name}}</span><ul class="icons"><li title="#{{description-title}}"><span class="icon-descrip "></span></li><li title="#{{comment-title}}"><span class="icon-comment #{{hide-comment}}">#{{comment}}</span></li><li title="#{{attachment-title}}"><span class="icon-attachment #{{hide-attachment}}">#{{attachment}}</span></li></ul></div></a>';
  
  function renderMemberList(data, opts, phase) {
    var result = '';

    if (data.phase === phase) {
      result += card.replace('#{{name}}', data.name).replace('#{{description-title}}', opts.descriptionTitle).replace('#{{comment-title}}', opts.commentTitle).replace('#{{comment}}', data.total_comment).replace('#{{attachment-title}}', opts.attachmentTitle).replace('#{{attachment}}', data.total_attachment).replace(/#{{priority}}/g, data.priority).replace('#{{card-id}}', data.id).replace('#{{title}}', data.name);
      if (data.comment !== '') {
        result = result.replace('#{{hide-comment}}', '');
      } else {
        result = result.replace('#{{hide-comment}}', opts.hideClass);
      }
      if (data.attachment !== '') {
        result = result.replace('#{{hide-attachment}}', '');
      } else {
        result = result.replace('#{{hide-attachment}}', opts.hideClass);
      }
    }
    return result;
  }

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
        loadmoreObj: {
          can_loadmore: true,
          offset: 0,
          limit: opts.limit
        },
        permission: true,
        is_Loadmore: true
      };

      this.callAjax();
      ele.off('scroll.' + pluginName).on('scroll.' + pluginName, function() {
        if (that.vars.is_Loadmore) {
          if ($(this).scrollTop() > this.scrollHeight - $(this).outerHeight() - opts.triggerBefore) {
            if (that.vars.permission) {
              if ($(this).data().lastFilter) {
                that.callAjax($(this).data().lastFilter, 'loadmore');
              } else {
                that.callAjax();
              }
            }
          }
        }
      });
    },
    callAjax: function(data, action) {
      var that = this,
          ele = this.element,
          opts = this.options,
          listUser = '',
          dataOffset = {},
          param;

      this.vars.permission = false;
      param = {
        board_id: $(opts.boardIdEle).val(),
        limit: that.vars.loadmoreObj.limit,
        phase: ele.parents('[data-' + opts.dataPhase + ']').data(opts.dataPhase)
      };
      if (typeof(data) === 'object') {
        if (action){
          if (action === 'delete') {
            dataOffset.offset = this.vars.loadmoreObj.offset - 1;
          } else {
            dataOffset.offset = this.vars.loadmoreObj.offset;
          }
        } else {
          that.vars.loadmoreObj.offset = 0;
          dataOffset.offset = 0;
        }
        dataOffset[data[0]] = data[1];
      } else {
        if (data === 'delete') {
          dataOffset.offset = this.vars.loadmoreObj.offset - 1;
        } else {
          if (ele.find(opts.dataContent).length > this.vars.loadmoreObj.offset) {
            dataOffset.offset = ele.find(opts.dataContent).length;
          } else {
            dataOffset.offset = this.vars.loadmoreObj.offset;
          }
        }
      }
      param = $.extend(param, dataOffset);
      $.ajax({
        type: opts.method,
        url: $(opts.getCardsLink).val(),
        dataType: 'json',
        cache: false,
        data: param,
        success: function(result) {
          if (result.status) {
            // result.data.sort(function(a, b) {
            //   return parseInt(a.position) - parseInt(b.position);
            // });
            if (action && action !== 'loadmore' || typeof(data) === 'string') {
              if (result.data.length) {
                listUser += renderMemberList(result.data[0], opts, ele.parents('[data-' + opts.dataPhase + ']').data(opts.dataPhase).toString());
              }
            } else {
              result.data.forEach(function(dataList) {
                listUser += renderMemberList(dataList, opts, ele.parents('[data-' + opts.dataPhase + ']').data(opts.dataPhase).toString());
              });
              that.vars.loadmoreObj.offset += that.vars.loadmoreObj.limit;
            }
            if (typeof(data) === 'object' && typeof(action) === 'undefined') {
              ele
                .html(listUser)
                .find(opts.dataLimitWord)['limit-word']()
                .scrollTop(0);
            } else {
              ele
                .append(listUser)
                .find(opts.dataLimitWord)['limit-word']();
            }
            if (result.total <= that.vars.loadmoreObj.offset) {
              that.vars.is_Loadmore = false;
            } else {
              that.vars.is_Loadmore = true;
            }
          } else {
            ele.html('<p class="errorText">' + opts.errorText + '</p>');
          }
        },
        error: function(xhr) {
          ele.html('<p class="errorText">' + opts.failText + xhr.status + ' ' + xhr.statusText + '</p>');
        },
        complete: function() {
          that.vars.permission = true;
        }
      });
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, param1, param2) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](param1, param2);
      }
    });
  };

  $.fn[pluginName].defaults = {
    method: 'GET',
    errorLoadmore: 'Sorry, we can\'t load more card.',
    errorText: 'Sorry, we can\'t find the cards of this phase',
    failText: 'An error occured: ',
    dataLimitWord: '[data-limit-word]',
    dataContent: '[data-content]',
    getCardsLink: '#get-cards-link',
    boardIdEle: '#board-id',
    fadeOutTime: 1000,
    triggerBefore: 20,
    limit: 10,
    dataPhase: 'phase',
    descriptionTitle: 'This card has a description',
    commentTitle: 'Comment',
    attachmentTitle: 'Attach files',
    hideClass: 'hide'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));