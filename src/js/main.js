document.addEventListener('DOMContentLoaded', function () {
// PRODUCTS DESKTOP CAROUSEL
    var owlBanner = $('.owl-carousel.main-banner__owl-carousel');
    owlBanner.owlCarousel({
        items: 1,
        loop: true,
    });

    $('.main-banner__carousel-next').click(function () {
        owlBanner.trigger('next.owl.carousel');
    });
    $('.main-banner__carousel-prev').click(function () {
        // With optional speed parameter
        // Parameters has to be in square bracket '[]'
        owlBanner.trigger('prev.owl.carousel');
    });
});
