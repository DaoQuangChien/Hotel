/**
 *  @name drwaw-chart
 *  @version 1.0
 *  @options
 *    chart
 *    title
 *    credits
 *    plotOption
 *    xAxis
 *    yAxis
 *    legend
 *    tooltip
 *    series
 *  @events
 *  @methods
 *    init
 *    destroy
 */
;(function($, window, undefined) {
  var pluginName = 'draw-chart',
      signageSelector = '.signage',
      signageClass = 'signage',
      hiddenClass = 'hidden',
      signageBlock = '<img class="signage signage-" alt="' + l10n.chartText.SIGNAGE + '" src="source">',
      pTag = '<p class="alert-block">' + l10n.chartText.NO_POSITION + '</p>',
      messageBlockSel = '.alert-block',
      listNextDayVal = {},
      highchartsLabelBlockSel = '.highcharts-yaxis-labels',
     // highchartsXLabelSel = '.highcharts-xaxis-labels',
      //series,
      workingPointW = 25,
      innerPointW = 18,
      planningPointW = 10,
      shown = false,
      count = 0,
      keys = [],
      listHiddenLabel = [],
      listHidden = [],
      listGPS = [],
      seriesBlockSel = '.highcharts-series',
      modalSel = '.google-map-modal',
      googleMapModalSel = 'google-map-block',
      labelBlockSel = '.highcharts-data-labels',
      body = $('body'),
      gpsData = 'gps',
      modalBodySel = '.modal-body',
      Events = {
        CLICK: 'click.' + pluginName,
        SHOWN: 'shown.bs.modal'
      },
      nullGpsArr = [0, 0],
      dataMinMax = 'rangeTime',
      chart;
  var createEl = function() {
    if(body.find(modalSel).length) {
      return;
    }
    body.append(
      '<div id="google-map-modal" data-address-modal="" class="google-map-modal modal fade">' +
        '<div class="modal-dialog">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
              '<h4 class="modal-title">Position de ce temps</h4>' +
            '</div>' +
            '<div class="modal-body"><div class="google-map-block" id="google-map-block"></div>'
    );
  };
  var initialize = function(agr) {
    var mapProp,
        map,
        marker,
        myCenter = new google.maps.LatLng(agr.x, agr.y);
    mapProp = {
      center: myCenter,
      zoom: 14,
      mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById(googleMapModalSel), mapProp);
    marker = new google.maps.Marker({
      position: myCenter
    });
    marker.setMap(map);
  };
  // var changeColor = function(col, amt) {

  //   var usePound = false,
  //       num,
  //       r,
  //       b,
  //       g;

  //   if (col[0] === '#') {
  //       col = col.slice(1);
  //       usePound = true;
  //   }

  //   num = parseInt(col,16);
  //   r = (num >> 16) + amt;
  //   if (r > 255) {
  //     r = 255;
  //   } else if(r < 0) {
  //     r = 0;
  //   }
  //   b = ((num >> 8) & 0x00FF) + amt;
  //   if (b > 255) {
  //     b = 255;
  //   } else if(b < 0) {
  //     b = 0;
  //   }
  //   g = (num & 0x0000FF) + amt;
  //   if (g > 255) {
  //     g = 255;
  //   }
  //   else if (g < 0) {
  //     g = 0;
  //   }
  //   return (usePound? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
  // };
  var convertTime = function(str) {
    var arr = str ? str.split(':') : [0,0,0];
    return Date.UTC(2013, 07, 02, arr[0], arr[1], arr[2]);
  };
  var tooltipFormatter = function () {
    var high,
        low,
        isNextDay = false;
    for(var i in listNextDayVal) {
      if(this.point.x === parseInt(i)) {
        high = listNextDayVal[i].endTime;
        low = listNextDayVal[i].startTime;
        isNextDay = true;
      }
    }
    if(this.series.userOptions && this.series.userOptions.pointWidth === planningPointW) {
      return l10n.chartText.TOOL_TIP_3 + ' <b>' + (isNextDay ? low : Highcharts.dateFormat('%H:%M', this.point.low)) + '</b>' + l10n.chartText.TOOL_TIP_4 + '<b>' + (isNextDay ? high : Highcharts.dateFormat('%H:%M', this.point.high)) + '</b>.';
    } else {
      return '<b>' + this.x + (!this.series.name.match(/Series/) ? '-' + this.series.name : '') + '</b> ' + l10n.chartText.TOOL_TIP_1 + ' <b>' + (isNextDay ? low : Highcharts.dateFormat('%H:%M', this.point.low)) + '</b>' + l10n.chartText.TOOL_TIP_2 + '<b>' + (isNextDay ? high : Highcharts.dateFormat('%H:%M', this.point.high)) + ' demain</b>';
    }
  };
  var labelFormatter = function() {
    var d = Highcharts.dateFormat('%H:%M', this.y),
      timeReturn = (d.split(':')[0] + ':' + d.split(':')[1]),
      isNextDay = false;
    // for(var i = 0, l = keys.length; i < l; i++) {
    //   if(this.point.index === (keys[i] + i + 1)) {
    //     isNextDay = true;
    //   }
    // }
    if(timeReturn === '00:00' && parseInt(this.y)!=='NaN' && this.y === this.series.dataMax) {
      return '';
    } else {
      return ((isNextDay ? '<span style="color: #ff0000; font-weight: bold">' : '') + timeReturn);
    }
  };
  var getData = function(that) {
    //var listNextDay = [],
    var el = that.element,
        series = el.data('listSeries'),
        name = [],
        time = [],
       // arrPlan = [],
        opts = that.options;
        //prevNumOfTask = 0,
        //prevNumOfWork = 0;
    for(var i = 0, len = series.length; i < len; i++) {
      var tempSer = series[i] || '',
          startTime = [],
          endTime = [],
          innerTask = [],
          arrPlanning = [];
      if(tempSer.innerTask) {
        innerTask = tempSer.innerTask;
      }
      if(tempSer.arrPlanning) {
        arrPlanning = tempSer.arrPlanning;
      }
      name.push(tempSer.name);
      count = name.length;
      if(tempSer.startTime) {
        if($.isArray(tempSer.startTime)) {
          for(var iTmp = 0, lengthTimeTmp = tempSer.startTime.length; iTmp < lengthTimeTmp; iTmp++) {
            //var isLabel = true;

            if(tempSer.startTime[iTmp + 1] && (tempSer.startTime[iTmp + 1].split(':')[0] - tempSer.endTime[iTmp].split(':')[0]) <= 1) {
              listHidden.push((2*(i) + iTmp) + ';' + (2*(i) + (iTmp + 1)));
            }
            listGPS.push({
              start: (tempSer.gpsStart[iTmp]) ? tempSer.gpsStart[iTmp] : '',
              end: (tempSer.gpsEnd[iTmp]) ? tempSer.gpsEnd[iTmp] : ''
            });
            startTime = tempSer.startTime[iTmp].split(':');
            endTime = tempSer.endTime[iTmp].split(':') || startTime;
            time.push({
              pointWidth: workingPointW,
              data: [{
                x: i,
                low: Date.UTC(2013, 07, 02, startTime[0], startTime[1], startTime[2]),
                high: Date.UTC(2013, 07, 02, endTime[0], endTime[1], endTime[2]),
                color: (opts.seriesColor[i] || opts.seriesColor[len - 1 - i])
              }]
            });
            //
          }
        } else {
          listGPS.push({
            start: (tempSer.gpsStart) ? tempSer.gpsStart : '',
            end: (tempSer.gpsEnd) ? tempSer.gpsEnd : ''
          });
          startTime = tempSer.startTime.split(':');
          endTime = tempSer.endTime.split(':') || startTime;
          time.push({
            pointWidth: 25,
            pointPadding: -1,
            data: [{
              x: i,
              low: Date.UTC(2013, 07, 02, startTime[0], startTime[1], startTime[2]),
              high: Date.UTC(2013, 07, 02, endTime[0], endTime[1], endTime[2]),
              color: (opts.seriesColor[i] || opts.seriesColor[len - 1 - i])
            }]
          });
        }
      } else {
        listHidden.push((2*(i)) + ';' + (2*(i) + 1));
        // listGPS.push({
        //   start: '',
        //   end: ''
        // });
      }
      if(innerTask) {
        for(var j = 0, l = innerTask.length; j < l; j++) {
          var innerStartTime = innerTask[j].startTime.split(':'),
              innerEndTime = innerTask[j].endTime.split(':');
              //isLabelInner = true;

          time.push({
            name: innerTask[j].name,
            pointWidth: innerPointW,
            dataLabels: false,
            data: [{
              x: i,
              low: Date.UTC(2013, 07, 02, innerStartTime[0],innerStartTime[1], innerStartTime[2]),
              high: Date.UTC(2013, 07, 02, innerEndTime[0], innerEndTime[1], innerEndTime[2])
            }]
          });
          //listHiddenLabel.push((i + j + 1 + prevNumOfTask) * 2);
        }
        //prevNumOfTask += innerTask.length;
      }
      if(arrPlanning) {
        for(var k = 0, pl = arrPlanning.length; k < pl; k++) {
          var planningStartTime = arrPlanning[k].startTime.split(':'),
              planningEndTime = arrPlanning[k].endTime.split(':');
          time.push({
            name: arrPlanning[k].planningPlage || '',
            color: '#EEEEEE',
            pointWidth: planningPointW,
            dataLabels: false,
            data: [{
              x: i,
              low: Date.UTC(2013, 07, 02, planningStartTime[0], planningStartTime[1], planningStartTime[2]),
              high: Date.UTC(2013, 07, 02, planningEndTime[0], planningEndTime[1], planningEndTime[2])
            }]
          });
        }
      }
    }
    opts.xAxis.categories = name;
    opts.series = time.length > 0 ? time : [{name: '',data:{}}];

    if(el.data(dataMinMax)) {
      opts.yAxis.min = convertTime(el.data(dataMinMax)[0]);
      opts.yAxis.max = convertTime(el.data(dataMinMax)[1]);
    }

    opts.tooltip.formatter = tooltipFormatter;
    opts.plotOptions.columnrange.dataLabels.formatter = labelFormatter;
    return keys;
  };

  var setGpsData = function(gps, ele) {
    var labelGpsElements = ele.find('text');

    labelGpsElements.eq(0).data(gpsData, (labelGpsElements.eq(0).length > 0) ? gps.end : gps.start);
    labelGpsElements.eq(1).data(gpsData, gps.start);
  };
  var dataLabelFormat = function(that) {
    var listLabelWrap = that.element.find(labelBlockSel),
        //listLabelWrapLength = listLabelWrap.length,
        listLabel = listLabelWrap.find('g'),

        listLabelLength = listLabel.length,
        listGpsLength = listGPS.length;
        //labelHideLength = listHidden.length;

    if(listGpsLength > 0 && listLabelLength > 0) {
      for(var z = 0; z < listLabelLength; z++) {
        if(listGPS[z]) {
          setGpsData(listGPS[z], listLabelWrap.eq(z));
        }
      }
    }
    // if(labelHideLength > 0) {
    //   for(var k = 0; k < labelHideLength; k++) {
    //     listHidden[k] = listHidden[k].split(';');

    //     listLabelWrap.eq(listHidden[k][0]).find('g').attr('class','hide');

    //     if(listLabelWrap.eq(listHidden[k][1]).find('g').eq(1).text() !== listLabelWrap.eq(listHidden[k][1]).eq(0).find('g').text()) {
    //       listLabelWrap.eq(listHidden[k][1]).find('g').attr('class','hide');
    //     }
    //   }
    // }


    for(var j = 0, len = listHiddenLabel.length; j < len; j++) {
      listLabel.eq(listHiddenLabel[j]).closest(labelBlockSel).hide();
    }
    for(var i = 0, l = listLabel.length ; i < l; i++) {
      if(i % 2 === 0 && listLabel.eq(i).text() === listLabel.eq(i + 1).text()){
        listLabel.eq(i).hide();
      }
    }

    listGPS = [];
    listHidden = [];
    listHiddenLabel = [];
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var el = this.element,
          opts = this.options;
          //that = this;

      this.vars = {
        signageBlock : signageBlock.replace('source', opts.imgUrl)
      };
      this.drawChart();
      el.find(highchartsLabelBlockSel).find('text:last-child').text('00:00');
      body.on(Events.SHOWN, modalSel, function() {
        var self = $(this),
            //modalBody = $(this).find(modalBodySel),
            data = self.data(gpsData);
        initialize({
          x: data[0],
          y: data[1]
        });
      });
    },

    drawChart: function() {
      var opts = this.options,
          ele = this.element,
          that = this;

      var listNextDay = getData(this);
      chart = this.element.highcharts({
        chart: opts.chart,
        title: opts.title,
        credits: opts.credits,
        plotOptions: opts.plotOptions,
        xAxis: opts.xAxis,
        yAxis: opts.yAxis,
        legend: opts.legend,
        tooltip: opts.tooltip,
        series: opts.series,
        scrollbar: opts.scrollbar
      }, function(chart) {
        var imgW = 25,
            signageEl = ele.find(signageSelector);
          if(count >= 5) {
            chart.setSize($(chart.container).width()-18, count*80);
            count = 0;
          }

          signageEl.remove();
          if(!listNextDay.length) {
            return;
          }
          for(var i = 0, l = listNextDay.length; i < l; i++) {
            //var data = chart.series[0].data[i];

            ele.append(that.vars.signageBlock.replace(signageClass + '-', signageClass + '-' + i));
            ele.find('.' + signageClass + '-' + i)
            .css({
              top: chart.chartHeight - $( seriesBlockSel).find('rect').filter(':nth-child(' + (parseInt(listNextDay[i]) + i + 1) + ')').attr('x') - $(seriesBlockSel).find('rect').filter(':nth-child(' + (parseInt(listNextDay[i]) + i + 1) + ')').attr('width') / 2 + imgW / 3
            });
         }
      });
      this.element.highcharts().reflow();
      keys = [];
      dataLabelFormat(this);
      var  listLabel = ele.find(labelBlockSel);

      listLabel.find('text').off(Events.CLICK).on(Events.CLICK, function() {
        var selft = $(this),
            data = selft.data(gpsData);
        createEl();
        $(modalSel).data(gpsData, selft.data(gpsData) || nullGpsArr);
        $(modalSel).modal('show');
        if(!data || !data.length) {
          $(modalSel).find('#' + googleMapModalSel).addClass(hiddenClass);
          if($(messageBlockSel).length) {
            $(messageBlockSel).removeClass(hiddenClass);
          } else {
            $(modalSel).find(modalBodySel).append(pTag);
          }
          return;
        }
        $(modalSel).find('#' + googleMapModalSel).removeClass(hiddenClass);
        $(modalSel).find(messageBlockSel).addClass(hiddenClass);
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
      chart: {
        type: 'columnrange',
        inverted: true,
        marginRight: 27
      },
      title: false,
      credits: false,
      plotOptions: {
        columnrange: {
          grouping: false,
          borderColor: '#C14830',
          borderWidth: 1,
          dataLabels: {
            enabled: true,
            formatter: function () {}
          },
          point: {
            events: {
              mouseOver: function () {
                if(this.series.dataLabelsGroup) {
                  if($(this.series.dataLabelsGroup.element).children().eq(1).attr('class') === 'hide') {
                    $(this.series.dataLabelsGroup.element).children().attr('class','').show();
                    shown = true;
                  }
                }
              },
              mouseOut: function () {
                if(this.series.dataLabelsGroup && shown) {
                  $(this.series.dataLabelsGroup.element).children().attr('class','hide');
                  shown = false;
                }
              },
            }
          }
        }
      },
      xAxis: {
        categories: [],
      },
      yAxis: [{
        type: 'datetime',
        title: false,
        min: Date.UTC(2013, 07, 02, 0, 0, 0),
        max: Date.UTC(2013, 07, 02, 24, 0, 0),
        dateTimeLabelFormats: {
          second: '%H:%M',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%H:%M',
          week: '%H:%M',
          month: '%H:%M',
          year: '%H:%M'
        }
      }],
      legend: {
        enabled: false
      },
      scrollbar: {
        enabled: true
      },
      tooltip: {
        shared: false,
        positioner:function(labelWidth, labelHeight, point) {
          var tooltipX,
              tooltipY;
          tooltipX = point.plotX > chart.highcharts().chartWidth - labelWidth ? (chart.highcharts().chartWidth -  labelWidth - 19) : point.plotX;
          tooltipY = point.plotY - 40 > 0 ? point.plotY - 40 : point.plotY + 17;
          return {
            x: tooltipX,
            y: tooltipY
          };
        },
        formatter: function() {}
      },
      planningTooltip: {
        shared: false,
        positioner:function(labelWidth, labelHeight, point) {
          var tooltipX,
              tooltipY;
          tooltipX = point.plotX > chart.highcharts().chartWidth - labelWidth ? (chart.highcharts().chartWidth -  labelWidth - 19) : point.plotX;
          tooltipY = point.plotY - 40 > 0 ? point.plotY - 40 : point.plotY + 17;
          return {
            x: tooltipX,
            y: tooltipY
          };
        },
        formatter: function() {}
      },
      series: [{
        data: [
          [Date.UTC(2013, 07, 02, 05, 10, 0), Date.UTC(2013, 07, 02, 05, 15, 0)],
          [Date.UTC(2013, 07, 02, 06, 18, 0), Date.UTC(2013, 07, 02, 14, 10, 0)],
          [Date.UTC(2013, 07, 02, 15, 10, 0), Date.UTC(2013, 07, 02, 23, 19, 0)],
          [Date.UTC(2013, 07, 02, 06, 18, 0), Date.UTC(2013, 07, 02, 14, 10, 0)],
          [Date.UTC(2013, 07, 02, 06, 18, 0), Date.UTC(2013, 07, 02, 14, 10, 0)],
          [Date.UTC(2013, 07, 02, 06, 18, 0), Date.UTC(2013, 07, 02, 14, 10, 0)]
        ]
      }],
      imgUrl: 'images/icon-right.png',
      listSeries: '',
      minMax: [],
      seriesColor: ['#7cb5ec', '#FF66CC', '#90ed7d', '#f7a35c', '#8085e9','#f15c80', '#e4d354', '#8085e8']
    };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({});
  });

}(jQuery, window));
