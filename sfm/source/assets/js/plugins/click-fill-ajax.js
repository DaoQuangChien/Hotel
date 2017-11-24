/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'click-fill-ajax',
     // optTag = '<option value="{value}">{text}</option>',
      activeClass = 'active',
      Event = {
        CLICK: 'click.' + pluginName
      },
      totalRow = 10,
      hiddenClass = 'hidden',
      maxPage = 5,
     // centerPoint = Math.round(maxPage / 2),
      pagingBlockSel = '.pagination';

  // var getOptTag = function(data) {
  //   var listOpt = '';
  //   for(var i = 0, l = data.length; i < l; i++) {
  //     listOpt += optTag.replace('{value}', data[i].value).replace('{text}', data[i].text);
  //   }
  //   return listOpt;
  // };
  var getPostData = function(el, that) {
    var listVal = '',
        dataVal = that.element.data('value');
    if(dataVal) {
      return dataVal === 'index=first' ? 'index=1' : dataVal;
    }
    for (var i = 0, l = el.val().length; i < l; i++) {
      listVal += el.val()[i] + (i === l - 1 ? '' : ',');
    }
    return el.attr('name') + '=' + listVal;
  };
  var updateHTMl = function(that, listRow) {
    var tbody = that.vars.fillTarEle.find('tbody'),
        numberHiddenRow = totalRow - listRow.length;
       // listTr = [];
    for(var i = 0, l = listRow.length; i < l; i++) {
      var tempTr = tbody.find('tr').eq(i),
          tempData = listRow[i];
      for(var j = 0, len = tempData.length; j < len; j++) {
        tempTr.removeClass(hiddenClass).find('td').eq(j).html(tempData[j]);
      }
    }
    for(var k = 0; k <= numberHiddenRow; k++) {
      tbody.find('tr').eq(totalRow - k) .addClass(hiddenClass);
    }
  };
  var validateNumberOfPage = function(listEl, data) {
    listEl.removeClass(hiddenClass);
    for(var i = data.length, l = maxPage; i < l; i++) {
      listEl.filter(':nth-child(' + (i + 2) + ')').addClass(hiddenClass);
    }
  };
  var successCallback = function(data, that) {
    var opts = that.options,
        el = that.element,
       // siblingEl = el.siblings(),
        allPage = el.closest(pagingBlockSel).find('li'),
        listPage = allPage.not(':first-child').not(':last-child'),
        firstBtn = allPage.filter('[data-value="index=first"]'),
        lastBtn = allPage.filter('[data-value="index=last"]');

    if(opts.passUpdateHtml) {
     return;
    }

    if(opts.pagingAjax) {
      validateNumberOfPage(listPage, data.listPages);
      firstBtn.removeClass(hiddenClass);
      lastBtn.removeClass(hiddenClass);
      allPage.removeClass(activeClass);
      for(var i = 0, l = data.listPages.length; i < l; i++) {
        listPage.filter(':nth-child(' + (i + 2) + ')').data('value', 'index=' + data.listPages[i]).find('a').html(data.listPages[i]);
      }
      listPage.filter(':nth-child(' + (data.idx + 1)+ ')').addClass(activeClass);
      switch(opts.value) {
        case 'index=first':
          el.addClass(hiddenClass).next().addClass(activeClass);
          break;
        case 'index=last':
          el.addClass(hiddenClass).prev().addClass(activeClass);
          break;
        default:
          if(data.idx === 1) {
            firstBtn.addClass(hiddenClass);
          } else if(data.isLastPage) {
            lastBtn.addClass(hiddenClass);
          }
      }
    }
    updateHTMl(that, data.lisRow);
  };

  var handlerClickEvent = function(that) {
    var getValTarEle = that.vars.getValTarEle;
    if(!getValTarEle.val() && !that.options.passValidate) {
      return;
    }
    if(that.element.hasClass(activeClass)) {
      return;
    }
    Site.getDataAjaxDefault({
     postData: getPostData(getValTarEle, that),
      url: that.options.url,
      successHandler: function(data) {
        successCallback(data, that);
      }});
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
          //opts = that.options;

      this.vars = {
        getValTarEle: $(this.options.getValueTarget),
        fillTarEle: $(this.options.fillAjaxTarget)
      };

      this.element.off(Event.CLICK).on(Event.CLICK, function() {
        handlerClickEvent(that);
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
    url: '',
    fillAjaxTarget: '',
    getValueTarget: '',
    passValidate: '',
    value: '',
    passUpdateHtml: ''
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
