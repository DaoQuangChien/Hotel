; (function ($, window, undefined) {
  'use strict';

  var pluginName = 'get-list-card',
    card = '<a data-content class="card" data-card-id=#{{card-id}}><div class="card-description"><span class="detail priority-#{{priority}}">#{{name}}</span><ul class="icons"><li title="#{{description-title}}"><span class="icon-descrip "></span></li><li title="#{{comment-title}}"><span class="icon-comment #{{hide-comment}}">#{{comment}}</span></li><li title="#{{attachment-title}}"><span class="icon-attachment #{{hide-attachment}}">#{{attachment}}</span></li></ul></div></a>';
  // <span data-show-option data-show-overlay class="icon-pencil"></span>
  function renderMemberList(data, opts, phase) {
    var result = '';

    if (data.phase === phase) {
      result += card.replace('#{{name}}', data.name).replace('#{{description-title}}', opts.descriptionTitle).replace('#{{comment-title}}', opts.commentTitle).replace('#{{comment}}', data.total_comment).replace('#{{attachment-title}}', opts.attachmentTitle).replace('#{{attachment}}', data.total_attachment).replace('#{{priority}}', data.priority).replace('#{{card-id}}', data.id);
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

  var callAjax = function () {
    var that = this,
        ele = this.element,
        opts = this.options,
        listUser = '';

    $.ajax({
      type: opts.method,
      url: $(opts.getCardsLink).val(),
      dataType: 'json',
      data: {
        board_id: $(opts.boardIdEle).val(),
        limit: that.vars.loadmoreObj.limit,
        offset: that.vars.loadmoreObj.offset,
        phase: ele.parents('[data-' + opts.dataPhase + ']').data(opts.dataPhase)
      },
      success: function (result) {
        if (result.status) {
          result.data.sort(function (a, b) {
            return a.position - b.position;
          });
          result.data.forEach(function (dataList) {
            listUser += renderMemberList(dataList, opts, ele.parents('[data-' + opts.dataPhase + ']').data(opts.dataPhase).toString());
          });
          ele.append(listUser);
          that.vars.loadmoreObj.offset++;
        } else {
          ele.html('<p class="errorText">' + opts.errorText + '</p>');
        }
      },
      error: function (xhr) {
        ele.html('<p class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>');
      }
    });
  };

  // var loadmoreAjax = function (opts, objOpt) {
  //   var ele = this,
  //     link = opts.callLoadmore;

  //   objOpt.permission = false;
  //   $.ajax({
  //     type: opts.methodLoadmore,
  //     url: link,
  //     dataType: 'json',
  //     data: {
  //       limit: objOpt.loadmoreObj.limit,
  //       offset: objOpt.loadmoreObj.offset
  //     },
  //     success: function (result) {
  //       if (result) {
  //         if (result.length > 0) {
  //           objOpt.loadmoreObj.offset++;
  //           ele.parent('[data-' + opts.autocompleteType + ']')[opts.autocompleteType]('addToList', result);
  //         } else {
  //           objOpt.loadmoreObj.can_loadmore = false;
  //         }
  //       } else {
  //         ele.append('<li class="' + opts.notFoundClass + '">An error occured: ' + opts.errorLoadmore + '</li>');
  //         ele.find(opts.notFoundClass).fadeOut(opts.fadeOutTime, function () {
  //           $(this).remove();
  //         });
  //       }
  //     },
  //     error: function (xhr) {
  //       ele.append('<li class="' + opts.notFoundClass + '">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</li>');
  //       ele.find(opts.notFoundClass).fadeOut(opts.fadeOutTime, function () {
  //         $(this).remove();
  //       });
  //     },
  //     complete: function () {
  //       objOpt.permission = true;
  //     }
  //   });
  // };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var opts = this.options;
      this.vars = {
        loadmoreObj: {
          can_loadmore: true,
          offset: 0,
          limit: opts.limit
        }
      };

      callAjax.call(this);
      // if (opts.isLoadmore) {
      //   ele.off('scroll.' + pluginName).on('scroll.' + pluginName, function () {
      //     if (that.vars.permission) {
      //       if ($(this).scrollTop() > this.scrollHeight - $(this).outerHeight() - opts.triggerBefore) {
      //         loadmoreAjax.call($(this), opts, that.vars);
      //       }
      //     }
      //   });
      // }
    },
    destroy: function () {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
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
    noResultText: 'No results found',
    getCardsLink: '#get-cards-link',
    boardIdEle: '#board-id',
    fadeOutTime: 1000,
    isLoadmore: false,
    triggerBefore: 20,
    limit: 10,
    dataPhase: 'phase',
    descriptionTitle: 'This card has a description',
    commentTitle: 'Comment',
    attachmentTitle: 'Attach files',
    hideClass: 'hide'
  };

  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));