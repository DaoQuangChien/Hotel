;(function($, window, undefined) {
  'use strict';

  var pluginName = 'edit-card',
      comment = '<div class="block-activity" data-editable data-comment-id="#{{comment-id}}"><span class="member">#{{short-name}}</span><p class="member-name">#{{full-name}}</p><div class="comment-content #{{hide}}">#{{comment-content}}</div><div class="edit-content hide"><div class="form-group"><div class="comment-box"><textarea data-fluid-height rows="3" data-min-rows="3" class="input-paragraph"></textarea><label for="comment-attachment-#{{index}}" class="icon-attachment"></label><input data-edit-attachment id="comment-attachment-#{{index}}" type="file" class="hide"></div><div data-file-name class="comment-file hide">#{{file}}<span data-remove-edit-file class="icon-close"></span></div><button data-save-edit class="create">Save</button><button data-close-edit class="negative"><span class="icon-close"></span></button></div></div>#{{image-preview}}<div class="bottom-comment"><span class="date">#{{created-at}}</span><span class="edit split" data-edit-comment>#{{edit-text}}</span><span class="delete split" data-delete>#{{delete-text}}</span></div></div>',
      attachmentImgEle = '<div class="block-file clearfix" data-attachment-id="#{{id}}"><div class="preview"><a href="#{{link}}" data-caption="#{{alt}}" data-fancybox="groupAttachment"><img src="#{{img-src}}" alt="#{{alt}}" class="preview-img"/></a></div><div class="file-info"><h4 class="file-name">#{{file-name}}</h4><span class="subtitle">#{{created-at}}</span><a href="#{{link}}" title="#{{downloadText}}" class="icon-image">#{{downloadText}}</a><a href="#" title="#{{removeText}}" class="icon-close" data-remove>#{{removeText}}</a></div></div>',
      attachmentCommnEle = '<div class="block-file clearfix" data-attachment-id="#{{id}}"><div class="preview"><p class="file-type">#{{file-type}}</p></div><div class="file-info"><h4 class="file-name">#{{file-name}}</h4><span class="subtitle">#{{created-at}}</span><a href="#{{link}}" title="#{{downloadText}}" class="icon-image">#{{downloadText}}</a><a href="#" title="#{{removeText}}" class="icon-close" data-remove>#{{removeText}}</a></div></div>',
      imagePreview = '<div class="comment-img#{{hide}}"><a href="#{{img-src}}" data-caption="#{{img-alt}}" data-fancybox><img src="#{{img-src}}" alt="#{{img-alt}}" data-attachment-id="#{{attachment-id}}" data-image-preview/></a></div>',
      file_name = '<span class="file-name">#{{file-name}}</span>';

  function setUp(that) {
    that.vars.openEditDescriptionEle.css('cursor', 'pointer');
    that.vars.deadlineDay.jqBootstrapValidation();
    that.vars.deadlineTime.jqBootstrapValidation();
  }

  function addZero(n) {
    return (n < 10) ? '0' + n : n;
  }

  function showImagePreview(file, blockName, image, opts, fancy) {
    if (blockName.find(opts.fileNameClass).length) {
      blockName.find(opts.fileNameClass).text(file.name);
    } else {
      blockName.prepend('<span class="file-name">' + file.name + '</span>');
      blockName.removeClass(opts.hideClass);
    }
    if (window.FileReader) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
        image.attr('src', e.target.result);
        image.attr('alt', file.name);
        if (fancy && fancy.length) {
          fancy.attr('href', e.target.result);
          fancy.attr('data-caption', file.name);
        }
        image.parent().removeClass(opts.hideClass);
      };
      reader.readAsDataURL(file);
    }
  }

  function popUp(target, button) {
    var moveDown = 20,
        menuHeight = 34,
        win = $(window),
        limitLeft = win.width(),
        limitBottom = win.scrollTop() + win.height(),
        targetWidth = target.outerWidth(),
        targetHeight = target.outerHeight();
  
    if (button.offset().left + targetWidth > limitLeft) {
      target.css({ left: limitLeft - targetWidth + 'px' });
    } else {
      target.css({ left: button.offset().left + 'px' });
    }

    if (button.offset().top + targetHeight + moveDown > limitBottom) {
      target.css({ top: limitBottom - targetHeight - menuHeight + 'px' });
    } else {
      target.css({ top: button.offset().top + moveDown - menuHeight + 'px' });
    }
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

  var editCardAjax = function(saveBtn) {
    var that = this,
        ele = this. element,
        opts = this.options,
        name = that.vars.cardName.val().trim(),
        location = that.vars.locationDetail.text().trim();
        // deadline = that.vars.deadlineToggle.find('.date').text().trim() + ' ' + that.vars.deadlineToggle.find('.hour').text().trim();

    $.ajax({
      type: opts.methodDescription,
      url: $(opts.updateCardDetailId).val(),
      dataType: 'json',
      data: {
        card_id: ele.data().cardFrom.id,
        name: name,
        description: that.vars.editDescriptionInput.val().trim(),
        priority: ele.data().cardFrom.priority,
        phase: ele.data().cardFrom.phase,
        board_id: $(opts.board_id).val(),
        location: location
        // deadline: deadline
      },
      success: function(result) {
        if (result.status) {
          var cardNameEle = $('[data-card-id=' + ele.data().cardFrom.id + '] .detail');
          that.vars.descriptionEle.html(that.vars.editDescriptionInput.val().trim());
          that.vars.descriptionEle.removeClass(opts.hideClass);
          that.vars.editDescriptionEle.addClass(opts.hideClass);
          if (cardNameEle.length) {
            cardNameEle.text(name);
            cardNameEle['limit-word']('updateText');
            $('[data-card-id=' + ele.data().cardFrom.id + ']').attr('title', name);
          }
        }
      },
      error: function(xhr) {
        if (saveBtn) {
          saveBtn.parent().append('<span class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</span>');
          saveBtn.siblings('.errorText').fadeOut(opts.fadeOutTime, function() {
            $(this).remove();
          });
        } else {
          that.vars.cardName.val(that.vars.currentCardName);
        }
      },
      complete: function() {
        that.vars.is_EditCard = true;
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
      formData.append('file_upload', file || '');
      formData.append('card_id', ele.data().cardFrom.id);
      formData.append('content', that.vars.commentInput.val().trim());
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
          var tmpComment = comment.replace('#{{comment-id}}', result.data.id).replace('#{{short-name}}', result.data.short_name).replace('#{{full-name}}', result.data.full_name).replace('#{{comment-content}}', result.data.content.replace(/(?:\\r\\n|\\r|\\n|\n)/g, '<br/>')).replace(/#{{index}}/g, result.data.id).replace('#{{created-at}}', result.data.created_at).replace('#{{edit-text}}', opts.editText).replace('#{{delete-text}}', opts.deleteText).replace('#{{hide}}', function() {
            if (result.data.content === '') {
              return opts.hideClass;
            } else {
              return '';
            }
          });
          if (result.data.attachment_id) {
            tmpComment = tmpComment.replace('#{{image-preview}}', imagePreview.replace('#{{hide}}', '').replace(/#{{img-src}}/g, result.data.attachment_link).replace(/#{{img-alt}}/g, result.data.attachment_name).replace('#{{attachment-id}}', result.data.attachment_id)).replace('#{{file}}', file_name.replace('#{{file-name}}', result.data.attachment_name));
          } else {
            tmpComment = tmpComment.replace('#{{image-preview}}', imagePreview.replace('#{{hide}}', ' ' + opts.hideClass).replace(/#{{img-src}}/g, '').replace(/#{{img-alt}}/g, '').replace('#{{attachment-id}}', result.data.attachment_id)).replace('#{{file}}', '');
          }
          that.vars.activityContainer.prepend(tmpComment);
          that.vars.activityContainer.find(opts.dataInput).first()['fluid-height']();
          that.vars.commentInput.val('');
          that.vars.commentInput.trigger('input');
          that.vars.imagePreview.attr('src', '');
          if (that.vars.commentFile.find(opts.fileNameClass).length > 0) {
            that.vars.commentFile.find(opts.fileNameClass).remove();
          }
          that.vars.imageAttached.val('');
          $('[data-card-id=' + ele.data().cardFrom.id + '] .icon-comment').text(that.vars.activityContainer.find(opts.dataEditable).length);
          that.vars.commentFile.addClass(opts.hideClass);
          that.vars.imagePreview.parent().addClass(opts.hideClass);
          saveBtn.addClass(opts.disabledClass);
          that.getDeleteCommentBtn();
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
      success: function(result) {
        if (result.status) {
          if (result.data.file_type.indexOf('image') > -1) {
            attachmentBlock += attachmentImgEle.replace(/#{{img-src}}/g, result.data.link).replace(/#{{alt}}/g, result.data.file_name).replace('#{{file-name}}', result.data.file_name).replace('#{{created-at}}', result.data.created_at).replace(/#{{downloadText}}/g, opts.downloadText).replace(/#{{removeText}}/g, opts.removeText).replace('#{{link}}', result.data.link).replace('#{{id}}', result.data.id);
          } else {
            attachmentBlock += attachmentCommnEle.replace('#{{file-type}}', result.data.file_type).replace('#{{file-name}}', result.data.file_name).replace('#{{created-at}}', result.data.created_at).replace(/#{{downloadText}}/g, opts.downloadText).replace(/#{{removeText}}/g, opts.removeText).replace('#{{link}}', result.data.link).replace('#{{id}}', result.data.id);
          }
          that.vars.attachmentContainer.append(attachmentBlock);
          $('[data-card-id=' + ele.data().cardFrom.id + '] .icon-attachment').text(that.vars.attachmentContainer.children().length);
          that.vars.attachmentContainer.parent().removeClass(opts.hideClass);
          attachBtn.val('');
        } else {
          $('#invalid-file-modal').modal('show');
        }
      },
      error: function(xhr) {
        $('#error-file-modal').find('.modal-body').html('<p>' + xhr.status + ' ' + xhr.statusText + '</p>');
        $('#error-file-modal').modal('show');
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
      success: function(result) {
        if (result.status) {
          removeBtn.parents(opts.dataAttachmentId).remove();
          $('[data-card-id=' + ele.data().cardFrom.id + '] .icon-attachment').text(that.vars.attachmentContainer.children().length);
          if (!that.vars.attachmentContainer.children().length) {
            that.vars.attachmentContainer.parent().addClass(opts.hideClass);
          }
        }
      },
      error: function(xhr) {
        removeBtn.after('<span class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</span>');
        removeBtn.next().fadeOut(opts.fadeOutTime, function() {
          $(this).remove();
        });
      }
    });
  };

  var editCommentAjax = function(saveEditBtn) {
    var that = this,
        ele = this.element,
        opts = this.options,
        privateOpts = that.vars.activityContainer.data(),
        currentComment = saveEditBtn.parents(opts.dataCommentId),
        commentId = currentComment.data().commentId,
        commentBox = currentComment.find(opts.commentContentClass),
        deleteId = currentComment.data('delete-id'),
        formData = null;

    this.vars.is_EditComment = false;
    if (window.FormData) {
      formData = new FormData();
    }
    if (formData) {
      formData.append('card_id', ele.data().cardFrom.id);
      formData.append('comment_id', commentId);
      formData.append('content', currentComment.find(opts.dataInput).val().trim());
      formData.append('file_upload', currentComment.find(opts.dataEditAttachment)[0].files[0] || '');
      if (deleteId) {
        formData.append('delete_attachment_id', deleteId);
      }
    }
    $.ajax({
      type: privateOpts.methodEdit,
      url: privateOpts.urlEdit,
      processData: false,
      contentType: false,
      dataType: 'json',
      data: formData,
      success: function(result) {
        if (result.status && result.data.id.toString() === commentId.toString()) {
          commentBox.html(result.data.content.replace(/(?:\\r\\n|\\r|\\n|\n)/g, '<br/>'));
          result.data.content === '' ? commentBox.addClass(opts.hideClass) : commentBox.removeClass(opts.hideClass);
          currentComment.find(opts.dateClass).text(result.data.created_at);
          currentComment.find(opts.dataInput).val('');
          currentComment.find(opts.editContentClass).addClass(opts.hideClass);
          currentComment.find(opts.fileNameClass).text(result.data.attachment_name);
          currentComment.find(opts.commentImgClass + ' a').attr('href', result.data.attachment_link);
          currentComment.find(opts.commentImgClass + ' a').attr('data-caption', result.data.attachment_name);
          currentComment.find(opts.commentImgClass + ' img').attr('src', result.data.attachment_link);
          currentComment.find(opts.commentImgClass + ' img').attr('alt', result.data.attachment_name);
          if (!currentComment.find(opts.editedCommentClass).length) {
            currentComment.find(opts.dataEditComment).before('<span class="edited" title="' + result.data.modified_at + '"> (' + opts.editedText + ')</span>');
          } else {
            currentComment.find(opts.dataEditComment).attr('title', result.data.modified_at);
          }
        }
      },
      error: function(xhr) {
        saveEditBtn.after('<span class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</span>');
        saveEditBtn.next().fadeOut(opts.fadeOutTime, function() {
          $(this).remove();
        });
      },
      complete: function() {
        that.vars.is_EditComment = true;
      }
    });
  };

  var deleteCommentAjax = function(deleteCommentBtn) {
    var that = this,
        ele = this.element,
        opts = this.options,
        privateOpts = that.vars.activityContainer.data(),
        deleteModal = deleteCommentBtn.parents(opts.dataDeleteCommentModal),
        currentComment = $('[data-comment-id=' + deleteModal.data().commentInfo.id + ']');

    $.ajax({
      type: privateOpts.methodDelete,
      url: privateOpts.urlDelete,
      dataType: 'json',
      data: {
        card_id: ele.data().cardFrom.id,
        comment_id: currentComment.data().commentId
      },
      success: function(result) {
        if (result.status) {
          deleteModal.addClass(opts.hideClass);
          currentComment.remove();
        } else {
          deleteCommentBtn.parent().after('<span class="errorText">' + deleteModal.data().errorText + '</span>');
          deleteCommentBtn.parent().next().fadeOut(opts.fadeOutTime, function() {
            $(this).remove();
          });
        }
      },
      error: function(xhr) {
        deleteCommentBtn.parent().after('<span class="errorText">' + opts.textFail + ': ' + xhr.status + ' ' + xhr.statusText + '</span>');
        deleteCommentBtn.parent().next().fadeOut(opts.fadeOutTime, function() {
          $(this).remove();
        });
      }
    });
  };

  var deleteCardAjax = function(deleteCardBtn) {
    var that = this,
        ele = this.element,
        opts = this. options,
        privateOpts = deleteCardBtn.parents(opts.dataDeleteCard).data(),
        card = $('[data-card-id=' + ele.data().cardFrom.id + ']'),
        cardContainer = card.parent();

    $.ajax({
      type: privateOpts.method,
      url: privateOpts.url,
      dataType: 'json',
      data: {
        card_id: ele.data().cardFrom.id
      },
      success: function(result) {
        if (result.status) {
          // deleteCardBtn.parents(opts.dataDeleteCard).data('deleted', true);
          deleteCardBtn.parents(opts.dataDeleteCard).modal('hide');
          that.vars.cardName.html('');
          that.vars.descriptionEle.html('');
          that.vars.attachmentContainer.html('');
          that.vars.commentInput.html('');
          that.vars.imageAttached.val('');
          that.vars.activityContainer.html('');
          !that.vars.editDescriptionBtn.hasClass(opts.disabledClass) ? that.vars.editDescriptionBtn.addClass(opts.disabledClass) : null;
          !that.vars.addCommentBtn.hasClass(opts.disabledClass) ? that.vars.addCommentBtn.addClass(opts.disabledClass) : null;
          card.remove();
          cardContainer['get-list-card']('callAjax', 'delete');
          $(opts.dataBoardActivity)['board-activity']('reLoadActivity');
          ele.parent().addClass(opts.hideClass);
        } else {
          deleteCardBtn.parent().after('<p class="errorText">' + privateOpts.errorText + '</p>');
          deleteCardBtn.parent().next().fadeOut(opts.fadeOutTime, function() {
            $(this).remove();
          });
        }
      },
      error: function(xhr) {
        deleteCardBtn.parent().after('<p class="errorText">' + opts.textFail + ': ' + xhr.status + xhr.statusText + '</p>');
        deleteCardBtn.parent().next().fadeOut(opts.fadeOutTime, function() {
          $(this).remove();
        });
      }
    });
  };

  var updateLocation = function(locationInput) {
    var that = this,
        ele = this.element,
        opts = this.options,
        privateOpts = locationInput.data(),
        location = locationInput.val();
        // deadline = that.vars.deadlineToggle.find('.date').text().trim() + ' ' + that.vars.deadlineToggle.find('.hour').text().trim();

    $.ajax({
      type: privateOpts.method,
      url: $(opts.updateCardDetailId).val(),
      dataType: 'json',
      data: {
        card_id: ele.data().cardFrom.id,
        name: that.vars.cardName.val().trim(),
        description: that.vars.editDescriptionInput.val().trim(),
        priority: ele.data().cardFrom.priority,
        phase: ele.data().cardFrom.phase,
        board_id: $(opts.board_id).val(),
        location: location
        // deadline: deadline
      },
      success: function(result) {
        if (result.status) {
          that.vars.locationDetail.html(location).removeClass(opts.hideClass);
          locationInput.addClass(opts.hideClass);
        } else {
          locationInput.after('<p class="errorText">' + privateOpts.errorText + '</p>');
          locationInput.next().fadeOut(opts.fadeOutTime, function() {
            $(this).remove();
          });
        }
      },
      error: function(xhr) {
        locationInput.after('<p class="errorText">' + opts.textFail + ': ' + xhr.status + xhr.statusText + '</p>');
        locationInput.next().fadeOut(opts.fadeOutTime, function() {
          $(this).remove();
        });
      }
    });
  };

  var updateDeadline = function(updateBtn) {
    var that = this,
        ele = this.element,
        opts = this.options,
        privateOpts = updateBtn.data(),
        deadline = that.vars.deadlineDay.val().trim() + ' ' + that.vars.deadlineTime.val().trim() + ':00';

    $.ajax({
      type: privateOpts.method,
      url: $(opts.updateCardDetailId).val(),
      dataType: 'json',
      data: {
        card_id: ele.data().cardFrom.id,
        name: that.vars.cardName.val().trim(),
        description: that.vars.editDescriptionInput.val().trim(),
        priority: ele.data().cardFrom.priority,
        phase: ele.data().cardFrom.phase,
        board_id: $(opts.board_id).val(),
        location: that.vars.locationDetail.text().trim(),
        expired_at: deadline
      },
      success: function(result) {
        if (result.status) {
          that.vars.deadlineToggle.find('.date').text(that.vars.deadlineDay.val().trim());
          that.vars.deadlineToggle.find('.hour').text(that.vars.deadlineTime.val().trim());
          that.vars.deadlineToggle.find('.detail').removeClass(opts.hideClass);
          that.vars.deadlineModal.modal('hide');
        }
      },
      error: function() {
        that.vars.failMessage.removeClass(opts.hideClass);
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
        is_EditCard: true,
        is_EditComment: true,
        is_ValidDate: true,
        is_ValidTime: true,
        currentCardName: '',
        locationDetail: ele.find(opts.dataLocationDetail),
        locationInput: ele.find(opts.dataLocationInput),
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
        showDeleteModal: ele.find(opts.dataCardDelete),
        cardDeleteModal: ele.find(opts.dataDeleteCard),
        get deleteCardBtn() {
          return this.cardDeleteModal.find(opts.dataDeleteComment);
        },
        deleteCommentBtn: $(opts.dataDeleteCommentModal).find(opts.dataDeleteComment),
        priorityList: ele.find(opts.dataListPriority),
        deadlineToggle: ele.find(opts.dataDeadline),
        deadlineModal: ele.find(opts.deadlineId),
        get deadlineDay() {
          return this.deadlineModal.find(opts.dataDatePicker);
        },
        get deadlineTime() {
          return this.deadlineModal.find(opts.dataTimeSpinner);
        },
        get invalidDateTime() {
          return this.deadlineModal.find(opts.textErrorClass);
        },
        get setDeadline() {
          return this.deadlineModal.find(opts.dataAccept);
        },
        get warningMessage() {
          return this.deadlineModal.find('.invalid');
        },
        get failMessage() {
          return this.deadlineModal.find('.fail');
        },
        get hideMessageBtn() {
          return this.deadlineModal.find(opts.dataHideMessage);
        },
        validFileTypes: 'gif,png,jpg,jpeg,doc,dot,wbk,docx,docm,dotx,dotm,docb,xls,xlt,xlm,xlsx,xlsm,xltx,xltm,xlsb,xla,xlam,xll,xlw' + opts.validTypes
      };

      setUp(this);
      this.resetDateTime();
      this.vars.locationDetail.off('click.' + pluginName).on('click.' + pluginName, function() {
        that.vars.locationInput.val($(this).text().trim());
        $(this).addClass(opts.hideClass);
        that.vars.locationInput.data('initValue', $(this).text()).removeClass(opts.hideClass).focus();
      });
      this.vars.locationInput
        .off('keydown.' + pluginName).on('keydown.' + pluginName, function(e) {
          if (e.keyCode === 13) {
            $(this).blur();
          }
        })
        .off('blur.' + pluginName).on('blur.' + pluginName, function() {
          if ($(this).val().trim().length) {
            if ($(this).val().trim() !== $(this).data().initValue) {
              updateLocation.call(that, $(this));
            } else {
              $(this).addClass(opts.hideClass);
              that.vars.locationDetail.removeClass(opts.hideClass);
            }
          }
        });
      if ($(opts.isAdminId).val() === '1') {
        this.vars.cardName
          .off('focus.' + pluginName).on('focus.' + pluginName, function() {
            that.vars.currentCardName = $(this).val().trim();
            if (!that.vars.is_EditCard) {
              $(this).trigger('blur');
            }
          })
          .off('blur.' + pluginName).on('blur.' + pluginName, function() {
            if ($(this).val().trim() !== that.vars.currentCardName) {
              editCardAjax.call(that);
            }
          })
          .off('keydown.' + pluginName).on('keydown.' + pluginName, function(e) {
            if (e.keyCode === 13) {
              $(this).trigger('blur');
            }
            if (e.keyCode === 27) {
              $(this).val(that.vars.currentCardName).trigger('input').trigger('blur');
            }
          });
      } else {
        this.vars.cardName.attr('disabled', true);
      }
      this.vars.openEditDescriptionEle.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.stopPropagation();
        if ($(opts.isAdminId).val() === '1') {
          if (that.vars.descriptionEle.html().trim().length) {
            that.vars.editDescriptionInput.val(that.vars.descriptionEle.html().replace(/<br>/g, '\n'));
          } else {
            that.vars.editDescriptionInput.val('');
          }
          that.vars.descriptionEle.addClass(opts.hideClass);
          that.vars.editDescriptionEle.removeClass(opts.hideClass);
          that.vars.editDescriptionInput
            .focus()
            .trigger('input');
          that.vars.editDescriptionInput[0].rows = that.vars.editDescriptionInput.data().minRows;
          if (that.vars.editDescriptionInput[0].scrollHeight > that.vars.editDescriptionInput.innerHeight()) {
            that.vars.editDescriptionInput.css('height', that.vars.editDescriptionInput[0].scrollHeight);
          }
          that.vars.openEditDescriptionEle.filter('.add-description').addClass(opts.hideClass);
        } else {
          if (!$(this).hasClass('card-content')) {
            $('#access-denied-modal').modal('show');
          }
        }
      });
      this.vars.editDescriptionInput
        .off('focusin.' + pluginName).on('focusin.' + pluginName, function() {
          if ($(this).val().trim().length) {
            that.vars.editDescriptionBtn.removeClass(opts.disabledClass);
          } else {
            !that.vars.editDescriptionBtn.hasClass(opts.disabledClass) ? that.vars.editDescriptionBtn.addClass(opts.disabledClass) : null;
          }
        })
        .off('blur.' + pluginName).on('blur.' + pluginName, function(e) {
          if (!$(e.target).is(that.vars.editDescriptionBtn)) {
            !that.vars.editDescriptionBtn.hasClass(opts.disabledClass) ? that.vars.editDescriptionBtn.addClass(opts.disabledClass) : null;
          }
        })
        .off('keydown.' + pluginName).on('keydown.' + pluginName, function(e) {
          if (e.keyCode === 27) {
            e.stopPropagation();
            if (that.vars.descriptionEle.html().trim().length) {
              that.vars.descriptionEle.removeClass(opts.hideClass);
            } else {
              that.vars.openEditDescriptionEle.filter('.add-description').removeClass(opts.hideClass);
            }
            that.vars.editDescriptionEle.addClass(opts.hideClass);
          }
        })
        .off('input.' + pluginName).on('input.' + pluginName, function() {
          if ($(this).val().trim().length) {
            that.vars.editDescriptionBtn.removeClass(opts.disabledClass);
          } else {
            !that.vars.editDescriptionBtn.hasClass(opts.disabledClass) ? that.vars.editDescriptionBtn.addClass(opts.disabledClass) : null;
          }
        });
      this.vars.closeEditDescriptionBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        that.vars.editDescriptionInput.val('');
        if (that.vars.descriptionEle.html().trim().length) {
          that.vars.descriptionEle.removeClass(opts.hideClass);
          that.vars.editDescriptionEle.addClass(opts.hideClass);
        } else {
          that.vars.openEditDescriptionEle.filter('.add-description').removeClass(opts.hideClass);
        }
      });
      this.vars.attachmentContainer.off('click.' + pluginName).on('click.' + pluginName, opts.iconImageClass, function(e) {
        e.preventDefault();
        $(this).parents(opts.dataAttachmentId).find(opts.dataFancyBox).trigger('click');
      });
      this.vars.toggleChangePriority.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.stopPropagation();
        if ($(opts.isAdminId).val() === '1') {
          $(this).find(opts.dataListPriority).toggleClass(opts.hideClass);
        } else {
          $('#access-denied-modal').modal('show');
        }
      });
      this.vars.changePriority.off('click.' + pluginName).on('click.' + pluginName, function() {
        if ($(opts.isAdminId).val() === '1') {
          changePriorityAjax.call(that, $(this));
        } else {
          $('#access-denied-modal').modal('show');
        }
      });
      this.vars.editDescriptionBtn.off('mousedown.' + pluginName).on('mousedown.' + pluginName, function() {
        if (!that.vars.is_EditCard) {
          return false;
        }
        that.vars.is_EditCard = false;
        editCardAjax.call(that, $(this));
      });
      this.vars.imageAttached.off('change.' + pluginName).on('change.' + pluginName, function() {
        var file = this.files[0];

        if (file) {
          if (that.vars.validFileTypes.indexOf(file.type.split('/')[1]) > -1) {
            showImagePreview(file, that.vars.commentFile, that.vars.imagePreview, opts);
            that.vars.addCommentBtn.removeClass(opts.disabledClass);
          } else {
            $('#invalid-file-modal').modal('show');
            $(this).val('');
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
        if (!that.vars.commentInput.val().trim().length) {
          !that.vars.addCommentBtn.hasClass(opts.disabledClass) ? that.vars.addCommentBtn.addClass(opts.disabledClass) : null;
        }
        that.vars.commentInput.focus();
      });
      this.vars.commentInput
        .off('focus.' + pluginName).on('focus.' + pluginName, function() {
          if (!$(this).val().trim().length && !that.vars.imageAttached[0].files.length) {
            !that.vars.addCommentBtn.hasClass(opts.disabledClass) ? that.vars.addCommentBtn.addClass(opts.disabledClass) : null;
          } else {
            that.vars.addCommentBtn.removeClass(opts.disabledClass);
          }
        })
        .off('blur.' + pluginName).on('blur.' + pluginName, function() {
          !that.vars.addCommentBtn.hasClass(opts.disabledClass) ? that.vars.addCommentBtn.addClass(opts.disabledClass) : null;
        })
        .off('input.' + pluginName).on('input.' + pluginName, function() {
          if (!$(this).val().trim().length && !that.vars.imageAttached[0].files.length) {
            !that.vars.addCommentBtn.hasClass(opts.disabledClass) ? that.vars.addCommentBtn.addClass(opts.disabledClass) : null;
          } else {
            that.vars.addCommentBtn.removeClass(opts.disabledClass);
          }
        });
      this.vars.addCommentBtn.off('mousedown.' + pluginName).on('mousedown.' + pluginName, function() {
        if (!that.vars.commentInput.val().length && !that.vars.imageAttached[0].files.length) {
          that.vars.commentInput.focus();
          return false;
        }
        if (!that.vars.is_AddComment) {
          return false;
        }
        that.vars.is_AddComment = false;
        addCommentAjax.call(that, $(this));
      });
      this.vars.cardAttachEle.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        if ($(opts.isAdminId).val() !== '1') {
          e.preventDefault();
          $('#access-denied-modal').modal('show');
        }
      });
      this.vars.cardAttachBtn.off('change.' + pluginName).on('change.' + pluginName, function() {
        if ($(this).val() !== '') {
          cardAttachmentAjax.call(that, $(this));
        }
      });
      this.vars.activityContainer
        .off('click.' + pluginName)
        .on('click.' + pluginName, opts.dataEditComment, function() {
          var editCommentBtn = $(this),
              currentComment = editCommentBtn.parents(opts.dataCommentId),
              contentBlock = currentComment.find(opts.editContentClass),
              commentContent = currentComment.find(opts.commentContentClass),
              commentInput = currentComment.find(opts.dataInput),
              currentSrc = {
                currentLink: currentComment.find(opts.commentImgClass + ' img').attr('src'),
                currentName: currentComment.find(opts.fileNameClass).length ? currentComment.find(opts.fileNameClass).text() : '',
                currentContent: commentContent.html().replace(/<br>/g, '\n')
              };

          !commentContent.hasClass(opts.hideClass) ? commentContent.addClass(opts.hideClass) : null;
          contentBlock.removeClass(opts.hideClass);
          currentComment.data('current-src', currentSrc);
          commentInput.val(commentContent.html().replace(/<br>/g, '\n'));
          commentInput.trigger('focus').trigger('input');
          (currentSrc.currentName !== '') ? contentBlock.find(opts.dataFileName).removeClass(opts.hideClass) : null;
          commentInput.select();
        })
        .on('click.' + pluginName, opts.dataRemoveEditFile, function() {
          var removeFileBtn = $(this),
              currentComment = removeFileBtn.parents(opts.dataCommentId),
              imagePreview = currentComment.find(opts.commentImgClass + ' img'),
              attachmentInput = currentComment.find(opts.dataEditAttachment);

          currentComment.data('delete-id', imagePreview.data('attachment-id'));
          if (removeFileBtn.prev().length) {
            removeFileBtn.prev().remove();
          }
          attachmentInput.val('');
          imagePreview.parent().addClass(opts.hideClass);
          imagePreview.attr('src', '');
          removeFileBtn.parent().addClass(opts.hideClass);
        })
        .on('click.' + pluginName, opts.dataCloseEdit, function() {
          var closeEditBtn = $(this),
              currentComment = closeEditBtn.parents(opts.dataCommentId),
              imagePreview = currentComment.find(opts.commentImgClass + ' img'),
              commentContent = currentComment.find(opts.commentContentClass),
              fileNameBlock = currentComment.find(opts.dataFileName);

          if (currentComment.data().currentSrc.currentLink !== 'null') {
            imagePreview.attr('src', currentComment.data().currentSrc.currentLink);
            imagePreview.parent().removeClass(opts.hideClass);
          }
          if (currentComment.data().currentSrc.currentName) {
            if (fileNameBlock.find(opts.fileNameClass).length) {
              fileNameBlock.find(opts.fileNameClass).text(currentComment.data().currentSrc.currentName);
            } else {
              fileNameBlock.prepend('<span class="file-name">' + currentComment.data().currentSrc.currentName + '</span>');
              fileNameBlock.removeClass(opts.hideClass);
            }
          }
          currentComment.find(opts.dataInput).val('');
          currentComment.find(opts.dataEditAttachment).val('');
          commentContent.html().trim().length ? commentContent.removeClass(opts.hideClass) : null;
          !closeEditBtn.parents(opts.editContentClass).hasClass(opts.hideClass) ? closeEditBtn.parents(opts.editContentClass).addClass(opts.hideClass) : null;
        })
        .on('click.' + pluginName, opts.dataSaveEdit, function() {
          var currentComment = $(this).parents(opts.dataCommentId),
              contentBlock = currentComment.find(opts.editContentClass),
              commentContent = currentComment.find(opts.commentContentClass),
              currentFileName = currentComment.find(opts.fileNameClass).length ? currentComment.find(opts.fileNameClass).text() : '',
              currentCommentInput = currentComment.find(opts.dataInput).val(),
              initData = currentComment.data().currentSrc;

          if (!currentComment.find(opts.dataInput).val().trim().length && !currentComment.find(opts.dataEditAttachment)[0].files.length) {
            return false;
          }
          if (initData.currentName === currentFileName && initData.currentContent === currentCommentInput) {
            contentBlock.addClass(opts.hideClass);
            commentContent.removeClass(opts.hideClass);
          } else {
            if (that.vars.is_EditComment) {
              editCommentAjax.call(that, $(this));
            }
          }
        })
        .on('click.' + pluginName, opts.dataDeleteComment, function() {
          var target = $('[data-delete-comment]'),
              currentComment = $(this).parents(opts.dataCommentId),
              commentInfo = {};

          that.vars.deleteCommentBtns.removeClass(opts.highLightClass);
          $(this).addClass(opts.highLightClass);
          target.removeClass(opts.hideClass);
          commentInfo.id = currentComment.data().commentId;
          target.data('commentInfo', commentInfo);
          popUp(target, $(this));
          return false;
        })
        .off('keydown.' + pluginName).on('keydown.' + pluginName, opts.dataInput, function(e) {
          e.stopPropagation();
          if (e.keyCode === 27) {
            $(this).parents(opts.dataCommentId).find(opts.dataCloseEdit).trigger('click');
          }
        })
        .off('change.' + pluginName).on('change.' + pluginName, opts.dataEditAttachment, function() {
          var file = this.files[0],
              attachBtn = $(this),
              currentComment = attachBtn.parents(opts.dataCommentId),
              fileNameBlock = currentComment.find(opts.dataFileName),
              imagePreview = currentComment.find(opts.commentImgClass + ' img'),
              fancyBox = currentComment.find(opts.commentImgClass + ' a');

          if (!imagePreview.length) {
            currentComment.find(opts.editContentClass).after('<div class="comment-img"><img/></div>');
            imagePreview = currentComment.find(opts.commentImgClass + ' img');
          }
          if (file) {
            showImagePreview(file, fileNameBlock, imagePreview, opts, fancyBox);
          } else {
            return;
          }
        });
      this.vars.showDeleteModal.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.stopPropagation();
        if ($(opts.isAdminId).val() === '1') {
          $('#delete-file-modal').modal('show');
        } else {
          $('#access-denied-modal').modal('show');
        }
      });
      this.vars.deleteCardBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        deleteCardAjax.call(that, $(this));
      });
      this.vars.deleteCommentBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        deleteCommentAjax.call(that, $(this));
      });
      this.vars.setDeadline.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (!that.vars.deadlineDay.val().trim().length) {
          that.vars.deadlineDay.focus();
          return;
        }
        if (!that.vars.deadlineTime.val().trim().length) {
          that.vars.deadlineTime.focus();
          return;
        }
        that.vars.deadlineDay.trigger('submit.validation').trigger('validationLostFocus.validation');
        that.vars.deadlineTime.trigger('submit.validation').trigger('validationLostFocus.validation');
        if (that.vars.deadlineDay.closest(opts.controlGroupClass).hasClass(opts.warningClass) ||  that.vars.deadlineTime.closest(opts.controlGroupClass).hasClass(opts.warningClass)) {
          that.vars.warningMessage.removeClass(opts.hideClass);
        } else {
          updateDeadline.call(that, $(this));
        }
      });
      this.vars.hideMessageBtn.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        $(this).closest(opts.textErrorsClass).addClass(opts.hideClass);
      });
      ele
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(e) {
          that.vars.deleteCommentBtns.removeClass(opts.highLightClass);
          if (!$(e.target).is(that.vars.editDescriptionInput) && that.vars.editDescriptionEle.is(':visible')) {
            that.vars.editDescriptionEle.addClass(opts.hideClass);
            if (that.vars.descriptionEle.html().trim().length) {
              that.vars.descriptionEle.removeClass(opts.hideClass);
            } else {
              that.vars.openEditDescriptionEle.filter('.add-description').removeClass(opts.hideClass);
            }
          }
          if (!$(e.target).is(that.vars.priorityList) && that.vars.priorityList.is(':visible')) {
            !that.vars.priorityList.hasClass(opts.hideClass) ? that.vars.priorityList.addClass(opts.hideClass) : null;
          }
        })
        .on('click.' + pluginName, opts.dataRemove, function(e) {
          e.preventDefault();
          if ($(opts.isAdminId).val() === '1') {
            removeAttachmentAjax.call(that, $(this));
          } else {
            $('#access-denied-modal').modal('show');
          }
        });
      ele.parent().off('click.' + pluginName).on('click.' + pluginName, function(e) {
        if ($(e.target).is(opts.dataCardDetail)) {
          that.vars.cardName.html('');
          that.vars.descriptionEle.html('');
          that.vars.editDescriptionEle.removeClass(opts.hideClass);
          that.vars.editDescriptionInput.val('').trigger('input');
          that.vars.editDescriptionEle.addClass(opts.hideClass);
          that.vars.attachmentContainer.html('');
          that.vars.commentInput.val('').trigger('input');
          that.vars.imageAttached.val('');
          that.vars.activityContainer.html('');
          !that.vars.editDescriptionBtn.hasClass(opts.disabledClass) ? that.vars.editDescriptionBtn.addClass(opts.disabledClass) : null;
          !that.vars.addCommentBtn.hasClass(opts.disabledClass) ? that.vars.addCommentBtn.addClass(opts.disabledClass) : null;
          $(this).addClass(opts.hideClass);
          $(opts.confirmModalClass).modal('hide');
          that.vars.priorityList.addClass(opts.hideClass);
        }
        that.vars.deleteCommentBtns.removeClass(opts.highLightClass);
      });
      $('body').off('keydown.' + pluginName).on('keydown.' + pluginName, function(e) {
        if (e.keyCode === 27) {
          if (that.vars.priorityList.is(':visible') || that.vars.cardDeleteModal.is(':visible') || $('#card-type-modal').is(':visible')) {
            that.vars.priorityList.addClass(opts.hideClass);
            that.vars.cardDeleteModal.modal('hide');
            $('#card-type-modal').modal('hide');
          } else {
            ele.parent().trigger('click');
          }
        }
      });
    },
    getDeleteCommentBtn: function() {
      var ele = this.element,
          opts = this. options;
      
      this.vars.deleteCommentBtns = ele.find(opts.dataDeleteComment);
    },
    resetDateTime: function() {
      var opts = this.options,
          now = new Date(),
          date = this.vars.deadlineToggle.find('.date').text().length ? this.vars.deadlineToggle.find('.date').text() : $.datepicker.formatDate('dd/mm/yy', now),
          time = this.vars.deadlineToggle.find('.hour').text().length ? this.vars.deadlineToggle.find('.hour').text() : addZero(now.getHours()) + ':' + addZero(now.getMinutes());
      this.vars.deadlineDay
        .datepicker('option', 'minDate', now)
        .val(date);
      this.vars.deadlineTime.val(time);
      this.vars.warningMessage.addClass(opts.hideClass);
      this.vars.failMessage.addClass(opts.hideClass);
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
    methodComment: 'GET',
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
    dataEditable: '[data-editable]',
    dataRemoveFile: '[data-remove-file]',
    dataAttachmentId: '[data-attachment-id]',
    dataCardAttachment: '[data-card-attachment]',
    cardAttachmentId: '#card-attachment',
    dataDeleteCard: '[data-delete-card]',
    dataImagePreview: '[data-image-preview]',
    dataEditComment: '[data-edit-comment]',
    dataSaveEdit: '[data-save-edit]',
    dataDeleteComment: '[data-delete]',
    dataEditAttachment: '[data-edit-attachment]',
    dataCloseEdit: '[data-close-edit]',
    dataRemoveEditFile: '[data-remove-edit-file]',
    dataDeleteCommentModal: '[data-delete-comment]',
    dataCardDelete: '[data-card-delete]',
    dataFancyBox: '[data-fancybox]',
    dataBoardActivity: '[data-board-activity]',
    dataLocationDetail: '[data-location-detail]',
    dataLocationInput: '[data-location-input]',
    dataDeadline: '[data-deadline]',
    dataDatePicker: '[data-datepicker]',
    dataTimeSpinner: '[data-timespinner]',
    dataHideMessage: '[data-hide-message]',
    fileNameClass: '.file-name',
    commentBoxClass: '.comment-box',
    commentContentClass: '.comment-content',
    editContentClass: '.edit-content',
    commentImgClass: '.comment-img',
    iconImageClass: '.icon-image',
    editedCommentClass: '.edited',
    dateClass: '.date',
    textErrorClass: '.text-error',
    highLightClass: 'high-light',
    textErrorsClass: '.text-errors',
    controlGroupClass: '.control-group',
    confirmModalClass: '.confirm-modal',
    warningClass: 'warning',
    targetDeleteComment: 'deleteComment',
    hideClass: 'hide',
    disabledClass: 'disabled',
    baseLineHeight: 14,
    fadeOutTime: 1000,
    overlayClass: 'screen-overlay',
    textFail: 'An error occured',
    removeText: 'Remove',
    editText: 'Edit',
    downloadText: 'View',
    deleteText: 'Delete',
    updateCardDetailId: '#update-card-detail',
    deadlineId: '#deadline-modal',
    board_id: '#board-id',
    isAdminId: '#is-admin',
    validTypes: ''
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));