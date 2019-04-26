/*global window,wp,Glide, document,breakPoints_990,breakPoints_810,breakPoints_650,breakPoints_490,breakPoints_400, getSiblings ,setInterval, clearInterval,getElements,getElement,getNextSibling,getPrevSibling,setAttributes,getComputedStyle,pageDirection,console*/
/*jslint es6 */


/*====== Gutenberg Components ==========*/
const {__} = wp.i18n;
const {registerBlockType} = wp.blocks;
const {withInstanceId} = wp.compose;
/*===== Editable Components =====*/
const {
    PlainText,
    InspectorControls,
    InnerBlocks,
    RichText,
    Editable,
    MediaUpload,
    MediaUploadCheck,
    AlignmentToolbar,
    BlockControls
} = wp.editor;
/*===== Editor Components =====*/
const {
    Draggable,
    Panel,
    PanelBody,
    PanelRow,
    SelectControl,
    Button,
    DropdownMenu,
    withAPIData,
    TextControl,
    ServerSideRender,
    RangeControl,
    FormFileUpload,
    BaseControl
} = wp.components;
/*===== Editor Elements Components =====*/
const {Component, Fragment} = wp.element;
/*===== Editor Dynamic Data =====*/
const {withSelect, dispatch} = wp.data;
/*===== Editor Component Wraper =====*/
const {createHigherOrderComponent} = wp.compose;
var breakPoints_990 = 990,
    breakPoints_810 = 810,
    breakPoints_650 = 650,
    breakPoints_490 = 490;
    breakPoints_400 = 440;
//===== Reload Sliders =====//
function reloadSliders(slideName) {
    'use strict';
    //==== Testimonials Slider Reload ====//
    if (slideName === 'testimonials') {
        //==== Testimonials Slider ====//
        var testimonialsSliderElement = getElements('.testimonials-slider');
        Array.from(testimonialsSliderElement).forEach(function (testimonialsSliderElement) {
            var testimonialsSlider = new Glide(testimonialsSliderElement, {
                type: 'carousel',
                autoplay: 7000,
                animationDuration: 1000,
                hoverpause: true,
                perView: 2,
                gap: 30,
                Breakpoint: {
                    breakPoints_650: {perView: 1, peek: {before: 0, after: 0}}
                }
            });

            testimonialsSlider.mount();

            if (pageDirection === 'rtl') {
                testimonialsSlider.update({direction: 'rtl'});
            }
        });
    //==== Blog Slider Reload ====//
    } else if (slideName === 'blog') {
        //==== Blog Slider ====//
        var blogSliderElement = getElements('.blog-slider');
        Array.from(blogSliderElement).forEach(function (blogSliderElement) {
            var blogSlider = new Glide(blogSliderElement, {
                type: 'carousel',
                autoplay: 7000,
                animationDuration: 1000,
                hoverpause: true,
                perView: 2,
                gap: 30,
                Breakpoint: {
                    breakPoints_810: {perView: 1, peek: {before: 100, after: 100}},
                    breakPoints_490: {peek: {before: 50, after: 50}}
                }
            });

            blogSlider.mount();

            if (pageDirection === 'rtl') {
                blogSlider.update({direction: 'rtl'});
            }
        });
    //==== Store Slider Reload ====//
    } else if (slideName === 'store') {
        //==== Store Slider ====//
        var storeSliderElement = getElements('.store-slider');
        Array.from(storeSliderElement).forEach(function (storeSliderElement) {
            var storeSlider = new Glide(storeSliderElement, {
                type: 'carousel',
                autoplay: 7000,
                animationDuration: 1000,
                hoverpause: true,
                perView: 3,
                gap: 30,
                Breakpoint: {
                    breakPoints_990: {perView: 2, peek: {before: 100, after: 100}},
                    breakPoints_650: {perView: 2, peek: {before: 0, after: 0}},
                    breakPoints_400: {perView: 3, peek: {before: 50, after: 50}}
                }
            });

            storeSlider.mount();

            if (pageDirection === 'rtl') {
                storeSlider.update({direction: 'rtl'});
            }
        });
    //==== Testimonials Single Slider Reload ====//
    } else if (slideName === 'testimonials-single') {
        var testimonialsSliderSingle = getElements('.testimonials-slider-2');
        Array.from(testimonialsSliderSingle).forEach(function (testimonialsSliderSingle) {
            var testimonialsSingle = new Glide(testimonialsSliderSingle, {
                type: 'slider',
                autoplay: 7000,
                animationDuration: 1000,
                hoverpause: true,
                perView: 1
            });

            testimonialsSingle.mount();

            if (pageDirection === 'rtl') {
                testimonialsSingle.update({direction: 'rtl'});
            }
        });
    //==== Categories Slider Reload ====//
    } else if (slideName === 'categories') {
        //==== Categories Slider ====//
        var categoriesSliderElement = getElements('.categories-slider');
        Array.from(categoriesSliderElement).forEach(function (categoriesSliderElement) {
            var categoriesSlider = new Glide(categoriesSliderElement, {
                type: 'carousel',
                autoplay: 7000,
                animationDuration: 1000,
                hoverpause: true,
                perView: 4,
                gap: 30,
                Breakpoint: {
                    breakPoints_990: {perView: 3},
                    breakPoints_650: {perView: 2, peek: {before: 50, after: 50}},
                    breakPoints_400: {perView: 1}
                }
            });

            categoriesSlider.mount();

            if (pageDirection === 'rtl') {
                categoriesSlider.update({direction: 'rtl'});
            }
        });
    //==== Portfolio Slider Reload ====//
    } else if (slideName === 'portfolio') {
        //==== Portfolio Slider ====//
        var portfolioSliderElement = getElements('.portfolio-slider');
        Array.from(portfolioSliderElement).forEach(function (portfolioSliderElement) {
            var portfolioSlider = new Glide(portfolioSliderElement, {
                type: 'carousel',
                animationDuration: 1000,
                hoverpause: true,
                perView: 1
            });

            portfolioSlider.mount();

            if (pageDirection === 'rtl') {
                portfolioSlider.update({direction: 'rtl'});
            }
        });
    //==== Details Slider Reload ====//
    //==== Blog Slider Reload ====//
    } else if (slideName === 'details') {
        //==== Details Slider ====//
        var detailsSliderElement = getElements('.details-slider');
        Array.from(detailsSliderElement).forEach(function (detailsSliderElement) {
            var detailsSlider = new Glide(detailsSliderElement, {
                type: 'carousel',
                animationDuration: 1000,
                hoverpause: true,
                perView: 1
            });

            detailsSlider.mount();

            if (pageDirection === 'rtl') {
                detailsSlider.update({direction: 'rtl'});
            }
        });
    //==== Blog Slider Reload ====//
    }
}

//===== Reload Modals ======//
function reloadModals() {
    'use strict';
    /*=====> Open Modal Button <=====*/
    var modalButton = getElements('*[data-modal]');
    Array.from(modalButton).forEach(function (modalButton) {
        modalButton.addEventListener('click', function (event) {
            event.preventDefault();
            //==== Call Back Function Before Opens the Modal ====//
            if (modalButton.hasAttribute('data-call-before')) {
                var callBackBefore = modalButton.getAttribute('data-call-before');
                window[callBackBefore]();
            }
            //==== Open the Modal ====//
            var modalID = modalButton.getAttribute('data-modal');
            getElement('#' + modalID).classList.add('active');
            //==== Call Back Function After Opens the Modal ====//
            if (modalButton.hasAttribute('data-call-after')) {
                var callBackAfter = modalButton.getAttribute('data-call-after');
                window[callBackAfter]();
            }
        });
    });

    /*=====> Close Modal by Overlay <=====*/
    var modalOverlay = getElements('.modal-overlay');
    Array.from(modalOverlay).forEach(function (modalOverlay) {
        modalOverlay.addEventListener('click', function (event) {
            event.preventDefault();
            //==== Call Back Function Before Close the Modal ====//
            if (modalOverlay.hasAttribute('data-call-before')) {
                var callBackBefore = modalOverlay.parentNode.getAttribute('data-call-before');
                window[callBackBefore]();
            }
            //==== Close the Modal ====//
            modalOverlay.parentNode.classList.remove('active');
            //==== Call Back Function After Close the Modal ====//
            if (modalOverlay.hasAttribute('data-call-after')) {
                var callBackAfter = modalOverlay.parentNode.getAttribute('data-call-after');
                window[callBackAfter]();
            }
        });
    });

    /*=====> Close Modal Button <=====*/
    var closeModal = getElements('.close-modal');
    Array.from(closeModal).forEach(function (closeModal) {
        closeModal.addEventListener('click', function (event) {
            event.preventDefault();
            //==== Call Back Function Before Close the Modal ====//
            if (closeModal.hasAttribute('data-call-before')) {
                var callBackBefore = closeModal.closest('.modal-box').getAttribute('data-call-before');
                window[callBackBefore]();
            }
            //==== Close the Modal ====//
            closeModal.closest('.modal-box').classList.remove('active');
            //==== Call Back Function After Close the Modal ====//
            if (closeModal.hasAttribute('data-call-after')) {
                var callBackAfter = closeModal.closest('.modal-box').getAttribute('data-call-after');
                window[callBackAfter]();
            }
        });
    });
}