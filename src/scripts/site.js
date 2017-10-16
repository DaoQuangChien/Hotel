$(function() {
  $('.date-picker.input').datepicker();
  $('.fa.fa-calendar').click(function() {
    $('.date-picker.input').focus();
  })
});