; (function($, window, undefined) {
  'use strict';

  var pluginName = 'card-type',
      cardTypeItem = '<li class="#{{active}}" data-card-type-item data-type-id="#{{type-id}}"><a href="#" title="#{{card-type}}">#{{card-type}}</a></li>';

  var filterType = function(filterContent) {
    if (!filterContent.length) {
      this.vars.createModifieldBtn.show();
    } else {
      this.vars.createModifieldBtn.hide();
    }
    this.vars.typeItem.parent().show();
    this.vars.typeItem.filter(function (index, typeItem) {
      return $(typeItem).text().toLowerCase().indexOf(filterContent) === -1;
    }).parent().hide();
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
        typeItem: ele.find(opts.dataCardTypeItem + ' a'),
        cardTypeModal: $(opts.cardTypeModalId),
        modifiedTypeModal: $(opts.modifiedTypeModalId)
      };

      this.vars.typeSelect        
        .off('focus.' + pluginName).on('focus.' + pluginName, function() {
          that.vars.listType.removeClass(opts.hideClass);
          filterType.call(that, $(this).val().toLowerCase());
        })
        .off('input.' + pluginName).on('input.' + pluginName, function() {
          filterType.call(that, $(this).val().toLowerCase());
        });
      this.vars.listType.off('click.' + pluginName, opts.dataCardTypeItem).on('click.' + pluginName, opts.dataCardTypeItem, function (e) {
        e.preventDefault();
        that.vars.typeSelect.val($(this).text());
        that.vars.listType.addClass(opts.hideClass);
      });

      this.vars.createModifieldBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        $(this).parents('[data-target-popup="cardType"]').addClass(opts.hideClass);
      });
      this.vars.toggleBtn.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        !that.vars.listType.is(':visible') ? that.vars.listType.removeClass(opts.hideClass) : null;
        that.vars.listType.find('li').show();
      });
      this.vars.modifiedTypeModal
        .off('show.bs.modal.' + pluginName).on('show.bs.modal.' + pluginName, function() {
          that.vars.cardTypeModal.modal('hide');
        })
        .off('hide.bs.modal.' + pluginName).on('hide.bs.modal.' + pluginName, function() {
          that.vars.cardTypeModal.modal('show');
        });
      ele.off('focusout.' + pluginName).on('focusout.' + pluginName, function (e) {
        if (e.relatedTarget === null) {
          that.vars.listType.addClass(opts.hideClass);
        }
      });
    },
    getListType: function(id) {
      var that = this,
          opts = this.options;

      $.ajax({
        type: opts.method,
        url: $(opts.updateCardTypeId).val(),
        dataType: 'json',
        cache: false,
        data: {
          
        },
        success: function(result) {
          if (result.status) {
            var listTypeItem = '';
  
            result.data.forEach(function(type) {
              listTypeItem += cardTypeItem.replace(/#{{card-type}}/g, type.name).replace('#{{type-id}}', type.id).replace('#{{active}}', function() {
                return (id === type.id && opts.activeItem) ? opts.activeClass : '';
              });
            });
            that.vars.listType.append(listTypeItem);
            that.updateTypeInput(id);
            that.getTypeItem();
          }
        },
        error: function(xhr) {
          that.vars.listType.append('<li class="errorText">' + xhr.status + ' ' + xhr.statusText + '</li>');
        }
      });
    },
    updateTypeInput: function(id) {
      var opts = this.options,
          inputType = this.vars.typeSelect.filter(opts.typeSelectId);

      inputType.data('card-type', this.vars.listType.find('[data-type-id=' + id + '] a').text());
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
    typeSelectClass: '.card-type-input',
    dropdownToggleClass: '.dropdown-toggle',
    cardTypeModalId: '#card-type-modal',
    modifiedTypeModalId: '#modified-type-modal',
    updateCardTypeId: '#update-card-type',
    typeSelectId: '#typeSelect',
    activeClass: 'active',
    hideClass: 'hide'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));