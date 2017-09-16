console.log(require('./lib/tagfinder').decomposeHtml('<!doctype html><title class="c1 c2" id=p>x</title>'))
var x = require('./lib/tagfinder').decomposeHtml('<!doctype html><title class="c1 c2" id=p>x</title>')
console.log(x.tags[0])
