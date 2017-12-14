let cacheConcern = (() => {
    let cache = {};

    function decorate(cacheNamespace, decoratedMethod) {
        if (!cache[cacheNamespace]) {
            cache[cacheNamespace] = {};
        }

        let decorated = function (...callArgs) {
            let cacheKey = callArgs.map(arg =>
                typeof(arg) === 'object' ? JSON.stringify(arg) : arg
            ).join(',');

            let promise;

            if (cache[cacheNamespace][cacheKey]) {
                console.debug('CACHE HIT:', cacheNamespace, cacheKey);
                promise = Promise.resolve(cache[cacheNamespace][cacheKey]);
            } else {
                promise = decoratedMethod.apply(null, callArgs).then(data => {
                    cache[cacheNamespace][cacheKey] = data;
                    return data;
                });
            }

            return promise;
        };

        return decorated;
    }

    function clearCache(namespace) {
        if (!namespace) {
            cache = {};
        } else {
            cache[namespace] = {};
        }
    }

    return {
        clearCache,
        decorate
    };
})();

module.exports = cacheConcern;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/cache.js