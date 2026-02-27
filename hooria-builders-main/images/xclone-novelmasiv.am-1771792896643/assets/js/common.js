/**
 * Common Scripts.
 *
 * @package  wp-configurator-pro/assets/frontend/js/
 * @since  3.1
 * @version  3.4.4
 */
(function ($, window, document) {
    'use strict';

    /*
     * On Document Ready
     */
    $(document).ready(function ($) {
        $('.js-wpc-single-menu').each(function () {
            var navHtml = $(this).html();
            $('.wpc-mobile-inner').prepend(navHtml);
        });

        $('.js-wpc-menu-trigger').on('click', function () {
            $('.wpc-mobile-nav').toggleClass('active');
        });

        $('.js-wpc-mobile-nav-close-trigger').on('click', function () {
            $('.wpc-mobile-nav').toggleClass('active');
        });

        $('.js-wpc-menu-toggle').on('click', function () {
            $(this).closest('li').find('.sub-menu').slideToggle(400);
        });

        $('.js-wpc-description-tooltip-trigger').on('click', function (e) {

            e.stopPropagation();
            const $self = $( this );

            const $wrap = $self.closest( '.wpc-layer-title-desc-wrap' );

            $wrap.toggleClass( 'active' );
        });

        if ($('.wpc-carousel-slider').length) {
            $('.wpc-carousel-slider').wpcCarousel({
                loop: false,
                responsive: {
                    0: {
                        items: 1,
                    },
                    768: {
                        items: 2,
                    },
                    991: {
                        items: 3,
                    },
                    1199: {
                        items: 3,
                    },
                },
            });
        }

        /*
         * Cart Form, Get a Quote and Contact Form 7
         */

        $('.js-wpc-submit-form-trigger').on('click', function (e) {
            e.preventDefault();

            let $self = $(this),
                configID = wpc.getConfigID($self),
                form = $self.data('form');

            if ('cart-form' === form) {
                $(
                    '[data-cart-form][data-config-id="' +
                        configID +
                        '"] .js-wpc-submit-cart-form'
                ).trigger('click');
            }
        });

        $('body').on(
            'change',
            '.wpc-cart-form input[name="quantity"]',
            function (e) {
                e.preventDefault();

                let el = this,
                    configID = wpc.getConfigID($(el));

                wpc.do_action('wpc_quantity_input_changed', { configID, el });
            }
        );

        $('body').on('click', '.js-view-configurations', function (e) {
            e.preventDefault();

            let $self = $(this),
                $wrap = $self.closest('.wpc-cart-form-cart-item');

            $wrap.find('.variation').slideToggle(400);
        });

        $('body').on('click', '[data-open-popup-id]', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $self = $(this),
                configID = wpc.getConfigID($self),
                popID = $self.data('open-popup-id'),
                popType = $self.data('popup-type'),
                $wrap = $(`[data-popup-id="${popID}"]`).closest(
                    `[data-popup][data-config-id="${configID}"]`
                );

            $('body, html').addClass('wpc-popup-initialized');

            $('[data-close-flyin]').trigger('click');

            $('[data-popup]').find('.error').empty();

            $('[data-popup]').removeClass(
                'wpc-popup-floating wpc-popup-full wpc-popup-partial wpc-popup-center wpc-popup-center-overflow'
            );

            $wrap.addClass(`wpc-popup-active wpc-popup-${popType}`);

            $wrap
                .find(`[data-popup-id="${popID}"]`)
                .addClass('active')
                .siblings()
                .removeClass('active');
        });

        $('[data-close-popup]').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            $('body, html').removeClass('wpc-popup-initialized');

            $('[data-popup]').removeClass(
                'wpc-popup-floating wpc-popup-full wpc-popup-partial wpc-popup-center wpc-popup-center-overflow wpc-popup-active'
            );
            $('[data-popup-id]').removeClass('active');
        });

        $('.js-wpc-zoom-img').on('click', function (event) {
            var $self = $(this),
                configID = $self.data('id'),
                $wrap = $(`.wpc-magnify-wrapper[data-config-id="${configID}"]`),
                $store = wpc.getStore(configID);

            $wrap.addClass('wpc-loading');

            wpc.buildActivePreviewImage($store, false, event);

            $wrap.addClass('active');
        });

        if ('undefined' !== typeof wpc) {
            wpc.add_action(
                'wpc_after_canvas_created',
                function ({ $store, canvas, event }) {
                    if (!$(event.currentTarget).hasClass('js-wpc-zoom-img')) {
                        return;
                    }

                    const configID = $store.configID;

                    const $wrap = $(
                        `.wpc-magnify-wrapper[data-config-id="${configID}"]`
                    );

                    let dataUrl = canvas.toDataURL();

                    if (dataUrl) {
                        $wrap
                            .find('.wpc-magnify')
                            .append(
                                `<img src="${dataUrl}" class="zoom" data-magnify-src="${dataUrl}">`
                            );
                        $wrap.find('img').magnify();
                    }

                    $wrap.removeClass('wpc-loading');
                }
            );

            wpc.add_action('wpc_data_changeimage', function ({ $self }) {
                $('body').removeClass('slide-left slide-right');
                $('[data-flyin-id]').removeClass('active');
            });
        }

        $('.js-wpc-submit-cart-form').on('click', function (e) {
            e.preventDefault();
            let $self = $(this),
                configID = wpc.getConfigID($self),
                $form = $(`[data-config-id="${configID}"] .wpc-cart-form`);

            wpc.beforeSubmitForm('cart-form', $form);
        });

        $('.wpc-config-element').on('submit', '.wpc-quote-form', function (e) {
            e.preventDefault();

            wpc.beforeSubmitForm('quote-form', $(this));
        });

        $('.wpc-contact-form .wpcf7-submit').on('click', function (e) {
            e.preventDefault();

            var $form = $(this).closest('form');

            wpc.beforeSubmitForm('contact-form', $form);
        });

        $('.wpc-magnify-wrapper .js-wpc-close-magnify').on(
            'click',
            function (e) {
                e.preventDefault();

                var $self = $(this),
                    $wrap = $self.closest('.wpc-magnify-wrapper');

                $wrap.find('.magnify').remove();
            }
        );

        // Flyin
        $('body').on('click', '[data-open-flyin-id]', function (e) {
            e.preventDefault();

            $('[data-close-flyin]').trigger('click');

            var $self = $(this),
                flyinID = $self.data('open-flyin-id'),
                flyinPosition = $self.data('flyin-position'),
                $wrap = $(`[data-flyin-id="${flyinID}"]`);

            $('body').toggleClass(`slide-${flyinPosition}`);
            $wrap.toggleClass('active');
        });

        $('[data-close-flyin]').on('click', function (e) {
            e.preventDefault();

            $('body').removeClass('slide-left slide-right');
            $('[data-flyin-id]').removeClass('active');
        });
    });
})(jQuery, window, document);
