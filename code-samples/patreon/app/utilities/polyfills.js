require('array.prototype.find').shim()
require('array-includes').shim()
require('string.prototype.startswith')
require('string.prototype.endswith')
require('string.prototype.includes')
if (!Number.parseInt) Number.parseInt = parseInt



// WEBPACK FOOTER //
// ./app/utilities/polyfills.js