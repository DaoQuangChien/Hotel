/**
 *  @name auto-complete
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

/*Jshint validation*/
/*Jslint validation predefine window*/

(function ($, window) {
  'use strict';

  var pluginName = 'auto-complete',
     // doc = $(document),
      win = $(window),
      downKey = 40,
      upKey = 38,
      enterKey = 13,
     // arrayKeyCode = [downKey, upKey],
      itemSelected,
  showPopupCreate=function(){},
  filter = function(that, value) {
    var resultLen = 0;
    that.optionsList = $('[data-value]', that.listItems);
    // read newest list
    if(value !== '' && typeof value !== typeof undefined) {
      var filterOptions = [];
      var l = that.optionsList.length;
      value = value.toLowerCase();
      while(l--) {
        if(that.optionsList.eq(l).attr('data-show-popup')) {
          break;
        }
        if(that.optionsList.eq(l).text().toLowerCase().indexOf(value) >= 0) {
          filterOptions.push(that.optionsList[l]);
          // that.optionsList.eq(l).show();
        }
      }
      that.optionsList.hide();
      $(filterOptions).show();
      resultLen = filterOptions.length;
      // that.optionsList.each(function() {
      // });
    } else {
      that.optionsList.show();
      resultLen = that.optionsList.length;
    }
    // that.optionsList.show();
    $('.no-result', that.listItems).remove();
    if (resultLen === 0) {
      that.listItems.append('<li class="no-result">' + l10n.text.notFound + '</li>');
    }
  },
  creatNewItem = function(el, val) {
    var name = 'new-' + el.find('[data-hidden-value]').attr('name'),
        input = '<input type="hidden" value="' + val + '" name="' + name + '">',
        form = el.closest('form');

    if(form.find('[name="' + name + '"]').length) {
      form.find('[name="' + name + '"]').val(val);
      return;
    }
    form.append(input);
  },
  selectOptionEnter = function (el) {
    var aSelected = el.find('[data-list-items] > li.selected > a').eq(0),
        input = el.find('[data-input-control]'),
        hiddenEl = el.find('[data-hidden-value]'),
        fill = function () {
          el.removeClass('open');
          if(el.data('not-match')) {
            hiddenEl.val(aSelected.attr('data-value') || input.val());
            creatNewItem(el, aSelected.attr('data-value') ? 'false' : 'true');
          }else {
            hiddenEl.val(aSelected.attr('data-value'));
            input.val(aSelected.text());
          }
        };

    if ($('[data-show-popup]', el).length) {
      if (aSelected.parent().is(':first-child')) {
        showPopupCreate(aSelected, el);
      } else {
        fill();
      }
    } else {
      fill();
    }
  },
  hoverOption = function (element, keyCode, input, listItems) {
    var nextItem;
    if (keyCode === downKey) {
      if (!$('li.selected', listItems).length){
        itemSelected = $('li', listItems).filter(function(){return $(this).children().is(':visible');}).eq(0).addClass('selected');
      } else {
        if ($('li.selected', listItems).is(':last-child')) {
          nextItem = $('li:first', listItems);
        } else {
          nextItem = $('li.selected', listItems).nextAll().filter(function(){return $(this).children().is(':visible');}).eq(0);
        }
        $('li.selected', listItems).removeClass('selected');
        nextItem.focus().addClass('selected');
      }
    } else if (keyCode === upKey) {
      if (!$('li.selected', listItems).length){
        itemSelected = $('li', listItems).filter(function(){return $(this).children().is(':visible');}).last().addClass('selected');
      } else {
        if ($('li.selected', listItems).is(':first-child')) {
          nextItem = $('li:last', listItems);
        } else {
          nextItem = $('li.selected', listItems).prevAll().filter(function(){return $(this).children().is(':visible');}).eq(0);
        }
        $('li.selected', listItems).removeClass('selected');
        nextItem.focus().addClass('selected');
      }
    }
  },
  updateHiddenValue = function(val){
    this.inputHidden.val(val);
  },
  resetValue = function() {
    this.inputControl.val('');
    updateHiddenValue.call(this, '');
    this.element.parents('.control-group').removeClass('error');
  },
  selectOption = function(plugin, el){
    updateHiddenValue.call(plugin, el.data('value'));
    plugin.inputControl.val(el.text()).trigger('blur');
    plugin.element.removeClass('open');
  },
  bindingData = function(item){
    $('.signature-input').val($(item).text());
  },
  updateSuggestData = function(data) {
    var that = this;
    this.listItems.find('li').remove();
    $.each(data, function(index, el) {
      var temp = that.options.itemHTML.replace('{value}', el.value);
      temp = temp.replace('{text}', el.text);
      that.listItems.append(temp);
    });
    if (data.length > 0) {
      var listItems = this.listItems;
      itemSelected = $('li', listItems).filter(function() {
        return $(this).children().is(':visible');
      }).last().addClass('selected');
    }
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.dataElement = 'data-' + pluginName;
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var that = this;
      var signatureElmId = 'drop-1';
      this.inputControl = $(this.options.inputControlSelecter, this.element);
      this.inputHidden = $(this.options.inputHiddenSelecter, this.element);
      this.listItems = $(this.options.listItemsSelecter, this.element);
      this.getValue = $(this.options.getValueSelecter, this.element);
      this.button = $(this.options.buttonSelecter, this.element);
      this.listSelect = $(this.options.listSelect, this.element);
      this.popupShow = $(this.options.popupShow, this.element);
      this.optionsList = $('[data-value]', that.listItems);
      this.keyTimeout = null;

      $(document).off('click.doc' + pluginName).on('click.doc' + pluginName, function(e){
        var target = $(e.target);
        if(typeof(target.attr('data-' + pluginName)) === 'undefined'){
          if(!target.closest('[data-' + pluginName + ']').length){
            $('[data-' + pluginName + ']').removeClass('open');
          }
        }
        if(typeof(target.attr('data-email-' + pluginName)) === 'undefined'){
          if(!target.closest('[data-email-' + pluginName + ']').length){
            $('[data-email-' + pluginName + ']').removeClass('open');
          }
        }
      });

      this.inputControl.off('keyup.' + pluginName).on('keyup.' + pluginName, function(e){
        var thatEl = $(e.target), inputEl = $(this) ;
        creatNewItem(that.element, false);

        if (that.options.selectByKey && (e.keyCode === downKey || e.keyCode === upKey)) {
          hoverOption(that.element, e.keyCode, thatEl, that.listItems);
          $(this).focus();
        }
        if(e.keyCode !== enterKey) {
            if (that.inputHidden.val() !== '') {
              updateHiddenValue.call(that, '');
            }
            that.keyTimeout && clearTimeout(that.keyTimeout);
            that.keyTimeout = setTimeout(function() {
              that.element.addClass('open');
              filter(that, inputEl.val());
            }, 50);
          }
      }).off('blur.' + pluginName).on('blur.' + pluginName, function() {
        if(that.element.data('not-match') ) {
          that.inputHidden.val(that.inputControl.val());
          creatNewItem(that.element, true);
        }
      });

      // this.inputControl.off('focus.' + pluginName).on('focus.' + pluginName, function(){
      //   if($(this).val() > 0) {
      //     filter(that, this.value);
      //     $('li', that.listItems).removeClass('selected');
      //     $('[data-' + pluginName + ']').removeClass('open');
      //     //that.element.addClass('open');
      //   }
      // });
      this.inputControl.off('focusout.' + pluginName).on('focusout.' + pluginName, function() {
        that.keyTimeout && clearTimeout(that.keyTimeout);
        that.keyTimeout = setTimeout(function() {
          $('[data-' + pluginName + ']').removeClass('open');
        }, 200);
      });
      this.inputControl.off('click.' + pluginName).on('click.' + pluginName , function() {
        // that.inputHidden.trigger('click');
        filter(that, '');
        that.keyTimeout && clearTimeout(that.keyTimeout);
        that.keyTimeout = setTimeout(function() {
          $('[data-' + pluginName + ']').not(that.element).removeClass('open');
          that.element.addClass('open');
        }, 200);
      });

      this.button.off('click.' + pluginName).on('click.' + pluginName, function(e){
        e.preventDefault();
        filter(that, '');
        $('[data-' + pluginName + ']').not(that.element).removeClass('open');
        if (that.element.hasClass('open')) {
          setTimeout(function (){
            that.element.removeClass('open');
          }, 50);
        } else {
          setTimeout(function (){
            that.element.addClass('open');
          }, 50);
        }
      });

      this.listItems.off('click.'+ pluginName, this.options.getValueSelecter).on('click.'+ pluginName, this.options.getValueSelecter, function(e){
        e.preventDefault();
        creatNewItem(that.element, false);
        var thatEl = $(this),
            show = function () {
              selectOption(that, thatEl);
              if(that.element.attr('id') === signatureElmId){
                bindingData(thatEl);
              }
            };

        if (that.popupShow.length) {
          if (thatEl.parent().index() !== 0) {
            show();
          } else {
            showPopupCreate(thatEl, that.element);
          }
        } else {
          show();
        }
        // that.inputHidden.trigger('change');
      });

    },
    destroy: function () {
      $.removeData(this.element[0], pluginName);
    },
    resetData: function() {
      resetValue.call(this);
    },
    updateSuggestData: function(data) {
      resetValue.call(this);
      updateSuggestData.call(this, data);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
        var instance = $.data(this, pluginName);
        if (!instance) {
          $.data(this, pluginName, new Plugin(this, options));
        } else if (instance[options]) {
          instance[options](params);
        }
    });
  };

  $.fn[pluginName].defaults = {
    inputControlSelecter: '[data-input-control]',
    inputHiddenSelecter: '[data-hidden-value]',
    listItemsSelecter: '[data-list-items]',
    getValueSelecter: '[data-value]',
    listSelect: '[data-list-select]',
    popupShow: '[data-show-popup]',
    buttonSelecter: '[data-button]',
    selectByKey: true,
    notFoundText: 'Not found',
    itemHTML: '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" data-value="{value}">{text}</a></li>'
  };

  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();

    $('[data-email-' + pluginName + ']')[pluginName]({
      inputControlSelecter: '.multiple-emails-input',
      notFoundText: false,
      selectByKey: false
    });
    win.bind('keydown', function(event){
      if(event.keyCode === enterKey && $('[data-auto-complete]').filter('.open').length) {
        event.preventDefault();
        selectOptionEnter($('[data-auto-complete]').filter('.open').eq(0));
      }
    });
    // doc.ready(function() {
      // win.bind('keydown', function(event){
      //   if(event.keyCode === enterKey && $('[data-email-auto-complete]').filter('.open').length) {
      //     event.preventDefault();
      //     selectOptionEnter($('[data-email-auto-complete]').filter('.open').eq(0));
      //   }
      // });
    // });
  });

}(window.jQuery, window));
