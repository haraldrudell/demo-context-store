// regexpmultiline.js
// The multiline flag of JavaScript regular expressions
// © Harald Rudell 2012 <harald@therudells.com> All rights reserved.

var p = require('./jsutil').p
var pEval = require('./jsutil').pEval

p('The multiline flag of JavaScript regular expressions')

/*
1.   All multiline does is that it affects the assertions ^ and $.
1a.  With multiline flag, these assertions consider multiline characters as beginning or end of text.
1b.  Without the multiline flag, line terminator characters are regular characters.
1c.  Line terminator characters in JavaScript are \n \r unicode line separator and unicode paragraph separator.
1d.  Matching a newline is platform dependent:: /(\r\n|\n|\r|\u2028|\u2029)/.exec(' a \n a  b ')
     2['\n', '\n', index: 3, input: ' a \n a  b ']
1e.  \r\n should be before \r and \n in the expression:: /(\r\n|\n|\r|\u2028|\u2029)/.exec(' a \r\n a  b ')
     2['\r\n', '\r\n', index: 3, input: ' a \r\n a  b ']
*/
p('All multiline does is that it affects the assertions ^ and $.', true)
p('With multiline flag, these assertions consider multiline characters as beginning or end of text.')
p('Without the multiline flag, line terminator characters are regular characters.')
p('Line terminator characters in JavaScript are \\n \\r unicode line separator and unicode paragraph separator.')
pEval('Matching a newline is platform dependent:', '/(\\r\\n|\\n|\\r|\\u2028|\\u2029)/.exec(\' a \\n a  b \')')
pEval('\\r\\n should be before \\r and \\n in the expression:', '/(\\r\\n|\\n|\\r|\\u2028|\\u2029)/.exec(\' a \\r\\n a  b \')')
