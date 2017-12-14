const TYPES = {
    HOVERED_CAROUSEL_ITEM: 'HOVERED_CAROUSEL_ITEM',
    MOVED_OVER_CAROUSEL_ITEM: 'MOVED_OVER_CAROUSEL_ITEM',
    CLICKED_CAROUSEL_ITEM: 'CLICKED_CAROUSEL_ITEM'
};

module.exports = {

    TYPES: TYPES,

    carouselItemHovered: function (carouselName, itemIndex, isHovered) {
        return {
            type: TYPES.HOVERED_CAROUSEL_ITEM,
            carouselName: carouselName,
            isHovered: isHovered,
            itemIndex: itemIndex
        };
    },

    carouselItemMovedOver: function (carouselName, itemIndex, coords) {
        return {
            type: TYPES.MOVED_OVER_CAROUSEL_ITEM,
            carouselName: carouselName,
            itemIndex: itemIndex,
            coords: coords
        };
    },

    carouselItemClicked: function (carouselName, itemIndex) {
        return {
            type: TYPES.CLICKED_CAROUSEL_ITEM,
            carouselName: carouselName,
            itemIndex: itemIndex
        };
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/CarouselActions.js