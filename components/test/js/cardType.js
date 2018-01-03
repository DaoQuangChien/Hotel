; (function($, window, undefined) {
  'use strict';

  var pluginName = 'card-type';

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
        typeSelect: ele.find(opts.typeSelectId),
        toggleBtn: ele.find(opts.dropdownToggleClass),
        createModifieldBtn: ele.find(opts.dataCreateModifield),
        listType: ele.find(opts.dataListType),
        typeItem: ele.find(opts.dataCardTypeItem + ' a')
      };

      this.vars.typeSelect.off('input.' + pluginName).on('input.' + pluginName, function() {
        var filterContent = $(this).val();

        if (!filterContent.length) {
          that.vars.createModifieldBtn.show();
        } else {
          that.vars.createModifieldBtn.hide();
        }
        that.vars.typeItem.parent().show();
        that.vars.typeItem.filter(function(index, typeItem) {
          return $(typeItem).text().toLowerCase().indexOf(filterContent) === -1;
        }).parent().hide();
      });
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
    typeSelectId: '#typeSelect',
    dropdownToggleClass: '.dropdown-toggle'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));