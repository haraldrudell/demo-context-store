module.exports = (function () {
    // this will not work for Header and Footer on legacy pages, as they are considered
    // to be the same on all pages and their `location` is considered as `home page` always

    let Location = {};
    const basketURL = /^\/basket*/;
    const productReviewsPageURL = /^\/reviews*/;
    const addReviewPageURL = /^\/addReview*/;
    const productURL = /product*/;
    const CUSTOM_SETS_HASH = '#customsets';
    function getLocation() {
        return Sephora.location ? Sephora.location :
            !Sephora.isRootRender ? window.location : {
                pathname: ''
            };
    }

    function setLocation(url) {
        let location = Location.getLocation();
        location.href = url;
    }

    function isBasketPage() {
        let location = Location.getLocation();
        return location.pathname && !!location.pathname.match(basketURL);
    }

    function isProductReviewsPage() {
        let location = Location.getLocation();
        return location.pathname && !!location.pathname.match(productReviewsPageURL);
    }

    function isAddReviewPage() {
        let location = Location.getLocation();
        return location.pathname && !!location.pathname.match(addReviewPageURL);
    }

    function isGalleryPage() {
        let location = Location.getLocation();
        return (location.pathname === '/gallery' ||
            location.pathname === '/gallery/');
    }

    function isGalleryAlbumPage() {
        let location = Location.getLocation();
        return /\/gallery\/album\/.*/.test(location.pathname);
    }

    function isCustomSets(hash) {
        return new RegExp(CUSTOM_SETS_HASH).test(hash || Location.getLocation().hash);
    }

    function isMyProfilePage() {
        let location = Location.getLocation();
        return location.pathname === '/profile/me';
    }

    function isRichProfilePage() {
        let location = Location.getLocation();
        return location.pathname.indexOf('/profile') === 0;
    }

    function isCheckout() {
        let location = Location.getLocation();
        return location.pathname.indexOf('/checkout') === 0;
    }

    function isPreview() {
        let location = Location.getLocation();
        return location.pathname.indexOf('/preview') === 0;
    }

    function isHomePage() {
        return Sephora.pagePath === 'Homepage/Homepage';
    }

    function isProductPage() {
        let location = Location.getLocation();
        return location.pathname && !!location.href.match(productURL);
    }

    function isGalleryProfilePage() {
        let location = Location.getLocation();
        return (location.pathname === '/myprofile' ||
            location.pathname === '/myprofile/photos' ||
            location.pathname === '/gallery/myprofile/photos' ||
            location.pathname === '/gallery/myprofile/loved');
    }

    function reload() {
        window.location.reload();
    }

    Location = {
        isBasketPage,
        isProductReviewsPage,
        isAddReviewPage,
        isMyProfilePage,
        isRichProfilePage,
        isPreview,
        isCheckout,
        isHomePage,
        isGalleryPage,
        isProductPage,
        isGalleryProfilePage,
        isGalleryAlbumPage,
        isCustomSets,
        getLocation,
        setLocation,
        reload,
        PAGES: { CUSTOM_SETS_HASH: CUSTOM_SETS_HASH }
    };

    return Location;
}());



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Location.js