$(document).bind("mobileinit", function(){
    $.mobile.page.prototype.options.addBackBtn= false;
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;

    $(document).on('pagehide', function (event, ui) {
      $(".ui-page").not(".ui-page-active").remove()
    });
});