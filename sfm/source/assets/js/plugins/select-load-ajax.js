
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
  var pluginName = 'select-load-ajax',
      OPT_TAG = '<option value={value} {selected}>{text}</option>',
      inputTag = '<input class="form-control" readonly value="{text}">',
      replacement = '{text}',
      tdTag = '<td>' + inputTag + '</td>',
      bgWar = 'glyphicon glyphicon-ok',
      nodataClass = 'no-data',
      numberOfPassage = 10,
      //labelBlockSel = '.highcharts-data-labels',
      //gpsData = 'gps',
      confirmPopupSel = '#confirm-change-popup',
      messageContainerSel = '.modal-title',
      confirmBtnSel = '[data-confirm-to-load-ajax]',
      body = $('body'),
      doc = $(document),
      editorClass='editor',
      win = $(window),
      // deleteIcon = '<a href="#" class="multiple-emails-close" title="Supprimer"><span class="glyphicon glyphicon-remove"></span></a>',
      // deleteIconSel = '.multiple-emails-close',
      confirmPopupHtml = '<div id="confirm-change-popup" data-address-modal="" class="modal fade">' +
        '<div class="modal-dialog">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
              '<h4 class="modal-title">Position de ce temps</h4>' +
            '</div>' +
            '<div class="modal-body"><a data-confirm-to-load-ajax="true" href="javascript:;" title="OK" class="btn btn-success" data-dismiss="modal">OK</a><a data-dismiss="modal" href="javascript:;" class="btn btn-danger margin-left-1">Amuler</a></div>',
      Event = {
        CHANGE: 'change.' + pluginName,
        CLICK: 'click.' + pluginName,
        MODAL_HIDDEN: 'hidden.bs.modal'
      };

  var callBackForInput = function(that, data) {
      if(!$.isArray(that.options.target.input)) {
        for (var k in data) {
          $(that.options.target.input).find('[name=' + k +']').val(data[k]);
        }
      } else {
        for (var i = 0, len = that.options.target.input.length; i < len; i++) {
          //select = that.options.target[i].input;
          for (var j in data) {
            var targetInp = $(that.options.target.input[i]).find('[name=' + j +']');
            targetInp.val(data[j]);
            if(targetInp.hasClass(editorClass) && tinyMCE.activeEditor) {
              var idTargetInp = targetInp.attr('id');
              for(var e=0; e < tinyMCE.editors.length; e++){
                if(tinyMCE.editors[e].id === idTargetInp) {
                  tinyMCE.editors[e].setContent(data[j]);
                }
              }
            }
            if(targetInp.data('select2Email') === true) {
              // init email value
              var emailInputContainer = targetInp.next('.multiple-emails-container'),
                emailList = emailInputContainer.find('.multiple-emails-ul').find('.multiple-emails-email'),
                inputEmail = targetInp.closest('.control-group').find('.multiple-emails-input'),
                timerAjax = null;
              emailList.remove();
              emailInputContainer.addClass('initing-ajax');
              emailInputContainer.trigger('click');
              clearTimeout(timerAjax);
              timerAjax = setTimeout(function() {
                inputEmail.trigger('blur');
              }, 20);
            }
          }
        }
      }
  };
  var initPopup = function() {
    if(!$(confirmPopupSel).length) {
      body.append(confirmPopupHtml);
    }
    $(confirmPopupSel).modal('show');
  };
  var changeMess = function(that, mess) {
    $(confirmPopupSel).find(messageContainerSel).html(mess);
  };
  var onCancelHandler = function(that) {
    var el = that.element;
    if(el.vars.canLoadAjax) {
      return;
    }
    if(el.vars.oldValue) {
      el.find('option').filter('[value=' + (el.vars.oldValue) + ']').prop('selected', true);
    } else {
      el.find('option').eq(0).prop('selected', true);
    }
  };
  var callBackForTable = function(that, data) {
    var targetEle =  $(that.options.target.table),
        listTr = '',
        totalTime = 0,
        listName = [],
        tbody = targetEle.find('tbody'),
        tfoot = targetEle.find('tfoot');

    for(var i = 0, len = data.length; i < len; i++) {
      totalTime += Site.timeToSec(data[i].duration);
      listName.push(data[i].name);
    }
    for(var j = 0, length = listName.length; j < length; j ++) {
      listTr += '<tr>' + tdTag.replace(replacement, listName[j]) + tdTag.replace(replacement, data[j].duration) + tdTag.replace(replacement, data[j].duration === '00:00:00' ? '0%' : ((Site.timeToSec(data[j].duration) / totalTime * 100).toFixed(2).replace(/[0]$/g, '') + '%')) +'</tr>';
    }
    if(data.length) {
      targetEle.removeClass(nodataClass);
    }
    tbody.find('tr').remove().end().append(listTr);
    tfoot.find('tr').find('td:nth-child(2)').find('input').val(Site.convertTime(totalTime) === '00:00:00' ? '' : Site.convertTime(totalTime));
    tfoot.find('tr').find('td:last-child').find('input').val(Site.convertTime(totalTime) === '00:00:00' ? '' : '100%');
  };
  var callbackForChart = function(that, data) {
    var listGps = [], dataSeries = [], j = 0;

    for(var i in data) {
      listGps[j] = {
        startGps: data[i].gpsStart,
        endGps: data[i].gpsEnd
      };
      dataSeries[j] = data[i];
      j++;
    }
    $(that.options.target.chart).data('listSeries', dataSeries);
    $(that.options.target.chart).data('draw-chart').drawChart(listGps);
  };
  var callBackForSelect = function(that, data) {
    var optList = '',
        optCallback = that.options.callBack,
        isSelected = '',
        selector = that.options.targetTmp.select || that.options.target.select,
        select = $(selector);

    if(!$.isArray(selector)) {
      for(var i = 0, l = data.length; i < l; i++) {
        isSelected = typeof data[i].selected !== 'undefined' ? 'selected="true"' : '';
        optList += OPT_TAG.replace('{text}', data[i].text)
                          .replace('{value}', data[i].value)
                          .replace('{selected}', isSelected);
      }
      select.val('');
      select.find('option').remove();
      select.append(optList);
    } else {
      for (var k = 0, length = that.options.target.select.length ; k < length; k++) {
        optList = '';
        var tempSelect = $(that.options.target.select[k]);
            // checkedBox = tempSelect.parent().next('.checkbox').find('input:checkbox');
        for(var j = 0, len = data[k].length; j < len; j++) {
          isSelected = typeof data[k][j].selected !== 'undefined' ? 'selected="true"' : '';
          optList += OPT_TAG.replace('{value}', data[k][j].value)
                            .replace('{text}', data[k][j].text)
                            .replace('{selected}', data[k][j].selected);
        }
        tempSelect.val('');
        tempSelect.find('option').remove();
        tempSelect.append(optList);

        if(tempSelect.data('selected')) {
          var sels = tempSelect.data('selected'),
              tempOpts = tempSelect.find('option');

          for(var iOpt = 0, lenOpt = tempOpts.length; iOpt < lenOpt; iOpt++) {
            for(var sel in sels) {
              if(parseInt(tempOpts.eq(iOpt).val()) === sels[sel]) {
                tempOpts.eq(iOpt).prop('selected', true);
              }
            }
          }
          // uncheck all select for setting report page
          // if(sels.length === tempOpts.length) {
          //   checkedBox.prop('checked', true);
          // } else {
          //   checkedBox.prop('checked', false);
          // }
        }
      }
    }
    if(optCallback) {
      if(optCallback[1] === 'clear') {
        $(optCallback[0]).find('option').remove();
      return;
      }
      if(that.options.idxTrigger) {
        for(var n = 0, le = that.options.idxTrigger.length; n < le; n++) {
          $(that.options.target.select[that.options.idxTrigger[n]]).trigger(optCallback);
          return;
        }
      }
      if($.isArray(that.options.target.select)) {
        for(var i1=0, selLen = that.options.target.select.length; i1 < selLen; i1++) {
          $(that.options.target.select[i1]).trigger(optCallback);
        }
      }
      select.trigger(optCallback);
    }
  };
  var tfootHandler = function(el, data, total, emptyData, isEmpty) {
    var totalEl = el.find('tr').find('td:nth-child(2)').find('input'),
        totalPerEl = el.find('tr').find('td:last-child').find('input');

    if((data.length || Object.keys(data).length) && !isEmpty) {
      totalEl.val(total);
      totalPerEl.val('100%');
      el.closest('table').removeClass(nodataClass);
      return;
    }
      totalEl.val(emptyData || 0);
      totalPerEl.val('0%');
      el.closest('table').addClass(nodataClass);
  };
  var getTr = function(length) {
    var tr ='<tr>';
    for(var i = 0; i < length; i ++) {
      tr += '<td></td>';
    }
    return tr + '</tr>';
  };
  var filterTr = function(el, num1, num2) {
    var sub = num1 - num2,
        absSub = Math.abs(num1 - num2),
        isNegative = sub < 0,
        listTr = el.find('tr');

    for (var i = 0; i < absSub; i++) {
      if(isNegative) {
        listTr.eq(i).remove();
      } else {
        el.parent().append(getTr(numberOfPassage));
      }
    }
  };
  var callBackForEditor = function(that, data) {
    if(!data) {
      return;
    }
    tinyMCE.activeEditor.setContent(data.body);
    $(that.options.target.editor).val(data.subject);
    that.element.vars.oldValue = that.element.val();
  };
  var theadHandler = function(that, mainTargetEle, total) {
    var theadHtml = '<thead><tr>',
        tempTbodyHtml = '<td></td>';
        mainTargetEle.empty();
        theadHtml += '<th></th>';
        if(total < 9) {
          total = 9;
        }

        for(var i = 0; i< total; i++) {
          theadHtml+='<th>Passage '+ (i+1) +'</th>';
          tempTbodyHtml += '<td></td>';
        }
        theadHtml += '</tr></thead><tbody><tr>'+ tempTbodyHtml +'</tr></tbody>';
    if(!mainTargetEle.parent().hasClass('passage-wrapper')) {
      mainTargetEle.wrap('<div class="passage-wrapper"></div>');
    }
    mainTargetEle.html(theadHtml);
  };
  //this function call for point and passage table,
  var callbackForPoint = function (that, data) {
    var mainTargetEle =  $(that.options.target.point[0]),
        subTargetEle = $(that.options.target.point[1]),
        listDataKey,
        listSubTr = '',
        maxPoint = data.max_number_passage || 0,
        totalPoint = 0,
        listPointPassage = {},
        mainTbody = mainTargetEle.find('tbody'),
        subTbody = subTargetEle.find('tbody'),
        tfoot = subTargetEle.find('tfoot'),
        isEmpty = 0;

    if(data.data) {
      listDataKey = Object.keys(data.data);

      for(var x in data.data) {
        for(var x2 = 0, pointLength = data.data[x].length; x2 < pointLength; x2++) {
          if(pointLength > maxPoint) {
            maxPoint = pointLength;
          }
        }
      }
      theadHandler(that, mainTargetEle, maxPoint);
      mainTbody = mainTargetEle.find('tbody');
      subTbody = subTargetEle.find('tbody');
      tfoot = subTargetEle.find('tfoot');
      if(maxPoint >= 9) {
        numberOfPassage = parseInt(maxPoint) + 1;
      }
      mainTbody.find('tr td').removeClass(bgWar);
      filterTr(mainTbody, listDataKey.length, mainTbody.find('tr').length);
      for(var i in data.data){
        var idx = listDataKey.indexOf(i),
            tempTrEl = mainTbody.find('tr:nth-child(' + (idx + 1) + ')'),
            tempTdEl = tempTrEl.find('td'),
            totalPointTmp = 0;

        tempTdEl.html('');
        for(var j = 0, l = data.data[i].length; j < l; j++) {
          var trEl = tempTdEl.filter(':nth-child(' + (j + 2) + ')');
          totalPointTmp += !!data.data[i][j].trim();
          tempTdEl.filter(':first-child').html(i);
          trEl.addClass(!data.data[i][j] ? bgWar : '').html(data.data[i][j]);
        }
        listPointPassage[i] = totalPointTmp;
        totalPoint += totalPointTmp;
      }

      for(var k in listPointPassage) {
        var per = parseInt(listPointPassage[k]) === 0 ? 0 : parseInt(listPointPassage[k]) / totalPoint * 100;
        isEmpty += per;
        listSubTr += '<tr>' + tdTag.replace(replacement, k) + tdTag.replace(replacement, listPointPassage[k]) + tdTag.replace(replacement, ((per === 0 || per === 100)? per + '%' : per.toFixed(2).replace(/[0]$/g, '') + '%')) + '</tr>';
      }
      subTbody.find('tr').remove().end().append(listSubTr);
      tfootHandler(tfoot, data.data, totalPoint, '', !isEmpty);
    } else {
      listDataKey = Object.keys(data);
      theadHandler(that, mainTargetEle, maxPoint);
      mainTbody = mainTargetEle.find('tbody');
      subTbody = subTargetEle.find('tbody');
      tfoot = subTargetEle.find('tfoot');
      filterTr(mainTbody, 1, mainTbody.find('tr').length);
      subTbody.find('tr').remove().end().append(listSubTr);
      tfootHandler(tfoot, data, totalPoint, '', !isEmpty);
    }
  };
  var callBackForAgent = function(that, data) {
    var targetEle =  $(that.options.target.agent),
        listTr = '',
        totalPoint = 0,
        tbody = targetEle.find('tbody'),
        tfoot = targetEle.find('tfoot');

    for(var i = 0, l = data.length; i < l; i++) {
      totalPoint += parseInt(data[i][1]);
    }
    for(var j = 0, len = data.length; j < len; j++) {
      listTr += '<tr>' + tdTag.replace(replacement, data[j][0]) + tdTag.replace(replacement, data[j][1]) + tdTag.replace(replacement, (parseInt(data[j][1]) / totalPoint * 100).toFixed(2).replace(/[0]$/g, '') + '%') + '</tr>';
    }
    tbody.find('tr').remove().end().append(listTr);
    tfootHandler(tfoot, data, totalPoint);
  };
  var callBackForAutoComplete=function(that,data){
    var targetSel = that.options.targetTmp['auto-complete'] || that.options.target['auto-complete'];
    var autoComplete = $(targetSel).data('auto-complete');

    autoComplete.updateSuggestData(data);

    // if (that.options.autoCompleteAction === 'clear') {
    //   autoComplete.resetData();
    // } else if (that.options.autoCompleteAction === 'update') {
    //   autoComplete.updateSuggestData(data);
    // }
  };
  var successCallback = function(that, data, type) {
    switch(type) {
      case 'select':
        callBackForSelect(that, data);
        break;
      case 'table':
        callBackForTable(that, data);
        break;
      case 'input':
        callBackForInput(that, data);
        break;
      case 'chart':
        callbackForChart(that, data);
        break;
      case 'point' :
        callbackForPoint(that, data);
        break;
      case 'agent':
        callBackForAgent(that, data);
        break;
      case 'editor':
        callBackForEditor(that, data);
        break;
      case 'auto-complete':
        callBackForAutoComplete(that, data);
        break;
    }
  };
  var getPostData = function(that) {
    var self = that.element,
        opts = that.options,
        plusDataSelector = opts.plusDataTarget,
        dataGetValTar = opts.getValueTarget,
        postData = '';
    postData += self.attr('name') + '=' + self.val() + (plusDataSelector ? '&date=' + $(plusDataSelector).val() : '') + (dataGetValTar ? '&' : '');
    if(dataGetValTar) {
      for(var i = 0, l = dataGetValTar.length; i < l; i++) {
        postData += $(dataGetValTar[i]).prop('name') + '=' + $(dataGetValTar[i]).val() + (i === l - 1 ? '' : '&');
      }
    }
    return postData;
  };
  var confirmHandler = function(that) {
    var el = that.element;
    el.vars.canLoadAjax = true;
    el.trigger(Event.CHANGE);
  };
  var callAjax = function(that, url, target) {
    Site.getDataAjaxDefault({
      postData: getPostData(that),
      selector: target,
      url: url,
      // ajaxType: 'GET',
      successHandler: function(data) {
        that.options.targetTmp = target;
        if (data.rangeTime) {
          $(target.chart).data('rangeTime', data.rangeTime);
        }
        if(data.auto_complete !== undefined){
            data['auto-complete'] = data.auto_complete;
            delete data.auto_complete;
          }
        for (var i in target) {
          if (data[i]) {
            successCallback(that, data[i], i);
          } else {
            successCallback(that, data, that.options.fillTypeDef);
          }
        }
      }
    });
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          opts = that.options;

      this.element.vars = {
        canLoadAjax: false,
        oldValue: this.element.val()
      };
      if(opts.hasConfirm) {
        doc.off(Event.CLICK, confirmBtnSel).on(Event.CLICK, confirmBtnSel, function() {
          confirmHandler(that);
        });
        doc.on(Event.MODAL_HIDDEN, function() {
          onCancelHandler(that);
        });
      }
      this.element.off(Event.CHANGE).on(Event.CHANGE, function() {
        var canLoadAjax = that.element.vars.canLoadAjax;
        if(opts.hasConfirm) {
          if(!that.element.vars.oldValue) {
            canLoadAjax = true;
          }
          if(!canLoadAjax) {
            initPopup();
            changeMess(that, that.options.confirmMessage);
            return;
          }
        }
        if($.isArray(opts.target) && $.isArray(opts.url)) {
          $.each(opts.url, function(index, el) {
             callAjax(that, el, opts.target[index]);
            // callAjax(that, opts.url[index], opts.target[index]);
          });
        }
        else {
          callAjax(that, opts.url, opts.target);
        }

        // Site.getDataAjaxDefault({
        //   postData: getPostData(that),
        //   selector: opts.target,
        //   url: opts.url,
        //   // ajaxType: 'GET',
        //   successHandler: function(data) {
        //     if(data.rangeTime) {
        //       $(opts.target.chart).data('rangeTime', data.rangeTime);
        //     }
        //     for(var i in opts.target) {
        //       if(data[i]) {
        //         successCallback(that, data[i], i);
        //       } else {
        //         successCallback(that, data, opts.fillTypeDef);
        //       }
        //     }
        // }});

        that.element.vars.canLoadAjax = false;
      });
      win.on('load.'+pluginName, function() {
        if(opts.autoTrigger) {
          that.element.trigger(Event.CHANGE);
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
    url: '',
    target: {select: '', input: '', table: ''},
    fillTypeDef: 'select',
    callBack: '',
    loadAjaxDrawChart: false,
    plusDataTarget: '',
    getValueTarget: '',
    autoTrigger: null,
    idxTrigger: null,
    hasConfirm: false,
    confirmMessage: l10n.confirmMessage,
    targetTmp: null,
    autoCompleteAction: ''//clear or update li when execute success callback
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
