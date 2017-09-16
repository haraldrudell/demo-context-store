// regexphtml.js

var string = 's<!a><tag' +
	' single = \'value1\'' +
	' double="value2"' +
	' unquoted= value3 ' +
	'   empty  ' +
	'></a><tag2/><tag3 />'

// building blocks
var tagName = '[a-zA-Z\\d]+'
var spaceRange = ' \\t\\n\\f\\r'
var controlRange = '\\u0000-\\u001f\\u007f'
var singleQuote = '\''
var doubleQuote = '"'
var funnyCharacters = singleQuote + doubleQuote + '=<>'
var backTick = '`'
var attributeName = '[^' + spaceRange + controlRange + funnyCharacters + '\\u0000/]+'
var mandatorySpace = '[' + spaceRange + ']+'
var optionalSpace = '[' + spaceRange + ']*'
var singleQuotedAttributeValue = singleQuote + '[^' + singleQuote + ']*' + singleQuote
var doubleQuotedAttributeValue = doubleQuote + '[^' + doubleQuote + ']*' + doubleQuote
var unquotedAttributeValue = '[^' + spaceRange + funnyCharacters + backTick + ']+'

noncap()
//complete()
//single()

//unquoteddouble()
//double()
//unquoted()
//emptyAttribute()
//tagNameOnly()
// tagname only
function tagNameOnly() {
	var regExp = new RegExp('<' +tagName +
	optionalSpace + '\/?>', 'gm')

	doMatch(' <tag2/> <tag3 />', regExp)
}
function empty() {
	var regExp = new RegExp('<' +tagName +
		'(' + mandatorySpace + attributeName + ')' +
		optionalSpace + '\/?>', 'gm')

	var string = ' <tag> <tag1 > <tag2 x> <tag3 y > <tag4/> <tag5 /> <tag6 x/> <tag7 x />'
	doMatch(string, regExp)
}

function unquoted() {
	var regExp = new RegExp('<' +tagName +
		'(' + mandatorySpace + attributeName + '(|' +
			optionalSpace + '=' + optionalSpace + unquotedAttributeValue +
		'))' +
		optionalSpace + '\/?>', 'gm')

	var string = ' <tag z> <tag1 a=b> <tag2 a = b />'
	doMatch(string, regExp)
}

function double() {
	var regExp = new RegExp('<' +tagName +
		'(' + mandatorySpace + attributeName + '(|' +
			optionalSpace + '=' + optionalSpace + doubleQuotedAttributeValue +
		'))' +
		optionalSpace + '\/?>', 'gm')

	var string = ' <tag z> <tag1 a="b"> <tag2 a = "b" />'
	doMatch(string, regExp)
}

function unquoteddouble() {
	var regExp = new RegExp('<' +tagName +
		'(' + mandatorySpace + attributeName + '(|' +
			optionalSpace + '=' + optionalSpace + '(' +
				doubleQuotedAttributeValue + '|' +
				unquotedAttributeValue +
		')))' +
		optionalSpace + '\/?>', 'gm')

	var string = ' <tag z> <tag1 a="b"> <tag2 a = "b" />'
	doMatch(string, regExp)
}

function single() {
	var regExp = new RegExp('<' +tagName + '(' + 
			mandatorySpace + attributeName + '(|' +
				optionalSpace + '=' + optionalSpace + singleQuotedAttributeValue +
		'))*' + optionalSpace + '\/?>', 'gm')

	var string = ' <tag z> <tag1 a=\'b\'> <tag2 a=\'b\' c = \'d\' />'
	doMatch(string, regExp)
}


// regexp
function complete() {
	var regExp = new RegExp('<' +tagName + '(' +
			mandatorySpace + attributeName + '(|' +
					optionalSpace + '=' + optionalSpace + '(' +
						unquotedAttributeValue + '|' +
						singleQuotedAttributeValue + '|' +
						doubleQuotedAttributeValue +
		')))*' + optionalSpace + '\/?>', 'gm')
	//var string = ' <tag z> <tag1 a=\'b\' cc = "dd" />'
	doMatch(string, regExp)
}

function noncap() {
	var regExp = new RegExp('<' +tagName + '((?:' +
			mandatorySpace + attributeName + '(?:|' +
					optionalSpace + '=' + optionalSpace + '(?:' +
						unquotedAttributeValue + '|' +
						singleQuotedAttributeValue + '|' +
						doubleQuotedAttributeValue +
		')))*)' + optionalSpace + '(\/)?>', 'gm')
	//var string = ' <tag z> <tag1 a=\'b\' cc = "dd" />'
	doMatch(string, regExp)
}


function literal() {
	var regExp = /<+.*\/>/g	
	doMatch(regExp)
}
	
function doMatch(string, regExp) {
	console.log(regExp)
	var match
	for (var i = 0; i < 10; i++) {
		match = regExp.exec(string)
		console.log(match)
		if (!match) break
	}
}