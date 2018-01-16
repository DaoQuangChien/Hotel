; (function ($, window, undefined) {
  'use strict';

  var pluginName = 'modified-card-type';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var that = this,
          ele = this.element,
          opts = this.options;
      this.vars = {
        typeInput: ele.find(opts.modifiedCardTypeId),
        modifiedBtn: ele.find(opts.dataAccept)
      };
      
      this.vars.modifiedBtn.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (!that.vars.typeInput.val().trim().length) {
          that.vars.typeInput.focus();
        } else {
          var cardType = that.vars.typeInput.data().cardType,
              applyTypeModal = $(opts.dataCardType).filter(function () {
                return $(this).data().activeItem;
              }),
              // currentCardType = applyTypeModal.find('#typeSelect').data(),
              method = cardType ? opts.methodUpdate : opts.methodCreate,
              data = cardType ? {type_id: cardType.id, name: that.vars.typeInput.val()} : {name: that.vars.typeInput.val()};

          $.ajax({
            type: method,
            url: $(opts.updateCardTypeId).val(),
            dataType: 'json',
            cache: false,
            data: data,
            success: function(result) {
              if (result.status) {
                result.data.id ?
                  $(opts.dataCardType)['card-type']('getListType', '', result.data.id.toString())
                :
                  $(opts.dataCardType)['card-type']('getListType', '');
                if (cardType) {
                  // $(opts.dataCardType)['card-type']('updateAfterModified', {id: cardType.id, name: that.vars.typeInput.val()});
                  $(opts.dataCardType).filter('[data-mode=search]').find('.card-type-input').val('');
                  applyTypeModal['card-type']('updateTypeInput', cardType.id);
                  // if (currentCardType && currentCardType.cardType) {
                  //   currentCardType.cardType.id.toString() === cardType.id.toString() ?
                  //   applyTypeModal
                  //     ['card-type']('updateTypeInput', cardType.id)
                  //     ['card-type']('updateTypeSelection', cardType.id)
                  //     ['card-type']('activeTypeItem', cardType.id)
                  //     ['card-type']('updateCardDetailType')
                  //   : null;
                  // }
                } else {
                  // $(opts.dataCardType)['card-type']('updateAfterAdded', {id: result.data.id, name: that.vars.typeInput.val()});
                  // applyTypeModal
                    // ['card-type']('updateTypeInput', result.data.id)
                    // ['card-type']('updateTypeSelection', result.data.id)
                    // ['card-type']('activeTypeItem', result.data.id);
                  applyTypeModal['card-type']('updateTypeInput', result.data.id);
                  ele.data('add-new', true);
                }
                that.vars.typeInput.val('');
                ele.modal('hide');
              }
            }
          });
        }
      });
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
    dataAccept: '[data-accept]',
    dataCardType: '[data-card-type]',
    modifiedCardTypeId: '#modified-card-type',
    // updateCardTypeId: '#add-card-type'
    updateCardTypeId: '#update-card-type'
  };

  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));