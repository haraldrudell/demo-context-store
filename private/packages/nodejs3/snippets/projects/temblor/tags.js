// tags.js

var tagRegExp = /<([a-zA-Z\d]+)((?:[ \t\n\f\r]+[^ \t\n\f\r\u0000-\u001f\u007f'"=<>\u0000\/]+(?:|[ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r'"=<>`]+|'[^']*'|"[^"]*")))*)[ \t\n\f\r]*(\/)?>/gm

var attributeRegExp = /^[ \t\n\f\r]*([^ \t\n\f\r\u0000-\u001f\u007f'"=<>\u0000\/]+)(?:[ \t\n\f\r]*=[ \t\n\f\r]*([^ \t\n\f\r'"=<>`]+|'[^']*'|"[^"]*"))/m
var emptyAttributeRegExp = /^[ \t\n\f\r]*([^ \t\n\f\r\u0000-\u001f\u007f'"=<>\u0000\/]+)/

var string = 's<!a><tag' +
	' single = \'value1\'' +
	' double="value2"' +
	' unquoted= value3 ' +
	'   empty  ' +
	'></a><tag2/><tag3 />'
/*
[ '<tag3 />',
  undefined,
  '/',
  index: 83,
  input: 's<!a><tag single = \'value1\' double="value2" unquoted= value3    empty  ></a><tag2/><tag3 />' ]
*/

tagRegExp.exec()

var tagData

for (;;) {

	// find the next opening tag in the html markup
	var match = tagRegExp.exec(string)
	if (!match) break
	var tagData = {
		tag: match[1],
		start: match.index,
		end: match.index + match[0].length,
		voidElement: !!match[3],
		attributes: {},
	}

	// parse possible attributes
	if (match[2]) {
		var attributes = match[2]
		for (;;) {
			var attMatch = attributeRegExp.exec(attributes)
			if (!attMatch) attMatch = emptyAttributeRegExp.exec(attributes)
			if (!attMatch) break

			var name = attMatch[1]
			var value = attMatch[2]
			if (value && (value[0] == '"' || value[0] == '\'')) value = value.substring(1, value.length - 1)
			tagData.attributes[name] = value
			attributes = attributes.substring(attMatch.index + attMatch[0].length)
			if (!attributes) break
		}
	}
	console.log(tagData)
}
