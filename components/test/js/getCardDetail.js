;(function($, window, undefined) {
  'use strict';

  var pluginName = 'get-detail',
      attachmentImgEle = '<div class="block-file clearfix" data-attachment-id="#{{id}}"><div class="preview"><a href="#{{link}}" data-caption="#{{file-name}}" data-fancybox="groupAttachment"><img src="#{{img-src}}" alt="#{{alt}}" class="preview-img"/></a></div><div class="file-info"><h4 class="file-name">#{{file-name}}</h4><span class="subtitle">#{{created-at}}</span><a href="#{{link}}" title="#{{downloadText}}" class="icon-image">#{{downloadText}}</a><a href="#" title="#{{removeText}}" class="icon-close" data-remove>#{{removeText}}</a></div></div>',
      attachmentCommnEle = '<div class="block-file clearfix" data-attachment-id="#{{id}}"><div class="preview"><p class="file-type">#{{file-type}}</p></div><div class="file-info"><h4 class="file-name">#{{file-name}}</h4><span class="subtitle">#{{created-at}}</span><a href="#{{link}}" title="#{{downloadText}}" class="icon-image">#{{downloadText}}</a><a href="#" title="#{{removeText}}" class="icon-close" data-remove>#{{removeText}}</a></div></div>',
      activityEditable = '<div class="block-activity" data-editable data-comment-id="#{{comment-id}}"><span class="member">#{{short-name}}</span><p class="member-name">#{{full-name}}</p><div class="comment-content #{{hide-comment}}">#{{comment-content}}</div><div class="edit-content hide"><div class="form-group"><div class="comment-box"><textarea data-fluid-height rows="3" data-min-rows="3" class="input-paragraph"></textarea><label for="comment-attachment-#{{index}}" class="icon-attachment"></label><input data-edit-attachment id="comment-attachment-#{{index}}" type="file" class="hide"></div><div data-file-name class="comment-file#{{hide}}">#{{file}}<span data-remove-edit-file class="icon-close"></span></div><button data-save-edit class="create">Save</button><button data-close-edit class="negative"><span class="icon-close"></span></button></div></div>#{{image-preview}}<div class="bottom-comment"><span class="date">#{{created-at}}</span>#{{edited}}#{{edit-btn}}</div></div>',
      activityNotEditable = '<div class="block-activity" data-comment-id="#{{comment-id}}"><span class="member">#{{short-name}}</span><p class="member-name">#{{full-name}}<span class="activity-no-comment"> #{{activity}}</span></p>#{{image-preview}}<div class="bottom-comment"><span class="date">#{{created-at}}</span></div></div>',
      imagePreview = '<div class="comment-img#{{hide}}"><a href="#{{img-src}}" data-caption="#{{img-alt}}" data-fancybox><img src="#{{img-src}}" alt="#{{img-alt}}" data-attachment-id="#{{attachment-id}}"/></a></div>',
      // cardTypeItem = '<li data-card-type-item data-type-id="#{{type-id}}"><a href="#" title="#{{card-type}}">#{{card-type}}</a></li>',
      file_name = '<span class="file-name">#{{file-name}}</span>',
      editBtn = '<span class="edit split" data-edit-comment>Edit</span><span class="delete split" data-delete>Delete</span>';
  
  // function addZero(n) {
  //   return (n < 10) ? '0' + n : n;
  // }

  var callAjax = function(cardEle, phaseName) {
    var that = this,
        opts = this.options,
        phase = 0;

    if (opts.hasPhase) {
      phase = cardEle.data().phase;
    } else {
      phase = cardEle.parents(opts.dataPhase).data().phase;
    }
    $.ajax({
      type: opts.method,
      url: $(opts.getCardDetail).val(),
      dataType: 'json',
      cache: false,
      data: {
        card_id: cardEle.data().cardId
      },
      success: function(result) {
        var cardObj = {
          id: cardEle.data().cardId,
          priority: cardEle.data().priority,
          phase: phase
        };

        that.vars.editCard.data('card-from', cardObj);
        if (result.status) {
          that.vars.cardDetail.removeClass(opts.hideClass);
          // that.vars.cardName['fluid-height']();
          that.vars.cardName.val(result.data.name).removeClass(function(index, className) {
            return (className.match(/(^|\s)priority-\S+/g) || []).join(' ');
          }).addClass('priority-' + result.data.priority).trigger('focus').trigger('input').trigger('blur');
          that.vars.phaseName.html(phaseName);
          that.vars.phaseName.html(result.data.creator);
          if (result.data.location && result.data.location.length) {
            that.vars.locationDetail.html(result.data.location);
            that.vars.locationInput.addClass(opts.hideClass);
          } else {
            that.vars.locationDetail.addClass(opts.hideClass);
            that.vars.locationInput.removeClass(opts.hideClass);
          }
          if (result.data.description) {
            that.vars.showDescriptionInput.addClass(opts.hideClass);
            that.vars.addDescription.addClass(opts.hideClass);
            that.vars.descriptionSection.html(result.data.description.replace(/\\n/g, '<br>'));
            that.vars.descriptionInput.val(result.data.description);
            that.vars.descriptionSection.removeClass(opts.hideClass);
            that.vars.addDescriptionBtn.removeClass(opts.disabledClass);
          } else {
            that.vars.showDescriptionInput.removeClass(opts.hideClass);
            that.vars.descriptionSection.addClass(opts.hideClass);
            that.vars.addDescriptionBtn.addClass(opts.disabledClass);
            that.vars.addDescription.addClass(opts.hideClass);
          }
          if (parseInt(result.data.attachment.total) === 0) {
            !that.vars.attachmentSection.parent().hasClass(opts.hideClass) ? that.vars.attachmentSection.parent().addClass(opts.hideClass) : null;
            that.vars.attachmentSection.html('');
          } else {
            var attachmentBlock = '';
            result.data.attachment.attachments.forEach(function(attach) {
              if (attach.file_type.indexOf('image') > -1) {
                attachmentBlock += attachmentImgEle.replace('#{{img-src}}', attach.link).replace('#{{alt}}', attach.file_name).replace(/#{{file-name}}/g, attach.file_name).replace('#{{created-at}}', attach.created_at).replace(/#{{downloadText}}/g, opts.downloadText).replace(/#{{removeText}}/g, opts.removeText).replace(/#{{link}}/g, attach.link).replace('#{{id}}', attach.id);
              } else {
                attachmentBlock += attachmentCommnEle.replace('#{{file-type}}', attach.file_type).replace('#{{file-name}}', attach.file_name).replace('#{{created-at}}', attach.created_at).replace(/#{{downloadText}}/g, opts.downloadText).replace(/#{{removeText}}/g, opts.removeText).replace('#{{link}}', attach.link).replace('#{{id}}', attach.id);
              }
            });
            that.vars.attachmentSection.html(attachmentBlock);
            that.vars.attachmentSection.parent().removeClass(opts.hideClass);
          }
          that.vars.commentSection.find(opts.dataFluidHeight).val('');
          that.vars.commentSection.find(opts.commentAttachmentId).val('');
          that.vars.commentSection.find(opts.dataImagePreview).attr('src', '');
          that.vars.commentSection.find(opts.dataImagePreview).parent().addClass(opts.hideClass);
          !that.vars.addComment.hasClass(opts.disabledClass) ? that.vars.addComment.addClass(opts.disabledClass) : null;
          if (that.vars.commentSection.find(opts.fileNameClass).length) {
            that.vars.commentSection.find(opts.fileNameClass).remove();
            !that.vars.commentSection.find(opts.dataFileName).hasClass(opts.hideClass) ? that.vars.commentSection.find(opts.dataFileName).addClass(opts.hideClass) : null;
          }
          if (parseInt(result.data.activity.total === 0)) {
            that.vars.activitySection.parent().addClass(opts.hideClass);
          } else {
            var activityBlock = '';
            result.data.activity.activities.forEach(function(act, index) {
              if (act.is_editable === '0') {
                if (act.attachment_link !== null) {
                  activityBlock += activityNotEditable.replace('#{{comment-id}}', act.id).replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{activity}}', act.content.replace(/&gt;/g, '>').replace(/&lt;/g, '<')).replace('#{{img-src}}', act.attachment_link).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', imagePreview.replace('#{{hide}}', '').replace(/#{{img-src}}/g, act.attachment_link).replace(/#{{img-alt}}/g, act.attachment_name).replace('#{{attachment-id}}', act.attachment_id));
                } else {
                  activityBlock += activityNotEditable.replace('#{{comment-id}}', act.id).replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{activity}}', act.content).replace('#{{img-src}}', act.attachment_link).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', '');
                }
              } else {
                if (act.attachment_link !== null) {
                  activityBlock += activityEditable.replace('#{{comment-id}}', act.id).replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{comment-content}}', act.content.replace(/(?:\\r\\n|\\r|\\n|\n)/g, '<br/>')).replace(/#{{index}}/g, index).replace('#{{img-src}}', act.attachment_link).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', imagePreview.replace('#{{hide}}', '').replace(/#{{img-src}}/g, act.attachment_link).replace(/#{{img-alt}}/g, act.attachment_name).replace('#{{attachment-id}}', act.attachment_id)).replace('#{{hide}}', '').replace('#{{file}}', file_name.replace('#{{file-name}}', act.attachment_name)).replace('#{{hide-comment}}', function() {
                    if (act.content.length) {
                      return '';
                    } else {
                      return opts.hideClass;
                    }
                  });
                } else {
                  activityBlock += activityEditable.replace('#{{comment-id}}', act.id).replace('#{{short-name}}', act.short_name).replace('#{{full-name}}', act.full_name).replace('#{{comment-content}}', act.content.replace(/(?:\\r\\n|\\r|\\n|\n)/g, '<br/>')).replace(/#{{index}}/g, index).replace('#{{img-src}}', act.attachment_link).replace('#{{created-at}}', act.created_at).replace('#{{image-preview}}', '').replace('#{{hide}}', ' ' + opts.hideClass).replace('#{{file}}', '').replace('#{{hide-comment}}', function() {
                    if (act.content.length) {
                      return '';
                    } else {
                      return opts.hideClass;
                    }
                  });
                }
                if (act.created_at === act.modified_at) {
                  activityBlock = activityBlock.replace('#{{edited}}', '');
                } else {
                  activityBlock = activityBlock.replace('#{{edited}}', '<span class="edited" title="' + act.modified_at + '"> (' + opts.editedText + ')</span>');
                }
                if (act.allow_edit) {
                  activityBlock = activityBlock.replace('#{{edit-btn}}', editBtn);
                } else {
                  activityBlock = activityBlock.replace('#{{edit-btn}}', '');
                }
              }
            });
            that.vars.activitySection.html(activityBlock);
          }
          that.vars.listCardType.find(opts.dataCardTypeItem).remove();
          // if (result.data.list_type && result.data.list_type.length) {
          //   var listTypeItem = '';
          //   result.data.list_type.forEach(function (type) {
          //     listTypeItem += cardTypeItem.replace(/#{{card-type}}/g, type.name).replace('#{{type-id}}', type.id);
          //   });
          //   that.vars.listCardType.append(listTypeItem);
          //   that.vars.cardTypeEle['card-type']('getTypeItem');
          // }
          if (result.data.type_id) {
            that.vars.cardTypeEle['card-type']('getListType', result.data.type_id);
          }
          if (result.data.expired_at && result.data.expired_at.length) {
            var deadline = result.data.expired_at.split(' ');
            that.vars.deadlineToggle.find('.hour').text(deadline[1]);
            that.vars.deadlineToggle.find('.date').text(deadline[0]);
          } else {
            // var now = new Date(),
            //     date = $.datepicker.formatDate('dd/mm/yy', now),
            //     time = addZero(now.getHours()) + ':' + addZero(now.getMinutes());
            that.vars.deadlineToggle.find('.detail').addClass(opts.hideClass);
            that.vars.deadlineToggle.find('.hour').text('');
            that.vars.deadlineToggle.find('.date').text('');
          }
          that.vars.editCard['edit-card']('resetDateTime');
          // if (result.data.deadline && result.data.deadline.length) {
          //   var deadline = result.data.deadline.split(' ');
          //   that.vars.deadlineToggle.find('.hour').text(deadline[1]);
          //   that.vars.deadlineToggle.find('.date').text(deadline[0]);
          // } else {
          //   var now = new Date(),
          //       date = $.datepicker.formatDate('dd/mm/yy', now),
          //       time = addZero(now.getHours()) + ':' + addZero(now.getMinutes());

          //   that.vars.deadlineToggle.find('.hour').text(time);
          //   that.vars.deadlineToggle.find('.date').text(date);
          // }
          // that.vars.editCard['edit-card']('resetDateTime');
        }
      },
      error: function(xhr) {
        that.vars.cardDetail.removeClass(opts.hideClass);
        that.vars.cardDetail.html('<p class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</p>');
      },
      complete: function() {
        that.vars.editCard['edit-card']('getDeleteCommentBtn');
        // that.vars.cardName['limit-word']('updateText');
        that.vars.activitySection.find(opts.dataFluidHeight)['fluid-height']();
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
          opts = this.options,
          phase = '';
      this.vars = {
        is_Click: true,
        cardDetail: $(opts.dataCardDetail),
        editCard: $(opts.dataEditCard),
        cardTypeEle: $(opts.dataCardType),
        get locationDetail() {
          return this.cardDetail.find(opts.dataLocationDetail);
        },
        get locationInput() {
          return this.cardDetail.find(opts.dataLocationInput);
        },
        get cardName() {
          return this.cardDetail.find(opts.dataDetailName);
        },
        get phaseName() {
          return this.cardDetail.find(opts.dataPhaseName);
        },
        get descriptionSection() {
          return this.cardDetail.find(opts.dataCardDescription);
        },
        get showDescriptionInput() {
          return this.cardDetail.find(opts.dataEditDescription).filter('.add-description');
        },
        get addDescription() {
          return this.cardDetail.find(opts.dataTargetEdit);
        },
        get addDescriptionBtn() {
          return this.addDescription.find(opts.dataAccept);
        },
        get descriptionInput() {
          return this.addDescription.find(opts.dataFluidHeight);
        },
        get commentSection() {
          return this.cardDetail.find(opts.dataComment);
        },
        get addComment() {
          return this.commentSection.find(opts.dataAccept);
        },
        get attachmentSection() {
          return this.cardDetail.find(opts.dataListAttachments);
        },
        get activitySection() {
          return this.cardDetail.find(opts.dataListActivities);
        },
        get listCardType() {
          return this.cardTypeEle.find(opts.dataListType);
        },
        get cardTypeInput() {
          return this.cardTypeEle.find(opts.typeSelectId);
        },
        get deadlineToggle() {
          return this.cardDetail.find(opts.dataDeadline);
        }
      };

      phase = ele.find(opts.cardNameClass).text();
      ele.off('click.' + pluginName).on('click.' + pluginName, opts.dataContent, function() {
        if (!that.vars.is_Click) {
          return false;
        }
        that.vars.is_Click = false;
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
    dataLocationDetail: '[data-location-detail]',
    dataLocationInput: '[data-location-input]',
    dataEditCard: '[data-edit-card]',
    dataContent: '[data-content]',
    dataPhase: '[data-phase]',
    dataCardDetail: '[data-card-detail]',
    dataComment: '[data-comment]',
    dataListActivities: '[data-list-activities]',
    dataListAttachments: '[data-list-attachments]',
    dataDetailName: '[data-detail-name]',
    dataPhaseName: '[data-phase-name]',
    dataAddDescription: '[data-add-description]',
    dataEditDescription: '[data-edit-description]',
    dataCardDescription: '[data-card-description]',
    dataTargetEdit: '[data-target-edit]',
    dataFluidHeight: '[data-fluid-height]',
    dataImagePreview: '[data-image-preview]',
    dataAccept: '[data-accept]',
    dataDeadline: '[data-deadline]',
    dataCardType: '[data-card-type]',
    dataListType: '[data-list-type]',
    dataCardTypeItem: '[data-card-type-item]',
    commentAttachmentId: '#comment-attachment',
    dataFileName: '[data-file-name]',
    fileNameClass: '.file-name',
    cardNameClass: '.card-name',
    getCardDetail: '#get-card-detail',
    typeSelectId: '#typeSelect',
    hideClass: 'hide',
    disabledClass: 'disabled',
    textFail: 'An error occured',
    removeText: 'Remove'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));