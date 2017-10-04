/**
 *  @name slide
 *  @description Image slider
 *  @version 1.0
 *  @options
 *    interval
 *    self_animate
 *    drag
 *    navigator
 *    bullet_nav
 *    current
 *  @methods
 *    init
 *    destroy
 */
 ;(function($, window, undefined) {
  'use strict';

  var pluginName = 'slide';

  var setUp = function(obj){
    obj.first.before(obj.last.clone());
    obj.last.after(obj.first.clone());
    obj.gallery.css('left', -100*obj.current + '%');
  };

  var addBullet = function(obj, animate){
    var bullet = document.createElement('div');
    $(bullet).attr('class', 'bullet-nav');

    for(var i = 0; i < obj.len; i++){
      var point = document.createElement('a');
      $(point).attr('data-slide', i);
      var sl_num = i;
      $(point).text(++sl_num);
      $(point).appendTo(bullet);
      if(i === obj.current - 1){
        $(point).addClass('current');
      }
    }
    obj.obj.append(bullet);

    var nav = obj.obj.find('.bullet-nav').find('a');
    $(nav).click(function(){
      if(animate.self_animate){
        clearInterval(animate.IntervalSelfAnimate);
      }
      $(nav).removeClass();
      $(this).addClass('current');
      obj.current = parseInt($(this).attr('data-slide'));
      obj.current++;
      obj.gallery.animate({left: -100*obj.current + '%'});
      if (animate.self_animate) {
        animate.IntervalSelfAnimate = setInterval(animate.selfAnimate, animate.interval);
      }
    });
  };

  var addNavigator = function(obj, animate){
    var next_btn = document.createElement('button');
    var prev_btn = document.createElement('button');
    $(next_btn).attr({class : 'navigator next'});
    $(prev_btn).attr({class : 'navigator prev'});
    obj.obj.append(prev_btn, next_btn);

    var nav = obj.obj.find('.bullet-nav').find('a');
    var button = obj.obj.find('button.navigator');
    $(button).click(function(){ 
      if(animate.self_animate){
        clearInterval(animate.IntervalSelfAnimate);
      }
      var clNames = this.className;
      var clName = clNames.split(' ');
      var delta = (clName[1] === 'prev')? -1 : 1;
      if(obj.gallery.is(':not(:animated)')){
        if(obj.current <= 1 && delta === -1){
          obj.current = obj.len + 1;
          obj.gallery.css('left', -100*obj.current + '%');
        }else
          if(obj.current >= obj.len && delta === 1){
            obj.gallery.css('left', 0 );
            obj.current = 0;
          }
        obj.current += delta;
        obj.gallery.animate({left: -100*obj.current + '%'}, function(){
          if(obj.current === obj.len && delta === 1){
            obj.current = 0;
            obj.gallery.css('left', '0');
          }
        });
        $(nav).removeClass();
        $(nav).each(function(){
          if(parseInt($(this).attr('data-slide')) === obj.current - 1){
            $(this).addClass('current');
          }
        });
      }
      if(animate.self_animate){
        animate.IntervalSelfAnimate = setInterval(animate.selfAnimate, animate.interval);
      }
    });
  };

  var dragSelfAnimate = function(obj, direc){
    var nav = obj.obj.find('.bullet-nav').find('a');
    if(direc != null){
      if(!direc){
        obj.current++;
      }else{
        obj.current--;
      }
    }
    obj.gallery.animate({left: -100*obj.current + '%'},function(){
      if(obj.current > obj.len){
        obj.current = 1;
      }
      if(obj.current === 0){
        obj.current = obj.len;
      }
      obj.gallery.css('left', -100*obj.current + '%');
      $(nav).removeClass();
      $(nav).each(function(){
        var dtSlide = parseInt($(this).attr('data-slide'));
        dtSlide++;
        if( dtSlide === obj.current ){
          $(this).addClass('current');
        }
      });
    });
  };

  var drag = function(obj, animate){
    var nav = obj.obj.find('.bullet-nav').find('a'),
        dragging = null,
        msCurnt = 0,
        msDown,
        move,
        galWidth = obj.obj.width()/2,
        distce,
        dir;
    $(obj.gallery).mousemove(function(event) {
      move = event.pageX - msCurnt;
      distce = Math.abs(event.pageX - msDown);

      (msCurnt < event.pageX)? dir = true : dir = false;
      msCurnt = event.pageX;

      if(dragging){
        obj.gallery.css({
          left : '+=' + move
        });
      }
      $(nav).removeClass();
      $(nav).each(function(){
        if( parseInt($(this).attr('data-slide')) === obj.current - 1){
          $(this).addClass('current');
        }
      });
    });

    $(obj.gallery).mousedown(function(e){
      if(animate.self_animate){
        clearInterval(animate.IntervalSelfAnimate);
      }
      dragging = e.target;
      msDown = e.pageX;
    });

    $(obj.gallery).mouseup(function(){
      dragging = null;
      if(distce > galWidth){
        dragSelfAnimate(obj, dir);
      }else{
        dragSelfAnimate(obj);
      }
      if(animate.self_animate){
        animate.IntervalSelfAnimate = setInterval(animate.selfAnimate, animate.interval);
      }
    });

    $(obj.gallery).mouseleave(function(){
      if(dragging) {
        $(obj.gallery).mouseup();
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
          opt = that.options,
          slideElem = {
            obj : that.element,
            gallery : that.element.find('ul'),
            items : that.element.find('li'),
            len : that.element.find('li').length,
            first : that.element.find('li').filter(':first'),
            last : that.element.find('li').filter(':last'),
            current : opt.current
          },
          animate = {
            selfAnimate : function(){},
            self_animate : opt.self_animate,
            interval : opt.interval,
            IntervalSelfAnimate : null
          };

      if(opt.bullet_nav){
        addBullet(slideElem, animate);
      }

      if(opt.navigator){
        addNavigator(slideElem, animate);
      }

      var nav = slideElem.obj.find('.bullet-nav a');
      animate.selfAnimate = function(){
        slideElem.current++;
        $(nav).removeClass();
        $(nav).each(function(){
          var dtSlide = parseInt($(this).attr('data-slide'));
          dtSlide++;
          if(dtSlide === slideElem.current){
            $(this).addClass('current');
          }
        });
        slideElem.gallery.animate({left: -100*slideElem.current + '%'},function(){
          if(slideElem.current > slideElem.len){
            slideElem.current = 1;
            slideElem.gallery.css('left', -100*slideElem.current + '%');
            $(nav).removeClass();
            $(nav).each(function(){
              var dtSlide = parseInt($(this).attr('data-slide'));
              dtSlide++;
              if( dtSlide === slideElem.current ){
                $(this).addClass('current');
              }
            });
          }
        });
      };

      setUp(slideElem);

      if(opt.self_animate){
        animate.IntervalSelfAnimate = setInterval(animate.selfAnimate, animate.interval);
      }

      if(opt.drag){
        drag(slideElem, animate);
      }
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
    interval: 2000,
    self_animate: true,
    drag: true,
    navigator: true,
    bullet_nav: true,
    current: 1
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });


}(jQuery, window));