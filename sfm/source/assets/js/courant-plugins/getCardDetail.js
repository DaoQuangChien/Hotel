;(function($, window, undefined) {
  'use strict';

  var pluginName = 'get-detail';

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
        cardDetail: $(opts.dataCardDetail),
        get cardName() {
          return this.cardDetail.find(opts.dataDetailName);
        },
        get phaseName() {
          return this.cardDetail.find(opts.dataPhaseName);
        },
        get attachmentSection() {
          return this.cardDetail.find(opts.dataListAttachments);
        },
        get activitySection() {
          return this.cardDetail.find(opts.dataListActivities);
        }
      };

      ele.off('click.' + pluginName).on('click.' + pluginName, opts.dataContent, function() {
        $.ajax({
          type: opts.method,
          url: $(opts.getCardDetail).val(),
          dataType: 'json',
          data: {
            card_id: $(this).data().cardId
          },
          succes: function(result) {
            if (result.status) {
              that.vars.cardName.html();

            }
          }
        });
        that.vars.cardDetail.removeClass(opts.hideClass);
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
      }
    });
  };

  $.fn[pluginName].defaults = {
    method: 'GET',
    dataContent: '[data-content]',
    dataCardDetail: '[data-card-detail]',
    dataListActivities: '[data-list-activities]',
    dataListAttachments: '[data-list-attachments]',
    dataDetailName: '[data-detail-name]',
    dataPhaseName: '[data-phase-name]',
    dataAddDescription: '[data-add-description]',
    dataEditDescription: '[data-edit-description]',
    dataCardDescription: '[data-card-description]',
    getCardDetail: '#get-card-detail',
    hideClass: 'hide'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));