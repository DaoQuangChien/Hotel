; (function ($, window, undefined) {
  'use strict';

  var pluginName = 'download-file';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var ele = this.element;
      
      ele.off('click.' + pluginName).on('click.' + pluginName, function(e) {
        e.preventDefault();
        window.location.href = $(this).find('img')[0].src;
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
    method: 'GET',
    createCardLink: '#create-card-link',
    hideClass: 'hide',
    fadeOutTime: 1000,
    dataInput: '[data-input]',
    dataAccept: '[data-accept]',
    dataParent: 'phase',
    defaultPriority: 1,
    descriptionTitle: 'This card has a description',
    boardId: '#board-id'
  };

  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));