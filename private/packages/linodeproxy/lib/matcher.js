// matcher.js
// Match a string agains white and black lists of strings and RegExps
// © Harald Rudell 2012 MIT License

exports.match = match

/*
Evaluate a text string agains a series of matcher lists
- on a whitelist match, the return value is true
- on a blacklist match, the return value is false
- if there are no matches, the return value is object.default

opts: object
.default: boolean default false: return value if there are no matches at all
.matcherList: array of object

object.matcherList objects
.white: boolean default true: this matcher is a whitelist as opposed to a blacklist
.matcher: string or regexp or an array of these: what the text value is matched against
*/
function match(text, opts) {
	if (opts == null) opts = {}
	var result = !!opts.unmatched

	for (var matcherIndex in opts.matcherList) {
		var matcherElement = opts.matcherList[matcherIndex]
		var isMatch = false
		if (Array.isArray(matcherElement.matcher)) {
			for (var mIndex in matcherElement.matcher)
				if (isMatch = tryMatcher(matcherElement.matcher[mIndex])) break
		} else isMatch = tryMatcher(matcherElement.matcher)
		if (isMatch) {
			result = matcherElement.white !== false
			break
		}
	}

	return result

	// matcherObject: string or regexp
	function tryMatcher(matcherObject) {
		var result

		if (typeof matcherObject == 'string') result = matcherObject == text
		else if (matcherObject instanceof RegExp) result = matcherObject.test(text)

		return result
	}
}