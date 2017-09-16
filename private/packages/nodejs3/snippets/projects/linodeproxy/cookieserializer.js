// cookieserializer.js
// from connect lib/utils.js

/**
 * Serialize the given object into a cookie string.
 *
 *      utils.serializeCookie('name', 'tj', { httpOnly: true })
 *      // => "name=tj; httpOnly"
 *
 * @param {String} name
 * @param {String} val
 * @param {Object} obj
 * @return {String}
 * @api private
 */

exports.serializeCookie = function(name, val, obj){
	var pairs = [name + '=' + encodeURIComponent(val)]
	var obj = obj || {}

	if (obj.domain) pairs.push('domain=' + obj.domain)
	if (obj.path) pairs.push('path=' + obj.path)
	if (obj.expires) pairs.push('expires=' + obj.expires.toUTCString())
	if (obj.httpOnly) pairs.push('httpOnly')
	if (obj.secure) pairs.push('secure')

	return pairs.join('; ')
}
