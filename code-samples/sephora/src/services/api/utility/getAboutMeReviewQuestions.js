const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+About+Me+Review+Questions+API

function getAboutMeReviewQuestions(productId) {
    let url = restApi.getRestLocation(
            '/api/util/aboutMeQuestions?productId=' + productId);
    return refetch.fetch(url).
        then(data => data.errorCode ? Promise.reject(data) : data);
}

module.exports = getAboutMeReviewQuestions;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/getAboutMeReviewQuestions.js