//Load Signal (Tag Management System)
(function () {

    //Start loading Signal
    var tagjs = document.createElement('script');
    var s = document.getElementsByTagName('script')[0];

    tagjs.text = '{\'site\':\'FF7LCmo\'}';
    tagjs.async = true;
    tagjs.src = '//s.btstatic.com/tag.js';
    s.parentNode.insertBefore(tagjs, s);

}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/loadTagManagementSystem.js