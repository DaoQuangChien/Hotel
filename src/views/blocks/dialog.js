function show(selector) {
  var dialog = $(selector);
  var background = $('.modal-background');
  var body = $('body');
  dialog.css("left", 0)
  var wWidth = window.innerWidth;
  var wHeight = window.innerHeight;
  background.show();
  dialog.css("max-width", wWidth - 4);
  dialog.css("max-height", wHeight - 4);
  dialog.find(".scrollable-content").css({
    "overflow":"auto",
    "max-height": (wHeight - 160) + "px"
  })
  dialog.show();
  body.css("overflow", "hidden");
  var width = dialog.width();
  var height = dialog.height();
  console.log("Window Width:" + wWidth + " - Dialog width:" + width);
  console.log("Window Height:" + wHeight + " - Dialog height:" + height);
  dialog.css("top", (wHeight - height)/2 > 2 ? (wHeight - height)/2 : 2);
  dialog.css("left", (wWidth - width)/2 > 2 ? (wWidth - width)/2 : 2);
  return false;
}
function hide(selector) {
  var dialog = $(selector);
  var background = $('.modal-background');
  var body = $('body');
  dialog.hide();
  dialog.css("max-width", "");
  dialog.css("max-height", "");
  dialog.css("top", "");
  dialog.css("left", "");
  background.hide();
  body.css("overflow", "");
  return false;
}
