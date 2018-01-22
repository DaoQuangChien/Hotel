; (function ($, window, undefined) {
  'use strict';

  var pluginName = 'assign-user';

  var filterResult = function (filterContent) {
    var searchResult;

    this.vars.noResultWarning.hide();
    this.vars.selectItem.parent().show();
    searchResult = this.vars.selectItem.filter(function (index, selectItem) {
      return $(selectItem).text().toLowerCase().indexOf(filterContent) === -1;
    });
    if (searchResult.length === this.vars.selectItem.length && filterContent.length) {
      this.vars.noResultWarning.show();
    }
    searchResult.parent().hide();
  };

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
        autocompleteInput: ele.find(opts.dataInput),
        submitBtn: ele.find(opts.dataAccept),
        listItem: ele.find(opts.dataListItem),
        toggleBtn: ele.find(opts.dropdownToggleClass),
        noResultWarning: ele.find(opts.noResultClass)
      };

      this.getItemEle();
      this.vars.autocompleteInput
        .off('focus.' + pluginName).on('focus.' + pluginName, function() {
          that.vars.listItem.removeClass(opts.hideClass);
          filterResult.call(that, $(this).val().toLowerCase());
        })
        .off('input.' + pluginName).on('input.' + pluginName, function() {
          filterResult.call(that, $(this).val().toLowerCase());
        });
      this.vars.listItem.off('click.' + pluginName, opts.dataItem).on('click.' + pluginName, opts.dataItem, function(e) {
        e.preventDefault();
        that.vars.autocompleteInput.val($(this).find('a').text());
        that.vars.listItem.addClass(opts.hideClass);
      });
      this.vars.toggleBtn.off('click.' + pluginName).on('click.' + pluginName, function (e) {
        e.preventDefault();
        !that.vars.listItem.is(':visible') ? that.vars.listItem.removeClass(opts.hideClass) : null;
        that.vars.listItem.find('li').show();
        that.vars.listItem.find('li.no-result').hide();
      });
      ele.off('focusout.' + pluginName).on('focusout.' + pluginName, function (e) {
        if (e.relatedTarget === null || !$(e.relatedTarget).parents('[data-assign-user]').is($(e.currentTarget))) {
          that.vars.listItem.addClass(opts.hideClass);
        }
      });
    },
    getItemEle: function() {
      var opts = this.options;

      this.vars.selectItem = this.vars.listItem.find(opts.dataItem + ' a');
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
    dataInput: '[data-input]',
    dataAccept: '[data-accept]',
    dataListItem: '[data-list-item]',
    dataItem: '[data-item]',
    hideClass: 'hide',
    dropdownToggleClass: '.dropdown-toggle',
    noResultClass: '.no-result'
  };

  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));