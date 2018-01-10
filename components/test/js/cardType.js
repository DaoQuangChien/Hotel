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
        noResult: ele.find(opts.noresultClass),
        hideMsgBtn: ele.find(opts.dataHideMessage),
        limit: opts.limit,
        offset: 0
      };

      this.getListType();
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
            that.vars.typeSelect.val(that.vars.typeSelect.data().cardType.name);
          }
          that.vars.notSelectMsg.addClass(opts.hideClass);
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
            $(this).find('#modified-card-type').removeData('card-type');
            that.vars.cardTypeModal
              .data('not-show-apply', false)
              .modal('show');
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
                  }
                }
              });
            }
          }
        });
      }
      if (opts.mode === 'table') {
        this.vars.listTypeTable
          .off('click.' + pluginName, opts.dataUpdateType).on('click.' + pluginName, opts.dataUpdateType, function() {
            var currentCardType = $(this).parents('tr');

            $(opts.modifiedTypeModalId).modal('show');
            $(opts.modifiedTypeModalId).find('#modified-card-type')
              .val(currentCardType.find(opts.dataTypeName).text())
              .data('card-type', {id: currentCardType.find(opts.dataTypeId).text(), name: currentCardType.find(opts.dataTypeName).text()});
          })
          .off('click.' + pluginName, opts.dataDeleteType).on('click.' + pluginName, opts.dataDeleteType, function() {
            var currentCardType = $(this).parents('tr');

            $(opts.deleteTypeModalId)
              .data('card-type', {id: currentCardType.find(opts.dataTypeId).text(), name: currentCardType.find(opts.dataTypeName).text()})
              .modal('show');
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
    },
    getListType: function() {
      var that = this,
          opts = this.options,
          cardTypeItem = opts.mode === 'table' ? '<tr><td data-type-id>#{{type-id}}</td><td data-type-name>#{{card-type}}</td><td><div class="btn-group"><button data-toggle="dropdown" class="btn btn-warning dropdown-toggle">#{{action-text}}&nbsp;<span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#" title="#{{modified-text}}" data-update-type>#{{modified-text}}</a></li><li><a href="#" title="#{{delete-text}}" data-delete-type>#{{delete-text}}</a></li></ul></div></td></tr>' : '<li data-card-type-item data-type-id="#{{type-id}}"><a href="#" title="#{{card-type}}">#{{card-type}}</a></li>';

      $.ajax({
        type: opts.method,
        url: $(opts.updateCardTypeId).val(),
        dataType: 'json',
        cache: false,
        data: {
          limit: that.vars.limit,
          offset: that.vars.offset
        },
        success: function(result) {
          if (result.status) {
            var listTypeItem = '';
  
            if (opts.mode === 'table') {
              result.data.forEach(function(type) {
                listTypeItem += cardTypeItem.replace('#{{card-type}}', type.name).replace('#{{type-id}}', type.id).replace('#{{action-text}}', opts.actionText).replace(/#{{modified-text}}/g, opts.modifiedText).replace(/#{{delete-text}}/g, opts.deleteText);
              });
              that.vars.listTypeTable.append(listTypeItem);
            } else {
              result.data.forEach(function(type) {
                listTypeItem += cardTypeItem.replace(/#{{card-type}}/g, type.name).replace('#{{type-id}}', type.id);
              });
              that.vars.listType.append(listTypeItem);
              // that.updateTypeInput(id);
              that.getTypeItem();
            }
          }
        },
        error: function(xhr) {
          that.vars.listType.append('<li class="errorText">' + xhr.status + ' ' + xhr.statusText + '</li>');
        }
      });
    },
    updateAfterAdded: function(data) {
      var opts = this.options,
          cardTypeItem = opts.mode === 'table' ? '<tr><td data-type-id>#{{type-id}}</td><td data-type-name>#{{card-type}}</td><td><div class="btn-group"><button data-toggle="dropdown" class="btn btn-warning dropdown-toggle">#{{action-text}}&nbsp;<span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#" title="#{{modified-text}}" data-update-type>#{{modified-text}}</a></li><li><a href="#" title="#{{delete-text}}" data-delete-type>#{{delete-text}}</a></li></ul></div></td></tr>' : '<li data-card-type-item data-type-id="#{{type-id}}"><a href="#" title="#{{card-type}}">#{{card-type}}</a></li>';

      if (opts.mode === 'table') {
        this.vars.listTypeTable.prepend(cardTypeItem.replace('#{{card-type}}', data.name).replace('#{{type-id}}', data.id).replace('#{{action-text}}', opts.actionText).replace(/#{{modified-text}}/g, opts.modifiedText).replace(/#{{delete-text}}/g, opts.deleteText));
      } else {
        this.vars.listType.find('[data-card-type-item]').first().before(cardTypeItem.replace(/#{{card-type}}/g, data.name).replace('#{{type-id}}', data.id));
        this.getTypeItem();
      }
    },
    updateAfterModified: function(data) {
      var opts = this.options;

      if (opts.mode === 'table') {
        this.vars.listTypeTable.find(opts.dataTypeId).filter(function() {
          return $(this).text() === data.id;
        }).next(opts.dataTypeName).text(data.name);
      } else {
        this.vars.listType.find('[data-type-id=' + data.id + '] a').text(data.name);
      }
    },
    deleteType: function(id) {
      var opts = this.options;

      this.vars.listType.find('[data-type-id=' + id + ']').remove();
      this.vars.listTypeTable.find(opts.dataTypeId).filter(function() {
        return $(this).text() === id;
      }).parent().remove();
      if (opts.mode === 'update') {
        if (this.vars.typeSelect.data().cardType.id.toString() === id) {
          this.updateCardDetailType(opts.typeText);
          this.vars.typeSelect
            .val('')
            .removeData('card-type');
        }
      }
      this.getTypeItem();
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
    hideClass: 'hide'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));