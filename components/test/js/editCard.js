;(function($, window, undefined) {
  'use strict';

  var pluginName = 'edit-card',
      comment = '<div class="block-activity" data-comment-id="#{{comment-id}}"><span class="member">#{{short-name}}</span><p class="member-name">#{{full-name}}</p><div class="comment-content">#{{comment-content}}</div><div class="edit-content hide"><div class="form-group"><div class="comment-box"><textarea data-fluid-height rows="3" data-min-rows="3" class="input-paragraph"></textarea><label for="comment-attachment-#{{index}}" class="icon-attachment"></label><input data-edit-attachment id="comment-attachment-#{{index}}" type="file" class="hide"></div><div data-file-name class="comment-file hide"><span data-remove-edit-file class="icon-close"></span></div><button data-save-edit class="create">Save</button><button data-close-edit class="negative"><span class="icon-close"></span></button></div></div>#{{image-preview}}<div class="bottom-comment"><span class="date">#{{created-at}}</span><span class="edit split" data-edit-comment>Edit</span><span class="delete split" data-delete-comment>Delete</span></div></div>',
      attachmentImgEle = '<div class="block-file clearfix" data-attachment-id="#{{id}}"><div class="preview"><img src="#{{img-src}}" alt="#{{alt}}" class="preview-img"/></div><div class="file-info"><h4 class="file-name">#{{file-name}}</h4><span class="subtitle">#{{created-at}}</span><a href="#{{link}}" title="#{{downloadText}}" class="icon-download" target="_blank">#{{downloadText}}</a><a href="#" title="#{{removeText}}" class="icon-close" data-remove>#{{removeText}}</a></div></div>',
      attachmentCommnEle = '<div class="block-file clearfix" data-attachment-id="#{{id}}"><div class="preview"><p class="file-type">#{{file-type}}</p></div><div class="file-info"><h4 class="file-name">#{{file-name}}</h4><span class="subtitle">#{{created-at}}</span><a href="#{{link}}" title="#{{downloadText}}" class="icon-download" target="_blank">#{{downloadText}}</a><a href="#" title="#{{removeText}}" class="icon-close" data-remove>#{{removeText}}</a></div></div>',
      imagePreview = '<div class="comment-img#{{hide}}"><img src="#{{img-src}}" alt="image comment" data-image-preview/></div>';

  function setUp(that) {
    that.vars.openEditDescriptionEle.css('cursor', 'pointer');
  }

  var changePriorityAjax = function(priorityBtn) {
    var that = this,
        ele = this.element,
        opts = this.options;

    $.ajax({
      type: opts.methodPriority,
      url: priorityBtn.parent().data().url,
      dataType: 'json',
      data: {
        card_id: ele.data().cardFrom.id,
        priority: priorityBtn.data().priority
      },
      success: function(result) {
        if (result.status) {
          that.vars.cardName.removeClass(function(index, className) {
            return (className.match(/(^|\s)priority-\S+/g) || []).join(' ');
          }).addClass('priority-' + priorityBtn.data().priority);
          $('[data-card-id=' + ele.data().cardFrom.id + '] .detail').removeClass(function(index, className) {
            return (className.match(/(^|\s)priority-\S+/g) || []).join(' ');
          }).addClass('priority-' + priorityBtn.data().priority);
          priorityBtn.parent().addClass(opts.hideClass);
        }
      },
      error: function(xhr) {
        priorityBtn.after('<li class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</li>');
        priorityBtn.next().fadeOut(opts.fadeOutTime, function() {
          $(this).remove();
          priorityBtn.parent().addClass(opts.hideClass);
        });
      }
    });
  };

  var editDescriptionAjax = function(saveBtn) {
    var that = this,
        ele = this. element,
        opts = this.options;

    $.ajax({
      type: opts.methodDescription,
      url: saveBtn.parents(opts.dataTargetEdit).data().url,
      dataType: 'json',
      data: {
        card_id: ele.data().cardFrom.id,
        name: that.vars.cardName.text(),
        description: that.vars.editDescriptionInput.val().trim(),
        priority: ele.data().cardFrom.priority,
        phase: ele.data().cardFrom.phase,
        board_id: $(opts.board_id).val()
      },
      success: function(result) {
        if (result.status) {
          that.vars.descriptionEle.html(that.vars.editDescriptionInput.val().trim());
          that.vars.descriptionEle.removeClass(opts.hideClass);
          that.vars.editDescriptionEle.addClass(opts.hideClass);
        }
      },
      error: function(xhr) {
        saveBtn.parent().append('<span class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</span>');
        saveBtn.siblings('.errorText').fadeOut(opts.fadeOutTime, function() {
          $(this).remove();
        });
      },
      complete: function() {
        that.vars.is_EditDescription = true;
      }
    });
  };

  var addCommentAjax = function(saveBtn) {
    var that = this,
        opts = this.options,
        ele = this.element,
        formData = null,
        file = that.vars.imageAttached[0].files[0];

    if (window.FormData) {
      formData = new FormData();
    }
    if (formData) {
      formData.append('file_upload', file);
      formData.append('card_id', ele.data().cardFrom.id);
      formData.append('content', that.vars.commentInput.val());
    }
    $.ajax({
      type: opts.methodComment,
      url: that.vars.commentEle.data().url,
      dataType: 'json',
      processData: false,
      contentType: false,
      data: formData,
      success: function(result) {
        if (result.status) {
          var tmpComment = comment.replace('#{{comment-id}}', result.data.id).replace('#{{short-name}}', result.data.short_name).replace('#{{full-name}}', result.data.full_name).replace('#{{comment-content}}', result.data.content).replace(/#{{index}}/g, result.data.id).replace('#{{created-at}}', result.data.created_at);
          if (result.data.attachment_id) {
            tmpComment = tmpComment.replace('#{{image-preview}}', imagePreview.replace('#{{hide}}', '')).replace('#{{img-src}}', result.data.attachment_link);
          } else {
            tmpComment = tmpComment.replace('#{{image-preview}}', imagePreview.replace('#{{hide}}', ' ' + opts.hideClass)).replace('#{{img-src}}', '');
          }
          that.vars.activityContainer.prepend(tmpComment);
          that.vars.commentInput.val('');
          that.vars.imagePreview.attr('src', '');
          if (that.vars.commentFile.find(opts.fileNameClass).length > 0) {
            that.vars.commentFile.find(opts.fileNameClass).remove();
          }
          that.vars.commentFile.addClass(opts.hideClass);
          that.vars.imagePreview.parent().addClass(opts.hideClass);
        }
      },
      error: function(xhr) {
        saveBtn.after('<span class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</span>');
        saveBtn.next().fadeOut(opts.fadeOutTime, function() {
          $(this).remove();
        });
      },
      complete: function() {
        that.vars.is_AddComment = true;
      }
    });
  };

  var cardAttachmentAjax = function(attachBtn) {
    var that = this,
        ele = this.element,
        opts = this.options,
        privateOpts = this.vars.cardAttachEle.data(),
        attachmentBlock = '',
        formData = null,
        file = attachBtn[0].files[0];

    if (window.FormData) {
      formData = new FormData();
    }
    if (formData) {
      formData.append('file_upload', file);
      formData.append('card_id', ele.data().cardFrom.id);
    }
    $.ajax({
      type: privateOpts.method,
      url: privateOpts.url,
      dataType: 'json',
      processData: false,
      contentType: false,
      data: formData,
      success: function (result) {
        if (result.status) {
          if (result.data.file_type.indexOf('image') > -1) {
            attachmentBlock += attachmentImgEle.replace('#{{img-src}}', result.data.link).replace('#{{alt}}', result.data.file_name).replace('#{{file-name}}', result.data.file_name).replace('#{{created-at}}', result.data.created_at).replace(/#{{downloadText}}/g, opts.downloadText).replace(/#{{removeText}}/g, opts.removeText).replace('#{{link}}', result.data.link).replace('#{{id}}', result.data.id);
          } else {
            attachmentBlock += attachmentCommnEle.replace('#{{file-type}}', result.data.file_type).replace('#{{file-name}}', result.data.file_name).replace('#{{created-at}}', result.data.created_at).replace(/#{{downloadText}}/g, opts.downloadText).replace(/#{{removeText}}/g, opts.removeText).replace('#{{link}}', result.data.link).replace('#{{id}}', result.data.id);
          }
          that.vars.attachmentContainer.append(attachmentBlock);
          $('[data-card-id=' + ele.data().cardFrom.id + '] .icon-attachment').text(that.vars.attachmentContainer.children().length);
          that.vars.attachmentContainer.parent().removeClass(opts.hideClass);
        }
      },
      error: function (xhr) {
        attachBtn.after('<li class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</li>');
        attachBtn.next().fadeOut(opts.fadeOutTime, function () {
          $(this).remove();
        });
      }
    });
  };

  var removeAttachmentAjax = function(removeBtn) {
    var that = this,
        ele = this.element,
        opts = this.options,
        privateOpts = this.vars.attachmentContainer.data();

    $.ajax({
      type: privateOpts.method,
      url: privateOpts.url,
      dataType: 'json',
      data: {
        card_id: ele.data().cardFrom.id,
        attachment_id: removeBtn.parents(opts.dataAttachmentId).data().attachmentId
      },
      success: function (result) {
        if (result.status) {
          removeBtn.parents(opts.dataAttachmentId).remove();
          $('[data-card-id=' + ele.data().cardFrom.id + '] .icon-attachment').text(that.vars.attachmentContainer.children().length);
        }
      },
      error: function (xhr) {
        removeBtn.after('<span class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</span>');
        removeBtn.next().fadeOut(opts.fadeOutTime, function () {
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
        is_AddComment: true,
        is_EditDescription: true,
        openEditDescriptionEle: ele.find(opts.dataEditDescription),
        descriptionEle: ele.find(opts.dataCardDescription),
        editDescriptionEle: ele.find(opts.dataTargetEdit),
        get editDescriptionBtn() {
          return this.editDescriptionEle.find(opts.dataAccept);
        },
        get closeEditDescriptionBtn() {
          return this.editDescriptionEle.find(opts.dataClose);
        },
        get editDescriptionInput() {
          return this.editDescriptionEle.find(opts.dataInput);
        },
        toggleChangePriority: ele.find(opts.dataChangePriority),
        get changePriority() {
          return this.toggleChangePriority.find(opts.dataPriority);
        },
        attachmentContainer: ele.find(opts.dataListAttachment),
        cardName: ele.find(opts.dataDetailName),
        commentEle: ele.find(opts.dataComment),
        get commentInput() {
          return this.commentEle.find(opts.dataInput);
        },
        get imageAttached() {
          return this.commentEle.find(opts.dataFileAttached);
        },
        get commentFile() {
          return this.commentEle.find(opts.dataFileName);
        },
        get imagePreview() {
          return this.commentEle.find(opts.dataImagePreview);
        },
        get addCommentBtn() {
          return this.commentEle.find(opts.dataAccept);
        },
        get removeFileBtn() {
          return this.commentEle.find(opts.dataRemoveFile);
        },
        activityContainer: ele.find(opts.dataListActivities),
        cardAttachEle: ele.find(opts.dataCardAttachment),
        get cardAttachBtn() {
          return this.cardAttachEle.find(opts.cardAttachmentId);
        },
        cardDeleteBtn: ele.find(opts.dataDeleteCard)
      };

      setUp(this);
      this.vars.openEditDescriptionEle.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (that.vars.descriptionEle.html().length) {
          that.vars.editDescriptionInput.val(that.vars.descriptionEle.html().replace(/<br>/g, '\n'));
        } else {
          that.vars.editDescriptionInput.val('');
        }
        that.vars.descriptionEle.addClass(opts.hideClass);
        that.vars.editDescriptionEle.removeClass(opts.hideClass);
        that.vars.editDescriptionInput[0].rows = that.vars.editDescriptionInput.data().minRows;
        if (that.vars.editDescriptionInput[0].scrollHeight > that.vars.editDescriptionInput.innerHeight()) {
          that.vars.editDescriptionInput[0].rows = that.vars.editDescriptionInput[0].rows + Math.ceil((that.vars.editDescriptionInput[0].scrollHeight - that.vars.editDescriptionInput.innerHeight()) / opts.baseLineHeight);
        }
      });

      this.vars.closeEditDescriptionBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        that.vars.editDescriptionInput.val('');
        that.vars.descriptionEle.removeClass(opts.hideClass);
        that.vars.editDescriptionEle.addClass(opts.hideClass);
      });

      this.vars.toggleChangePriority.off('click.' + pluginName).on('click.' + pluginName, function() {
        $(this).find(opts.dataListPriority).toggleClass(opts.hideClass);
      });

      this.vars.changePriority.off('click.' + pluginName).on('click.' + pluginName, function() {
        changePriorityAjax.call(that, $(this));
      });

      this.vars.editDescriptionBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (!that.vars.is_EditDescription) {
          return false;
        }
        that.vars.is_EditDescription = false;
        editDescriptionAjax.call(that, $(this));
      });

      this.vars.imageAttached.off('change.' + pluginName).on('change.' + pluginName, function() {
        var file = this.files[0];

        if (file) {
          if (that.vars.commentFile.find(opts.fileNameClass).length) {
            that.vars.commentFile.find(opts.fileNameClass).text(file.name);
          } else {
            that.vars.commentFile.prepend('<span class="file-name">' + file.name + '</span>');
            that.vars.commentFile.removeClass(opts.hideClass);
          }
          if (window.FileReader) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
              that.vars.imagePreview.attr('src', e.target.result);
              that.vars.imagePreview.parent().removeClass(opts.hideClass);
            };
            reader.readAsDataURL(file);
          }
        } else {
          return;
        }
      });

      this.vars.removeFileBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        $(this).prev().remove();
        that.vars.imageAttached.val('');
        that.vars.imagePreview.attr('src', '');
        that.vars.imagePreview.parent().addClass(opts.hideClass);
        $(this).parent().addClass(opts.hideClass);
      });

      this.vars.addCommentBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (that.vars.commentInput.val().length === 0) {
          that.vars.commentInput.focus();
          return false;
        }
        if (!that.vars.is_AddComment) {
          return false;
        }
        that.vars.is_AddComment = false;
        addCommentAjax.call(that, $(this));
      });

      this.vars.cardAttachBtn.off('change.' + pluginName).on('change.' + pluginName, function() {
        cardAttachmentAjax.call(that, $(this));
      });

      this.vars.activityContainer
        .off('click.' + pluginName)
        .on('click.' + pluginName, opts.dataEditComment, function() {
          $(this).parent().siblings(opts.editContentClass).removeClass(opts.hideClass);
        })
        .on('click.' + pluginName, opts.dataDeleteComment, function () {
          removeAttachmentAjax.call(that, $(this));
        })
        .on('click.' + pluginName, opts.dataSaveEdit, function() {
          var saveEditBtn = $(this),
              privateOpts = that.vars.activityContainer.data(),
              currentComment = saveEditBtn.parents(opts.dataCommentId),
              commentId = currentComment.data().commentId,
              formData = null;

          if (window.FormData) {
            formData = new FormData();
            formData.append('card_id', ele.data().cardFrom.id);
            formData.append('comment_id', commentId);
            formData.append('content', saveEditBtn.siblings(opts.commentBoxClass).find(opts.dataInput).val());
            formData.append('file_upload', saveEditBtn.siblings(opts.commentBoxClass).find(opts.dataEditAttachment)[0].files[0]);
          }
          $.ajax({
            type: privateOpts.methodEdit,
            url: privateOpts.urlEdit,
            dataType: 'json',
            data: formData,
            success: function(result) {
              if (result.status && result.data.id.toString() === commentId.toString()) {
                currentComment.find(opts.commentBoxClass).text(result.data.content);
                currentComment.find(opts.dateClass).text(result.data.created_at);
              }
            },
            error: function(xhr) {

            }
          });
        });

      ele.off('click.' + pluginName).on('click.' + pluginName, opts.dataRemove, function(e) {
        e.preventDefault();
        removeAttachmentAjax.call(that, $(this));
      });

      ele.parent().off('click.' + pluginName).on('click.' + pluginName, function(e) {
        if ($(e.target).is('.' + opts.overlayClass)) {
          $(this).addClass(opts.hideClass);
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
    methodPriority: 'GET',
    methodDescription: 'GET',
    methodComment: 'POST',
    dataCardDetail: '[data-card-detail]',
    dataCardDescription: '[data-card-description]',
    dataEditDescription: '[data-edit-description]',
    dataTargetEdit: '[data-target-edit]',
    dataAccept: '[data-accept]',
    dataClose: '[data-close]',
    dataInput: '[data-fluid-height]',
    dataChangePriority: '[data-change-priority]',
    dataListPriority: '[data-list-priority]',
    dataPriority: '[data-priority]',
    dataDetailName: '[data-detail-name]',
    dataComment: '[data-comment]',
    dataCommentId: '[data-comment-id]',
    dataFileAttached: '#comment-attachment',
    dataFileName: '[data-file-name]',
    dataListActivities: '[data-list-activities]',
    dataListAttachment: '[data-list-attachments]',
    dataRemove: '[data-remove]',
    dataRemoveFile: '[data-remove-file]',
    dataAttachmentId: '[data-attachment-id]',
    dataCardAttachment: '[data-card-attachment]',
    cardAttachmentId: '#card-attachment',
    dataDeleteCard: '[data-delete-card]',
    dataImagePreview: '[data-image-preview]',
    dataEditComment: '[data-edit-comment]',
    dataSaveEdit: '[data-save-edit]',
    dataDeleteComment: '[data-delete-comment]',
    dataEditAttachment: '[data-edit-attachment]',
    fileNameClass: '.file-name',
    commentBoxClass: '.comment-box',
    commentContentClass: '.comment-content',
    editContentClass: '.edit-content',
    dateClass: '.date',
    hideClass: 'hide',
    baseLineHeight: 14,
    fadeOutTime: 1000,
    overlayClass: 'screen-overlay',
    textFail: 'An error occured',
    downloadText: 'Download',
    removeText: 'Remove',
    board_id: '#board-id'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));