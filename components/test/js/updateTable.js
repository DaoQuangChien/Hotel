;(function($, window, undefined) {
  'use strict';

  var pluginName = 'update-table';

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var ele = this.element,
          opts = this.options,
          eleInput = ele.find('input'),
          eleSubmit = ele.find('button'),
          is_Click = true;

      eleSubmit.off('click.' + pluginName).on('click.' + pluginName, function() {
        if (eleInput.val().length === 0) {
          eleInput.focus();
          return false;
        }
        if (!is_Click) {
          return false;
        }

        is_Click = false;
        $.ajax({
          type: opts.method,
          url: $(opts.updateTableLink).val(),
          dataType: 'json',
          data: {
            name: eleInput.val(),
            id: ele.data().tableFrom,
            company_id: ele.data().companyFrom
          },
          success: function(data) {
            if (data.status) {
              $('[data-board-id="' + ele.data().tableFrom + '"]').attr('title', eleInput.val()).find('h5.title-card').text(eleInput.val())['limit-word']('updateText');
              ele.addClass(opts.hideClass);
            }else {
              eleInput.after('<p class="errorText">' + ele.data().errorText + '</p>');
              eleInput.next().fadeOut(opts.fadeOutTime, function() {
                $(this).remove();
                ele.addClass(opts.hideClass);
              });
            }
          },
          error: function(xhr) {
            eleInput.after('<p class="errorText">An error occured: ' + xhr.status + ' ' + xhr.statusText + '</p>');
            eleInput.next().fadeOut(opts.fadeOutTime, function() {
              $(this).remove();
            });
          },
          complete: function() {
            is_Click = true;
          }
        });
      });
      eleInput.off('keydown.' + pluginName).on('keydown.' + pluginName, function(e) {
        if (e.keyCode === 13) {
          eleSubmit.click();
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
    method: 'GET',
    updateTableLink: '#update-table-link',
    hideClass: 'hide',
    fadeOutTime: 1000
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));