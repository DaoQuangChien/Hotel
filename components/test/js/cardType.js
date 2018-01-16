; (function($, window, undefined) {
  'use strict';

  var pluginName = 'card-type';

  var filterType = function(filterContent) {
    var searchResult;

    if (!filterContent.length) {
      this.vars.createModifieldBtn.show();
    } else {
      this.vars.createModifieldBtn.hide();
    }
    this.vars.noResult.hide();
    this.vars.typeItem.parent().show();
    searchResult = this.vars.typeItem.filter(function (index, typeItem) {
      return $(typeItem).text().toLowerCase().indexOf(filterContent) === -1;
    });
    if (searchResult.length === this.vars.typeItem.length && filterContent.length) {
      this.vars.noResult.show();
    }
    searchResult.parent().hide();
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
        typeSelect: ele.find(opts.typeSelectClass),
        toggleBtn: ele.find(opts.dropdownToggleClass),
        createModifieldBtn: ele.find(opts.dataCreateModifield),
        listType: ele.find(opts.dataListType),
        listTypeTable: ele.find('tbody'),
        typeItem: ele.find(opts.dataCardTypeItem + ' a'),
        applyTypeModal: $(opts.applyTypeModal),
        get applyCardTypeBtn() {
          return this.applyTypeModal.find(opts.dataAccept);
        },
        get notSelectMsg() {
          return this.applyTypeModal.find(opts.dataNotSelect);
        },
        cardTypeModal: $(opts.cardTypeModalId),
        modifiedTypeModal: $(opts.modifiedTypeModalId),
        searchTypeBtn: ele.find(opts.dataSearchBtn),
        noResult: ele.find(opts.noresultClass),
        hideMsgBtn: ele.find(opts.dataHideMessage),
        modifiedButtonGroup: $(opts.dataModfiedType),
        limit: opts.limit,
        offset: 0,
        permission: true,
        isLoadmore: true
      };

      if (opts.mode === 'update') {
        this.vars.createModifieldBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
          that.vars.applyTypeModal.modal('hide');
        });
        this.vars.toggleBtn.off('click.' + pluginName).on('click.' + pluginName, function(e) {
          e.preventDefault();
          !that.vars.listType.is(':visible') ? that.vars.listType.removeClass(opts.hideClass) : null;
          that.vars.listType.find('li').show();
          that.vars.listType.find('li.no-result').hide();
        });
        this.vars.applyTypeModal.off('show.bs.modal.' + pluginName).on('show.bs.modal.' + pluginName, function () {
          if (that.vars.typeSelect.data().cardType) {
            that.vars.typeSelect.data().cardType.currentName && that.vars.typeSelect.data().cardType.id !== -1 ?
            that.vars.typeSelect.val(that.vars.typeSelect.data().cardType.currentName)
            :
            that.vars.typeSelect.val(that.vars.typeSelect.data().cardType.name);
          } else {
            that.vars.typeSelect.val('');
          }
          that.vars.notSelectMsg.addClass(opts.hideClass);
        });
        this.vars.applyTypeModal.off('hide.bs.modal' + pluginName).on('hide.bs.modal' + pluginName, function() {
          if (that.vars.typeSelect.data().cardType) {
            that.vars.typeSelect.data('card-type', {id: that.vars.typeSelect.data().cardType.id, name: that.vars.typeSelect.data().cardType.name});
          }
        });
        this.vars.cardTypeModal.off('hide.bs.modal.' + pluginName).on('hide.bs.modal.' + pluginName, function() {
          if (!$(this).data().notShowApply) {
            that.vars.applyTypeModal.modal('show');
          }
        });
        this.vars.hideMsgBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
          $(this).parents(opts.textErrorClass).addClass(opts.hideClass);
        });
        this.vars.modifiedTypeModal
          .off('show.bs.modal.' + pluginName).on('show.bs.modal.' + pluginName, function() {
            that.vars.cardTypeModal
              .data('not-show-apply', true)
              .modal('hide');
          })
          .off('hide.bs.modal.' + pluginName).on('hide.bs.modal.' + pluginName, function() {
            $(this).find('#modified-card-type')
              .val('')
              .removeData('card-type');
            if ($(this).data().addNew) {
              that.vars.cardTypeModal.data('not-show-apply', false);
              that.vars.applyTypeModal.modal('show');
              $(this).removeData('add-new');
            } else {
              that.vars.cardTypeModal
                .data('not-show-apply', false)
                .modal('show');
            }
          });
        this.vars.applyCardTypeBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
          var privateOpts = $(this).data(),
              selection = that.vars.typeSelect.data().typeSelection,
              currentSelect = that.vars.typeSelect.data().cardType;

          if (!selection || that.vars.typeSelect.val() !== selection.name) {
            that.vars.notSelectMsg.removeClass(opts.hideClass);
          } else {
            that.vars.notSelectMsg.addClass(opts.hideClass);
            if (currentSelect.id === selection.id && currentSelect.name === selection.name) {
              that.vars.applyTypeModal.modal('hide');
            } else {
              $.ajax({
                type: privateOpts.method,
                url: privateOpts.url,
                dataType: 'json',
                cache: false,
                data: {
                  card_id: ele.data().cardFrom.id,
                  type_id: selection.id
                },
                success: function(result) {
                  if (result.status) {
                    that.updateTypeInput(selection.id);
                    that.activeTypeItem(selection.id);
                    that.updateCardDetailType();
                    that.vars.applyTypeModal.modal('hide');
                    $(opts.dataEditCard)['edit-card']('reRenderAcivity');
                  }
                }
              });
            }
          }
        });
      }
      if (opts.mode === 'search') {
        this.vars.searchTypeBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
          var lastSearch = that.vars.typeSelect.data().lastSearch,
              searchValue = that.vars.typeSelect.val().trim() || '';

          if (typeof(lastSearch) !== 'undefined' && lastSearch === searchValue) {
            that.vars.typeSelect.focus();
          } else {
            $('[data-' + pluginName + ']').filter('[data-mode=table]')['card-type']('getListType', searchValue);
            that.vars.typeSelect.data('last-search', searchValue);
          }
        });
      }
      if (opts.mode === 'table') {
        this.vars.modifiedButtonGroup
          .off('click.' + pluginName, opts.dataUpdateType).on('click.' + pluginName, opts.dataUpdateType, function(e) {
            e.preventDefault();
            var currentCardType = $(this).parents('[data-target-popup]');

            $(opts.modifiedTypeModalId).modal('show');
            $(opts.modifiedTypeModalId).find('#modified-card-type')
              .val(currentCardType.data('type-from').type_name)
              .data('card-type', { id: currentCardType.data('type-from').type_id, name: currentCardType.data('type-from').type_name});
            currentCardType.addClass(opts.hideClass);
          })
          .off('click.' + pluginName, opts.dataDeleteType).on('click.' + pluginName, opts.dataDeleteType, function(e) {
            e.preventDefault();
            var currentCardType = $(this).parents('[data-target-popup]');

            $(opts.deleteTypeModalId)
              .data('card-type', { id: currentCardType.data('type-from').type_id, name: currentCardType.data('type-from').type_name })
              .modal('show');
            currentCardType.addClass(opts.hideClass);
          });
        ele.off('scroll.' + pluginName).on('scroll.' + pluginName, function() {
          if (that.vars.isLoadmore) {
            if ($(this).scrollTop() > this.scrollHeight - $(this).outerHeight() - opts.triggerBefore) {
              if (that.vars.permission) {
                that.getListType();
              }
            }
          }
        });
      } else {
        this.vars.typeSelect
          .off('focus.' + pluginName).on('focus.' + pluginName, function () {
            that.vars.listType.removeClass(opts.hideClass);
            filterType.call(that, $(this).val().toLowerCase());
          })
          .off('input.' + pluginName).on('input.' + pluginName, function () {
            filterType.call(that, $(this).val().toLowerCase());
          });
        this.vars.listType.off('click.' + pluginName, opts.dataCardTypeItem).on('click.' + pluginName, opts.dataCardTypeItem, function (e) {
          e.preventDefault();
          that.vars.typeSelect.val($(this).text());
          that.vars.listType.addClass(opts.hideClass);
          if (!that.vars.typeSelect.data().cardType) {
            that.vars.typeSelect.data('card-type', {id: -1, name: ''});
          }
          that.updateTypeSelection($(this).data().typeId);
        });
        ele.off('focusout.' + pluginName).on('focusout.' + pluginName, function (e) {
          if (e.relatedTarget === null || !$(e.relatedTarget).parents('[data-card-type]').is($(e.currentTarget))) {
            that.vars.listType.addClass(opts.hideClass);
          }
        });
      }
      this.getListType();
    },
    getListType: function(name, id) {
      var that = this,
          opts = this.options,
          cardTypeItem = opts.mode === 'table' ? '<tr><td data-type-id>#{{type-id}}</td><td data-type-name>#{{card-type}}</td><td><div class="btn-group"><button class="btn btn-warning dropdown-toggle" data-open-popup, data-target="modifiedType", data-set-pos="true", data-left-aligned="true">#{{action-text}}&nbsp;<span class="caret"></span></button></div></td></tr>' : '<li #{{active}} data-card-type-item data-type-id="#{{type-id}}"><a href="#" title="#{{card-type}}">#{{card-type}}</a></li>',
          data;

      this.vars.permission = false;
      if (opts.mode === 'table') {
        if (typeof(name) !== 'undefined') {
          that.vars.offset = 0;
          data = {
            limit: that.vars.limit,
            offset: that.vars.offset,
            name: name
          };
        } else {
          data = {
            limit: that.vars.limit,
            offset: that.vars.offset
          };
        }
      } else {
        data = {
          // limit: that.vars.limit,
          offset: that.vars.offset
        };
      }
      $.ajax({
        type: opts.method,
        url: $(opts.updateCardTypeId).val(),
        dataType: 'json',
        cache: false,
        data: data,
        success: function(result) {
          if (result.status) {
            var listTypeItem = '';
  
            if (opts.mode === 'table') {
              result.data.forEach(function(type) {
                listTypeItem += cardTypeItem.replace('#{{card-type}}', type.name).replace('#{{type-id}}', type.id).replace('#{{action-text}}', opts.actionText).replace(/#{{modified-text}}/g, opts.modifiedText).replace(/#{{delete-text}}/g, opts.deleteText);
              });
              typeof(name) !== 'undefined' ? that.vars.listTypeTable.html(listTypeItem) : that.vars.listTypeTable.append(listTypeItem);
              that.vars.listTypeTable.find('.dropdown-toggle')['open-popup']();
              that.vars.offset += that.vars.limit;
              if (result.total <= that.vars.offset) {
                that.vars.isLoadmore = false;
              } else {
                that.vars.isLoadmore = true;
              }
            } else {
              if (opts.mode === 'update') {
                result.data.forEach(function(type) {
                  listTypeItem += cardTypeItem.replace(/#{{card-type}}/g, type.name).replace('#{{type-id}}', type.id).replace('#{{active}}', function() {
                    return type.id === id ? 'class="active"' : '';
                  });
                });
              } else {
                result.data.forEach(function(type) {
                  listTypeItem += cardTypeItem.replace(/#{{card-type}}/g, type.name).replace('#{{type-id}}', type.id).replace('#{{active}}', '');
                });
              }
              that.vars.listType.find(opts.dataCardTypeItem).remove();
              that.vars.listType.append(listTypeItem);
              if (id) {
                that.updateTypeInput(id);
                // that.activeTypeItem(id);
              }
              that.getTypeItem();
            }
          }
        },
        error: function(xhr) {
          that.vars.listType.append('<li class="errorText">' + xhr.status + ' ' + xhr.statusText + '</li>');
        },
        complete: function() {
          that.vars.permission = true;
        }
      });
    },
    // updateAfterAdded: function(data) {
    //   var opts = this.options,
    //       cardTypeItem = opts.mode === 'table' ? '<tr><td data-type-id>#{{type-id}}</td><td data-type-name>#{{card-type}}</td><td><div class="btn-group"><button class="btn btn-warning dropdown-toggle" data-open-popup, data-target="modifiedType", data-set-pos="true", data-left-aligned="true">#{{action-text}}&nbsp;<span class="caret"></span></button></div></td></tr>' : '<li data-card-type-item data-type-id="#{{type-id}}"><a href="#" title="#{{card-type}}">#{{card-type}}</a></li>';

    //   if (opts.mode === 'table') {
    //     this.vars.listTypeTable.prepend(cardTypeItem.replace('#{{card-type}}', data.name).replace('#{{type-id}}', data.id).replace('#{{action-text}}', opts.actionText).replace(/#{{modified-text}}/g, opts.modifiedText).replace(/#{{delete-text}}/g, opts.deleteText));
    //     this.vars.listTypeTable.find('.dropdown-toggle:first')['open-popup']();
    //   } else {
    //     this.vars.listType.find('[data-card-type-item]').length ? this.vars.listType.find('[data-card-type-item]').first().before(cardTypeItem.replace(/#{{card-type}}/g, data.name).replace('#{{type-id}}', data.id)) : this.vars.listType.html(cardTypeItem.replace(/#{{card-type}}/g, data.name).replace('#{{type-id}}', data.id));
    //     this.getTypeItem();
    //   }
    // },
    // updateAfterModified: function(data) {
    //   var opts = this.options;

    //   if (opts.mode === 'table') {
    //     this.vars.listTypeTable.find(opts.dataTypeId).filter(function() {
    //       return $(this).text() === data.id;
    //     }).next(opts.dataTypeName).text(data.name);
    //   } else {
    //     this.vars.listType.find('[data-type-id=' + data.id + '] a').text(data.name);
    //   }
    // },
    deleteType: function(id) {
      var opts = this.options;

      if (opts.mode === 'table') {
        this.getListType($('[data-' + pluginName + ']').filter('[data-mode=search]').find('.card-type-input').val() || '');
      } else {
        this.vars.listType.find('[data-type-id=' + id + ']').remove();
        this.vars.listTypeTable.find(opts.dataTypeId).filter(function() {
          return $(this).text() === id;
        }).parent().remove();
        if (opts.mode === 'update') {
          if (this.vars.typeSelect.data().cardType && this.vars.typeSelect.data().cardType.id.toString() === id) {
            this.updateCardDetailType(opts.typeText);
            this.vars.typeSelect
              .val('')
              .removeData('card-type');
          }
        }
        this.getTypeItem();
      }
    },
    updateCardDetailType: function(text) {
      text ? $('[data-type-toggle]').text(text) : $('[data-type-toggle]').text(this.vars.typeSelect.val());
    },
    updateTypeSelection: function(id) {
      var opts = this.options,
          inputType = this.vars.typeSelect.filter(opts.typeSelectId);

      inputType.data('type-selection', {id: id, name: this.vars.listType.find('[data-type-id=' + id + '] a').text()});
    },
    updateTypeInput: function(id) {
      var opts = this.options,
          inputType = this.vars.typeSelect.filter(opts.typeSelectId);
          // inputData = inputType.data();

      // if (isCreate === -1) {
      //   inputType.data('card-type', {id: isCreate, name: this.vars.listType.find('[data-type-id=' + id + '] a').text()});
      //   if (inputData && inputData.cardType) {
      //     inputType.data('card-type', $.extend(inputType.data().cardType, {currentName: inputData.cardType.name}));
      //   }
      // } else {
      //   inputType.data('card-type', {id: id, name: this.vars.listType.find('[data-type-id=' + id + '] a').text()});
      // }
      inputType.data('card-type', {id: id, name: this.vars.listType.find('[data-type-id=' + id + '] a').text()});
    },
    activeTypeItem: function(id) {
      var opts = this.options;

      this.vars.listType.find(opts.dataCardTypeItem).removeClass(opts.activeClass);
      this.vars.listType.find('[data-type-id=' + id + ']').addClass(opts.activeClass);
      this.vars.typeSelect.val(this.vars.listType.find('[data-type-id=' + id + '] a').text());
    },
    getTypeItem: function() {
      var ele = this.element,
          opts = this.options;

      this.vars.typeItem = ele.find(opts.dataCardTypeItem + ' a');
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
    dataEditCard: '[data-edit-card]',
    dataListType: '[data-list-type]',
    dataCardTypeItem: '[data-card-type-item]',
    dataCreateModifield: '[data-create-modifield]',
    dataAccept: '[data-accept]',
    dataHideMessage: '[data-hide-message]',
    dataNotSelect: '[data-not-select]',
    dataTypeId: '[data-type-id]',
    dataTypeName: '[data-type-name]',
    dataUpdateType: '[data-update-type]',
    dataDeleteType: '[data-delete-type]',
    dataSearchBtn: '[data-search-btn]',
    dataModfiedType: '[data-modified-type]',
    typeSelectClass: '.card-type-input',
    dropdownToggleClass: '.dropdown-toggle',
    cardTypeModalId: '#card-type-modal',
    applyTypeModal: '#apply-card-type-modal',
    modifiedTypeModalId: '#modified-type-modal',
    deleteTypeModalId: '#delete-type-modal',
    updateCardTypeId: '#update-card-type',
    typeSelectId: '#typeSelect',
    deleteTypeModal: '#delete-type-modal',
    textErrorClass: '.text-errors',
    noresultClass: '.no-result',
    activeClass: 'active',
    hideClass: 'hide',
    triggerBefore: 20
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));