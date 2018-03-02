(function ($) {

    var slider = $('.bxslider').bxSlider({
        mode: 'horizontal'
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });
    $('.scrollup').click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
        return false;
    });

    wow = new WOW({}).init();

})(jQuery);



