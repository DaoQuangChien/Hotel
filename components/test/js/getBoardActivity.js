; (function($, window, undefined) {
  'use strict';

  var pluginName = 'board-activity',
      activityEditable = '<div class="block-activity"><span class="member">#{{short-name}}</span><p class="member-name">#{{full-name}}</p><div class="comment-content">#{{comment-content}}</div>#{{image-preview}}<div class="bottom-comment"><span class="date">#{{add-text}}: #{{created-at}}</span></div></div>',
      activityNotEditable = '<div class="block-activity"><span class="member">#{{short-name}}</span><p class="member-name">#{{full-name}}<span class="activity-no-comment">#{{comment-content}}</span></p>#{{image-preview}}<div class="bottom-comment"><span class="date">#{{add-text}}: #{{created-at}}</span></div></div>',
      imagePreview = '<div class="comment-img"><a href="#{{img-src}}" data-caption="#{{img-alt}}" data-fancybox><img src="#{{img-src}}" alt="#{{img-alt}}"/></a></div>';

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
          limit: opts.limit,
          offset: 0
        },
        permission: true,
        is_Loadmore: true,
      };

      this.callAjax();
      ele.parents(opts.boardMenuClass).off('scroll.' + pluginName).on('scroll.' + pluginName, function() {
        if (that.vars.is_Loadmore) {
          if ($(this).scrollTop() > this.scrollHeight - $(this).outerHeight() - opts.triggerBefore) {
            if (that.vars.permission) {
              that.callAjax();
            }
          }
        }
      });
    },
    reLoadActivity: function() {
      var opts = this.options;

      this.vars.loadmoreObj = {
        limit: opts.limit,
        offset: 0
      };
      this.vars.is_Loadmore = true;
      this.callAjax(true);
    },
    callAjax: function(reset) {
      var that = this,
          ele = this.element,
          opts = this.options,
          activity = '';

      this.vars.permission = false;
      $.ajax({
        type: opts.method,
        url: opts.url,
        dataType: 'json',
        cache: false,
        data: {
          board_id: $(opts.boardId).val(),
          limit: that.vars.loadmoreObj.limit,
          offset: that.vars.loadmoreObj.offset,
          type: opts.type
        },
        success: function(result) {
          if (result.status) {
            result.data.forEach(function(act) {
              if (act.is_editable === '1') {
                if (act.attachment_link !== null) {
                  activity += activityEditable.replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{comment-content}}', act.content.replace(/(?:\r\n|\r|\n)/g, '<br/>')).replace('#{{add-text}}', opts.translation.addText).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', imagePreview.replace(/#{{img-src}}/g, act.attachment_link).replace(/#{{img-alt}}/g, act.attachment_name));
                } else {
                  activity += activityEditable.replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{comment-content}}', act.content.replace(/(?:\r\n|\r|\n)/g, '<br/>')).replace('#{{add-text}}', opts.translation.addText).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', '');
                }
              } else {
                if (act.attachment_link !== null) {
                  activity += activityNotEditable.replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{comment-content}}', act.content.replace(/(?:\r\n|\r|\n)/g, '<br/>').replace(/&gt;/g, '>').replace(/&lt;/g, '<')).replace('#{{add-text}}', opts.translation.addText).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', imagePreview.replace(/#{{img-src}}/g, act.attachment_link).replace(/#{{img-alt}}/g, act.attachment_name));
                } else {
                  activity += activityNotEditable.replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{comment-content}}', act.content.replace(/(?:\r\n|\r|\n)/g, '<br/>').replace(/&gt;/g, '>').replace(/&lt;/g, '<')).replace('#{{add-text}}', opts.translation.addText).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', '');
                }
              }
            });
            if (reset) {
              ele.html(activity);
            } else {
              ele.append(activity);
            }
            that.vars.loadmoreObj.offset += that.vars.loadmoreObj.limit;
            if (that.vars.loadmoreObj.offset >= result.total) {
              that.vars.is_Loadmore = false;
            }
          }
        },
        error: function(xhr) {
          ele.html('<p class="errorText">' + opts.translation.failText + ': ' + xhr.status + xhr.statusText + '</p>');
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
    boardId: '#board-id',
    boardMenuClass: '.board-menu',
    type: 2
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));