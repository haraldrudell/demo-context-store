// This module contains common logic used in private and public BeautyBoard
// profiles.


const userUtils = require('utils/User');
const olapicLovesApi = require('services/api/thirdparty/OlapicLoves');


function Look(data) {
    this._data = data;
}

Object.defineProperty(Look.prototype, 'medium', {
    get: function() {
        return this._data.medium;
    }
});

Object.defineProperty(Look.prototype, 'socialInfo', {
    get: function() {
        return this._data.socialInfo;
    }
});

Object.defineProperty(Look.prototype, 'numLoves', {
    get: function() {
        return this._data.numLoves;
    }
});

Object.defineProperty(Look.prototype, 'isLoved', {
    get: function() {
        return this._data.isLoved;
    }
});


function getFullLooks(media) {
    let mediaIds = media.map(medium => medium.id);
    let getLovedMediaData = userUtils.validateUserStatus().
            then(user => user.publicId).
            then(userPublicId =>
                    olapicLovesApi.getLovedMediaData(userPublicId, mediaIds));

    return getLovedMediaData.then(data => {
        // (!) Later, we'll have to add social lookup block onto each look
        // telling who the owner of the look is. For that reason, we'll need to
        // make a bunch of Lithium calls. Setting look's socialInfo piece to
        // null until then.

        return media.map(medium => new Look({
            medium,
            socialInfo: null,
            numLoves: data.lovesCountsMap[medium.id],
            isLoved: data.lovedByUser.indexOf(medium.id) >= 0
        }));
    });
}


module.exports = {
    getFullLooks
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/BeautyBoard.js