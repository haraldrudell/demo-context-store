module.exports = (function () {
    const TLS_REQUIRED = [
        'shopping-cart',
        'basket', //api/basket',
        'bulk', //api/bulk',
        'checkout', //api/checkout',
        'my', //api/my',
        'users', // rest/users,
        'auth', // rest/auth
        'secure', // rest/forgotpassword
        'ssi'    // rest/ssi
    ];

    /**
     * Generates the proper    non/SSL/TLS host connection string
     * (i.e., https://localhost:3001)
     * @param {String} path '/path/to/endpoint?query=foo'
     * @return {String}
     */
    function getRestLocation(path) {

        let host;
        let port;
        let exPath = path.split('/');
        let useTls = TLS_REQUIRED.indexOf(exPath[2]) > -1;

        if (exPath[2] === 'users' && exPath[5] === 'check') {
            useTls = false;
        }

        if (useTls) {
            let sslPort = Sephora.sslPort;

            host = Sephora.host || window.location.hostname;
            port = (typeof sslPort === 'undefined' || sslPort === 443 || sslPort === '') ?
                ''
            :
                ':' + sslPort;
            return ['https://', host, port, path].join('');
        }

        return path;
    }

    return {
        getRestLocation: getRestLocation
    };
})();



// WEBPACK FOOTER //
// ./public_ufe/js/utils/RestApi.js