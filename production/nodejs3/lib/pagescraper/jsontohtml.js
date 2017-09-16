// jsontohtml.js
// Extract html from a json reponse
// © Harald Rudell 2012 MIT License

module.exports = {
	jsonToHtml: jsonToHtml,
}

// parse json to object, extract key property
// return value: string on success otherwise an Error
function jsonToHtml(jsonString, key) {
	var result

	// convert json to object
	var obj
	if (typeof key != 'string') {
		result = Error('Bad key for json')
	} else {
		try {
			obj = JSON.parse(jsonString)
		} catch (e) {
			result = e
		}
		if (!result && obj) {

			// extract the html
			var html = obj[key]
			if (typeof html == 'string' && html.length > 0) result = html
			else {
				result = Error('html encoded as json bad')
			}
		} else {
			result = Error('bad json response')
		}
	}

	if (result instanceof Error) {
		applego.anomaly(arguments.calleee.name, opts.url, err)
	}

	return result
}
