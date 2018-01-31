scripts
/crossbrowser.js
https://js.braintreegateway.com/web/3.6.3/js/client.min.js
https://js.braintreegateway.com/web/3.6.3/js/hosted-fields.min.js
lib/manifest.js
https://www.googletagmanager.com/gtm.js
iframe: https://www.googletagmanager.com/ns.html
aurelia-bootstrap.bundle.js
extern.bundle.js
aurelia.bundle.js
styles.bundle.js

app.bundle.js
All Resources/app.overpass.com/app.bundle.js
250k lines
seem to have 1333 entry points
each begins with: /***/ 0:
0: moments.js

exports begins with key: function(module, exports, ...)

Examine export 1002:
defined:
/***/ 1002:
used:
__webpack_require__(1002),

export 1333 line 42,649
- this is the entry point, and it is empty

"workforce/workforce.scss" line 250370

The file begins with invocation of webpackJsonp
- array 0
Object os key: number 0.., value: function
- array 1333
functios are also by name:

Their code is only in app.bundle.js

export:
"environment/dashboard/campaign/wizard/details/details.js"
require('aurelia-framework')
/components…

Each component has html scss and js
One component is list of users: admin/users.html