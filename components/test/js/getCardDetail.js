;(function($, window, undefined) {
  'use strict';

  var pluginName = 'get-detail',
      attachmentImgEle = '<div class="block-file clearfix"><div class="preview"><img src="#{{img-src}}" alt="#{{alt}}" class="preview-img"/></div><div class="file-info"><h4 class="file-name">#{{file-name}}</h4><span class="subtitle">#{{created-at}}</span><a href="#" title="#{{downloadText}}" class="icon-download">#{{downloadText}}</a></div></div>',
      attachmentCommnEle = '<div class="block-file clearfix"><div class="preview"><p class="file-type">#{{file-type}}</p></div><div class="file-info"><h4 class="file-name">#{{file-name}}</h4><span class="subtitle">#{{created-at}}</span><a href="#" title="#{{downloadText}}" class="icon-download">#{{downloadText}}</a></div></div>',
      activityEditable = '<div class="block-activity" data-comment-id="#{{comment-id}}"><span class="member">#{{short-name}}</span><p class="member-name">#{{full-name}}</p><div class="comment-content">#{{comment-content}}</div><div class="edit-content hide"><div class="form-group"><div class="comment-box"><textarea data-fluid-height rows="3" data-min-rows="3" class="input-paragraph"></textarea><label for="comment-attachment-#{{index}}" class="icon-attachment"></label><input id="comment-attachment-#{{index}}" type="file" class="hide"></div><button data-accept class="create">Save</button><button data-close class="negative"><span class="icon-close"></span></button></div></div>#{{image-preview}}<div class="bottom-comment"><span class="date">#{{created-at}}</span><span class="edit split">Edit</span><span class="delete split">Delete</span></div></div>',
      activityNotEditable = '<div class="block-activity" data-comment-id="#{{comment-id}}"><span class="member">#{{short-name}}</span><p class="member-name">#{{full-name}}<span class="activity-no-comment"> #{{activity}}</span></p>#{{image-preview}}<div class="bottom-comment"><span class="date">#{{created-at}}</span></div></div>',
      imagePreview = '<div class="comment-img#{{hide}}"><img src="#{{img-src}}" alt="image comment"/></div>';

  var callAjax = function(cardEle, phase) {
    var that = this,
        opts = this.options;

    $.ajax({
      type: opts.method,
      url: $(opts.getCardDetail).val(),
      dataType: 'json',
      data: {
        card_id: cardEle.data().cardId
      },
      success: function (result) {
        var cardObj = {
          id: cardEle.data().cardId,
          priority: cardEle.data().priority,
          phase: cardEle.parents(opts.dataPhase).data().phase
        };

        that.vars.editCard.data('card-from', cardObj);
        if (result.status) {
          that.vars.cardName.html(result.card.name).removeClass(function (index, className) {
            return (className.match(/(^|\s)priority-\S+/g) || []).join(' ');
          }).addClass('priority-' + result.card.priority);
          that.vars.phaseName.html(phase);
          that.vars.descriptionSection.html(result.card.description.replace(/\n/g, '<br>'));
          if (parseInt(result.card.attachment.total) === 0) {
            that.vars.attachmentSection.parent().addClass(opts.hideClass);
          } else {
            var attachmentBlock = '';
            result.card.attachment.attachments.forEach(function (attach) {
              if (attach.file_type === 'jpg' || 'png' || 'jpeg' || 'gif' || 'tif') {
                attachmentBlock += attachmentImgEle.replace('#{{img-src}}', attach.link).replace('#{{alt}}', attach.file_name).replace('#{{file-name}}', attach.file_name).replace('#{{created-at}}', attach.created_at).replace(/#{{downloadText}}/g, opts.downloadText);
              } else {
                attachmentBlock += attachmentCommnEle.replace('#{{file-type}}', attach.file_type).replace('#{{file-name}}', attach.file_name).replace('#{{created-at}}', attach.created_at).replace(/#{{downloadText}}/g, opts.downloadText);
              }
            });
            that.vars.attachmentSection.html(attachmentBlock);
          }
          if (parseInt(result.card.activity.total === 0)) {
            that.vars.activitySection.parent().addClass(opts.hideClass);
          } else {
            var activityBlock = '';
            result.card.activity.activities.forEach(function (act, index) {
              if (act.is_editable === '0') {
                if (act.link === '') {
                  activityBlock += activityNotEditable.replace('#{{comment-id}}', act.id).replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{activity}}', act.content).replace('#{{img-src}}', act.link).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', imagePreview.replace('#{{hide}}', ' hide').replace('#{{img-src}}', act.link));
                } else {
                  activityBlock += activityNotEditable.replace('#{{comment-id}}', act.id).replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{activity}}', act.content).replace('#{{img-src}}', act.link).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', imagePreview.replace('#{{hide}}', '').replace('#{{img-src}}', act.link));
                }
              } else {
                if (act.link === '') {
                  activityBlock += activityEditable.replace('#{{comment-id}}', act.id).replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{comment-content}}', act.content).replace(/#{{index}}/g, index).replace('#{{img-src}}', act.link).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', imagePreview.replace('#{{hide}}', ' hide').replace('#{{img-src}}', act.link));
                } else {
                  activityBlock += activityEditable.replace('#{{comment-id}}', act.id).replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{comment-content}}', act.content).replace(/#{{index}}/g, index).replace('#{{img-src}}', act.link).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', imagePreview.replace('#{{hide}}', '').replace('#{{img-src}}', act.link));
                }
              }
            });
            that.vars.activitySection.html(activityBlock);
          }
        }
      },
      error: function (xhr) {
        that.vars.cardDetail.html('<p class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>');
      },
      complete: function () {
        that.vars.cardDetail.removeClass(opts.hideClass);
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
          phase = '';
      this.vars = {
        cardDetail: $(opts.dataCardDetail),
        editCard: $(opts.dataEditCard),
        get cardName() {
          return this.cardDetail.find(opts.dataDetailName);
        },
        get phaseName() {
          return this.cardDetail.find(opts.dataPhaseName);
        },
        get descriptionSection() {
          return this.cardDetail.find(opts.dataCardDescription);
        },
        get attachmentSection() {
          return this.cardDetail.find(opts.dataListAttachments);
        },
        get activitySection() {
          return this.cardDetail.find(opts.dataListActivities);
        }
      };

      phase = ele.find(opts.cardNameClass).text();
      ele.off('click.' + pluginName).on('click.' + pluginName, opts.dataContent, function() {
        callAjax.call(that, $(this), phase);
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
    method: 'GET',
    dataEditCard: '[data-edit-card]',
    dataContent: '[data-content]',
    dataPhase: '[data-phase]',
    dataCardDetail: '[data-card-detail]',
    dataListActivities: '[data-list-activities]',
    dataListAttachments: '[data-list-attachments]',
    dataDetailName: '[data-detail-name]',
    dataPhaseName: '[data-phase-name]',
    dataAddDescription: '[data-add-description]',
    dataEditDescription: '[data-edit-description]',
    dataCardDescription: '[data-card-description]',
    cardNameClass: '.card-name',
    getCardDetail: '#get-card-detail',
    hideClass: 'hide',
    downloadText: 'Download'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));