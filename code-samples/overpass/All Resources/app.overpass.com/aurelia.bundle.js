webpackJsonp([1],{

/***/ 1299:
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, Promise, console) {/*!
 * validate.js 0.10.0
 *
 * (c) 2013-2016 Nicklas Ansman, 2013 Wrapp
 * Validate.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://validatejs.org/
 */

(function(exports, module, define) {
  "use strict";

  // The main function that calls the validators specified by the constraints.
  // The options are the following:
  //   - format (string) - An option that controls how the returned value is formatted
  //     * flat - Returns a flat array of just the error messages
  //     * grouped - Returns the messages grouped by attribute (default)
  //     * detailed - Returns an array of the raw validation data
  //   - fullMessages (boolean) - If `true` (default) the attribute name is prepended to the error.
  //
  // Please note that the options are also passed to each validator.
  var validate = function(attributes, constraints, options) {
    options = v.extend({}, v.options, options);

    var results = v.runValidations(attributes, constraints, options)
      , attr
      , validator;

    for (attr in results) {
      for (validator in results[attr]) {
        if (v.isPromise(results[attr][validator])) {
          throw new Error("Use validate.async if you want support for promises");
        }
      }
    }
    return validate.processValidationResults(results, options);
  };

  var v = validate;

  // Copies over attributes from one or more sources to a single destination.
  // Very much similar to underscore's extend.
  // The first argument is the target object and the remaining arguments will be
  // used as sources.
  v.extend = function(obj) {
    [].slice.call(arguments, 1).forEach(function(source) {
      for (var attr in source) {
        obj[attr] = source[attr];
      }
    });
    return obj;
  };

  v.extend(validate, {
    // This is the version of the library as a semver.
    // The toString function will allow it to be coerced into a string
    version: {
      major: 0,
      minor: 10,
      patch: 0,
      metadata: null,
      toString: function() {
        var version = v.format("%{major}.%{minor}.%{patch}", v.version);
        if (!v.isEmpty(v.version.metadata)) {
          version += "+" + v.version.metadata;
        }
        return version;
      }
    },

    // Below is the dependencies that are used in validate.js

    // The constructor of the Promise implementation.
    // If you are using Q.js, RSVP or any other A+ compatible implementation
    // override this attribute to be the constructor of that promise.
    // Since jQuery promises aren't A+ compatible they won't work.
    Promise: typeof Promise !== "undefined" ? Promise : /* istanbul ignore next */ null,

    EMPTY_STRING_REGEXP: /^\s*$/,

    // Runs the validators specified by the constraints object.
    // Will return an array of the format:
    //     [{attribute: "<attribute name>", error: "<validation result>"}, ...]
    runValidations: function(attributes, constraints, options) {
      var results = []
        , attr
        , validatorName
        , value
        , validators
        , validator
        , validatorOptions
        , error;

      if (v.isDomElement(attributes) || v.isJqueryElement(attributes)) {
        attributes = v.collectFormValues(attributes);
      }

      // Loops through each constraints, finds the correct validator and run it.
      for (attr in constraints) {
        value = v.getDeepObjectValue(attributes, attr);
        // This allows the constraints for an attribute to be a function.
        // The function will be called with the value, attribute name, the complete dict of
        // attributes as well as the options and constraints passed in.
        // This is useful when you want to have different
        // validations depending on the attribute value.
        validators = v.result(constraints[attr], value, attributes, attr, options, constraints);

        for (validatorName in validators) {
          validator = v.validators[validatorName];

          if (!validator) {
            error = v.format("Unknown validator %{name}", {name: validatorName});
            throw new Error(error);
          }

          validatorOptions = validators[validatorName];
          // This allows the options to be a function. The function will be
          // called with the value, attribute name, the complete dict of
          // attributes as well as the options and constraints passed in.
          // This is useful when you want to have different
          // validations depending on the attribute value.
          validatorOptions = v.result(validatorOptions, value, attributes, attr, options, constraints);
          if (!validatorOptions) {
            continue;
          }
          results.push({
            attribute: attr,
            value: value,
            validator: validatorName,
            globalOptions: options,
            attributes: attributes,
            options: validatorOptions,
            error: validator.call(validator,
                value,
                validatorOptions,
                attr,
                attributes,
                options)
          });
        }
      }

      return results;
    },

    // Takes the output from runValidations and converts it to the correct
    // output format.
    processValidationResults: function(errors, options) {
      var attr;

      errors = v.pruneEmptyErrors(errors, options);
      errors = v.expandMultipleErrors(errors, options);
      errors = v.convertErrorMessages(errors, options);

      switch (options.format || "grouped") {
        case "detailed":
          // Do nothing more to the errors
          break;

        case "flat":
          errors = v.flattenErrorsToArray(errors);
          break;

        case "grouped":
          errors = v.groupErrorsByAttribute(errors);
          for (attr in errors) {
            errors[attr] = v.flattenErrorsToArray(errors[attr]);
          }
          break;

        default:
          throw new Error(v.format("Unknown format %{format}", options));
      }

      return v.isEmpty(errors) ? undefined : errors;
    },

    // Runs the validations with support for promises.
    // This function will return a promise that is settled when all the
    // validation promises have been completed.
    // It can be called even if no validations returned a promise.
    async: function(attributes, constraints, options) {
      options = v.extend({}, v.async.options, options);

      var WrapErrors = options.wrapErrors || function(errors) {
        return errors;
      };

      // Removes unknown attributes
      if (options.cleanAttributes !== false) {
        attributes = v.cleanAttributes(attributes, constraints);
      }

      var results = v.runValidations(attributes, constraints, options);

      return new v.Promise(function(resolve, reject) {
        v.waitForResults(results).then(function() {
          var errors = v.processValidationResults(results, options);
          if (errors) {
            reject(new WrapErrors(errors, options, attributes, constraints));
          } else {
            resolve(attributes);
          }
        }, function(err) {
          reject(err);
        });
      });
    },

    single: function(value, constraints, options) {
      options = v.extend({}, v.single.options, options, {
        format: "flat",
        fullMessages: false
      });
      return v({single: value}, {single: constraints}, options);
    },

    // Returns a promise that is resolved when all promises in the results array
    // are settled. The promise returned from this function is always resolved,
    // never rejected.
    // This function modifies the input argument, it replaces the promises
    // with the value returned from the promise.
    waitForResults: function(results) {
      // Create a sequence of all the results starting with a resolved promise.
      return results.reduce(function(memo, result) {
        // If this result isn't a promise skip it in the sequence.
        if (!v.isPromise(result.error)) {
          return memo;
        }

        return memo.then(function() {
          return result.error.then(
            function(error) {
              result.error = error || null;
            },
            function(error) {
              if (error instanceof Error) {
                throw error;
              }
              v.error("Rejecting promises with the result is deprecated. Please use the resolve callback instead.");
              result.error = error;
            }
          );
        });
      }, new v.Promise(function(r) { r(); })); // A resolved promise
    },

    // If the given argument is a call: function the and: function return the value
    // otherwise just return the value. Additional arguments will be passed as
    // arguments to the function.
    // Example:
    // ```
    // result('foo') // 'foo'
    // result(Math.max, 1, 2) // 2
    // ```
    result: function(value) {
      var args = [].slice.call(arguments, 1);
      if (typeof value === 'function') {
        value = value.apply(null, args);
      }
      return value;
    },

    // Checks if the value is a number. This function does not consider NaN a
    // number like many other `isNumber` functions do.
    isNumber: function(value) {
      return typeof value === 'number' && !isNaN(value);
    },

    // Returns false if the object is not a function
    isFunction: function(value) {
      return typeof value === 'function';
    },

    // A simple check to verify that the value is an integer. Uses `isNumber`
    // and a simple modulo check.
    isInteger: function(value) {
      return v.isNumber(value) && value % 1 === 0;
    },

    // Checks if the value is a boolean
    isBoolean: function(value) {
      return typeof value === 'boolean';
    },

    // Uses the `Object` function to check if the given argument is an object.
    isObject: function(obj) {
      return obj === Object(obj);
    },

    // Simply checks if the object is an instance of a date
    isDate: function(obj) {
      return obj instanceof Date;
    },

    // Returns false if the object is `null` of `undefined`
    isDefined: function(obj) {
      return obj !== null && obj !== undefined;
    },

    // Checks if the given argument is a promise. Anything with a `then`
    // function is considered a promise.
    isPromise: function(p) {
      return !!p && v.isFunction(p.then);
    },

    isJqueryElement: function(o) {
      return o && v.isString(o.jquery);
    },

    isDomElement: function(o) {
      if (!o) {
        return false;
      }

      if (!o.querySelectorAll || !o.querySelector) {
        return false;
      }

      if (v.isObject(document) && o === document) {
        return true;
      }

      // http://stackoverflow.com/a/384380/699304
      /* istanbul ignore else */
      if (typeof HTMLElement === "object") {
        return o instanceof HTMLElement;
      } else {
        return o &&
          typeof o === "object" &&
          o !== null &&
          o.nodeType === 1 &&
          typeof o.nodeName === "string";
      }
    },

    isEmpty: function(value) {
      var attr;

      // Null and undefined are empty
      if (!v.isDefined(value)) {
        return true;
      }

      // functions are non empty
      if (v.isFunction(value)) {
        return false;
      }

      // Whitespace only strings are empty
      if (v.isString(value)) {
        return v.EMPTY_STRING_REGEXP.test(value);
      }

      // For arrays we use the length property
      if (v.isArray(value)) {
        return value.length === 0;
      }

      // Dates have no attributes but aren't empty
      if (v.isDate(value)) {
        return false;
      }

      // If we find at least one property we consider it non empty
      if (v.isObject(value)) {
        for (attr in value) {
          return false;
        }
        return true;
      }

      return false;
    },

    // Formats the specified strings with the given values like so:
    // ```
    // format("Foo: %{foo}", {foo: "bar"}) // "Foo bar"
    // ```
    // If you want to write %{...} without having it replaced simply
    // prefix it with % like this `Foo: %%{foo}` and it will be returned
    // as `"Foo: %{foo}"`
    format: v.extend(function(str, vals) {
      if (!v.isString(str)) {
        return str;
      }
      return str.replace(v.format.FORMAT_REGEXP, function(m0, m1, m2) {
        if (m1 === '%') {
          return "%{" + m2 + "}";
        } else {
          return String(vals[m2]);
        }
      });
    }, {
      // Finds %{key} style patterns in the given string
      FORMAT_REGEXP: /(%?)%\{([^\}]+)\}/g
    }),

    // "Prettifies" the given string.
    // Prettifying means replacing [.\_-] with spaces as well as splitting
    // camel case words.
    prettify: function(str) {
      if (v.isNumber(str)) {
        // If there are more than 2 decimals round it to two
        if ((str * 100) % 1 === 0) {
          return "" + str;
        } else {
          return parseFloat(Math.round(str * 100) / 100).toFixed(2);
        }
      }

      if (v.isArray(str)) {
        return str.map(function(s) { return v.prettify(s); }).join(", ");
      }

      if (v.isObject(str)) {
        return str.toString();
      }

      // Ensure the string is actually a string
      str = "" + str;

      return str
        // Splits keys separated by periods
        .replace(/([^\s])\.([^\s])/g, '$1 $2')
        // Removes backslashes
        .replace(/\\+/g, '')
        // Replaces - and - with space
        .replace(/[_-]/g, ' ')
        // Splits camel cased words
        .replace(/([a-z])([A-Z])/g, function(m0, m1, m2) {
          return "" + m1 + " " + m2.toLowerCase();
        })
        .toLowerCase();
    },

    stringifyValue: function(value) {
      return v.prettify(value);
    },

    isString: function(value) {
      return typeof value === 'string';
    },

    isArray: function(value) {
      return {}.toString.call(value) === '[object Array]';
    },

    // Checks if the object is a hash, which is equivalent to an object that
    // is neither an array nor a function.
    isHash: function(value) {
      return v.isObject(value) && !v.isArray(value) && !v.isFunction(value);
    },

    contains: function(obj, value) {
      if (!v.isDefined(obj)) {
        return false;
      }
      if (v.isArray(obj)) {
        return obj.indexOf(value) !== -1;
      }
      return value in obj;
    },

    unique: function(array) {
      if (!v.isArray(array)) {
        return array;
      }
      return array.filter(function(el, index, array) {
        return array.indexOf(el) == index;
      });
    },

    forEachKeyInKeypath: function(object, keypath, callback) {
      if (!v.isString(keypath)) {
        return undefined;
      }

      var key = ""
        , i
        , escape = false;

      for (i = 0; i < keypath.length; ++i) {
        switch (keypath[i]) {
          case '.':
            if (escape) {
              escape = false;
              key += '.';
            } else {
              object = callback(object, key, false);
              key = "";
            }
            break;

          case '\\':
            if (escape) {
              escape = false;
              key += '\\';
            } else {
              escape = true;
            }
            break;

          default:
            escape = false;
            key += keypath[i];
            break;
        }
      }

      return callback(object, key, true);
    },

    getDeepObjectValue: function(obj, keypath) {
      if (!v.isObject(obj)) {
        return undefined;
      }

      return v.forEachKeyInKeypath(obj, keypath, function(obj, key) {
        if (v.isObject(obj)) {
          return obj[key];
        }
      });
    },

    // This returns an object with all the values of the form.
    // It uses the input name as key and the value as value
    // So for example this:
    // <input type="text" name="email" value="foo@bar.com" />
    // would return:
    // {email: "foo@bar.com"}
    collectFormValues: function(form, options) {
      var values = {}
        , i
        , input
        , inputs
        , value;

      if (v.isJqueryElement(form)) {
        form = form[0];
      }

      if (!form) {
        return values;
      }

      options = options || {};

      inputs = form.querySelectorAll("input[name], textarea[name]");
      for (i = 0; i < inputs.length; ++i) {
        input = inputs.item(i);

        if (v.isDefined(input.getAttribute("data-ignored"))) {
          continue;
        }

        value = v.sanitizeFormValue(input.value, options);
        if (input.type === "number") {
          value = value ? +value : null;
        } else if (input.type === "checkbox") {
          if (input.attributes.value) {
            if (!input.checked) {
              value = values[input.name] || null;
            }
          } else {
            value = input.checked;
          }
        } else if (input.type === "radio") {
          if (!input.checked) {
            value = values[input.name] || null;
          }
        }
        values[input.name] = value;
      }

      inputs = form.querySelectorAll("select[name]");
      for (i = 0; i < inputs.length; ++i) {
        input = inputs.item(i);
        value = v.sanitizeFormValue(input.options[input.selectedIndex].value, options);
        values[input.name] = value;
      }

      return values;
    },

    sanitizeFormValue: function(value, options) {
      if (options.trim && v.isString(value)) {
        value = value.trim();
      }

      if (options.nullify !== false && value === "") {
        return null;
      }
      return value;
    },

    capitalize: function(str) {
      if (!v.isString(str)) {
        return str;
      }
      return str[0].toUpperCase() + str.slice(1);
    },

    // Remove all errors who's error attribute is empty (null or undefined)
    pruneEmptyErrors: function(errors) {
      return errors.filter(function(error) {
        return !v.isEmpty(error.error);
      });
    },

    // In
    // [{error: ["err1", "err2"], ...}]
    // Out
    // [{error: "err1", ...}, {error: "err2", ...}]
    //
    // All attributes in an error with multiple messages are duplicated
    // when expanding the errors.
    expandMultipleErrors: function(errors) {
      var ret = [];
      errors.forEach(function(error) {
        // Removes errors without a message
        if (v.isArray(error.error)) {
          error.error.forEach(function(msg) {
            ret.push(v.extend({}, error, {error: msg}));
          });
        } else {
          ret.push(error);
        }
      });
      return ret;
    },

    // Converts the error mesages by prepending the attribute name unless the
    // message is prefixed by ^
    convertErrorMessages: function(errors, options) {
      options = options || {};

      var ret = [];
      errors.forEach(function(errorInfo) {
        var error = v.result(errorInfo.error,
            errorInfo.value,
            errorInfo.attribute,
            errorInfo.options,
            errorInfo.attributes,
            errorInfo.globalOptions);

        if (!v.isString(error)) {
          ret.push(errorInfo);
          return;
        }

        if (error[0] === '^') {
          error = error.slice(1);
        } else if (options.fullMessages !== false) {
          error = v.capitalize(v.prettify(errorInfo.attribute)) + " " + error;
        }
        error = error.replace(/\\\^/g, "^");
        error = v.format(error, {value: v.stringifyValue(errorInfo.value)});
        ret.push(v.extend({}, errorInfo, {error: error}));
      });
      return ret;
    },

    // In:
    // [{attribute: "<attributeName>", ...}]
    // Out:
    // {"<attributeName>": [{attribute: "<attributeName>", ...}]}
    groupErrorsByAttribute: function(errors) {
      var ret = {};
      errors.forEach(function(error) {
        var list = ret[error.attribute];
        if (list) {
          list.push(error);
        } else {
          ret[error.attribute] = [error];
        }
      });
      return ret;
    },

    // In:
    // [{error: "<message 1>", ...}, {error: "<message 2>", ...}]
    // Out:
    // ["<message 1>", "<message 2>"]
    flattenErrorsToArray: function(errors) {
      return errors.map(function(error) { return error.error; });
    },

    cleanAttributes: function(attributes, whitelist) {
      function whitelistCreator(obj, key, last) {
        if (v.isObject(obj[key])) {
          return obj[key];
        }
        return (obj[key] = last ? true : {});
      }

      function buildObjectWhitelist(whitelist) {
        var ow = {}
          , lastObject
          , attr;
        for (attr in whitelist) {
          if (!whitelist[attr]) {
            continue;
          }
          v.forEachKeyInKeypath(ow, attr, whitelistCreator);
        }
        return ow;
      }

      function cleanRecursive(attributes, whitelist) {
        if (!v.isObject(attributes)) {
          return attributes;
        }

        var ret = v.extend({}, attributes)
          , w
          , attribute;

        for (attribute in attributes) {
          w = whitelist[attribute];

          if (v.isObject(w)) {
            ret[attribute] = cleanRecursive(ret[attribute], w);
          } else if (!w) {
            delete ret[attribute];
          }
        }
        return ret;
      }

      if (!v.isObject(whitelist) || !v.isObject(attributes)) {
        return {};
      }

      whitelist = buildObjectWhitelist(whitelist);
      return cleanRecursive(attributes, whitelist);
    },

    exposeModule: function(validate, root, exports, module, define) {
      if (exports) {
        if (module && module.exports) {
          exports = module.exports = validate;
        }
        exports.validate = validate;
      } else {
        root.validate = validate;
        if (validate.isFunction(define) && define.amd) {
          define([], function () { return validate; });
        }
      }
    },

    warn: function(msg) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("[validate.js] " + msg);
      }
    },

    error: function(msg) {
      if (typeof console !== "undefined" && console.error) {
        console.error("[validate.js] " + msg);
      }
    }
  });

  validate.validators = {
    // Presence validates that the value isn't empty
    presence: function(value, options) {
      options = v.extend({}, this.options, options);
      if (v.isEmpty(value)) {
        return options.message || this.message || "can't be blank";
      }
    },
    length: function(value, options, attribute) {
      // Empty values are allowed
      if (v.isEmpty(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var is = options.is
        , maximum = options.maximum
        , minimum = options.minimum
        , tokenizer = options.tokenizer || function(val) { return val; }
        , err
        , errors = [];

      value = tokenizer(value);
      var length = value.length;
      if(!v.isNumber(length)) {
        v.error(v.format("Attribute %{attr} has a non numeric value for `length`", {attr: attribute}));
        return options.message || this.notValid || "has an incorrect length";
      }

      // Is checks
      if (v.isNumber(is) && length !== is) {
        err = options.wrongLength ||
          this.wrongLength ||
          "is the wrong length (should be %{count} characters)";
        errors.push(v.format(err, {count: is}));
      }

      if (v.isNumber(minimum) && length < minimum) {
        err = options.tooShort ||
          this.tooShort ||
          "is too short (minimum is %{count} characters)";
        errors.push(v.format(err, {count: minimum}));
      }

      if (v.isNumber(maximum) && length > maximum) {
        err = options.tooLong ||
          this.tooLong ||
          "is too long (maximum is %{count} characters)";
        errors.push(v.format(err, {count: maximum}));
      }

      if (errors.length > 0) {
        return options.message || errors;
      }
    },
    numericality: function(value, options) {
      // Empty values are fine
      if (v.isEmpty(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var errors = []
        , name
        , count
        , checks = {
            greaterThan:          function(v, c) { return v > c; },
            greaterThanOrEqualTo: function(v, c) { return v >= c; },
            equalTo:              function(v, c) { return v === c; },
            lessThan:             function(v, c) { return v < c; },
            lessThanOrEqualTo:    function(v, c) { return v <= c; },
            divisibleBy:          function(v, c) { return v % c === 0; }
          };

      // Strict will check that it is a valid looking number
      if (v.isString(value) && options.strict) {
        var pattern = "^(0|[1-9]\\d*)";
        if (!options.onlyInteger) {
          pattern += "(\\.\\d+)?";
        }
        pattern += "$";

        if (!(new RegExp(pattern).test(value))) {
          return options.message || options.notValid || this.notValid || "must be a valid number";
        }
      }

      // Coerce the value to a number unless we're being strict.
      if (options.noStrings !== true && v.isString(value)) {
        value = +value;
      }

      // If it's not a number we shouldn't continue since it will compare it.
      if (!v.isNumber(value)) {
        return options.message || options.notValid || this.notValid || "is not a number";
      }

      // Same logic as above, sort of. Don't bother with comparisons if this
      // doesn't pass.
      if (options.onlyInteger && !v.isInteger(value)) {
        return options.message || options.notInteger || this.notInteger  || "must be an integer";
      }

      for (name in checks) {
        count = options[name];
        if (v.isNumber(count) && !checks[name](value, count)) {
          // This picks the default message if specified
          // For example the greaterThan check uses the message from
          // this.notGreaterThan so we capitalize the name and prepend "not"
          var key = "not" + v.capitalize(name);
          var msg = options[key] || this[key] || "must be %{type} %{count}";

          errors.push(v.format(msg, {
            count: count,
            type: v.prettify(name)
          }));
        }
      }

      if (options.odd && value % 2 !== 1) {
        errors.push(options.notOdd || this.notOdd || "must be odd");
      }
      if (options.even && value % 2 !== 0) {
        errors.push(options.notEven || this.notEven || "must be even");
      }

      if (errors.length) {
        return options.message || errors;
      }
    },
    datetime: v.extend(function(value, options) {
      if (!v.isFunction(this.parse) || !v.isFunction(this.format)) {
        throw new Error("Both the parse and format functions needs to be set to use the datetime/date validator");
      }

      // Empty values are fine
      if (v.isEmpty(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var err
        , errors = []
        , earliest = options.earliest ? this.parse(options.earliest, options) : NaN
        , latest = options.latest ? this.parse(options.latest, options) : NaN;

      value = this.parse(value, options);

      // 86400000 is the number of seconds in a day, this is used to remove
      // the time from the date
      if (isNaN(value) || options.dateOnly && value % 86400000 !== 0) {
        err = options.notValid ||
          options.message ||
          this.notValid ||
          "must be a valid date";
        return v.format(err, {value: arguments[0]});
      }

      if (!isNaN(earliest) && value < earliest) {
        err = options.tooEarly ||
          options.message ||
          this.tooEarly ||
          "must be no earlier than %{date}";
        err = v.format(err, {
          value: this.format(value, options),
          date: this.format(earliest, options)
        });
        errors.push(err);
      }

      if (!isNaN(latest) && value > latest) {
        err = options.tooLate ||
          options.message ||
          this.tooLate ||
          "must be no later than %{date}";
        err = v.format(err, {
          date: this.format(latest, options),
          value: this.format(value, options)
        });
        errors.push(err);
      }

      if (errors.length) {
        return v.unique(errors);
      }
    }, {
      parse: null,
      format: null
    }),
    date: function(value, options) {
      options = v.extend({}, options, {dateOnly: true});
      return v.validators.datetime.call(v.validators.datetime, value, options);
    },
    format: function(value, options) {
      if (v.isString(options) || (options instanceof RegExp)) {
        options = {pattern: options};
      }

      options = v.extend({}, this.options, options);

      var message = options.message || this.message || "is invalid"
        , pattern = options.pattern
        , match;

      // Empty values are allowed
      if (v.isEmpty(value)) {
        return;
      }
      if (!v.isString(value)) {
        return message;
      }

      if (v.isString(pattern)) {
        pattern = new RegExp(options.pattern, options.flags);
      }
      match = pattern.exec(value);
      if (!match || match[0].length != value.length) {
        return message;
      }
    },
    inclusion: function(value, options) {
      // Empty values are fine
      if (v.isEmpty(value)) {
        return;
      }
      if (v.isArray(options)) {
        options = {within: options};
      }
      options = v.extend({}, this.options, options);
      if (v.contains(options.within, value)) {
        return;
      }
      var message = options.message ||
        this.message ||
        "^%{value} is not included in the list";
      return v.format(message, {value: value});
    },
    exclusion: function(value, options) {
      // Empty values are fine
      if (v.isEmpty(value)) {
        return;
      }
      if (v.isArray(options)) {
        options = {within: options};
      }
      options = v.extend({}, this.options, options);
      if (!v.contains(options.within, value)) {
        return;
      }
      var message = options.message || this.message || "^%{value} is restricted";
      return v.format(message, {value: value});
    },
    email: v.extend(function(value, options) {
      options = v.extend({}, this.options, options);
      var message = options.message || this.message || "is not a valid email";
      // Empty values are fine
      if (v.isEmpty(value)) {
        return;
      }
      if (!v.isString(value)) {
        return message;
      }
      if (!this.PATTERN.exec(value)) {
        return message;
      }
    }, {
      PATTERN: /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i
    }),
    equality: function(value, options, attribute, attributes) {
      if (v.isEmpty(value)) {
        return;
      }

      if (v.isString(options)) {
        options = {attribute: options};
      }
      options = v.extend({}, this.options, options);
      var message = options.message ||
        this.message ||
        "is not equal to %{attribute}";

      if (v.isEmpty(options.attribute) || !v.isString(options.attribute)) {
        throw new Error("The attribute must be a non empty string");
      }

      var otherValue = v.getDeepObjectValue(attributes, options.attribute)
        , comparator = options.comparator || function(v1, v2) {
          return v1 === v2;
        };

      if (!comparator(value, otherValue, options, attribute, attributes)) {
        return v.format(message, {attribute: v.prettify(options.attribute)});
      }
    },

    // A URL validator that is used to validate URLs with the ability to
    // restrict schemes and some domains.
    url: function(value, options) {
      if (v.isEmpty(value)) {
        return;
      }

      options = v.extend({}, this.options, options);

      var message = options.message || this.message || "is not a valid url"
        , schemes = options.schemes || this.schemes || ['http', 'https']
        , allowLocal = options.allowLocal || this.allowLocal || false;

      if (!v.isString(value)) {
        return message;
      }

      // https://gist.github.com/dperini/729294
      var regex =
        "^" +
          // schemes
          "(?:(?:" + schemes.join("|") + "):\\/\\/)" +
          // credentials
          "(?:\\S+(?::\\S*)?@)?";

      regex += "(?:";

      var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";

      // This ia a special case for the localhost hostname
      if (allowLocal) {
        tld += "?";
      } else {
        // private & local addresses
        regex +=
          "(?!10(?:\\.\\d{1,3}){3})" +
          "(?!127(?:\\.\\d{1,3}){3})" +
          "(?!169\\.254(?:\\.\\d{1,3}){2})" +
          "(?!192\\.168(?:\\.\\d{1,3}){2})" +
          "(?!172" +
          "\\.(?:1[6-9]|2\\d|3[0-1])" +
          "(?:\\.\\d{1,3})" +
          "{2})";
      }

      var hostname =
          "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
          "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
          tld + ")";

      // reserved addresses
      regex +=
          "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
          "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
          "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
          hostname +
          // port number
          "(?::\\d{2,5})?" +
          // path
          "(?:\\/[^\\s]*)?" +
        "$";

      var PATTERN = new RegExp(regex, 'i');
      if (!PATTERN.exec(value)) {
        return message;
      }
    }
  };

  validate.exposeModule(validate, this, exports, module, __webpack_require__(13));
}).call(this,
         true ? /* istanbul ignore next */ exports : null,
         true ? /* istanbul ignore next */ module : null,
        __webpack_require__(13));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)(module), __webpack_require__("bluebird"), __webpack_require__(1)))

/***/ },

/***/ 13:
/***/ function(module, exports) {

module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },

/***/ 1334:
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(9);
__webpack_require__(4);
__webpack_require__("aurelia-event-aggregator");
__webpack_require__("aurelia-framework");
__webpack_require__(146);
__webpack_require__("aurelia-history-browser");
__webpack_require__(72);
__webpack_require__("aurelia-loader-webpack");
__webpack_require__(47);
__webpack_require__("aurelia-route-recognizer");
__webpack_require__("aurelia-router");
__webpack_require__(42);
__webpack_require__("aurelia-templating");
__webpack_require__("aurelia-templating-binding");
__webpack_require__("aurelia-templating-router");
__webpack_require__("aurelia-templating-resources");
__webpack_require__("aurelia-dialog");
__webpack_require__("aurelia-validatejs");
module.exports = __webpack_require__("aurelia-validation");


/***/ },

/***/ 146:
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});



function mi(name) {
  throw new Error('History must implement ' + name + '().');
}

var History = exports.History = function () {
  function History() {
    
  }

  History.prototype.activate = function activate(options) {
    mi('activate');
  };

  History.prototype.deactivate = function deactivate() {
    mi('deactivate');
  };

  History.prototype.getAbsoluteRoot = function getAbsoluteRoot() {
    mi('getAbsoluteRoot');
  };

  History.prototype.navigate = function navigate(fragment, options) {
    mi('navigate');
  };

  History.prototype.navigateBack = function navigateBack() {
    mi('navigateBack');
  };

  History.prototype.setTitle = function setTitle(title) {
    mi('setTitle');
  };

  return History;
}();

/***/ },

/***/ 147:
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});



var DialogResult = exports.DialogResult = function DialogResult(cancelled, output) {
  

  this.wasCancelled = false;

  this.wasCancelled = cancelled;
  this.output = output;
};

/***/ },

/***/ 150:
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var validateTrigger = exports.validateTrigger = {
  blur: 'blur',

  change: 'change',

  manual: 'manual'
};

/***/ },

/***/ 151:
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});



var ValidationError = exports.ValidationError = function ValidationError(rule, message, object) {
  var propertyName = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  

  this.rule = rule;
  this.message = message;
  this.object = object;
  this.propertyName = propertyName || null;
};

/***/ },

/***/ 152:
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * Sets, unsets and retrieves rules on an object or constructor function.
 */
var Rules = (function () {
    function Rules() {
    }
    /**
     * Applies the rules to a target.
     */
    Rules.set = function (target, rules) {
        if (target instanceof Function) {
            target = target.prototype;
        }
        Object.defineProperty(target, Rules.key, { enumerable: false, configurable: false, writable: true, value: rules });
    };
    /**
     * Removes rules from a target.
     */
    Rules.unset = function (target) {
        if (target instanceof Function) {
            target = target.prototype;
        }
        target[Rules.key] = null;
    };
    /**
     * Retrieves the target's rules.
     */
    Rules.get = function (target) {
        return target[Rules.key] || null;
    };
    /**
     * The name of the property that stores the rules.
     */
    Rules.key = '__rules__';
    return Rules;
}());
exports.Rules = Rules;


/***/ },

/***/ 153:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var validation_parser_1 = __webpack_require__(154);
/**
 * Dictionary of validation messages. [messageKey]: messageExpression
 */
exports.validationMessages = {
    /**
     * The default validation message. Used with rules that have no standard message.
     */
    default: "${$displayName} is invalid.",
    required: "${$displayName} is required.",
    matches: "${$displayName} is not correctly formatted.",
    email: "${$displayName} is not a valid email.",
    minLength: "${$displayName} must be at least ${$config.length} character${$config.length === 1 ? '' : 's'}.",
    maxLength: "${$displayName} cannot be longer than ${$config.length} character${$config.length === 1 ? '' : 's'}.",
    minItems: "${$displayName} must contain at least ${$config.count} item${$config.count === 1 ? '' : 's'}.",
    maxItems: "${$displayName} cannot contain more than ${$config.count} item${$config.count === 1 ? '' : 's'}.",
    equals: "${$displayName} must be ${$config.expectedValue}.",
};
/**
 * Retrieves validation messages and property display names.
 */
var ValidationMessageProvider = (function () {
    function ValidationMessageProvider(parser) {
        this.parser = parser;
    }
    /**
     * Returns a message binding expression that corresponds to the key.
     * @param key The message key.
     */
    ValidationMessageProvider.prototype.getMessage = function (key) {
        var message;
        if (key in exports.validationMessages) {
            message = exports.validationMessages[key];
        }
        else {
            message = exports.validationMessages['default'];
        }
        return this.parser.parseMessage(message);
    };
    /**
     * When a display name is not provided, this method is used to formulate
     * a display name using the property name.
     * Override this with your own custom logic.
     * @param propertyName The property name.
     */
    ValidationMessageProvider.prototype.getDisplayName = function (propertyName) {
        // split on upper-case letters.
        var words = propertyName.split(/(?=[A-Z])/).join(' ');
        // capitalize first letter.
        return words.charAt(0).toUpperCase() + words.slice(1);
    };
    ValidationMessageProvider.inject = [validation_parser_1.ValidationParser];
    return ValidationMessageProvider;
}());
exports.ValidationMessageProvider = ValidationMessageProvider;


/***/ },

/***/ 154:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aurelia_binding_1 = __webpack_require__(9);
var aurelia_templating_1 = __webpack_require__("aurelia-templating");
var util_1 = __webpack_require__(252);
var LogManager = __webpack_require__(40);
var ValidationParser = (function () {
    function ValidationParser(parser, bindinqLanguage) {
        this.parser = parser;
        this.bindinqLanguage = bindinqLanguage;
        this.emptyStringExpression = new aurelia_binding_1.LiteralString('');
        this.nullExpression = new aurelia_binding_1.LiteralPrimitive(null);
        this.undefinedExpression = new aurelia_binding_1.LiteralPrimitive(undefined);
        this.cache = {};
    }
    ValidationParser.prototype.coalesce = function (part) {
        // part === null || part === undefined ? '' : part
        return new aurelia_binding_1.Conditional(new aurelia_binding_1.Binary('||', new aurelia_binding_1.Binary('===', part, this.nullExpression), new aurelia_binding_1.Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new aurelia_binding_1.CallMember(part, 'toString', []));
    };
    ValidationParser.prototype.parseMessage = function (message) {
        if (this.cache[message] !== undefined) {
            return this.cache[message];
        }
        var parts = this.bindinqLanguage.parseInterpolation(null, message);
        if (parts === null) {
            return new aurelia_binding_1.LiteralString(message);
        }
        var expression = new aurelia_binding_1.LiteralString(parts[0]);
        for (var i = 1; i < parts.length; i += 2) {
            expression = new aurelia_binding_1.Binary('+', expression, new aurelia_binding_1.Binary('+', this.coalesce(parts[i]), new aurelia_binding_1.LiteralString(parts[i + 1])));
        }
        MessageExpressionValidator.validate(expression, message);
        this.cache[message] = expression;
        return expression;
    };
    ValidationParser.prototype.getAccessorExpression = function (fn) {
        var classic = /^function\s*\([$_\w\d]+\)\s*\{\s*(?:"use strict";)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
        var arrow = /^[$_\w\d]+\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
        var match = classic.exec(fn) || arrow.exec(fn);
        if (match === null) {
            throw new Error("Unable to parse accessor function:\n" + fn);
        }
        return this.parser.parse(match[1]);
    };
    ValidationParser.prototype.parseProperty = function (property) {
        if (util_1.isString(property)) {
            return { name: property, displayName: null };
        }
        var accessor = this.getAccessorExpression(property.toString());
        if (accessor instanceof aurelia_binding_1.AccessScope
            || accessor instanceof aurelia_binding_1.AccessMember && accessor.object instanceof aurelia_binding_1.AccessScope) {
            return {
                name: accessor.name,
                displayName: null
            };
        }
        throw new Error("Invalid subject: \"" + accessor + "\"");
    };
    ValidationParser.inject = [aurelia_binding_1.Parser, aurelia_templating_1.BindingLanguage];
    return ValidationParser;
}());
exports.ValidationParser = ValidationParser;
var MessageExpressionValidator = (function (_super) {
    __extends(MessageExpressionValidator, _super);
    function MessageExpressionValidator(originalMessage) {
        _super.call(this, []);
        this.originalMessage = originalMessage;
    }
    MessageExpressionValidator.validate = function (expression, originalMessage) {
        var visitor = new MessageExpressionValidator(originalMessage);
        expression.accept(visitor);
    };
    MessageExpressionValidator.prototype.visitAccessScope = function (access) {
        if (access.ancestor !== 0) {
            throw new Error('$parent is not permitted in validation message expressions.');
        }
        if (['displayName', 'propertyName', 'value', 'object', 'config', 'getDisplayName'].indexOf(access.name) !== -1) {
            LogManager.getLogger('aurelia-validation')
                .warn("Did you mean to use \"$" + access.name + "\" instead of \"" + access.name + "\" in this validation message template: \"" + this.originalMessage + "\"?");
        }
    };
    return MessageExpressionValidator;
}(aurelia_binding_1.Unparser));
exports.MessageExpressionValidator = MessageExpressionValidator;


/***/ },

/***/ 155:
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * A validation error.
 */
var ValidationError = (function () {
    /**
     * @param rule The rule associated with the error. Validator implementation specific.
     * @param message The error message.
     * @param object The invalid object
     * @param propertyName The name of the invalid property. Optional.
     */
    function ValidationError(rule, message, object, propertyName) {
        if (propertyName === void 0) { propertyName = null; }
        this.rule = rule;
        this.message = message;
        this.object = object;
        this.propertyName = propertyName;
        this.id = ValidationError.nextId++;
    }
    ValidationError.prototype.toString = function () {
        return this.message;
    };
    ValidationError.nextId = 0;
    return ValidationError;
}());
exports.ValidationError = ValidationError;


/***/ },

/***/ 22:
/***/ function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			configurable: false,
			get: function() { return module.l; }
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			configurable: false,
			get: function() { return module.i; }
		});
		module.webpackPolyfill = 1;
	}
	return module;
}


/***/ },

/***/ 234:
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var dialogOptions = exports.dialogOptions = {
  lock: true,
  centerHorizontalOnly: false,
  startingZIndex: 1000,
  ignoreTransitions: false
};

/***/ },

/***/ 235:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invokeLifecycle = invokeLifecycle;
function invokeLifecycle(instance, name, model) {
  if (typeof instance[name] === 'function') {
    var result = instance[name](model);

    if (result instanceof Promise) {
      return result;
    }

    if (result !== null && result !== undefined) {
      return Promise.resolve(result);
    }

    return Promise.resolve(true);
  }

  return Promise.resolve(true);
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("bluebird")))

/***/ },

/***/ 236:
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});



var Renderer = exports.Renderer = function () {
  function Renderer() {
    
  }

  Renderer.prototype.getDialogContainer = function getDialogContainer() {
    throw new Error('DialogRenderer must implement getDialogContainer().');
  };

  Renderer.prototype.showDialog = function showDialog(dialogController) {
    throw new Error('DialogRenderer must implement showDialog().');
  };

  Renderer.prototype.hideDialog = function hideDialog(dialogController) {
    throw new Error('DialogRenderer must implement hideDialog().');
  };

  return Renderer;
}();

/***/ },

/***/ 249:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validationRenderer = undefined;

var _aureliaMetadata = __webpack_require__(26);

var _validationError = __webpack_require__(151);

var validationRenderer = exports.validationRenderer = _aureliaMetadata.protocol.create('aurelia:validation-renderer', function (target) {
  if (!(typeof target.render === 'function')) {
    return 'Validation renderers must implement: render(error: ValidationError, target: Element): void';
  }

  if (!(typeof target.unrender === 'function')) {
    return 'Validation renderers must implement: unrender(error: ValidationError, target: Element): void';
  }

  return true;
});

/***/ },

/***/ 250:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validator = undefined;

var _validationError = __webpack_require__(151);



var Validator = exports.Validator = function () {
  function Validator() {
    
  }

  Validator.prototype.validateProperty = function validateProperty(object, propertyName) {
    var rules = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    throw new Error('A Validator must implement validateProperty');
  };

  Validator.prototype.validateObject = function validateObject(object) {
    var rules = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    throw new Error('A Validator must implement validateObject');
  };

  return Validator;
}();

/***/ },

/***/ 251:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aurelia_templating_1 = __webpack_require__("aurelia-templating");
var validator_1 = __webpack_require__(76);
var validation_error_1 = __webpack_require__(155);
var rules_1 = __webpack_require__(152);
var validation_messages_1 = __webpack_require__(153);
/**
 * Validates.
 * Responsible for validating objects and properties.
 */
var StandardValidator = (function (_super) {
    __extends(StandardValidator, _super);
    function StandardValidator(messageProvider, resources) {
        _super.call(this);
        this.messageProvider = messageProvider;
        this.lookupFunctions = resources.lookupFunctions;
        this.getDisplayName = messageProvider.getDisplayName.bind(messageProvider);
    }
    StandardValidator.prototype.getMessage = function (rule, object, value) {
        var expression = rule.message || this.messageProvider.getMessage(rule.messageKey);
        var _a = rule.property, propertyName = _a.name, displayName = _a.displayName;
        if (displayName === null && propertyName !== null) {
            displayName = this.messageProvider.getDisplayName(propertyName);
        }
        var overrideContext = {
            $displayName: displayName,
            $propertyName: propertyName,
            $value: value,
            $object: object,
            $config: rule.config,
            $getDisplayName: this.getDisplayName
        };
        return expression.evaluate({ bindingContext: object, overrideContext: overrideContext }, this.lookupFunctions);
    };
    StandardValidator.prototype.validateRuleSequence = function (object, propertyName, ruleSequence, sequence) {
        var _this = this;
        // are we validating all properties or a single property?
        var validateAllProperties = propertyName === null || propertyName === undefined;
        var rules = ruleSequence[sequence];
        var errors = [];
        // validate each rule.
        var promises = [];
        var _loop_1 = function(i) {
            var rule = rules[i];
            // is the rule related to the property we're validating.
            if (!validateAllProperties && rule.property.name !== propertyName) {
                return "continue";
            }
            // is this a conditional rule? is the condition met?
            if (rule.when && !rule.when(object)) {
                return "continue";
            }
            // validate.
            var value = rule.property.name === null ? object : object[rule.property.name];
            var promiseOrBoolean = rule.condition(value, object);
            if (!(promiseOrBoolean instanceof Promise)) {
                promiseOrBoolean = Promise.resolve(promiseOrBoolean);
            }
            promises.push(promiseOrBoolean.then(function (isValid) {
                if (!isValid) {
                    var message = _this.getMessage(rule, object, value);
                    errors.push(new validation_error_1.ValidationError(rule, message, object, rule.property.name));
                }
            }));
        };
        for (var i = 0; i < rules.length; i++) {
            _loop_1(i);
        }
        return Promise.all(promises)
            .then(function () {
            sequence++;
            if (errors.length === 0 && sequence < ruleSequence.length) {
                return _this.validateRuleSequence(object, propertyName, ruleSequence, sequence);
            }
            return errors;
        });
    };
    StandardValidator.prototype.validate = function (object, propertyName, rules) {
        // rules specified?
        if (!rules) {
            // no. attempt to locate the rules.
            rules = rules_1.Rules.get(object);
        }
        // any rules?
        if (!rules) {
            return Promise.resolve([]);
        }
        return this.validateRuleSequence(object, propertyName, rules, 0);
    };
    /**
     * Validates the specified property.
     * @param object The object to validate.
     * @param propertyName The name of the property to validate.
     * @param rules Optional. If unspecified, the rules will be looked up using the metadata
     * for the object created by ValidationRules....on(class/object)
     */
    StandardValidator.prototype.validateProperty = function (object, propertyName, rules) {
        return this.validate(object, propertyName, rules || null);
    };
    /**
     * Validates all rules for specified object and it's properties.
     * @param object The object to validate.
     * @param rules Optional. If unspecified, the rules will be looked up using the metadata
     * for the object created by ValidationRules....on(class/object)
     */
    StandardValidator.prototype.validateObject = function (object, rules) {
        return this.validate(object, null, rules || null);
    };
    StandardValidator.inject = [validation_messages_1.ValidationMessageProvider, aurelia_templating_1.ViewResources];
    return StandardValidator;
}(validator_1.Validator));
exports.StandardValidator = StandardValidator;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("bluebird")))

/***/ },

/***/ 252:
/***/ function(module, exports) {

"use strict";
"use strict";
function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}
exports.isString = isString;


/***/ },

/***/ 253:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var util_1 = __webpack_require__(252);
var rules_1 = __webpack_require__(152);
var validation_messages_1 = __webpack_require__(153);
/**
 * Part of the fluent rule API. Enables customizing property rules.
 */
var FluentRuleCustomizer = (function () {
    function FluentRuleCustomizer(property, condition, config, fluentEnsure, fluentRules, parser) {
        if (config === void 0) { config = {}; }
        this.fluentEnsure = fluentEnsure;
        this.fluentRules = fluentRules;
        this.parser = parser;
        this.rule = {
            property: property,
            condition: condition,
            config: config,
            when: null,
            messageKey: 'default',
            message: null,
            sequence: fluentEnsure._sequence
        };
        this.fluentEnsure._addRule(this.rule);
    }
    /**
     * Validate subsequent rules after previously declared rules have
     * been validated successfully. Use to postpone validation of costly
     * rules until less expensive rules pass validation.
     */
    FluentRuleCustomizer.prototype.then = function () {
        this.fluentEnsure._sequence++;
        return this;
    };
    /**
     * Specifies the key to use when looking up the rule's validation message.
     */
    FluentRuleCustomizer.prototype.withMessageKey = function (key) {
        this.rule.messageKey = key;
        this.rule.message = null;
        return this;
    };
    /**
     * Specifies rule's validation message.
     */
    FluentRuleCustomizer.prototype.withMessage = function (message) {
        this.rule.messageKey = 'custom';
        this.rule.message = this.parser.parseMessage(message);
        return this;
    };
    /**
     * Specifies a condition that must be met before attempting to validate the rule.
     * @param condition A function that accepts the object as a parameter and returns true
     * or false whether the rule should be evaluated.
     */
    FluentRuleCustomizer.prototype.when = function (condition) {
        this.rule.when = condition;
        return this;
    };
    /**
     * Tags the rule instance, enabling the rule to be found easily
     * using ValidationRules.taggedRules(rules, tag)
     */
    FluentRuleCustomizer.prototype.tag = function (tag) {
        this.rule.tag = tag;
        return this;
    };
    ///// FluentEnsure APIs /////
    /**
     * Target a property with validation rules.
     * @param property The property to target. Can be the property name or a property accessor function.
     */
    FluentRuleCustomizer.prototype.ensure = function (subject) {
        return this.fluentEnsure.ensure(subject);
    };
    /**
     * Targets an object with validation rules.
     */
    FluentRuleCustomizer.prototype.ensureObject = function () {
        return this.fluentEnsure.ensureObject();
    };
    Object.defineProperty(FluentRuleCustomizer.prototype, "rules", {
        /**
         * Rules that have been defined using the fluent API.
         */
        get: function () {
            return this.fluentEnsure.rules;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Applies the rules to a class or object, making them discoverable by the StandardValidator.
     * @param target A class or object.
     */
    FluentRuleCustomizer.prototype.on = function (target) {
        return this.fluentEnsure.on(target);
    };
    ///////// FluentRules APIs /////////
    /**
     * Applies an ad-hoc rule function to the ensured property or object.
     * @param condition The function to validate the rule.
     * Will be called with two arguments, the property value and the object.
     * Should return a boolean or a Promise that resolves to a boolean.
     */
    FluentRuleCustomizer.prototype.satisfies = function (condition, config) {
        return this.fluentRules.satisfies(condition, config);
    };
    /**
     * Applies a rule by name.
     * @param name The name of the custom or standard rule.
     * @param args The rule's arguments.
     */
    FluentRuleCustomizer.prototype.satisfiesRule = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = this.fluentRules).satisfiesRule.apply(_a, [name].concat(args));
        var _a;
    };
    /**
     * Applies the "required" rule to the property.
     * The value cannot be null, undefined or whitespace.
     */
    FluentRuleCustomizer.prototype.required = function () {
        return this.fluentRules.required();
    };
    /**
     * Applies the "matches" rule to the property.
     * Value must match the specified regular expression.
     * null, undefined and empty-string values are considered valid.
     */
    FluentRuleCustomizer.prototype.matches = function (regex) {
        return this.fluentRules.matches(regex);
    };
    /**
     * Applies the "email" rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    FluentRuleCustomizer.prototype.email = function () {
        return this.fluentRules.email();
    };
    /**
     * Applies the "minLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    FluentRuleCustomizer.prototype.minLength = function (length) {
        return this.fluentRules.minLength(length);
    };
    /**
     * Applies the "maxLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    FluentRuleCustomizer.prototype.maxLength = function (length) {
        return this.fluentRules.maxLength(length);
    };
    /**
     * Applies the "minItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    FluentRuleCustomizer.prototype.minItems = function (count) {
        return this.fluentRules.minItems(count);
    };
    /**
     * Applies the "maxItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    FluentRuleCustomizer.prototype.maxItems = function (count) {
        return this.fluentRules.maxItems(count);
    };
    /**
     * Applies the "equals" validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    FluentRuleCustomizer.prototype.equals = function (expectedValue) {
        return this.fluentRules.equals(expectedValue);
    };
    return FluentRuleCustomizer;
}());
exports.FluentRuleCustomizer = FluentRuleCustomizer;
/**
 * Part of the fluent rule API. Enables applying rules to properties and objects.
 */
var FluentRules = (function () {
    function FluentRules(fluentEnsure, parser, property) {
        this.fluentEnsure = fluentEnsure;
        this.parser = parser;
        this.property = property;
    }
    /**
     * Sets the display name of the ensured property.
     */
    FluentRules.prototype.displayName = function (name) {
        this.property.displayName = name;
        return this;
    };
    /**
     * Applies an ad-hoc rule function to the ensured property or object.
     * @param condition The function to validate the rule.
     * Will be called with two arguments, the property value and the object.
     * Should return a boolean or a Promise that resolves to a boolean.
     */
    FluentRules.prototype.satisfies = function (condition, config) {
        return new FluentRuleCustomizer(this.property, condition, config, this.fluentEnsure, this, this.parser);
    };
    /**
     * Applies a rule by name.
     * @param name The name of the custom or standard rule.
     * @param args The rule's arguments.
     */
    FluentRules.prototype.satisfiesRule = function (name) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var rule = FluentRules.customRules[name];
        if (!rule) {
            // standard rule?
            rule = this[name];
            if (rule instanceof Function) {
                return rule.call.apply(rule, [this].concat(args));
            }
            throw new Error("Rule with name \"" + name + "\" does not exist.");
        }
        var config = rule.argsToConfig ? rule.argsToConfig.apply(rule, args) : undefined;
        return this.satisfies(function (value, obj) { return (_a = rule.condition).call.apply(_a, [_this, value, obj].concat(args)); var _a; }, config)
            .withMessageKey(name);
    };
    /**
     * Applies the "required" rule to the property.
     * The value cannot be null, undefined or whitespace.
     */
    FluentRules.prototype.required = function () {
        return this.satisfies(function (value) {
            return value !== null
                && value !== undefined
                && !(util_1.isString(value) && !/\S/.test(value));
        }).withMessageKey('required');
    };
    /**
     * Applies the "matches" rule to the property.
     * Value must match the specified regular expression.
     * null, undefined and empty-string values are considered valid.
     */
    FluentRules.prototype.matches = function (regex) {
        return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || regex.test(value); })
            .withMessageKey('matches');
    };
    /**
     * Applies the "email" rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    FluentRules.prototype.email = function () {
        return this.matches(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i)
            .withMessageKey('email');
    };
    /**
     * Applies the "minLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    FluentRules.prototype.minLength = function (length) {
        return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length >= length; }, { length: length })
            .withMessageKey('minLength');
    };
    /**
     * Applies the "maxLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    FluentRules.prototype.maxLength = function (length) {
        return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length <= length; }, { length: length })
            .withMessageKey('maxLength');
    };
    /**
     * Applies the "minItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    FluentRules.prototype.minItems = function (count) {
        return this.satisfies(function (value) { return value === null || value === undefined || value.length >= count; }, { count: count })
            .withMessageKey('minItems');
    };
    /**
     * Applies the "maxItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    FluentRules.prototype.maxItems = function (count) {
        return this.satisfies(function (value) { return value === null || value === undefined || value.length <= count; }, { count: count })
            .withMessageKey('maxItems');
    };
    /**
     * Applies the "equals" validation rule to the property.
     * null and undefined values are considered valid.
     */
    FluentRules.prototype.equals = function (expectedValue) {
        return this.satisfies(function (value) { return value === null || value === undefined || value === '' || value === expectedValue; }, { expectedValue: expectedValue })
            .withMessageKey('equals');
    };
    FluentRules.customRules = {};
    return FluentRules;
}());
exports.FluentRules = FluentRules;
/**
 * Part of the fluent rule API. Enables targeting properties and objects with rules.
 */
var FluentEnsure = (function () {
    function FluentEnsure(parser) {
        this.parser = parser;
        /**
         * Rules that have been defined using the fluent API.
         */
        this.rules = [];
        this._sequence = 0;
    }
    /**
     * Target a property with validation rules.
     * @param property The property to target. Can be the property name or a property accessor function.
     */
    FluentEnsure.prototype.ensure = function (property) {
        this.assertInitialized();
        return new FluentRules(this, this.parser, this.parser.parseProperty(property));
    };
    /**
     * Targets an object with validation rules.
     */
    FluentEnsure.prototype.ensureObject = function () {
        this.assertInitialized();
        return new FluentRules(this, this.parser, { name: null, displayName: null });
    };
    /**
     * Applies the rules to a class or object, making them discoverable by the StandardValidator.
     * @param target A class or object.
     */
    FluentEnsure.prototype.on = function (target) {
        rules_1.Rules.set(target, this.rules);
        return this;
    };
    /**
     * Adds a rule definition to the sequenced ruleset.
     */
    FluentEnsure.prototype._addRule = function (rule) {
        while (this.rules.length < rule.sequence + 1) {
            this.rules.push([]);
        }
        this.rules[rule.sequence].push(rule);
    };
    FluentEnsure.prototype.assertInitialized = function () {
        if (this.parser) {
            return;
        }
        throw new Error("Did you forget to add \".plugin('aurelia-validation)\" to your main.js?");
    };
    return FluentEnsure;
}());
exports.FluentEnsure = FluentEnsure;
/**
 * Fluent rule definition API.
 */
var ValidationRules = (function () {
    function ValidationRules() {
    }
    ValidationRules.initialize = function (parser) {
        ValidationRules.parser = parser;
    };
    /**
     * Target a property with validation rules.
     * @param property The property to target. Can be the property name or a property accessor function.
     */
    ValidationRules.ensure = function (property) {
        return new FluentEnsure(ValidationRules.parser).ensure(property);
    };
    /**
     * Targets an object with validation rules.
     */
    ValidationRules.ensureObject = function () {
        return new FluentEnsure(ValidationRules.parser).ensureObject();
    };
    /**
     * Defines a custom rule.
     * @param name The name of the custom rule. Also serves as the message key.
     * @param condition The rule function.
     * @param message The message expression
     * @param argsToConfig A function that maps the rule's arguments to a "config" object that can be used when evaluating the message expression.
     */
    ValidationRules.customRule = function (name, condition, message, argsToConfig) {
        validation_messages_1.validationMessages[name] = message;
        FluentRules.customRules[name] = { condition: condition, argsToConfig: argsToConfig };
    };
    /**
     * Returns rules with the matching tag.
     * @param rules The rules to search.
     * @param tag The tag to search for.
     */
    ValidationRules.taggedRules = function (rules, tag) {
        return rules.map(function (x) { return x.filter(function (r) { return r.tag === tag; }); });
    };
    /**
     * Removes the rules from a class or object.
     * @param target A class or object.
     */
    ValidationRules.off = function (target) {
        rules_1.Rules.unset(target);
    };
    return ValidationRules;
}());
exports.ValidationRules = ValidationRules;


/***/ },

/***/ 698:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogConfiguration = undefined;

var _renderer = __webpack_require__(236);

var _dialogRenderer = __webpack_require__(699);

var _dialogOptions = __webpack_require__(234);

var _aureliaPal = __webpack_require__(14);



var defaultRenderer = _dialogRenderer.DialogRenderer;

var resources = {
  'ai-dialog': './ai-dialog',
  'ai-dialog-header': './ai-dialog-header',
  'ai-dialog-body': './ai-dialog-body',
  'ai-dialog-footer': './ai-dialog-footer',
  'attach-focus': './attach-focus'
};

var defaultCSSText = 'ai-dialog-container,ai-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ai-dialog,ai-dialog-container>div>div{min-width:300px;margin:auto;display:block}ai-dialog-overlay{opacity:0}ai-dialog-overlay.active{opacity:1}ai-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ai-dialog-container.active{opacity:1}ai-dialog-container>div{padding:30px}ai-dialog-container>div>div{width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content}ai-dialog-container,ai-dialog-container>div,ai-dialog-container>div>div{outline:0}ai-dialog{box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ai-dialog>ai-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ai-dialog>ai-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ai-dialog>ai-dialog-body{display:block;padding:16px}ai-dialog>ai-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ai-dialog>ai-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ai-dialog>ai-dialog-footer button:disabled{cursor:default;opacity:.45}ai-dialog>ai-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ai-dialog-open{overflow:hidden}';

var DialogConfiguration = exports.DialogConfiguration = function () {
  function DialogConfiguration(aurelia) {
    

    this.aurelia = aurelia;
    this.settings = _dialogOptions.dialogOptions;
    this.resources = [];
    this.cssText = defaultCSSText;
    this.renderer = defaultRenderer;
  }

  DialogConfiguration.prototype.useDefaults = function useDefaults() {
    return this.useRenderer(defaultRenderer).useCSS(defaultCSSText).useStandardResources();
  };

  DialogConfiguration.prototype.useStandardResources = function useStandardResources() {
    return this.useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
  };

  DialogConfiguration.prototype.useResource = function useResource(resourceName) {
    this.resources.push(resourceName);
    return this;
  };

  DialogConfiguration.prototype.useRenderer = function useRenderer(renderer, settings) {
    this.renderer = renderer;
    this.settings = Object.assign(this.settings, settings || {});
    return this;
  };

  DialogConfiguration.prototype.useCSS = function useCSS(cssText) {
    this.cssText = cssText;
    return this;
  };

  DialogConfiguration.prototype._apply = function _apply() {
    var _this = this;

    this.aurelia.transient(_renderer.Renderer, this.renderer);
    this.resources.forEach(function (resourceName) {
      return _this.aurelia.globalResources(resources[resourceName]);
    });

    if (this.cssText) {
      _aureliaPal.DOM.injectStyles(this.cssText);
    }
  };

  return DialogConfiguration;
}();

/***/ },

/***/ 699:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogRenderer = undefined;

var _dec, _class;

var _dialogOptions = __webpack_require__(234);

var _aureliaPal = __webpack_require__(14);

var _aureliaDependencyInjection = __webpack_require__(4);



var containerTagName = 'ai-dialog-container';
var overlayTagName = 'ai-dialog-overlay';
var transitionEvent = function () {
  var transition = null;

  return function () {
    if (transition) return transition;

    var t = void 0;
    var el = _aureliaPal.DOM.createElement('fakeelement');
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };
    for (t in transitions) {
      if (el.style[t] !== undefined) {
        transition = transitions[t];
        return transition;
      }
    }
  };
}();

var DialogRenderer = exports.DialogRenderer = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function () {
  function DialogRenderer() {
    var _this = this;

    

    this.dialogControllers = [];

    this.escapeKeyEvent = function (e) {
      if (e.keyCode === 27) {
        var top = _this.dialogControllers[_this.dialogControllers.length - 1];
        if (top && top.settings.lock !== true) {
          top.cancel();
        }
      }
    };

    this.defaultSettings = _dialogOptions.dialogOptions;
  }

  DialogRenderer.prototype.getDialogContainer = function getDialogContainer() {
    return _aureliaPal.DOM.createElement('div');
  };

  DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
    var _this2 = this;

    var settings = Object.assign({}, this.defaultSettings, dialogController.settings);
    var body = _aureliaPal.DOM.querySelectorAll('body')[0];
    var wrapper = document.createElement('div');

    this.modalOverlay = _aureliaPal.DOM.createElement(overlayTagName);
    this.modalContainer = _aureliaPal.DOM.createElement(containerTagName);
    this.anchor = dialogController.slot.anchor;
    wrapper.appendChild(this.anchor);
    this.modalContainer.appendChild(wrapper);

    this.stopPropagation = function (e) {
      e._aureliaDialogHostClicked = true;
    };
    this.closeModalClick = function (e) {
      if (!settings.lock && !e._aureliaDialogHostClicked) {
        dialogController.cancel();
      } else {
        return false;
      }
    };

    dialogController.centerDialog = function () {
      if (settings.centerHorizontalOnly) return;
      centerDialog(_this2.modalContainer);
    };

    this.modalOverlay.style.zIndex = this.defaultSettings.startingZIndex;
    this.modalContainer.style.zIndex = this.defaultSettings.startingZIndex;

    var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

    if (lastContainer) {
      lastContainer.parentNode.insertBefore(this.modalContainer, lastContainer.nextSibling);
      lastContainer.parentNode.insertBefore(this.modalOverlay, lastContainer.nextSibling);
    } else {
      body.insertBefore(this.modalContainer, body.firstChild);
      body.insertBefore(this.modalOverlay, body.firstChild);
    }

    if (!this.dialogControllers.length) {
      _aureliaPal.DOM.addEventListener('keyup', this.escapeKeyEvent);
    }

    this.dialogControllers.push(dialogController);

    dialogController.slot.attached();

    if (typeof settings.position === 'function') {
      settings.position(this.modalContainer, this.modalOverlay);
    } else {
      dialogController.centerDialog();
    }

    this.modalContainer.addEventListener('click', this.closeModalClick);
    this.anchor.addEventListener('click', this.stopPropagation);

    return new Promise(function (resolve) {
      var renderer = _this2;
      if (settings.ignoreTransitions) {
        resolve();
      } else {
        _this2.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
      }

      _this2.modalOverlay.classList.add('active');
      _this2.modalContainer.classList.add('active');
      body.classList.add('ai-dialog-open');

      function onTransitionEnd(e) {
        if (e.target !== renderer.modalContainer) {
          return;
        }
        renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
        resolve();
      }
    });
  };

  DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
    var _this3 = this;

    var settings = Object.assign({}, this.defaultSettings, dialogController.settings);
    var body = _aureliaPal.DOM.querySelectorAll('body')[0];

    this.modalContainer.removeEventListener('click', this.closeModalClick);
    this.anchor.removeEventListener('click', this.stopPropagation);

    var i = this.dialogControllers.indexOf(dialogController);
    if (i !== -1) {
      this.dialogControllers.splice(i, 1);
    }

    if (!this.dialogControllers.length) {
      _aureliaPal.DOM.removeEventListener('keyup', this.escapeKeyEvent);
    }

    return new Promise(function (resolve) {
      var renderer = _this3;
      if (settings.ignoreTransitions) {
        resolve();
      } else {
        _this3.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
      }

      _this3.modalOverlay.classList.remove('active');
      _this3.modalContainer.classList.remove('active');

      function onTransitionEnd() {
        renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
        resolve();
      }
    }).then(function () {
      body.removeChild(_this3.modalOverlay);
      body.removeChild(_this3.modalContainer);
      dialogController.slot.detached();

      if (!_this3.dialogControllers.length) {
        body.classList.remove('ai-dialog-open');
      }

      return Promise.resolve();
    });
  };

  return DialogRenderer;
}()) || _class);


function centerDialog(modalContainer) {
  var child = modalContainer.children[0];
  var vh = Math.max(_aureliaPal.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

  child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("bluebird")))

/***/ },

/***/ 700:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogService = undefined;

var _class, _temp;

var _aureliaMetadata = __webpack_require__(26);

var _aureliaDependencyInjection = __webpack_require__(4);

var _aureliaTemplating = __webpack_require__("aurelia-templating");

var _dialogController = __webpack_require__(94);

var _renderer = __webpack_require__(236);

var _lifecycle = __webpack_require__(235);

var _dialogResult = __webpack_require__(147);



var DialogService = exports.DialogService = (_temp = _class = function () {
  function DialogService(container, compositionEngine) {
    

    this.container = container;
    this.compositionEngine = compositionEngine;
    this.controllers = [];
    this.hasActiveDialog = false;
  }

  DialogService.prototype.open = function open(settings) {
    var _this = this;

    var dialogController = void 0;

    var promise = new Promise(function (resolve, reject) {
      var childContainer = _this.container.createChild();
      dialogController = new _dialogController.DialogController(childContainer.get(_renderer.Renderer), settings, resolve, reject);
      childContainer.registerInstance(_dialogController.DialogController, dialogController);
      return _openDialog(_this, childContainer, dialogController);
    });

    return promise.then(function (result) {
      var i = _this.controllers.indexOf(dialogController);
      if (i !== -1) {
        _this.controllers.splice(i, 1);
        _this.hasActiveDialog = !!_this.controllers.length;
      }

      return result;
    });
  };

  DialogService.prototype.openAndYieldController = function openAndYieldController(settings) {
    var _this2 = this;

    var childContainer = this.container.createChild();
    var dialogController = new _dialogController.DialogController(childContainer.get(_renderer.Renderer), settings, null, null);
    childContainer.registerInstance(_dialogController.DialogController, dialogController);

    dialogController.result = new Promise(function (resolve, reject) {
      dialogController._resolve = resolve;
      dialogController._reject = reject;
    }).then(function (result) {
      var i = _this2.controllers.indexOf(dialogController);
      if (i !== -1) {
        _this2.controllers.splice(i, 1);
        _this2.hasActiveDialog = !!_this2.controllers.length;
      }
      return result;
    });

    return _openDialog(this, childContainer, dialogController).then(function () {
      return dialogController;
    });
  };

  return DialogService;
}(), _class.inject = [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine], _temp);


function _openDialog(service, childContainer, dialogController) {
  var host = dialogController.renderer.getDialogContainer();
  var instruction = {
    container: service.container,
    childContainer: childContainer,
    model: dialogController.settings.model,
    view: dialogController.settings.view,
    viewModel: dialogController.settings.viewModel,
    viewSlot: new _aureliaTemplating.ViewSlot(host, true),
    host: host
  };

  return _getViewModel(instruction, service.compositionEngine).then(function (returnedInstruction) {
    dialogController.viewModel = returnedInstruction.viewModel;
    dialogController.slot = returnedInstruction.viewSlot;

    return (0, _lifecycle.invokeLifecycle)(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
      if (canActivate) {
        service.controllers.push(dialogController);
        service.hasActiveDialog = !!service.controllers.length;

        return service.compositionEngine.compose(returnedInstruction).then(function (controller) {
          dialogController.controller = controller;
          dialogController.view = controller.view;

          return dialogController.renderer.showDialog(dialogController);
        });
      }
    });
  });
}

function _getViewModel(instruction, compositionEngine) {
  if (typeof instruction.viewModel === 'function') {
    instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
  }

  if (typeof instruction.viewModel === 'string') {
    return compositionEngine.ensureViewModel(instruction);
  }

  return Promise.resolve(instruction);
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("bluebird")))

/***/ },

/***/ 703:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplatingRouteLoader = undefined;

var _dec, _class;

var _aureliaDependencyInjection = __webpack_require__(4);

var _aureliaTemplating = __webpack_require__("aurelia-templating");

var _aureliaRouter = __webpack_require__("aurelia-router");

var _aureliaPath = __webpack_require__(47);

var _aureliaMetadata = __webpack_require__(26);



function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TemplatingRouteLoader = exports.TemplatingRouteLoader = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.CompositionEngine), _dec(_class = function (_RouteLoader) {
  _inherits(TemplatingRouteLoader, _RouteLoader);

  function TemplatingRouteLoader(compositionEngine) {
    

    var _this = _possibleConstructorReturn(this, _RouteLoader.call(this));

    _this.compositionEngine = compositionEngine;
    return _this;
  }

  TemplatingRouteLoader.prototype.loadRoute = function loadRoute(router, config) {
    var childContainer = router.container.createChild();
    var instruction = {
      viewModel: (0, _aureliaPath.relativeToFile)(config.moduleId, _aureliaMetadata.Origin.get(router.container.viewModel.constructor).moduleId),
      childContainer: childContainer,
      view: config.view || config.viewStrategy,
      router: router
    };

    childContainer.getChildRouter = function () {
      var childRouter = void 0;

      childContainer.registerHandler(_aureliaRouter.Router, function (c) {
        return childRouter || (childRouter = router.createChild(childContainer));
      });

      return childContainer.get(_aureliaRouter.Router);
    };

    return this.compositionEngine.ensureViewModel(instruction);
  };

  return TemplatingRouteLoader;
}(_aureliaRouter.RouteLoader)) || _class);

/***/ },

/***/ 707:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validateBindingBehavior = __webpack_require__(709);

Object.defineProperty(exports, 'ValidateBindingBehavior', {
  enumerable: true,
  get: function get() {
    return _validateBindingBehavior.ValidateBindingBehavior;
  }
});

var _validateTrigger = __webpack_require__(150);

Object.defineProperty(exports, 'validateTrigger', {
  enumerable: true,
  get: function get() {
    return _validateTrigger.validateTrigger;
  }
});

var _validationController = __webpack_require__(95);

Object.defineProperty(exports, 'ValidationController', {
  enumerable: true,
  get: function get() {
    return _validationController.ValidationController;
  }
});

var _validationError = __webpack_require__(151);

Object.defineProperty(exports, 'ValidationError', {
  enumerable: true,
  get: function get() {
    return _validationError.ValidationError;
  }
});

var _validationErrorsCustomAttribute = __webpack_require__(710);

Object.defineProperty(exports, 'ValidationErrorsCustomAttribute', {
  enumerable: true,
  get: function get() {
    return _validationErrorsCustomAttribute.ValidationErrorsCustomAttribute;
  }
});

var _validationRendererCustomAttribute = __webpack_require__(711);

Object.defineProperty(exports, 'ValidationRendererCustomAttribute', {
  enumerable: true,
  get: function get() {
    return _validationRendererCustomAttribute.ValidationRendererCustomAttribute;
  }
});

var _validationRenderer = __webpack_require__(249);

Object.defineProperty(exports, 'validationRenderer', {
  enumerable: true,
  get: function get() {
    return _validationRenderer.validationRenderer;
  }
});

var _validator = __webpack_require__(250);

Object.defineProperty(exports, 'Validator', {
  enumerable: true,
  get: function get() {
    return _validator.Validator;
  }
});
exports.configure = configure;
function configure(config) {
  config.globalResources('./validate-binding-behavior', './validation-errors-custom-attribute', './validation-renderer-custom-attribute');
}

/***/ },

/***/ 708:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.getPropertyInfo = getPropertyInfo;

var _aureliaBinding = __webpack_require__(9);

function getObject(expression, objectExpression, source) {
  var value = objectExpression.evaluate(source);
  if (value !== null && ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'function')) {
    return value;
  }
  if (value === null) {
    value = 'null';
  } else if (value === undefined) {
    value = 'undefined';
  }
  throw new Error('The \'' + objectExpression + '\' part of \'' + expression + '\' evaluates to ' + value + ' instead of an object.');
}

function getPropertyInfo(expression, source) {
  var originalExpression = expression;
  while (expression instanceof _aureliaBinding.BindingBehavior || expression instanceof _aureliaBinding.ValueConverter) {
    expression = expression.expression;
  }

  var object = void 0;
  var property = void 0;
  if (expression instanceof _aureliaBinding.AccessScope) {
    object = source.bindingContext;
    property = expression.name;
  } else if (expression instanceof _aureliaBinding.AccessMember) {
    object = getObject(originalExpression, expression.object, source);
    property = expression.name;
  } else if (expression instanceof _aureliaBinding.AccessKeyed) {
    object = getObject(originalExpression, expression.object, source);
    property = expression.key.evaluate(source);
  } else {
    throw new Error('Expression \'' + originalExpression + '\' is not compatible with the validate binding-behavior.');
  }

  return { object: object, property: property };
}

/***/ },

/***/ 709:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidateBindingBehavior = undefined;

var _dec, _class;

var _aureliaDependencyInjection = __webpack_require__(4);

var _aureliaTaskQueue = __webpack_require__(42);

var _validationController = __webpack_require__(95);

var _validateTrigger = __webpack_require__(150);



var ValidateBindingBehavior = exports.ValidateBindingBehavior = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaTaskQueue.TaskQueue), _dec(_class = function () {
  function ValidateBindingBehavior(taskQueue) {
    

    this.taskQueue = taskQueue;
  }

  ValidateBindingBehavior.prototype.getTarget = function getTarget(binding, view) {
    var target = binding.target;
    if (target instanceof Element) {
      return target;
    }
    var controller = void 0;
    for (var id in view.controllers) {
      controller = view.controllers[id];
      if (controller.viewModel === target) {
        break;
      }
    }
    return controller.view.firstChild.parentNode;
  };

  ValidateBindingBehavior.prototype.bind = function bind(binding, source, rules) {
    var _this = this;

    var target = this.getTarget(binding, source);

    var controller = source.container.get(_aureliaDependencyInjection.Optional.of(_validationController.ValidationController, true));
    if (controller === null) {
      throw new Error('A ValidationController has not been registered.');
    }
    controller.registerBinding(binding, target, rules);
    binding.validationController = controller;

    if (controller.validateTrigger === _validateTrigger.validateTrigger.change) {
      binding.standardUpdateSource = binding.updateSource;
      binding.updateSource = function (value) {
        this.standardUpdateSource(value);
        this.validationController._validateBinding(this);
      };
    } else if (controller.validateTrigger === _validateTrigger.validateTrigger.blur) {
      binding.validateBlurHandler = function () {
        _this.taskQueue.queueMicroTask(function () {
          return controller._validateBinding(binding);
        });
      };
      binding.validateTarget = target;
      target.addEventListener('blur', binding.validateBlurHandler);
    }

    if (controller.validateTrigger !== _validateTrigger.validateTrigger.manual) {
      binding.standardUpdateTarget = binding.updateTarget;
      binding.updateTarget = function (value) {
        this.standardUpdateTarget(value);
        this.validationController._resetBinding(this);
      };
    }
  };

  ValidateBindingBehavior.prototype.unbind = function unbind(binding, source) {
    if (binding.standardUpdateSource) {
      binding.updateSource = binding.standardUpdateSource;
      binding.standardUpdateSource = null;
    }
    if (binding.standardUpdateTarget) {
      binding.updateTarget = binding.standardUpdateTarget;
      binding.standardUpdateTarget = null;
    }
    if (binding.validateBlurHandler) {
      binding.validateTarget.removeEventListener('blur', binding.validateBlurHandler);
      binding.validateBlurHandler = null;
      binding.validateTarget = null;
    }
    binding.validationController.unregisterBinding(binding);
    binding.validationController = null;
  };

  return ValidateBindingBehavior;
}()) || _class);

/***/ },

/***/ 710:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationErrorsCustomAttribute = undefined;

var _dec, _dec2, _class;

var _aureliaBinding = __webpack_require__(9);

var _aureliaDependencyInjection = __webpack_require__(4);

var _aureliaTemplating = __webpack_require__("aurelia-templating");

var _validationController = __webpack_require__(95);

var _validationRenderer = __webpack_require__(249);



var ValidationErrorsCustomAttribute = exports.ValidationErrorsCustomAttribute = (_dec = (0, _aureliaTemplating.customAttribute)('validation-errors', _aureliaBinding.bindingMode.twoWay), _dec2 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaDependencyInjection.Lazy.of(_validationController.ValidationController)), _dec(_class = _dec2(_class = (0, _validationRenderer.validationRenderer)(_class = function () {
  function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
    

    this.errors = [];

    this.boundaryElement = boundaryElement;
    this.controllerAccessor = controllerAccessor;
  }

  ValidationErrorsCustomAttribute.prototype.sort = function sort() {
    this.errors.sort(function (a, b) {
      if (a.target === b.target) {
        return 0;
      }
      return a.target.compareDocumentPosition(b.target) & 2 ? 1 : -1;
    });
  };

  ValidationErrorsCustomAttribute.prototype.render = function render(error, target) {
    if (!target || !(this.boundaryElement === target || this.boundaryElement.contains(target))) {
      return;
    }

    this.errors.push({ error: error, target: target });
    this.sort();
    this.value = this.errors;
  };

  ValidationErrorsCustomAttribute.prototype.unrender = function unrender(error, target) {
    var index = this.errors.findIndex(function (x) {
      return x.error === error;
    });
    if (index === -1) {
      return;
    }
    this.errors.splice(index, 1);
    this.value = this.errors;
  };

  ValidationErrorsCustomAttribute.prototype.bind = function bind() {
    this.controllerAccessor().addRenderer(this);
    this.value = this.errors;
  };

  ValidationErrorsCustomAttribute.prototype.unbind = function unbind() {
    this.controllerAccessor().removeRenderer(this);
  };

  return ValidationErrorsCustomAttribute;
}()) || _class) || _class) || _class);

/***/ },

/***/ 711:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationRendererCustomAttribute = undefined;

var _validationController = __webpack_require__(95);



var ValidationRendererCustomAttribute = exports.ValidationRendererCustomAttribute = function () {
  function ValidationRendererCustomAttribute() {
    
  }

  ValidationRendererCustomAttribute.prototype.created = function created(view) {
    this.container = view.container;
  };

  ValidationRendererCustomAttribute.prototype.bind = function bind() {
    this.controller = this.container.get(_validationController.ValidationController);
    this.renderer = this.container.get(this.value);
    this.controller.addRenderer(this.renderer);
  };

  ValidationRendererCustomAttribute.prototype.unbind = function unbind() {
    this.controller.removeRenderer(this.renderer);
    this.controller = null;
    this.renderer = null;
  };

  return ValidationRendererCustomAttribute;
}();

/***/ },

/***/ 712:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var aurelia_binding_1 = __webpack_require__(9);
function getObject(expression, objectExpression, source) {
    var value = objectExpression.evaluate(source, null);
    if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
        return value;
    }
    if (value === null) {
        value = 'null';
    }
    else if (value === undefined) {
        value = 'undefined';
    }
    throw new Error("The '" + objectExpression + "' part of '" + expression + "' evaluates to " + value + " instead of an object.");
}
/**
 * Retrieves the object and property name for the specified expression.
 * @param expression The expression
 * @param source The scope
 */
function getPropertyInfo(expression, source) {
    var originalExpression = expression;
    while (expression instanceof aurelia_binding_1.BindingBehavior || expression instanceof aurelia_binding_1.ValueConverter) {
        expression = expression.expression;
    }
    var object;
    var propertyName;
    if (expression instanceof aurelia_binding_1.AccessScope) {
        object = source.bindingContext;
        propertyName = expression.name;
    }
    else if (expression instanceof aurelia_binding_1.AccessMember) {
        object = getObject(originalExpression, expression.object, source);
        propertyName = expression.name;
    }
    else if (expression instanceof aurelia_binding_1.AccessKeyed) {
        object = getObject(originalExpression, expression.object, source);
        propertyName = expression.key.evaluate(source);
    }
    else {
        throw new Error("Expression '" + originalExpression + "' is not compatible with the validate binding-behavior.");
    }
    return { object: object, propertyName: propertyName };
}
exports.getPropertyInfo = getPropertyInfo;


/***/ },

/***/ 713:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var aurelia_dependency_injection_1 = __webpack_require__(4);
var aurelia_pal_1 = __webpack_require__(14);
var validation_controller_1 = __webpack_require__(75);
var validate_trigger_1 = __webpack_require__(96);
/**
 * Binding behavior. Indicates the bound property should be validated.
 */
var ValidateBindingBehaviorBase = (function () {
    function ValidateBindingBehaviorBase(taskQueue) {
        this.taskQueue = taskQueue;
    }
    /**
    * Gets the DOM element associated with the data-binding. Most of the time it's
    * the binding.target but sometimes binding.target is an aurelia custom element,
    * or custom attribute which is a javascript "class" instance, so we need to use
    * the controller's container to retrieve the actual DOM element.
    */
    ValidateBindingBehaviorBase.prototype.getTarget = function (binding, view) {
        var target = binding.target;
        // DOM element
        if (target instanceof Element) {
            return target;
        }
        // custom element or custom attribute
        for (var i = 0, ii = view.controllers.length; i < ii; i++) {
            var controller = view.controllers[i];
            if (controller.viewModel === target) {
                var element = controller.container.get(aurelia_pal_1.DOM.Element);
                if (element) {
                    return element;
                }
                throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
            }
        }
        throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
    };
    ValidateBindingBehaviorBase.prototype.bind = function (binding, source, rulesOrController, rules) {
        var _this = this;
        // identify the target element.
        var target = this.getTarget(binding, source);
        // locate the controller.
        var controller;
        if (rulesOrController instanceof validation_controller_1.ValidationController) {
            controller = rulesOrController;
        }
        else {
            controller = source.container.get(aurelia_dependency_injection_1.Optional.of(validation_controller_1.ValidationController));
            rules = rulesOrController;
        }
        if (controller === null) {
            throw new Error("A ValidationController has not been registered.");
        }
        controller.registerBinding(binding, target, rules);
        binding.validationController = controller;
        var trigger = this.getValidateTrigger(controller);
        if (trigger & validate_trigger_1.validateTrigger.change) {
            binding.standardUpdateSource = binding.updateSource;
            binding.updateSource = function (value) {
                this.standardUpdateSource(value);
                this.validationController.validateBinding(this);
            };
        }
        if (trigger & validate_trigger_1.validateTrigger.blur) {
            binding.validateBlurHandler = function () {
                _this.taskQueue.queueMicroTask(function () { return controller.validateBinding(binding); });
            };
            binding.validateTarget = target;
            target.addEventListener('blur', binding.validateBlurHandler);
        }
        if (trigger !== validate_trigger_1.validateTrigger.manual) {
            binding.standardUpdateTarget = binding.updateTarget;
            binding.updateTarget = function (value) {
                this.standardUpdateTarget(value);
                this.validationController.resetBinding(this);
            };
        }
    };
    ValidateBindingBehaviorBase.prototype.unbind = function (binding) {
        // reset the binding to it's original state.
        if (binding.standardUpdateSource) {
            binding.updateSource = binding.standardUpdateSource;
            binding.standardUpdateSource = null;
        }
        if (binding.standardUpdateTarget) {
            binding.updateTarget = binding.standardUpdateTarget;
            binding.standardUpdateTarget = null;
        }
        if (binding.validateBlurHandler) {
            binding.validateTarget.removeEventListener('blur', binding.validateBlurHandler);
            binding.validateBlurHandler = null;
            binding.validateTarget = null;
        }
        binding.validationController.unregisterBinding(binding);
        binding.validationController = null;
    };
    return ValidateBindingBehaviorBase;
}());
exports.ValidateBindingBehaviorBase = ValidateBindingBehaviorBase;


/***/ },

/***/ 714:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var validation_controller_1 = __webpack_require__(75);
var validator_1 = __webpack_require__(76);
/**
 * Creates ValidationController instances.
 */
var ValidationControllerFactory = (function () {
    function ValidationControllerFactory(container) {
        this.container = container;
    }
    ValidationControllerFactory.get = function (container) {
        return new ValidationControllerFactory(container);
    };
    /**
     * Creates a new controller instance.
     */
    ValidationControllerFactory.prototype.create = function (validator) {
        if (!validator) {
            validator = this.container.get(validator_1.Validator);
        }
        return new validation_controller_1.ValidationController(validator);
    };
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    ValidationControllerFactory.prototype.createForCurrentScope = function (validator) {
        var controller = this.create(validator);
        this.container.registerInstance(validation_controller_1.ValidationController, controller);
        return controller;
    };
    return ValidationControllerFactory;
}());
exports.ValidationControllerFactory = ValidationControllerFactory;
ValidationControllerFactory['protocol:aurelia:resolver'] = true;


/***/ },

/***/ 75:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {"use strict";
var validator_1 = __webpack_require__(76);
var validate_trigger_1 = __webpack_require__(96);
var property_info_1 = __webpack_require__(712);
var validation_error_1 = __webpack_require__(155);
/**
 * Orchestrates validation.
 * Manages a set of bindings, renderers and objects.
 * Exposes the current list of validation errors for binding purposes.
 */
var ValidationController = (function () {
    function ValidationController(validator) {
        this.validator = validator;
        // Registered bindings (via the validate binding behavior)
        this.bindings = new Map();
        // Renderers that have been added to the controller instance.
        this.renderers = [];
        /**
         * Errors that have been rendered by the controller.
         */
        this.errors = [];
        /**
         *  Whether the controller is currently validating.
         */
        this.validating = false;
        // Elements related to errors that have been rendered.
        this.elements = new Map();
        // Objects that have been added to the controller instance (entity-style validation).
        this.objects = new Map();
        /**
         * The trigger that will invoke automatic validation of a property used in a binding.
         */
        this.validateTrigger = validate_trigger_1.validateTrigger.blur;
        // Promise that resolves when validation has completed.
        this.finishValidating = Promise.resolve();
    }
    /**
     * Adds an object to the set of objects that should be validated when validate is called.
     * @param object The object.
     * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
     */
    ValidationController.prototype.addObject = function (object, rules) {
        this.objects.set(object, rules);
    };
    /**
     * Removes an object from the set of objects that should be validated when validate is called.
     * @param object The object.
     */
    ValidationController.prototype.removeObject = function (object) {
        this.objects.delete(object);
        this.processErrorDelta('reset', this.errors.filter(function (error) { return error.object === object; }), []);
    };
    /**
     * Adds and renders a ValidationError.
     */
    ValidationController.prototype.addError = function (message, object, propertyName) {
        var error = new validation_error_1.ValidationError({}, message, object, propertyName);
        this.processErrorDelta('validate', [], [error]);
        return error;
    };
    /**
     * Removes and unrenders a ValidationError.
     */
    ValidationController.prototype.removeError = function (error) {
        if (this.errors.indexOf(error) !== -1) {
            this.processErrorDelta('reset', [error], []);
        }
    };
    /**
     * Adds a renderer.
     * @param renderer The renderer.
     */
    ValidationController.prototype.addRenderer = function (renderer) {
        var _this = this;
        this.renderers.push(renderer);
        renderer.render({
            kind: 'validate',
            render: this.errors.map(function (error) { return ({ error: error, elements: _this.elements.get(error) }); }),
            unrender: []
        });
    };
    /**
     * Removes a renderer.
     * @param renderer The renderer.
     */
    ValidationController.prototype.removeRenderer = function (renderer) {
        var _this = this;
        this.renderers.splice(this.renderers.indexOf(renderer), 1);
        renderer.render({
            kind: 'reset',
            render: [],
            unrender: this.errors.map(function (error) { return ({ error: error, elements: _this.elements.get(error) }); })
        });
    };
    /**
     * Registers a binding with the controller.
     * @param binding The binding instance.
     * @param target The DOM element.
     * @param rules (optional) rules associated with the binding. Validator implementation specific.
     */
    ValidationController.prototype.registerBinding = function (binding, target, rules) {
        this.bindings.set(binding, { target: target, rules: rules });
    };
    /**
     * Unregisters a binding with the controller.
     * @param binding The binding instance.
     */
    ValidationController.prototype.unregisterBinding = function (binding) {
        this.resetBinding(binding);
        this.bindings.delete(binding);
    };
    /**
     * Interprets the instruction and returns a predicate that will identify
     * relevant errors in the list of rendered errors.
     */
    ValidationController.prototype.getInstructionPredicate = function (instruction) {
        if (instruction) {
            var object_1 = instruction.object, propertyName_1 = instruction.propertyName, rules_1 = instruction.rules;
            var predicate_1;
            if (instruction.propertyName) {
                predicate_1 = function (x) { return x.object === object_1 && x.propertyName === propertyName_1; };
            }
            else {
                predicate_1 = function (x) { return x.object === object_1; };
            }
            // todo: move to Validator interface:
            if (rules_1 && rules_1.indexOf) {
                return function (x) { return predicate_1(x) && rules_1.indexOf(x.rule) !== -1; };
            }
            return predicate_1;
        }
        else {
            return function () { return true; };
        }
    };
    /**
     * Validates and renders errors.
     * @param instruction Optional. Instructions on what to validate. If undefined, all objects and bindings will be validated.
     */
    ValidationController.prototype.validate = function (instruction) {
        var _this = this;
        // Get a function that will process the validation instruction.
        var execute;
        if (instruction) {
            var object_2 = instruction.object, propertyName_2 = instruction.propertyName, rules_2 = instruction.rules;
            // if rules were not specified, check the object map.
            rules_2 = rules_2 || this.objects.get(object_2);
            // property specified?
            if (instruction.propertyName === undefined) {
                // validate the specified object.
                execute = function () { return _this.validator.validateObject(object_2, rules_2); };
            }
            else {
                // validate the specified property.
                execute = function () { return _this.validator.validateProperty(object_2, propertyName_2, rules_2); };
            }
        }
        else {
            // validate all objects and bindings.
            execute = function () {
                var promises = [];
                for (var _i = 0, _a = Array.from(_this.objects); _i < _a.length; _i++) {
                    var _b = _a[_i], object = _b[0], rules = _b[1];
                    promises.push(_this.validator.validateObject(object, rules));
                }
                for (var _c = 0, _d = Array.from(_this.bindings); _c < _d.length; _c++) {
                    var _e = _d[_c], binding = _e[0], rules = _e[1].rules;
                    var _f = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _f.object, propertyName = _f.propertyName;
                    if (_this.objects.has(object)) {
                        continue;
                    }
                    promises.push(_this.validator.validateProperty(object, propertyName, rules));
                }
                return Promise.all(promises).then(function (errorSets) { return errorSets.reduce(function (a, b) { return a.concat(b); }, []); });
            };
        }
        // Wait for any existing validation to finish, execute the instruction, render the errors.
        this.validating = true;
        var result = this.finishValidating
            .then(execute)
            .then(function (newErrors) {
            var predicate = _this.getInstructionPredicate(instruction);
            var oldErrors = _this.errors.filter(predicate);
            _this.processErrorDelta('validate', oldErrors, newErrors);
            if (result === _this.finishValidating) {
                _this.validating = false;
            }
            return newErrors;
        })
            .catch(function (error) {
            // recover, to enable subsequent calls to validate()
            _this.validating = false;
            _this.finishValidating = Promise.resolve();
            return Promise.reject(error);
        });
        this.finishValidating = result;
        return result;
    };
    /**
     * Resets any rendered errors (unrenders).
     * @param instruction Optional. Instructions on what to reset. If unspecified all rendered errors will be unrendered.
     */
    ValidationController.prototype.reset = function (instruction) {
        var predicate = this.getInstructionPredicate(instruction);
        var oldErrors = this.errors.filter(predicate);
        this.processErrorDelta('reset', oldErrors, []);
    };
    /**
     * Gets the elements associated with an object and propertyName (if any).
     */
    ValidationController.prototype.getAssociatedElements = function (_a) {
        var object = _a.object, propertyName = _a.propertyName;
        var elements = [];
        for (var _i = 0, _b = Array.from(this.bindings); _i < _b.length; _i++) {
            var _c = _b[_i], binding = _c[0], target = _c[1].target;
            var _d = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), o = _d.object, p = _d.propertyName;
            if (o === object && p === propertyName) {
                elements.push(target);
            }
        }
        return elements;
    };
    ValidationController.prototype.processErrorDelta = function (kind, oldErrors, newErrors) {
        // prepare the instruction.
        var instruction = {
            kind: kind,
            render: [],
            unrender: []
        };
        // create a shallow copy of newErrors so we can mutate it without causing side-effects.
        newErrors = newErrors.slice(0);
        // create unrender instructions from the old errors.
        var _loop_1 = function(oldError) {
            // get the elements associated with the old error.
            var elements = this_1.elements.get(oldError);
            // remove the old error from the element map.
            this_1.elements.delete(oldError);
            // create the unrender instruction.
            instruction.unrender.push({ error: oldError, elements: elements });
            // determine if there's a corresponding new error for the old error we are unrendering.
            var newErrorIndex = newErrors.findIndex(function (x) { return x.rule === oldError.rule && x.object === oldError.object && x.propertyName === oldError.propertyName; });
            if (newErrorIndex === -1) {
                // no corresponding new error... simple remove.
                this_1.errors.splice(this_1.errors.indexOf(oldError), 1);
            }
            else {
                // there is a corresponding new error...        
                var newError = newErrors.splice(newErrorIndex, 1)[0];
                // get the elements that are associated with the new error.
                var elements_1 = this_1.getAssociatedElements(newError);
                this_1.elements.set(newError, elements_1);
                // create a render instruction for the new error.
                instruction.render.push({ error: newError, elements: elements_1 });
                // do an in-place replacement of the old error with the new error.
                // this ensures any repeats bound to this.errors will not thrash.
                this_1.errors.splice(this_1.errors.indexOf(oldError), 1, newError);
            }
        };
        var this_1 = this;
        for (var _i = 0, oldErrors_1 = oldErrors; _i < oldErrors_1.length; _i++) {
            var oldError = oldErrors_1[_i];
            _loop_1(oldError);
        }
        // create render instructions from the remaining new errors.
        for (var _a = 0, newErrors_1 = newErrors; _a < newErrors_1.length; _a++) {
            var error = newErrors_1[_a];
            var elements = this.getAssociatedElements(error);
            instruction.render.push({ error: error, elements: elements });
            this.elements.set(error, elements);
            this.errors.push(error);
        }
        // render.
        for (var _b = 0, _c = this.renderers; _b < _c.length; _b++) {
            var renderer = _c[_b];
            renderer.render(instruction);
        }
    };
    /**
    * Validates the property associated with a binding.
    */
    ValidationController.prototype.validateBinding = function (binding) {
        if (!binding.isBound) {
            return;
        }
        var _a = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _a.object, propertyName = _a.propertyName;
        var registeredBinding = this.bindings.get(binding);
        var rules = registeredBinding ? registeredBinding.rules : undefined;
        this.validate({ object: object, propertyName: propertyName, rules: rules });
    };
    /**
    * Resets the errors for a property associated with a binding.
    */
    ValidationController.prototype.resetBinding = function (binding) {
        var _a = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _a.object, propertyName = _a.propertyName;
        this.reset({ object: object, propertyName: propertyName });
    };
    ValidationController.inject = [validator_1.Validator];
    return ValidationController;
}());
exports.ValidationController = ValidationController;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("bluebird")))

/***/ },

/***/ 76:
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * Validates.
 * Responsible for validating objects and properties.
 */
var Validator = (function () {
    function Validator() {
    }
    return Validator;
}());
exports.Validator = Validator;


/***/ },

/***/ 94:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogController = undefined;

var _lifecycle = __webpack_require__(235);

var _dialogResult = __webpack_require__(147);



var DialogController = exports.DialogController = function () {
  function DialogController(renderer, settings, resolve, reject) {
    

    this.renderer = renderer;
    this.settings = settings;
    this._resolve = resolve;
    this._reject = reject;
  }

  DialogController.prototype.ok = function ok(output) {
    return this.close(true, output);
  };

  DialogController.prototype.cancel = function cancel(output) {
    return this.close(false, output);
  };

  DialogController.prototype.error = function error(message) {
    var _this = this;

    return (0, _lifecycle.invokeLifecycle)(this.viewModel, 'deactivate').then(function () {
      return _this.renderer.hideDialog(_this);
    }).then(function () {
      _this.controller.unbind();
      _this._reject(message);
    });
  };

  DialogController.prototype.close = function close(ok, output) {
    var _this2 = this;

    if (this._closePromise) return this._closePromise;

    this._closePromise = (0, _lifecycle.invokeLifecycle)(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
      if (canDeactivate) {
        return (0, _lifecycle.invokeLifecycle)(_this2.viewModel, 'deactivate').then(function () {
          return _this2.renderer.hideDialog(_this2);
        }).then(function () {
          var result = new _dialogResult.DialogResult(!ok, output);
          _this2.controller.unbind();
          _this2._resolve(result);
          return result;
        });
      }

      return Promise.resolve();
    });

    return this._closePromise;
  };

  return DialogController;
}();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("bluebird")))

/***/ },

/***/ 95:
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationController = undefined;

var _dec, _class;

var _aureliaDependencyInjection = __webpack_require__(4);

var _validator = __webpack_require__(250);

var _validateTrigger = __webpack_require__(150);

var _propertyInfo = __webpack_require__(708);



var ValidationController = exports.ValidationController = (_dec = (0, _aureliaDependencyInjection.inject)(_validator.Validator), _dec(_class = function () {
  function ValidationController(validator) {
    

    this.bindings = new Map();
    this.renderers = [];
    this.validateTrigger = _validateTrigger.validateTrigger.blur;

    this.validator = validator;
  }

  ValidationController.prototype.addRenderer = function addRenderer(renderer) {
    for (var _iterator = this.bindings.values(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _ref2 = _ref;
      var target = _ref2.target;
      var errors = _ref2.errors;

      for (var i = 0, ii = errors.length; i < ii; i++) {
        renderer.render(errors[i], target);
      }
    }
    this.renderers.push(renderer);
  };

  ValidationController.prototype.removeRenderer = function removeRenderer(renderer) {
    for (var _iterator2 = this.bindings.values(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var _ref4 = _ref3;
      var target = _ref4.target;
      var errors = _ref4.errors;

      for (var i = 0, ii = errors.length; i < ii; i++) {
        renderer.unrender(errors[i], target);
      }
    }
    this.renderers.splice(this.renderers.indexOf(renderer), 1);
  };

  ValidationController.prototype.registerBinding = function registerBinding(binding, target) {
    var rules = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    var errors = [];
    this.bindings.set(binding, { target: target, rules: rules, errors: errors });
  };

  ValidationController.prototype.unregisterBinding = function unregisterBinding(binding) {
    this._resetBinding(binding);
    this.bindings.delete(binding);
  };

  ValidationController.prototype.validate = function validate() {
    var errors = [];
    for (var _iterator3 = this.bindings.keys(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref5 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref5 = _i3.value;
      }

      var binding = _ref5;

      errors.splice.apply(errors, [errors.length, 0].concat(this._validateBinding(binding)));
    }
    return errors;
  };

  ValidationController.prototype.reset = function reset() {
    for (var _iterator4 = this.bindings.keys(), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref6;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref6 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref6 = _i4.value;
      }

      var binding = _ref6;

      this._resetBinding(binding);
    }
  };

  ValidationController.prototype._renderError = function _renderError(error, target) {
    var renderers = this.renderers;
    var i = renderers.length;
    while (i--) {
      renderers[i].render(error, target);
    }
  };

  ValidationController.prototype._unrenderError = function _unrenderError(error, target) {
    var renderers = this.renderers;
    var i = renderers.length;
    while (i--) {
      renderers[i].unrender(error, target);
    }
  };

  ValidationController.prototype._updateErrors = function _updateErrors(errors, newErrors, target) {
    var error = void 0;
    while (error = errors.pop()) {
      this._unrenderError(error, target);
    }
    for (var i = 0, ii = newErrors.length; i < ii; i++) {
      error = newErrors[i];
      errors.push(error);
      this._renderError(error, target);
    }
  };

  ValidationController.prototype._validateBinding = function _validateBinding(binding) {
    var _bindings$get = this.bindings.get(binding);

    var target = _bindings$get.target;
    var rules = _bindings$get.rules;
    var errors = _bindings$get.errors;

    var _getPropertyInfo = (0, _propertyInfo.getPropertyInfo)(binding.sourceExpression, binding.source);

    var object = _getPropertyInfo.object;
    var property = _getPropertyInfo.property;

    var newErrors = this.validator.validateProperty(object, property, rules);
    this._updateErrors(errors, newErrors, target);
    return errors;
  };

  ValidationController.prototype._resetBinding = function _resetBinding(binding) {
    var _bindings$get2 = this.bindings.get(binding);

    var target = _bindings$get2.target;
    var errors = _bindings$get2.errors;

    this._updateErrors(errors, [], target);
  };

  return ValidationController;
}()) || _class);

/***/ },

/***/ 96:
/***/ function(module, exports) {

"use strict";
"use strict";
/**
* Validation triggers.
*/
exports.validateTrigger = {
    /**
    * Manual validation.  Use the controller's `validate()` and  `reset()` methods
    * to validate all bindings.
    */
    manual: 0,
    /**
    * Validate the binding when the binding's target element fires a DOM "blur" event.
    */
    blur: 1,
    /**
    * Validate the binding when it updates the model due to a change in the view.
    */
    change: 2,
    /**
     * Validate the binding when the binding's target element fires a DOM "blur" event and
     * when it updates the model due to a change in the view.
     */
    changeOrBlur: 3
};


/***/ },

/***/ "aurelia-dialog":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogResult = exports.DialogController = exports.DialogService = exports.DialogConfiguration = exports.AttachFocus = exports.AiDialogFooter = exports.AiDialogBody = exports.AiDialogHeader = exports.AiDialog = undefined;

var _aiDialog = __webpack_require__("aurelia-dialog/ai-dialog.js");

Object.defineProperty(exports, 'AiDialog', {
  enumerable: true,
  get: function get() {
    return _aiDialog.AiDialog;
  }
});

var _aiDialogHeader = __webpack_require__("aurelia-dialog/ai-dialog-header.js");

Object.defineProperty(exports, 'AiDialogHeader', {
  enumerable: true,
  get: function get() {
    return _aiDialogHeader.AiDialogHeader;
  }
});

var _aiDialogBody = __webpack_require__("aurelia-dialog/ai-dialog-body.js");

Object.defineProperty(exports, 'AiDialogBody', {
  enumerable: true,
  get: function get() {
    return _aiDialogBody.AiDialogBody;
  }
});

var _aiDialogFooter = __webpack_require__("aurelia-dialog/ai-dialog-footer.js");

Object.defineProperty(exports, 'AiDialogFooter', {
  enumerable: true,
  get: function get() {
    return _aiDialogFooter.AiDialogFooter;
  }
});

var _attachFocus = __webpack_require__("aurelia-dialog/attach-focus.js");

Object.defineProperty(exports, 'AttachFocus', {
  enumerable: true,
  get: function get() {
    return _attachFocus.AttachFocus;
  }
});
exports.configure = configure;

var _dialogConfiguration = __webpack_require__(698);

Object.defineProperty(exports, 'DialogConfiguration', {
  enumerable: true,
  get: function get() {
    return _dialogConfiguration.DialogConfiguration;
  }
});

var _dialogService = __webpack_require__(700);

Object.defineProperty(exports, 'DialogService', {
  enumerable: true,
  get: function get() {
    return _dialogService.DialogService;
  }
});

var _dialogController = __webpack_require__(94);

Object.defineProperty(exports, 'DialogController', {
  enumerable: true,
  get: function get() {
    return _dialogController.DialogController;
  }
});

var _dialogResult = __webpack_require__(147);

Object.defineProperty(exports, 'DialogResult', {
  enumerable: true,
  get: function get() {
    return _dialogResult.DialogResult;
  }
});
function configure(aurelia, callback) {
  var config = new _dialogConfiguration.DialogConfiguration(aurelia);

  if (typeof callback === 'function') {
    callback(config);
  } else {
    config.useDefaults();
  }

  config._apply();
}

/***/ },

/***/ "aurelia-dialog/ai-dialog-body.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AiDialogBody = undefined;

var _dec, _dec2, _class;

var _aureliaTemplating = __webpack_require__("aurelia-templating");



var AiDialogBody = exports.AiDialogBody = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-body'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialogBody() {
  
}) || _class) || _class);

/***/ },

/***/ "aurelia-dialog/ai-dialog-footer.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AiDialogFooter = undefined;

var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _class3, _temp;

var _aureliaTemplating = __webpack_require__("aurelia-templating");

var _dialogController = __webpack_require__(94);

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}



function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var AiDialogFooter = exports.AiDialogFooter = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-footer'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n\n    <template if.bind="buttons.length > 0">\n      <button type="button" class="btn btn-default" repeat.for="button of buttons" click.trigger="close(button)">${button}</button>\n    </template>\n  </template>\n'), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
  function AiDialogFooter(controller) {
    

    _initDefineProp(this, 'buttons', _descriptor, this);

    _initDefineProp(this, 'useDefaultButtons', _descriptor2, this);

    this.controller = controller;
  }

  AiDialogFooter.prototype.close = function close(buttonValue) {
    if (AiDialogFooter.isCancelButton(buttonValue)) {
      this.controller.cancel(buttonValue);
    } else {
      this.controller.ok(buttonValue);
    }
  };

  AiDialogFooter.prototype.useDefaultButtonsChanged = function useDefaultButtonsChanged(newValue) {
    if (newValue) {
      this.buttons = ['Cancel', 'Ok'];
    }
  };

  AiDialogFooter.isCancelButton = function isCancelButton(value) {
    return value === 'Cancel';
  };

  return AiDialogFooter;
}(), _class3.inject = [_dialogController.DialogController], _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'buttons', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'useDefaultButtons', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
})), _class2)) || _class) || _class);

/***/ },

/***/ "aurelia-dialog/ai-dialog-header.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AiDialogHeader = undefined;

var _dec, _dec2, _class, _class2, _temp;

var _aureliaTemplating = __webpack_require__("aurelia-templating");

var _dialogController = __webpack_require__(94);



var AiDialogHeader = exports.AiDialogHeader = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-header'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">\n      <span aria-hidden="true">&times;</span>\n    </button>\n\n    <div class="dialog-header-content">\n      <slot></slot>\n    </div>\n  </template>\n'), _dec(_class = _dec2(_class = (_temp = _class2 = function AiDialogHeader(controller) {
  

  this.controller = controller;
}, _class2.inject = [_dialogController.DialogController], _temp)) || _class) || _class);

/***/ },

/***/ "aurelia-dialog/ai-dialog.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AiDialog = undefined;

var _dec, _dec2, _class;

var _aureliaTemplating = __webpack_require__("aurelia-templating");



var AiDialog = exports.AiDialog = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialog() {
  
}) || _class) || _class);

/***/ },

/***/ "aurelia-dialog/attach-focus.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttachFocus = undefined;

var _dec, _class, _class2, _temp;

var _aureliaTemplating = __webpack_require__("aurelia-templating");



var AttachFocus = exports.AttachFocus = (_dec = (0, _aureliaTemplating.customAttribute)('attach-focus'), _dec(_class = (_temp = _class2 = function () {
  function AttachFocus(element) {
    

    this.value = true;

    this.element = element;
  }

  AttachFocus.prototype.attached = function attached() {
    if (this.value && this.value !== 'false') {
      this.element.focus();
    }
  };

  AttachFocus.prototype.valueChanged = function valueChanged(newValue) {
    this.value = newValue;
  };

  return AttachFocus;
}(), _class2.inject = [Element], _temp)) || _class);

/***/ },

/***/ "aurelia-event-aggregator":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventAggregator = undefined;
exports.includeEventsIn = includeEventsIn;
exports.configure = configure;

var _aureliaLogging = __webpack_require__(40);

var LogManager = _interopRequireWildcard(_aureliaLogging);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }



var logger = LogManager.getLogger('event-aggregator');

var Handler = function () {
  function Handler(messageType, callback) {
    

    this.messageType = messageType;
    this.callback = callback;
  }

  Handler.prototype.handle = function handle(message) {
    if (message instanceof this.messageType) {
      this.callback.call(null, message);
    }
  };

  return Handler;
}();

var EventAggregator = exports.EventAggregator = function () {
  function EventAggregator() {
    

    this.eventLookup = {};
    this.messageHandlers = [];
  }

  EventAggregator.prototype.publish = function publish(event, data) {
    var subscribers = void 0;
    var i = void 0;

    if (!event) {
      throw new Error('Event was invalid.');
    }

    if (typeof event === 'string') {
      subscribers = this.eventLookup[event];
      if (subscribers) {
        subscribers = subscribers.slice();
        i = subscribers.length;

        try {
          while (i--) {
            subscribers[i](data, event);
          }
        } catch (e) {
          logger.error(e);
        }
      }
    } else {
      subscribers = this.messageHandlers.slice();
      i = subscribers.length;

      try {
        while (i--) {
          subscribers[i].handle(event);
        }
      } catch (e) {
        logger.error(e);
      }
    }
  };

  EventAggregator.prototype.subscribe = function subscribe(event, callback) {
    var handler = void 0;
    var subscribers = void 0;

    if (!event) {
      throw new Error('Event channel/type was invalid.');
    }

    if (typeof event === 'string') {
      handler = callback;
      subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);
    } else {
      handler = new Handler(event, callback);
      subscribers = this.messageHandlers;
    }

    subscribers.push(handler);

    return {
      dispose: function dispose() {
        var idx = subscribers.indexOf(handler);
        if (idx !== -1) {
          subscribers.splice(idx, 1);
        }
      }
    };
  };

  EventAggregator.prototype.subscribeOnce = function subscribeOnce(event, callback) {
    var sub = this.subscribe(event, function (a, b) {
      sub.dispose();
      return callback(a, b);
    });

    return sub;
  };

  return EventAggregator;
}();

function includeEventsIn(obj) {
  var ea = new EventAggregator();

  obj.subscribeOnce = function (event, callback) {
    return ea.subscribeOnce(event, callback);
  };

  obj.subscribe = function (event, callback) {
    return ea.subscribe(event, callback);
  };

  obj.publish = function (event, data) {
    ea.publish(event, data);
  };

  return ea;
}

function configure(config) {
  config.instance(EventAggregator, includeEventsIn(config.aurelia));
}

/***/ },

/***/ "aurelia-framework":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogManager = exports.FrameworkConfiguration = exports.Aurelia = undefined;

var _aureliaDependencyInjection = __webpack_require__(4);

Object.keys(_aureliaDependencyInjection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaDependencyInjection[key];
    }
  });
});

var _aureliaBinding = __webpack_require__(9);

Object.keys(_aureliaBinding).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaBinding[key];
    }
  });
});

var _aureliaMetadata = __webpack_require__(26);

Object.keys(_aureliaMetadata).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaMetadata[key];
    }
  });
});

var _aureliaTemplating = __webpack_require__("aurelia-templating");

Object.keys(_aureliaTemplating).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaTemplating[key];
    }
  });
});

var _aureliaLoader = __webpack_require__(72);

Object.keys(_aureliaLoader).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaLoader[key];
    }
  });
});

var _aureliaTaskQueue = __webpack_require__(42);

Object.keys(_aureliaTaskQueue).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaTaskQueue[key];
    }
  });
});

var _aureliaPath = __webpack_require__(47);

Object.keys(_aureliaPath).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaPath[key];
    }
  });
});

var _aureliaPal = __webpack_require__(14);

Object.keys(_aureliaPal).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaPal[key];
    }
  });
});

var _aureliaLogging = __webpack_require__(40);

var TheLogManager = _interopRequireWildcard(_aureliaLogging);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }



function preventActionlessFormSubmit() {
  _aureliaPal.DOM.addEventListener('submit', function (evt) {
    var target = evt.target;
    var action = target.action;

    if (target.tagName.toLowerCase() === 'form' && !action) {
      evt.preventDefault();
    }
  });
}

var Aurelia = exports.Aurelia = function () {
  function Aurelia(loader, container, resources) {
    

    this.loader = loader || new _aureliaPal.PLATFORM.Loader();
    this.container = container || new _aureliaDependencyInjection.Container().makeGlobal();
    this.resources = resources || new _aureliaTemplating.ViewResources();
    this.use = new FrameworkConfiguration(this);
    this.logger = TheLogManager.getLogger('aurelia');
    this.hostConfigured = false;
    this.host = null;

    this.use.instance(Aurelia, this);
    this.use.instance(_aureliaLoader.Loader, this.loader);
    this.use.instance(_aureliaTemplating.ViewResources, this.resources);
  }

  Aurelia.prototype.start = function start() {
    var _this = this;

    if (this.started) {
      return Promise.resolve(this);
    }

    this.started = true;
    this.logger.info('Aurelia Starting');

    return this.use.apply().then(function () {
      preventActionlessFormSubmit();

      if (!_this.container.hasResolver(_aureliaTemplating.BindingLanguage)) {
        var message = 'You must configure Aurelia with a BindingLanguage implementation.';
        _this.logger.error(message);
        throw new Error(message);
      }

      _this.logger.info('Aurelia Started');
      var evt = _aureliaPal.DOM.createCustomEvent('aurelia-started', { bubbles: true, cancelable: true });
      _aureliaPal.DOM.dispatchEvent(evt);
      return _this;
    });
  };

  Aurelia.prototype.enhance = function enhance() {
    var _this2 = this;

    var bindingContext = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var applicationHost = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    this._configureHost(applicationHost || _aureliaPal.DOM.querySelectorAll('body')[0]);

    return new Promise(function (resolve) {
      var engine = _this2.container.get(_aureliaTemplating.TemplatingEngine);
      _this2.root = engine.enhance({ container: _this2.container, element: _this2.host, resources: _this2.resources, bindingContext: bindingContext });
      _this2.root.attached();
      _this2._onAureliaComposed();
      resolve(_this2);
    });
  };

  Aurelia.prototype.setRoot = function setRoot() {
    var _this3 = this;

    var root = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var applicationHost = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    var instruction = {};

    if (this.root && this.root.viewModel && this.root.viewModel.router) {
      this.root.viewModel.router.deactivate();
      this.root.viewModel.router.reset();
    }

    this._configureHost(applicationHost);

    var engine = this.container.get(_aureliaTemplating.TemplatingEngine);
    var transaction = this.container.get(_aureliaTemplating.CompositionTransaction);
    delete transaction.initialComposition;

    if (!root) {
      if (this.configModuleId) {
        root = (0, _aureliaPath.relativeToFile)('./app', this.configModuleId);
      } else {
        root = 'app';
      }
    }

    instruction.viewModel = root;
    instruction.container = instruction.childContainer = this.container;
    instruction.viewSlot = this.hostSlot;
    instruction.host = this.host;

    return engine.compose(instruction).then(function (r) {
      _this3.root = r;
      instruction.viewSlot.attached();
      _this3._onAureliaComposed();
      return _this3;
    });
  };

  Aurelia.prototype._configureHost = function _configureHost(applicationHost) {
    if (this.hostConfigured) {
      return;
    }
    applicationHost = applicationHost || this.host;

    if (!applicationHost || typeof applicationHost === 'string') {
      this.host = _aureliaPal.DOM.getElementById(applicationHost || 'applicationHost');
    } else {
      this.host = applicationHost;
    }

    if (!this.host) {
      throw new Error('No applicationHost was specified.');
    }

    this.hostConfigured = true;
    this.host.aurelia = this;
    this.hostSlot = new _aureliaTemplating.ViewSlot(this.host, true);
    this.hostSlot.transformChildNodesIntoView();
    this.container.registerInstance(_aureliaPal.DOM.boundary, this.host);
  };

  Aurelia.prototype._onAureliaComposed = function _onAureliaComposed() {
    var evt = _aureliaPal.DOM.createCustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
    setTimeout(function () {
      return _aureliaPal.DOM.dispatchEvent(evt);
    }, 1);
  };

  return Aurelia;
}();

var logger = TheLogManager.getLogger('aurelia');
var extPattern = /\.[^/.]+$/;

function runTasks(config, tasks) {
  var current = void 0;
  var next = function next() {
    current = tasks.shift();
    if (current) {
      return Promise.resolve(current(config)).then(next);
    }

    return Promise.resolve();
  };

  return next();
}

function loadPlugin(config, loader, info) {
  logger.debug('Loading plugin ' + info.moduleId + '.');
  config.resourcesRelativeTo = info.resourcesRelativeTo;

  var id = info.moduleId;

  if (info.resourcesRelativeTo.length > 1) {
    return loader.normalize(info.moduleId, info.resourcesRelativeTo[1]).then(function (normalizedId) {
      return _loadPlugin(normalizedId);
    });
  }

  return _loadPlugin(id);

  function _loadPlugin(moduleId) {
    return loader.loadModule(moduleId).then(function (m) {
      if ('configure' in m) {
        return Promise.resolve(m.configure(config, info.config || {})).then(function () {
          config.resourcesRelativeTo = null;
          logger.debug('Configured plugin ' + info.moduleId + '.');
        });
      }

      config.resourcesRelativeTo = null;
      logger.debug('Loaded plugin ' + info.moduleId + '.');
    });
  }
}

function loadResources(aurelia, resourcesToLoad, appResources) {
  var viewEngine = aurelia.container.get(_aureliaTemplating.ViewEngine);

  return Promise.all(Object.keys(resourcesToLoad).map(function (n) {
    return _normalize(resourcesToLoad[n]);
  })).then(function (loads) {
    var names = [];
    var importIds = [];

    loads.forEach(function (l) {
      names.push(undefined);
      importIds.push(l.importId);
    });

    return viewEngine.importViewResources(importIds, names, appResources);
  });

  function _normalize(load) {
    var moduleId = load.moduleId;
    var ext = getExt(moduleId);

    if (isOtherResource(moduleId)) {
      moduleId = removeExt(moduleId);
    }

    return aurelia.loader.normalize(moduleId, load.relativeTo).then(function (normalized) {
      return {
        name: load.moduleId,
        importId: isOtherResource(load.moduleId) ? addOriginalExt(normalized, ext) : normalized
      };
    });
  }

  function isOtherResource(name) {
    var ext = getExt(name);
    if (!ext) return false;
    if (ext === '') return false;
    if (ext === '.js' || ext === '.ts') return false;
    return true;
  }

  function removeExt(name) {
    return name.replace(extPattern, '');
  }

  function addOriginalExt(normalized, ext) {
    return removeExt(normalized) + '.' + ext;
  }
}

function getExt(name) {
  var match = name.match(extPattern);
  if (match && match.length > 0) {
    return match[0].split('.')[1];
  }
}

function assertProcessed(plugins) {
  if (plugins.processed) {
    throw new Error('This config instance has already been applied. To load more plugins or global resources, create a new FrameworkConfiguration instance.');
  }
}

var FrameworkConfiguration = function () {
  function FrameworkConfiguration(aurelia) {
    var _this4 = this;

    

    this.aurelia = aurelia;
    this.container = aurelia.container;
    this.info = [];
    this.processed = false;
    this.preTasks = [];
    this.postTasks = [];
    this.resourcesToLoad = {};
    this.preTask(function () {
      return aurelia.loader.normalize('aurelia-bootstrapper').then(function (name) {
        return _this4.bootstrapperName = name;
      });
    });
    this.postTask(function () {
      return loadResources(aurelia, _this4.resourcesToLoad, aurelia.resources);
    });
  }

  FrameworkConfiguration.prototype.instance = function instance(type, _instance) {
    this.container.registerInstance(type, _instance);
    return this;
  };

  FrameworkConfiguration.prototype.singleton = function singleton(type, implementation) {
    this.container.registerSingleton(type, implementation);
    return this;
  };

  FrameworkConfiguration.prototype.transient = function transient(type, implementation) {
    this.container.registerTransient(type, implementation);
    return this;
  };

  FrameworkConfiguration.prototype.preTask = function preTask(task) {
    assertProcessed(this);
    this.preTasks.push(task);
    return this;
  };

  FrameworkConfiguration.prototype.postTask = function postTask(task) {
    assertProcessed(this);
    this.postTasks.push(task);
    return this;
  };

  FrameworkConfiguration.prototype.feature = function feature(plugin, config) {
    if (getExt(plugin)) {
      return this.plugin({ moduleId: plugin, resourcesRelativeTo: [plugin, ''], config: config || {} });
    }

    return this.plugin({ moduleId: plugin + '/index', resourcesRelativeTo: [plugin, ''], config: config || {} });
  };

  FrameworkConfiguration.prototype.globalResources = function globalResources(resources) {
    assertProcessed(this);

    var toAdd = Array.isArray(resources) ? resources : arguments;
    var resource = void 0;
    var resourcesRelativeTo = this.resourcesRelativeTo || ['', ''];

    for (var i = 0, ii = toAdd.length; i < ii; ++i) {
      resource = toAdd[i];
      if (typeof resource !== 'string') {
        throw new Error('Invalid resource path [' + resource + ']. Resources must be specified as relative module IDs.');
      }

      var parent = resourcesRelativeTo[0];
      var grandParent = resourcesRelativeTo[1];
      var name = resource;

      if ((resource.startsWith('./') || resource.startsWith('../')) && parent !== '') {
        name = (0, _aureliaPath.join)(parent, resource);
      }

      this.resourcesToLoad[name] = { moduleId: name, relativeTo: grandParent };
    }

    return this;
  };

  FrameworkConfiguration.prototype.globalName = function globalName(resourcePath, newName) {
    assertProcessed(this);
    this.resourcesToLoad[resourcePath] = { moduleId: newName, relativeTo: '' };
    return this;
  };

  FrameworkConfiguration.prototype.plugin = function plugin(_plugin, config) {
    assertProcessed(this);

    if (typeof _plugin === 'string') {
      return this.plugin({ moduleId: _plugin, resourcesRelativeTo: [_plugin, ''], config: config || {} });
    }

    this.info.push(_plugin);
    return this;
  };

  FrameworkConfiguration.prototype._addNormalizedPlugin = function _addNormalizedPlugin(name, config) {
    var _this5 = this;

    var plugin = { moduleId: name, resourcesRelativeTo: [name, ''], config: config || {} };
    this.plugin(plugin);

    this.preTask(function () {
      var relativeTo = [name, _this5.bootstrapperName];
      plugin.moduleId = name;
      plugin.resourcesRelativeTo = relativeTo;
      return Promise.resolve();
    });

    return this;
  };

  FrameworkConfiguration.prototype.defaultBindingLanguage = function defaultBindingLanguage() {
    return this._addNormalizedPlugin('aurelia-templating-binding');
  };

  FrameworkConfiguration.prototype.router = function router() {
    return this._addNormalizedPlugin('aurelia-templating-router');
  };

  FrameworkConfiguration.prototype.history = function history() {
    return this._addNormalizedPlugin('aurelia-history-browser');
  };

  FrameworkConfiguration.prototype.defaultResources = function defaultResources() {
    return this._addNormalizedPlugin('aurelia-templating-resources');
  };

  FrameworkConfiguration.prototype.eventAggregator = function eventAggregator() {
    return this._addNormalizedPlugin('aurelia-event-aggregator');
  };

  FrameworkConfiguration.prototype.basicConfiguration = function basicConfiguration() {
    return this.defaultBindingLanguage().defaultResources().eventAggregator();
  };

  FrameworkConfiguration.prototype.standardConfiguration = function standardConfiguration() {
    return this.basicConfiguration().history().router();
  };

  FrameworkConfiguration.prototype.developmentLogging = function developmentLogging() {
    var _this6 = this;

    this.preTask(function () {
      return _this6.aurelia.loader.normalize('aurelia-logging-console', _this6.bootstrapperName).then(function (name) {
        return _this6.aurelia.loader.loadModule(name).then(function (m) {
          TheLogManager.addAppender(new m.ConsoleAppender());
          TheLogManager.setLevel(TheLogManager.logLevel.debug);
        });
      });
    });

    return this;
  };

  FrameworkConfiguration.prototype.apply = function apply() {
    var _this7 = this;

    if (this.processed) {
      return Promise.resolve();
    }

    return runTasks(this, this.preTasks).then(function () {
      var loader = _this7.aurelia.loader;
      var info = _this7.info;
      var current = void 0;

      var next = function next() {
        current = info.shift();
        if (current) {
          return loadPlugin(_this7, loader, current).then(next);
        }

        _this7.processed = true;
        return Promise.resolve();
      };

      return next().then(function () {
        return runTasks(_this7, _this7.postTasks);
      });
    });
  };

  return FrameworkConfiguration;
}();

exports.FrameworkConfiguration = FrameworkConfiguration;
var LogManager = exports.LogManager = TheLogManager;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("bluebird")))

/***/ },

/***/ "aurelia-history-browser":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowserHistory = exports.DefaultLinkHandler = exports.LinkHandler = undefined;

var _class, _temp;

exports.configure = configure;

var _aureliaPal = __webpack_require__(14);

var _aureliaHistory = __webpack_require__(146);

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var LinkHandler = exports.LinkHandler = function () {
  function LinkHandler() {
    
  }

  LinkHandler.prototype.activate = function activate(history) {};

  LinkHandler.prototype.deactivate = function deactivate() {};

  return LinkHandler;
}();

var DefaultLinkHandler = exports.DefaultLinkHandler = function (_LinkHandler) {
  _inherits(DefaultLinkHandler, _LinkHandler);

  function DefaultLinkHandler() {
    

    var _this = _possibleConstructorReturn(this, _LinkHandler.call(this));

    _this.handler = function (e) {
      var _DefaultLinkHandler$g = DefaultLinkHandler.getEventInfo(e);

      var shouldHandleEvent = _DefaultLinkHandler$g.shouldHandleEvent;
      var href = _DefaultLinkHandler$g.href;


      if (shouldHandleEvent) {
        e.preventDefault();
        _this.history.navigate(href);
      }
    };
    return _this;
  }

  DefaultLinkHandler.prototype.activate = function activate(history) {
    if (history._hasPushState) {
      this.history = history;
      _aureliaPal.DOM.addEventListener('click', this.handler, true);
    }
  };

  DefaultLinkHandler.prototype.deactivate = function deactivate() {
    _aureliaPal.DOM.removeEventListener('click', this.handler);
  };

  DefaultLinkHandler.getEventInfo = function getEventInfo(event) {
    var info = {
      shouldHandleEvent: false,
      href: null,
      anchor: null
    };

    var target = DefaultLinkHandler.findClosestAnchor(event.target);
    if (!target || !DefaultLinkHandler.targetIsThisWindow(target)) {
      return info;
    }

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return info;
    }

    var href = target.getAttribute('href');
    info.anchor = target;
    info.href = href;

    var leftButtonClicked = event.which === 1;
    var isRelative = href && !(href.charAt(0) === '#' || /^[a-z]+:/i.test(href));

    info.shouldHandleEvent = leftButtonClicked && isRelative;
    return info;
  };

  DefaultLinkHandler.findClosestAnchor = function findClosestAnchor(el) {
    while (el) {
      if (el.tagName === 'A') {
        return el;
      }

      el = el.parentNode;
    }
  };

  DefaultLinkHandler.targetIsThisWindow = function targetIsThisWindow(target) {
    var targetWindow = target.getAttribute('target');
    var win = _aureliaPal.PLATFORM.global;

    return !targetWindow || targetWindow === win.name || targetWindow === '_self' || targetWindow === 'top' && win === win.top;
  };

  return DefaultLinkHandler;
}(LinkHandler);

function configure(config) {
  config.singleton(_aureliaHistory.History, BrowserHistory);
  config.transient(LinkHandler, DefaultLinkHandler);
}

var BrowserHistory = exports.BrowserHistory = (_temp = _class = function (_History) {
  _inherits(BrowserHistory, _History);

  function BrowserHistory(linkHandler) {
    

    var _this2 = _possibleConstructorReturn(this, _History.call(this));

    _this2._isActive = false;
    _this2._checkUrlCallback = _this2._checkUrl.bind(_this2);

    _this2.location = _aureliaPal.PLATFORM.location;
    _this2.history = _aureliaPal.PLATFORM.history;
    _this2.linkHandler = linkHandler;
    return _this2;
  }

  BrowserHistory.prototype.activate = function activate(options) {
    if (this._isActive) {
      throw new Error('History has already been activated.');
    }

    var wantsPushState = !!options.pushState;

    this._isActive = true;
    this.options = Object.assign({}, { root: '/' }, this.options, options);

    this.root = ('/' + this.options.root + '/').replace(rootStripper, '/');

    this._wantsHashChange = this.options.hashChange !== false;
    this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

    var eventName = void 0;
    if (this._hasPushState) {
      eventName = 'popstate';
    } else if (this._wantsHashChange) {
      eventName = 'hashchange';
    }

    _aureliaPal.PLATFORM.addEventListener(eventName, this._checkUrlCallback);

    if (this._wantsHashChange && wantsPushState) {
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      if (!this._hasPushState && !atRoot) {
        this.fragment = this._getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);

        return true;
      } else if (this._hasPushState && atRoot && loc.hash) {
          this.fragment = this._getHash().replace(routeStripper, '');
          this.history.replaceState({}, _aureliaPal.DOM.title, this.root + this.fragment + loc.search);
        }
    }

    if (!this.fragment) {
      this.fragment = this._getFragment();
    }

    this.linkHandler.activate(this);

    if (!this.options.silent) {
      return this._loadUrl();
    }
  };

  BrowserHistory.prototype.deactivate = function deactivate() {
    _aureliaPal.PLATFORM.removeEventListener('popstate', this._checkUrlCallback);
    _aureliaPal.PLATFORM.removeEventListener('hashchange', this._checkUrlCallback);
    this._isActive = false;
    this.linkHandler.deactivate();
  };

  BrowserHistory.prototype.getAbsoluteRoot = function getAbsoluteRoot() {
    var origin = createOrigin(this.location.protocol, this.location.hostname, this.location.port);
    return '' + origin + this.root;
  };

  BrowserHistory.prototype.navigate = function navigate(fragment) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$trigger = _ref.trigger;
    var trigger = _ref$trigger === undefined ? true : _ref$trigger;
    var _ref$replace = _ref.replace;
    var replace = _ref$replace === undefined ? false : _ref$replace;

    if (fragment && absoluteUrl.test(fragment)) {
      this.location.href = fragment;
      return true;
    }

    if (!this._isActive) {
      return false;
    }

    fragment = this._getFragment(fragment || '');

    if (this.fragment === fragment && !replace) {
      return false;
    }

    this.fragment = fragment;

    var url = this.root + fragment;

    if (fragment === '' && url !== '/') {
      url = url.slice(0, -1);
    }

    if (this._hasPushState) {
      url = url.replace('//', '/');
      this.history[replace ? 'replaceState' : 'pushState']({}, _aureliaPal.DOM.title, url);
    } else if (this._wantsHashChange) {
      updateHash(this.location, fragment, replace);
    } else {
      return this.location.assign(url);
    }

    if (trigger) {
      return this._loadUrl(fragment);
    }
  };

  BrowserHistory.prototype.navigateBack = function navigateBack() {
    this.history.back();
  };

  BrowserHistory.prototype.setTitle = function setTitle(title) {
    _aureliaPal.DOM.title = title;
  };

  BrowserHistory.prototype._getHash = function _getHash() {
    return this.location.hash.substr(1);
  };

  BrowserHistory.prototype._getFragment = function _getFragment(fragment, forcePushState) {
    var root = void 0;

    if (!fragment) {
      if (this._hasPushState || !this._wantsHashChange || forcePushState) {
        fragment = this.location.pathname + this.location.search;
        root = this.root.replace(trailingSlash, '');
        if (!fragment.indexOf(root)) {
          fragment = fragment.substr(root.length);
        }
      } else {
        fragment = this._getHash();
      }
    }

    return '/' + fragment.replace(routeStripper, '');
  };

  BrowserHistory.prototype._checkUrl = function _checkUrl() {
    var current = this._getFragment();
    if (current !== this.fragment) {
      this._loadUrl();
    }
  };

  BrowserHistory.prototype._loadUrl = function _loadUrl(fragmentOverride) {
    var fragment = this.fragment = this._getFragment(fragmentOverride);

    return this.options.routeHandler ? this.options.routeHandler(fragment) : false;
  };

  return BrowserHistory;
}(_aureliaHistory.History), _class.inject = [LinkHandler], _temp);

var routeStripper = /^#?\/*|\s+$/g;

var rootStripper = /^\/+|\/+$/g;

var trailingSlash = /\/$/;

var absoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

function updateHash(location, fragment, replace) {
  if (replace) {
    var _href = location.href.replace(/(javascript:|#).*$/, '');
    location.replace(_href + '#' + fragment);
  } else {
    location.hash = '#' + fragment;
  }
}

function createOrigin(protocol, hostname, port) {
  return protocol + '//' + hostname + (port ? ':' + port : '');
}

/***/ },

/***/ "aurelia-route-recognizer":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouteRecognizer = exports.EpsilonSegment = exports.StarSegment = exports.DynamicSegment = exports.StaticSegment = exports.State = undefined;

var _aureliaPath = __webpack_require__(47);



var State = exports.State = function () {
  function State(charSpec) {
    

    this.charSpec = charSpec;
    this.nextStates = [];
  }

  State.prototype.get = function get(charSpec) {
    for (var _iterator = this.nextStates, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var child = _ref;

      var isEqual = child.charSpec.validChars === charSpec.validChars && child.charSpec.invalidChars === charSpec.invalidChars;

      if (isEqual) {
        return child;
      }
    }

    return undefined;
  };

  State.prototype.put = function put(charSpec) {
    var state = this.get(charSpec);

    if (state) {
      return state;
    }

    state = new State(charSpec);

    this.nextStates.push(state);

    if (charSpec.repeat) {
      state.nextStates.push(state);
    }

    return state;
  };

  State.prototype.match = function match(ch) {
    var nextStates = this.nextStates;
    var results = [];

    for (var i = 0, l = nextStates.length; i < l; i++) {
      var child = nextStates[i];
      var charSpec = child.charSpec;

      if (charSpec.validChars !== undefined) {
        if (charSpec.validChars.indexOf(ch) !== -1) {
          results.push(child);
        }
      } else if (charSpec.invalidChars !== undefined) {
        if (charSpec.invalidChars.indexOf(ch) === -1) {
          results.push(child);
        }
      }
    }

    return results;
  };

  return State;
}();

var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];

var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

var StaticSegment = exports.StaticSegment = function () {
  function StaticSegment(string, caseSensitive) {
    

    this.string = string;
    this.caseSensitive = caseSensitive;
  }

  StaticSegment.prototype.eachChar = function eachChar(callback) {
    var s = this.string;
    for (var i = 0, ii = s.length; i < ii; ++i) {
      var ch = s[i];
      callback({ validChars: this.caseSensitive ? ch : ch.toUpperCase() + ch.toLowerCase() });
    }
  };

  StaticSegment.prototype.regex = function regex() {
    return this.string.replace(escapeRegex, '\\$1');
  };

  StaticSegment.prototype.generate = function generate() {
    return this.string;
  };

  return StaticSegment;
}();

var DynamicSegment = exports.DynamicSegment = function () {
  function DynamicSegment(name) {
    

    this.name = name;
  }

  DynamicSegment.prototype.eachChar = function eachChar(callback) {
    callback({ invalidChars: '/', repeat: true });
  };

  DynamicSegment.prototype.regex = function regex() {
    return '([^/]+)';
  };

  DynamicSegment.prototype.generate = function generate(params, consumed) {
    consumed[this.name] = true;
    return params[this.name];
  };

  return DynamicSegment;
}();

var StarSegment = exports.StarSegment = function () {
  function StarSegment(name) {
    

    this.name = name;
  }

  StarSegment.prototype.eachChar = function eachChar(callback) {
    callback({ invalidChars: '', repeat: true });
  };

  StarSegment.prototype.regex = function regex() {
    return '(.+)';
  };

  StarSegment.prototype.generate = function generate(params, consumed) {
    consumed[this.name] = true;
    return params[this.name];
  };

  return StarSegment;
}();

var EpsilonSegment = exports.EpsilonSegment = function () {
  function EpsilonSegment() {
    
  }

  EpsilonSegment.prototype.eachChar = function eachChar() {};

  EpsilonSegment.prototype.regex = function regex() {
    return '';
  };

  EpsilonSegment.prototype.generate = function generate() {
    return '';
  };

  return EpsilonSegment;
}();

var RouteRecognizer = exports.RouteRecognizer = function () {
  function RouteRecognizer() {
    

    this.rootState = new State();
    this.names = {};
  }

  RouteRecognizer.prototype.add = function add(route) {
    var _this = this;

    if (Array.isArray(route)) {
      route.forEach(function (r) {
        return _this.add(r);
      });
      return undefined;
    }

    var currentState = this.rootState;
    var regex = '^';
    var types = { statics: 0, dynamics: 0, stars: 0 };
    var names = [];
    var routeName = route.handler.name;
    var isEmpty = true;
    var segments = parse(route.path, names, types, route.caseSensitive);

    for (var i = 0, ii = segments.length; i < ii; i++) {
      var segment = segments[i];
      if (segment instanceof EpsilonSegment) {
        continue;
      }

      isEmpty = false;

      currentState = currentState.put({ validChars: '/' });
      regex += '/';

      currentState = addSegment(currentState, segment);
      regex += segment.regex();
    }

    if (isEmpty) {
      currentState = currentState.put({ validChars: '/' });
      regex += '/';
    }

    var handlers = [{ handler: route.handler, names: names }];

    if (routeName) {
      var routeNames = Array.isArray(routeName) ? routeName : [routeName];
      for (var _i2 = 0; _i2 < routeNames.length; _i2++) {
        this.names[routeNames[_i2]] = {
          segments: segments,
          handlers: handlers
        };
      }
    }

    currentState.handlers = handlers;
    currentState.regex = new RegExp(regex + '$', route.caseSensitive ? '' : 'i');
    currentState.types = types;

    return currentState;
  };

  RouteRecognizer.prototype.handlersFor = function handlersFor(name) {
    var route = this.names[name];
    if (!route) {
      throw new Error('There is no route named ' + name);
    }

    return [].concat(route.handlers);
  };

  RouteRecognizer.prototype.hasRoute = function hasRoute(name) {
    return !!this.names[name];
  };

  RouteRecognizer.prototype.generate = function generate(name, params) {
    var route = this.names[name];
    if (!route) {
      throw new Error('There is no route named ' + name);
    }

    var handler = route.handlers[0].handler;
    if (handler.generationUsesHref) {
      return handler.href;
    }

    var routeParams = Object.assign({}, params);
    var segments = route.segments;
    var consumed = {};
    var output = '';

    for (var i = 0, l = segments.length; i < l; i++) {
      var segment = segments[i];

      if (segment instanceof EpsilonSegment) {
        continue;
      }

      output += '/';
      var segmentValue = segment.generate(routeParams, consumed);
      if (segmentValue === null || segmentValue === undefined) {
        throw new Error('A value is required for route parameter \'' + segment.name + '\' in route \'' + name + '\'.');
      }

      output += segmentValue;
    }

    if (output.charAt(0) !== '/') {
      output = '/' + output;
    }

    for (var param in consumed) {
      delete routeParams[param];
    }

    var queryString = (0, _aureliaPath.buildQueryString)(routeParams);
    output += queryString ? '?' + queryString : '';

    return output;
  };

  RouteRecognizer.prototype.recognize = function recognize(path) {
    var states = [this.rootState];
    var queryParams = {};
    var isSlashDropped = false;
    var normalizedPath = path;

    var queryStart = normalizedPath.indexOf('?');
    if (queryStart !== -1) {
      var queryString = normalizedPath.substr(queryStart + 1, normalizedPath.length);
      normalizedPath = normalizedPath.substr(0, queryStart);
      queryParams = (0, _aureliaPath.parseQueryString)(queryString);
    }

    normalizedPath = decodeURI(normalizedPath);

    if (normalizedPath.charAt(0) !== '/') {
      normalizedPath = '/' + normalizedPath;
    }

    var pathLen = normalizedPath.length;
    if (pathLen > 1 && normalizedPath.charAt(pathLen - 1) === '/') {
      normalizedPath = normalizedPath.substr(0, pathLen - 1);
      isSlashDropped = true;
    }

    for (var i = 0, l = normalizedPath.length; i < l; i++) {
      states = recognizeChar(states, normalizedPath.charAt(i));
      if (!states.length) {
        break;
      }
    }

    var solutions = [];
    for (var _i3 = 0, _l = states.length; _i3 < _l; _i3++) {
      if (states[_i3].handlers) {
        solutions.push(states[_i3]);
      }
    }

    states = sortSolutions(solutions);

    var state = solutions[0];
    if (state && state.handlers) {
      if (isSlashDropped && state.regex.source.slice(-5) === '(.+)$') {
        normalizedPath = normalizedPath + '/';
      }

      return findHandler(state, normalizedPath, queryParams);
    }

    return undefined;
  };

  return RouteRecognizer;
}();

var RecognizeResults = function RecognizeResults(queryParams) {
  

  this.splice = Array.prototype.splice;
  this.slice = Array.prototype.slice;
  this.push = Array.prototype.push;
  this.length = 0;
  this.queryParams = queryParams || {};
};

function parse(route, names, types, caseSensitive) {
  var normalizedRoute = route;
  if (route.charAt(0) === '/') {
    normalizedRoute = route.substr(1);
  }

  var results = [];

  var splitRoute = normalizedRoute.split('/');
  for (var i = 0, ii = splitRoute.length; i < ii; ++i) {
    var segment = splitRoute[i];
    var match = segment.match(/^:([^\/]+)$/);
    if (match) {
      results.push(new DynamicSegment(match[1]));
      names.push(match[1]);
      types.dynamics++;
      continue;
    }

    match = segment.match(/^\*([^\/]+)$/);
    if (match) {
      results.push(new StarSegment(match[1]));
      names.push(match[1]);
      types.stars++;
    } else if (segment === '') {
      results.push(new EpsilonSegment());
    } else {
      results.push(new StaticSegment(segment, caseSensitive));
      types.statics++;
    }
  }

  return results;
}

function sortSolutions(states) {
  return states.sort(function (a, b) {
    if (a.types.stars !== b.types.stars) {
      return a.types.stars - b.types.stars;
    }

    if (a.types.stars) {
      if (a.types.statics !== b.types.statics) {
        return b.types.statics - a.types.statics;
      }
      if (a.types.dynamics !== b.types.dynamics) {
        return b.types.dynamics - a.types.dynamics;
      }
    }

    if (a.types.dynamics !== b.types.dynamics) {
      return a.types.dynamics - b.types.dynamics;
    }

    if (a.types.statics !== b.types.statics) {
      return b.types.statics - a.types.statics;
    }

    return 0;
  });
}

function recognizeChar(states, ch) {
  var nextStates = [];

  for (var i = 0, l = states.length; i < l; i++) {
    var state = states[i];
    nextStates.push.apply(nextStates, state.match(ch));
  }

  return nextStates;
}

function findHandler(state, path, queryParams) {
  var handlers = state.handlers;
  var regex = state.regex;
  var captures = path.match(regex);
  var currentCapture = 1;
  var result = new RecognizeResults(queryParams);

  for (var i = 0, l = handlers.length; i < l; i++) {
    var _handler = handlers[i];
    var _names = _handler.names;
    var _params = {};

    for (var j = 0, m = _names.length; j < m; j++) {
      _params[_names[j]] = captures[currentCapture++];
    }

    result.push({ handler: _handler.handler, params: _params, isDynamic: !!_names.length });
  }

  return result;
}

function addSegment(currentState, segment) {
  var state = currentState;
  segment.eachChar(function (ch) {
    state = state.put(ch);
  });

  return state;
}

/***/ },

/***/ "aurelia-router":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppRouter = exports.PipelineProvider = exports.LoadRouteStep = exports.RouteLoader = exports.ActivateNextStep = exports.DeactivatePreviousStep = exports.CanActivateNextStep = exports.CanDeactivatePreviousStep = exports.Router = exports.BuildNavigationPlanStep = exports.activationStrategy = exports.RouterConfiguration = exports.RedirectToRoute = exports.Redirect = exports.NavModel = exports.NavigationInstruction = exports.CommitChangesStep = exports.Pipeline = exports.pipelineStatus = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports._normalizeAbsolutePath = _normalizeAbsolutePath;
exports._createRootedPath = _createRootedPath;
exports._resolveUrl = _resolveUrl;
exports.isNavigationCommand = isNavigationCommand;
exports._buildNavigationPlan = _buildNavigationPlan;

var _aureliaLogging = __webpack_require__(40);

var LogManager = _interopRequireWildcard(_aureliaLogging);

var _aureliaRouteRecognizer = __webpack_require__("aurelia-route-recognizer");

var _aureliaDependencyInjection = __webpack_require__(4);

var _aureliaHistory = __webpack_require__(146);

var _aureliaEventAggregator = __webpack_require__("aurelia-event-aggregator");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



function _normalizeAbsolutePath(path, hasPushState) {
  var absolute = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  if (!hasPushState && path[0] !== '#') {
    path = '#' + path;
  }

  if (hasPushState && absolute) {
    path = path.substring(1, path.length);
  }

  return path;
}

function _createRootedPath(fragment, baseUrl, hasPushState, absolute) {
  if (isAbsoluteUrl.test(fragment)) {
    return fragment;
  }

  var path = '';

  if (baseUrl.length && baseUrl[0] !== '/') {
    path += '/';
  }

  path += baseUrl;

  if ((!path.length || path[path.length - 1] !== '/') && fragment[0] !== '/') {
    path += '/';
  }

  if (path.length && path[path.length - 1] === '/' && fragment[0] === '/') {
    path = path.substring(0, path.length - 1);
  }

  return _normalizeAbsolutePath(path + fragment, hasPushState, absolute);
}

function _resolveUrl(fragment, baseUrl, hasPushState) {
  if (isRootedPath.test(fragment)) {
    return _normalizeAbsolutePath(fragment, hasPushState);
  }

  return _createRootedPath(fragment, baseUrl, hasPushState);
}

var isRootedPath = /^#?\//;
var isAbsoluteUrl = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

var pipelineStatus = exports.pipelineStatus = {
  completed: 'completed',
  canceled: 'canceled',
  rejected: 'rejected',
  running: 'running'
};

var Pipeline = exports.Pipeline = function () {
  function Pipeline() {
    

    this.steps = [];
  }

  Pipeline.prototype.addStep = function addStep(step) {
    var run = void 0;

    if (typeof step === 'function') {
      run = step;
    } else if (typeof step.getSteps === 'function') {
      var steps = step.getSteps();
      for (var i = 0, l = steps.length; i < l; i++) {
        this.addStep(steps[i]);
      }

      return this;
    } else {
      run = step.run.bind(step);
    }

    this.steps.push(run);

    return this;
  };

  Pipeline.prototype.run = function run(instruction) {
    var index = -1;
    var steps = this.steps;

    function next() {
      index++;

      if (index < steps.length) {
        var currentStep = steps[index];

        try {
          return currentStep(instruction, next);
        } catch (e) {
          return next.reject(e);
        }
      } else {
        return next.complete();
      }
    }

    next.complete = createCompletionHandler(next, pipelineStatus.completed);
    next.cancel = createCompletionHandler(next, pipelineStatus.canceled);
    next.reject = createCompletionHandler(next, pipelineStatus.rejected);

    return next();
  };

  return Pipeline;
}();

function createCompletionHandler(next, status) {
  return function (output) {
    return Promise.resolve({ status: status, output: output, completed: status === pipelineStatus.completed });
  };
}

var CommitChangesStep = exports.CommitChangesStep = function () {
  function CommitChangesStep() {
    
  }

  CommitChangesStep.prototype.run = function run(navigationInstruction, next) {
    return navigationInstruction._commitChanges(true).then(function () {
      navigationInstruction._updateTitle();
      return next();
    });
  };

  return CommitChangesStep;
}();

var NavigationInstruction = exports.NavigationInstruction = function () {
  function NavigationInstruction(init) {
    

    this.plan = null;
    this.options = {};

    Object.assign(this, init);

    this.params = this.params || {};
    this.viewPortInstructions = {};

    var ancestorParams = [];
    var current = this;
    do {
      var currentParams = Object.assign({}, current.params);
      if (current.config && current.config.hasChildRouter) {
        delete currentParams[current.getWildCardName()];
      }

      ancestorParams.unshift(currentParams);
      current = current.parentInstruction;
    } while (current);

    var allParams = Object.assign.apply(Object, [{}, this.queryParams].concat(ancestorParams));
    this.lifecycleArgs = [allParams, this.config, this];
  }

  NavigationInstruction.prototype.getAllInstructions = function getAllInstructions() {
    var instructions = [this];
    for (var key in this.viewPortInstructions) {
      var childInstruction = this.viewPortInstructions[key].childNavigationInstruction;
      if (childInstruction) {
        instructions.push.apply(instructions, childInstruction.getAllInstructions());
      }
    }

    return instructions;
  };

  NavigationInstruction.prototype.getAllPreviousInstructions = function getAllPreviousInstructions() {
    return this.getAllInstructions().map(function (c) {
      return c.previousInstruction;
    }).filter(function (c) {
      return c;
    });
  };

  NavigationInstruction.prototype.addViewPortInstruction = function addViewPortInstruction(viewPortName, strategy, moduleId, component) {
    var viewportInstruction = this.viewPortInstructions[viewPortName] = {
      name: viewPortName,
      strategy: strategy,
      moduleId: moduleId,
      component: component,
      childRouter: component.childRouter,
      lifecycleArgs: this.lifecycleArgs.slice()
    };

    return viewportInstruction;
  };

  NavigationInstruction.prototype.getWildCardName = function getWildCardName() {
    var wildcardIndex = this.config.route.lastIndexOf('*');
    return this.config.route.substr(wildcardIndex + 1);
  };

  NavigationInstruction.prototype.getWildcardPath = function getWildcardPath() {
    var wildcardName = this.getWildCardName();
    var path = this.params[wildcardName] || '';

    if (this.queryString) {
      path += '?' + this.queryString;
    }

    return path;
  };

  NavigationInstruction.prototype.getBaseUrl = function getBaseUrl() {
    if (!this.params) {
      return this.fragment;
    }

    var wildcardName = this.getWildCardName();
    var path = this.params[wildcardName] || '';

    if (!path) {
      return this.fragment;
    }

    path = encodeURI(path);
    return this.fragment.substr(0, this.fragment.lastIndexOf(path));
  };

  NavigationInstruction.prototype._commitChanges = function _commitChanges(waitToSwap) {
    var _this = this;

    var router = this.router;
    router.currentInstruction = this;

    if (this.previousInstruction) {
      this.previousInstruction.config.navModel.isActive = false;
    }

    this.config.navModel.isActive = true;

    router._refreshBaseUrl();
    router.refreshNavigation();

    var loads = [];
    var delaySwaps = [];

    var _loop = function _loop(viewPortName) {
      var viewPortInstruction = _this.viewPortInstructions[viewPortName];
      var viewPort = router.viewPorts[viewPortName];

      if (!viewPort) {
        throw new Error('There was no router-view found in the view for ' + viewPortInstruction.moduleId + '.');
      }

      if (viewPortInstruction.strategy === activationStrategy.replace) {
        if (waitToSwap) {
          delaySwaps.push({ viewPort: viewPort, viewPortInstruction: viewPortInstruction });
        }

        loads.push(viewPort.process(viewPortInstruction, waitToSwap).then(function (x) {
          if (viewPortInstruction.childNavigationInstruction) {
            return viewPortInstruction.childNavigationInstruction._commitChanges();
          }

          return undefined;
        }));
      } else {
        if (viewPortInstruction.childNavigationInstruction) {
          loads.push(viewPortInstruction.childNavigationInstruction._commitChanges(waitToSwap));
        }
      }
    };

    for (var viewPortName in this.viewPortInstructions) {
      _loop(viewPortName);
    }

    return Promise.all(loads).then(function () {
      delaySwaps.forEach(function (x) {
        return x.viewPort.swap(x.viewPortInstruction);
      });
      return null;
    }).then(function () {
      return prune(_this);
    });
  };

  NavigationInstruction.prototype._updateTitle = function _updateTitle() {
    var title = this._buildTitle();
    if (title) {
      this.router.history.setTitle(title);
    }
  };

  NavigationInstruction.prototype._buildTitle = function _buildTitle() {
    var separator = arguments.length <= 0 || arguments[0] === undefined ? ' | ' : arguments[0];

    var title = this.config.navModel.title || '';
    var childTitles = [];

    for (var viewPortName in this.viewPortInstructions) {
      var _viewPortInstruction = this.viewPortInstructions[viewPortName];

      if (_viewPortInstruction.childNavigationInstruction) {
        var childTitle = _viewPortInstruction.childNavigationInstruction._buildTitle(separator);
        if (childTitle) {
          childTitles.push(childTitle);
        }
      }
    }

    if (childTitles.length) {
      title = childTitles.join(separator) + (title ? separator : '') + title;
    }

    if (this.router.title) {
      title += (title ? separator : '') + this.router.title;
    }

    return title;
  };

  return NavigationInstruction;
}();

function prune(instruction) {
  instruction.previousInstruction = null;
  instruction.plan = null;
}

var NavModel = exports.NavModel = function () {
  function NavModel(router, relativeHref) {
    

    this.isActive = false;
    this.title = null;
    this.href = null;
    this.relativeHref = null;
    this.settings = {};
    this.config = null;

    this.router = router;
    this.relativeHref = relativeHref;
  }

  NavModel.prototype.setTitle = function setTitle(title) {
    this.title = title;

    if (this.isActive) {
      this.router.updateTitle();
    }
  };

  return NavModel;
}();

function isNavigationCommand(obj) {
  return obj && typeof obj.navigate === 'function';
}

var Redirect = exports.Redirect = function () {
  function Redirect(url) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    

    this.url = url;
    this.options = Object.assign({ trigger: true, replace: true }, options);
    this.shouldContinueProcessing = false;
  }

  Redirect.prototype.setRouter = function setRouter(router) {
    this.router = router;
  };

  Redirect.prototype.navigate = function navigate(appRouter) {
    var navigatingRouter = this.options.useAppRouter ? appRouter : this.router || appRouter;
    navigatingRouter.navigate(this.url, this.options);
  };

  return Redirect;
}();

var RedirectToRoute = exports.RedirectToRoute = function () {
  function RedirectToRoute(route) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    

    this.route = route;
    this.params = params;
    this.options = Object.assign({ trigger: true, replace: true }, options);
    this.shouldContinueProcessing = false;
  }

  RedirectToRoute.prototype.setRouter = function setRouter(router) {
    this.router = router;
  };

  RedirectToRoute.prototype.navigate = function navigate(appRouter) {
    var navigatingRouter = this.options.useAppRouter ? appRouter : this.router || appRouter;
    navigatingRouter.navigateToRoute(this.route, this.params, this.options);
  };

  return RedirectToRoute;
}();

var RouterConfiguration = exports.RouterConfiguration = function () {
  function RouterConfiguration() {
    

    this.instructions = [];
    this.options = {};
    this.pipelineSteps = [];
  }

  RouterConfiguration.prototype.addPipelineStep = function addPipelineStep(name, step) {
    this.pipelineSteps.push({ name: name, step: step });
    return this;
  };

  RouterConfiguration.prototype.addAuthorizeStep = function addAuthorizeStep(step) {
    return this.addPipelineStep('authorize', step);
  };

  RouterConfiguration.prototype.addPreActivateStep = function addPreActivateStep(step) {
    return this.addPipelineStep('preActivate', step);
  };

  RouterConfiguration.prototype.addPreRenderStep = function addPreRenderStep(step) {
    return this.addPipelineStep('preRender', step);
  };

  RouterConfiguration.prototype.addPostRenderStep = function addPostRenderStep(step) {
    return this.addPipelineStep('postRender', step);
  };

  RouterConfiguration.prototype.map = function map(route) {
    if (Array.isArray(route)) {
      route.forEach(this.map.bind(this));
      return this;
    }

    return this.mapRoute(route);
  };

  RouterConfiguration.prototype.mapRoute = function mapRoute(config) {
    this.instructions.push(function (router) {
      var routeConfigs = [];

      if (Array.isArray(config.route)) {
        for (var i = 0, ii = config.route.length; i < ii; ++i) {
          var current = Object.assign({}, config);
          current.route = config.route[i];
          routeConfigs.push(current);
        }
      } else {
        routeConfigs.push(Object.assign({}, config));
      }

      var navModel = void 0;
      for (var _i = 0, _ii = routeConfigs.length; _i < _ii; ++_i) {
        var _routeConfig = routeConfigs[_i];
        _routeConfig.settings = _routeConfig.settings || {};
        if (!navModel) {
          navModel = router.createNavModel(_routeConfig);
        }

        router.addRoute(_routeConfig, navModel);
      }
    });

    return this;
  };

  RouterConfiguration.prototype.mapUnknownRoutes = function mapUnknownRoutes(config) {
    this.unknownRouteConfig = config;
    return this;
  };

  RouterConfiguration.prototype.exportToRouter = function exportToRouter(router) {
    var instructions = this.instructions;
    for (var i = 0, ii = instructions.length; i < ii; ++i) {
      instructions[i](router);
    }

    if (this.title) {
      router.title = this.title;
    }

    if (this.unknownRouteConfig) {
      router.handleUnknownRoutes(this.unknownRouteConfig);
    }

    router.options = this.options;

    var pipelineSteps = this.pipelineSteps;
    if (pipelineSteps.length) {
      if (!router.isRoot) {
        throw new Error('Pipeline steps can only be added to the root router');
      }

      var pipelineProvider = router.pipelineProvider;
      for (var _i2 = 0, _ii2 = pipelineSteps.length; _i2 < _ii2; ++_i2) {
        var _pipelineSteps$_i = pipelineSteps[_i2];
        var _name = _pipelineSteps$_i.name;
        var step = _pipelineSteps$_i.step;

        pipelineProvider.addStep(_name, step);
      }
    }
  };

  return RouterConfiguration;
}();

var activationStrategy = exports.activationStrategy = {
  noChange: 'no-change',
  invokeLifecycle: 'invoke-lifecycle',
  replace: 'replace'
};

var BuildNavigationPlanStep = exports.BuildNavigationPlanStep = function () {
  function BuildNavigationPlanStep() {
    
  }

  BuildNavigationPlanStep.prototype.run = function run(navigationInstruction, next) {
    return _buildNavigationPlan(navigationInstruction).then(function (plan) {
      navigationInstruction.plan = plan;
      return next();
    }).catch(next.cancel);
  };

  return BuildNavigationPlanStep;
}();

function _buildNavigationPlan(instruction, forceLifecycleMinimum) {
  var prev = instruction.previousInstruction;
  var config = instruction.config;
  var plan = {};

  if ('redirect' in config) {
    var redirectLocation = _resolveUrl(config.redirect, getInstructionBaseUrl(instruction));
    if (instruction.queryString) {
      redirectLocation += '?' + instruction.queryString;
    }

    return Promise.reject(new Redirect(redirectLocation));
  }

  if (prev) {
    var newParams = hasDifferentParameterValues(prev, instruction);
    var pending = [];

    var _loop2 = function _loop2(viewPortName) {
      var prevViewPortInstruction = prev.viewPortInstructions[viewPortName];
      var nextViewPortConfig = config.viewPorts[viewPortName];

      if (!nextViewPortConfig) throw new Error('Invalid Route Config: Configuration for viewPort "' + viewPortName + '" was not found for route: "' + instruction.config.route + '."');

      var viewPortPlan = plan[viewPortName] = {
        name: viewPortName,
        config: nextViewPortConfig,
        prevComponent: prevViewPortInstruction.component,
        prevModuleId: prevViewPortInstruction.moduleId
      };

      if (prevViewPortInstruction.moduleId !== nextViewPortConfig.moduleId) {
        viewPortPlan.strategy = activationStrategy.replace;
      } else if ('determineActivationStrategy' in prevViewPortInstruction.component.viewModel) {
        var _prevViewPortInstruct;

        viewPortPlan.strategy = (_prevViewPortInstruct = prevViewPortInstruction.component.viewModel).determineActivationStrategy.apply(_prevViewPortInstruct, instruction.lifecycleArgs);
      } else if (config.activationStrategy) {
        viewPortPlan.strategy = config.activationStrategy;
      } else if (newParams || forceLifecycleMinimum) {
        viewPortPlan.strategy = activationStrategy.invokeLifecycle;
      } else {
        viewPortPlan.strategy = activationStrategy.noChange;
      }

      if (viewPortPlan.strategy !== activationStrategy.replace && prevViewPortInstruction.childRouter) {
        var path = instruction.getWildcardPath();
        var task = prevViewPortInstruction.childRouter._createNavigationInstruction(path, instruction).then(function (childInstruction) {
          viewPortPlan.childNavigationInstruction = childInstruction;

          return _buildNavigationPlan(childInstruction, viewPortPlan.strategy === activationStrategy.invokeLifecycle).then(function (childPlan) {
            childInstruction.plan = childPlan;
          });
        });

        pending.push(task);
      }
    };

    for (var viewPortName in prev.viewPortInstructions) {
      _loop2(viewPortName);
    }

    return Promise.all(pending).then(function () {
      return plan;
    });
  }

  for (var _viewPortName in config.viewPorts) {
    plan[_viewPortName] = {
      name: _viewPortName,
      strategy: activationStrategy.replace,
      config: instruction.config.viewPorts[_viewPortName]
    };
  }

  return Promise.resolve(plan);
}

function hasDifferentParameterValues(prev, next) {
  var prevParams = prev.params;
  var nextParams = next.params;
  var nextWildCardName = next.config.hasChildRouter ? next.getWildCardName() : null;

  for (var key in nextParams) {
    if (key === nextWildCardName) {
      continue;
    }

    if (prevParams[key] !== nextParams[key]) {
      return true;
    }
  }

  for (var _key in prevParams) {
    if (_key === nextWildCardName) {
      continue;
    }

    if (prevParams[_key] !== nextParams[_key]) {
      return true;
    }
  }

  if (!next.options.compareQueryParams) {
    return false;
  }

  var prevQueryParams = prev.queryParams;
  var nextQueryParams = next.queryParams;
  for (var _key2 in nextQueryParams) {
    if (prevQueryParams[_key2] !== nextQueryParams[_key2]) {
      return true;
    }
  }

  for (var _key3 in prevQueryParams) {
    if (prevQueryParams[_key3] !== nextQueryParams[_key3]) {
      return true;
    }
  }

  return false;
}

function getInstructionBaseUrl(instruction) {
  var instructionBaseUrlParts = [];
  instruction = instruction.parentInstruction;

  while (instruction) {
    instructionBaseUrlParts.unshift(instruction.getBaseUrl());
    instruction = instruction.parentInstruction;
  }

  instructionBaseUrlParts.unshift('/');
  return instructionBaseUrlParts.join('');
}

var Router = exports.Router = function () {
  function Router(container, history) {
    

    this.parent = null;
    this.options = {};

    this.container = container;
    this.history = history;
    this.reset();
  }

  Router.prototype.reset = function reset() {
    var _this2 = this;

    this.viewPorts = {};
    this.routes = [];
    this.baseUrl = '';
    this.isConfigured = false;
    this.isNavigating = false;
    this.navigation = [];
    this.currentInstruction = null;
    this._fallbackOrder = 100;
    this._recognizer = new _aureliaRouteRecognizer.RouteRecognizer();
    this._childRecognizer = new _aureliaRouteRecognizer.RouteRecognizer();
    this._configuredPromise = new Promise(function (resolve) {
      _this2._resolveConfiguredPromise = resolve;
    });
  };

  Router.prototype.registerViewPort = function registerViewPort(viewPort, name) {
    name = name || 'default';
    this.viewPorts[name] = viewPort;
  };

  Router.prototype.ensureConfigured = function ensureConfigured() {
    return this._configuredPromise;
  };

  Router.prototype.configure = function configure(callbackOrConfig) {
    var _this3 = this;

    this.isConfigured = true;

    var result = callbackOrConfig;
    var config = void 0;
    if (typeof callbackOrConfig === 'function') {
      config = new RouterConfiguration();
      result = callbackOrConfig(config);
    }

    return Promise.resolve(result).then(function (c) {
      if (c && c.exportToRouter) {
        config = c;
      }

      config.exportToRouter(_this3);
      _this3.isConfigured = true;
      _this3._resolveConfiguredPromise();
    });
  };

  Router.prototype.navigate = function navigate(fragment, options) {
    if (!this.isConfigured && this.parent) {
      return this.parent.navigate(fragment, options);
    }

    return this.history.navigate(_resolveUrl(fragment, this.baseUrl, this.history._hasPushState), options);
  };

  Router.prototype.navigateToRoute = function navigateToRoute(route, params, options) {
    var path = this.generate(route, params);
    return this.navigate(path, options);
  };

  Router.prototype.navigateBack = function navigateBack() {
    this.history.navigateBack();
  };

  Router.prototype.createChild = function createChild(container) {
    var childRouter = new Router(container || this.container.createChild(), this.history);
    childRouter.parent = this;
    return childRouter;
  };

  Router.prototype.generate = function generate(name, params) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var hasRoute = this._recognizer.hasRoute(name);
    if ((!this.isConfigured || !hasRoute) && this.parent) {
      return this.parent.generate(name, params);
    }

    if (!hasRoute) {
      throw new Error('A route with name \'' + name + '\' could not be found. Check that `name: \'' + name + '\'` was specified in the route\'s config.');
    }

    var path = this._recognizer.generate(name, params);
    var rootedPath = _createRootedPath(path, this.baseUrl, this.history._hasPushState, options.absolute);
    return options.absolute ? '' + this.history.getAbsoluteRoot() + rootedPath : rootedPath;
  };

  Router.prototype.createNavModel = function createNavModel(config) {
    var navModel = new NavModel(this, 'href' in config ? config.href : config.route);
    navModel.title = config.title;
    navModel.order = config.nav;
    navModel.href = config.href;
    navModel.settings = config.settings;
    navModel.config = config;

    return navModel;
  };

  Router.prototype.addRoute = function addRoute(config, navModel) {
    validateRouteConfig(config, this.routes);

    if (!('viewPorts' in config) && !config.navigationStrategy) {
      config.viewPorts = {
        'default': {
          moduleId: config.moduleId,
          view: config.view
        }
      };
    }

    if (!navModel) {
      navModel = this.createNavModel(config);
    }

    this.routes.push(config);

    var path = config.route;
    if (path.charAt(0) === '/') {
      path = path.substr(1);
    }
    var caseSensitive = config.caseSensitive === true;
    var state = this._recognizer.add({ path: path, handler: config, caseSensitive: caseSensitive });

    if (path) {
      var _settings = config.settings;
      delete config.settings;
      var withChild = JSON.parse(JSON.stringify(config));
      config.settings = _settings;
      withChild.route = path + '/*childRoute';
      withChild.hasChildRouter = true;
      this._childRecognizer.add({
        path: withChild.route,
        handler: withChild,
        caseSensitive: caseSensitive
      });

      withChild.navModel = navModel;
      withChild.settings = config.settings;
    }

    config.navModel = navModel;

    if ((navModel.order || navModel.order === 0) && this.navigation.indexOf(navModel) === -1) {
      if (!navModel.href && navModel.href !== '' && (state.types.dynamics || state.types.stars)) {
        throw new Error('Invalid route config for "' + config.route + '" : dynamic routes must specify an "href:" to be included in the navigation model.');
      }

      if (typeof navModel.order !== 'number') {
        navModel.order = ++this._fallbackOrder;
      }

      this.navigation.push(navModel);
      this.navigation = this.navigation.sort(function (a, b) {
        return a.order - b.order;
      });
    }
  };

  Router.prototype.hasRoute = function hasRoute(name) {
    return !!(this._recognizer.hasRoute(name) || this.parent && this.parent.hasRoute(name));
  };

  Router.prototype.hasOwnRoute = function hasOwnRoute(name) {
    return this._recognizer.hasRoute(name);
  };

  Router.prototype.handleUnknownRoutes = function handleUnknownRoutes(config) {
    var _this4 = this;

    if (!config) {
      throw new Error('Invalid unknown route handler');
    }

    this.catchAllHandler = function (instruction) {
      return _this4._createRouteConfig(config, instruction).then(function (c) {
        instruction.config = c;
        return instruction;
      });
    };
  };

  Router.prototype.updateTitle = function updateTitle() {
    if (this.parent) {
      return this.parent.updateTitle();
    }

    this.currentInstruction._updateTitle();
    return undefined;
  };

  Router.prototype.refreshNavigation = function refreshNavigation() {
    var nav = this.navigation;

    for (var i = 0, length = nav.length; i < length; i++) {
      var current = nav[i];
      if (!current.config.href) {
        current.href = _createRootedPath(current.relativeHref, this.baseUrl, this.history._hasPushState);
      } else {
        current.href = _normalizeAbsolutePath(current.config.href, this.history._hasPushState);
      }
    }
  };

  Router.prototype._refreshBaseUrl = function _refreshBaseUrl() {
    if (this.parent) {
      var baseUrl = this.parent.currentInstruction.getBaseUrl();
      this.baseUrl = this.parent.baseUrl + baseUrl;
    }
  };

  Router.prototype._createNavigationInstruction = function _createNavigationInstruction() {
    var url = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var parentInstruction = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    var fragment = url;
    var queryString = '';

    var queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
      fragment = url.substr(0, queryIndex);
      queryString = url.substr(queryIndex + 1);
    }

    var results = this._recognizer.recognize(url);
    if (!results || !results.length) {
      results = this._childRecognizer.recognize(url);
    }

    var instructionInit = {
      fragment: fragment,
      queryString: queryString,
      config: null,
      parentInstruction: parentInstruction,
      previousInstruction: this.currentInstruction,
      router: this,
      options: {
        compareQueryParams: this.options.compareQueryParams
      }
    };

    if (results && results.length) {
      var first = results[0];
      var _instruction = new NavigationInstruction(Object.assign({}, instructionInit, {
        params: first.params,
        queryParams: first.queryParams || results.queryParams,
        config: first.config || first.handler
      }));

      if (typeof first.handler === 'function') {
        return evaluateNavigationStrategy(_instruction, first.handler, first);
      } else if (first.handler && 'navigationStrategy' in first.handler) {
        return evaluateNavigationStrategy(_instruction, first.handler.navigationStrategy, first.handler);
      }

      return Promise.resolve(_instruction);
    } else if (this.catchAllHandler) {
      var _instruction2 = new NavigationInstruction(Object.assign({}, instructionInit, {
        params: { path: fragment },
        queryParams: results && results.queryParams,
        config: null }));

      return evaluateNavigationStrategy(_instruction2, this.catchAllHandler);
    }

    return Promise.reject(new Error('Route not found: ' + url));
  };

  Router.prototype._createRouteConfig = function _createRouteConfig(config, instruction) {
    var _this5 = this;

    return Promise.resolve(config).then(function (c) {
      if (typeof c === 'string') {
        return { moduleId: c };
      } else if (typeof c === 'function') {
        return c(instruction);
      }

      return c;
    }).then(function (c) {
      return typeof c === 'string' ? { moduleId: c } : c;
    }).then(function (c) {
      c.route = instruction.params.path;
      validateRouteConfig(c, _this5.routes);

      if (!c.navModel) {
        c.navModel = _this5.createNavModel(c);
      }

      return c;
    });
  };

  _createClass(Router, [{
    key: 'isRoot',
    get: function get() {
      return !this.parent;
    }
  }]);

  return Router;
}();

function validateRouteConfig(config, routes) {
  if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) !== 'object') {
    throw new Error('Invalid Route Config');
  }

  if (typeof config.route !== 'string') {
    var _name2 = config.name || '(no name)';
    throw new Error('Invalid Route Config for "' + _name2 + '": You must specify a "route:" pattern.');
  }

  if (!('redirect' in config || config.moduleId || config.navigationStrategy || config.viewPorts)) {
    throw new Error('Invalid Route Config for "' + config.route + '": You must specify a "moduleId:", "redirect:", "navigationStrategy:", or "viewPorts:".');
  }
}

function evaluateNavigationStrategy(instruction, evaluator, context) {
  return Promise.resolve(evaluator.call(context, instruction)).then(function () {
    if (!('viewPorts' in instruction.config)) {
      instruction.config.viewPorts = {
        'default': {
          moduleId: instruction.config.moduleId
        }
      };
    }

    return instruction;
  });
}

var CanDeactivatePreviousStep = exports.CanDeactivatePreviousStep = function () {
  function CanDeactivatePreviousStep() {
    
  }

  CanDeactivatePreviousStep.prototype.run = function run(navigationInstruction, next) {
    return processDeactivatable(navigationInstruction.plan, 'canDeactivate', next);
  };

  return CanDeactivatePreviousStep;
}();

var CanActivateNextStep = exports.CanActivateNextStep = function () {
  function CanActivateNextStep() {
    
  }

  CanActivateNextStep.prototype.run = function run(navigationInstruction, next) {
    return processActivatable(navigationInstruction, 'canActivate', next);
  };

  return CanActivateNextStep;
}();

var DeactivatePreviousStep = exports.DeactivatePreviousStep = function () {
  function DeactivatePreviousStep() {
    
  }

  DeactivatePreviousStep.prototype.run = function run(navigationInstruction, next) {
    return processDeactivatable(navigationInstruction.plan, 'deactivate', next, true);
  };

  return DeactivatePreviousStep;
}();

var ActivateNextStep = exports.ActivateNextStep = function () {
  function ActivateNextStep() {
    
  }

  ActivateNextStep.prototype.run = function run(navigationInstruction, next) {
    return processActivatable(navigationInstruction, 'activate', next, true);
  };

  return ActivateNextStep;
}();

function processDeactivatable(plan, callbackName, next, ignoreResult) {
  var infos = findDeactivatable(plan, callbackName);
  var i = infos.length;

  function inspect(val) {
    if (ignoreResult || shouldContinue(val)) {
      return iterate();
    }

    return next.cancel(val);
  }

  function iterate() {
    if (i--) {
      try {
        var viewModel = infos[i];
        var _result = viewModel[callbackName]();
        return processPotential(_result, inspect, next.cancel);
      } catch (error) {
        return next.cancel(error);
      }
    }

    return next();
  }

  return iterate();
}

function findDeactivatable(plan, callbackName) {
  var list = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

  for (var viewPortName in plan) {
    var _viewPortPlan = plan[viewPortName];
    var prevComponent = _viewPortPlan.prevComponent;

    if ((_viewPortPlan.strategy === activationStrategy.invokeLifecycle || _viewPortPlan.strategy === activationStrategy.replace) && prevComponent) {
      var viewModel = prevComponent.viewModel;

      if (callbackName in viewModel) {
        list.push(viewModel);
      }
    }

    if (_viewPortPlan.childNavigationInstruction) {
      findDeactivatable(_viewPortPlan.childNavigationInstruction.plan, callbackName, list);
    } else if (prevComponent) {
      addPreviousDeactivatable(prevComponent, callbackName, list);
    }
  }

  return list;
}

function addPreviousDeactivatable(component, callbackName, list) {
  var childRouter = component.childRouter;

  if (childRouter && childRouter.currentInstruction) {
    var viewPortInstructions = childRouter.currentInstruction.viewPortInstructions;

    for (var viewPortName in viewPortInstructions) {
      var _viewPortInstruction2 = viewPortInstructions[viewPortName];
      var prevComponent = _viewPortInstruction2.component;
      var prevViewModel = prevComponent.viewModel;

      if (callbackName in prevViewModel) {
        list.push(prevViewModel);
      }

      addPreviousDeactivatable(prevComponent, callbackName, list);
    }
  }
}

function processActivatable(navigationInstruction, callbackName, next, ignoreResult) {
  var infos = findActivatable(navigationInstruction, callbackName);
  var length = infos.length;
  var i = -1;

  function inspect(val, router) {
    if (ignoreResult || shouldContinue(val, router)) {
      return iterate();
    }

    return next.cancel(val);
  }

  function iterate() {
    i++;

    if (i < length) {
      try {
        var _ret3 = function () {
          var _current$viewModel;

          var current = infos[i];
          var result = (_current$viewModel = current.viewModel)[callbackName].apply(_current$viewModel, current.lifecycleArgs);
          return {
            v: processPotential(result, function (val) {
              return inspect(val, current.router);
            }, next.cancel)
          };
        }();

        if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
      } catch (error) {
        return next.cancel(error);
      }
    }

    return next();
  }

  return iterate();
}

function findActivatable(navigationInstruction, callbackName) {
  var list = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
  var router = arguments[3];

  var plan = navigationInstruction.plan;

  Object.keys(plan).filter(function (viewPortName) {
    var viewPortPlan = plan[viewPortName];
    var viewPortInstruction = navigationInstruction.viewPortInstructions[viewPortName];
    var viewModel = viewPortInstruction.component.viewModel;

    if ((viewPortPlan.strategy === activationStrategy.invokeLifecycle || viewPortPlan.strategy === activationStrategy.replace) && callbackName in viewModel) {
      list.push({
        viewModel: viewModel,
        lifecycleArgs: viewPortInstruction.lifecycleArgs,
        router: router
      });
    }

    if (viewPortPlan.childNavigationInstruction) {
      findActivatable(viewPortPlan.childNavigationInstruction, callbackName, list, viewPortInstruction.component.childRouter || router);
    }
  });

  return list;
}

function shouldContinue(output, router) {
  if (output instanceof Error) {
    return false;
  }

  if (isNavigationCommand(output)) {
    if (typeof output.setRouter === 'function') {
      output.setRouter(router);
    }

    return !!output.shouldContinueProcessing;
  }

  if (output === undefined) {
    return true;
  }

  return output;
}

var SafeSubscription = function () {
  function SafeSubscription(subscriptionFunc) {
    

    this._subscribed = true;
    this._subscription = subscriptionFunc(this);

    if (!this._subscribed) this.unsubscribe();
  }

  SafeSubscription.prototype.unsubscribe = function unsubscribe() {
    if (this._subscribed && this._subscription) this._subscription.unsubscribe();

    this._subscribed = false;
  };

  _createClass(SafeSubscription, [{
    key: 'subscribed',
    get: function get() {
      return this._subscribed;
    }
  }]);

  return SafeSubscription;
}();

function processPotential(obj, resolve, reject) {
  if (obj && typeof obj.then === 'function') {
    return Promise.resolve(obj).then(resolve).catch(reject);
  }

  if (obj && typeof obj.subscribe === 'function') {
    var _ret4 = function () {
      var obs = obj;
      return {
        v: new SafeSubscription(function (sub) {
          return obs.subscribe({
            next: function next() {
              if (sub.subscribed) {
                sub.unsubscribe();
                resolve(obj);
              }
            },
            error: function error(_error) {
              if (sub.subscribed) {
                sub.unsubscribe();
                reject(_error);
              }
            },
            complete: function complete() {
              if (sub.subscribed) {
                sub.unsubscribe();
                resolve(obj);
              }
            }
          });
        })
      };
    }();

    if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
  }

  try {
    return resolve(obj);
  } catch (error) {
    return reject(error);
  }
}

var RouteLoader = exports.RouteLoader = function () {
  function RouteLoader() {
    
  }

  RouteLoader.prototype.loadRoute = function loadRoute(router, config, navigationInstruction) {
    throw Error('Route loaders must implement "loadRoute(router, config, navigationInstruction)".');
  };

  return RouteLoader;
}();

var LoadRouteStep = exports.LoadRouteStep = function () {
  LoadRouteStep.inject = function inject() {
    return [RouteLoader];
  };

  function LoadRouteStep(routeLoader) {
    

    this.routeLoader = routeLoader;
  }

  LoadRouteStep.prototype.run = function run(navigationInstruction, next) {
    return loadNewRoute(this.routeLoader, navigationInstruction).then(next).catch(next.cancel);
  };

  return LoadRouteStep;
}();

function loadNewRoute(routeLoader, navigationInstruction) {
  var toLoad = determineWhatToLoad(navigationInstruction);
  var loadPromises = toLoad.map(function (current) {
    return loadRoute(routeLoader, current.navigationInstruction, current.viewPortPlan);
  });

  return Promise.all(loadPromises);
}

function determineWhatToLoad(navigationInstruction) {
  var toLoad = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var plan = navigationInstruction.plan;

  for (var viewPortName in plan) {
    var _viewPortPlan2 = plan[viewPortName];

    if (_viewPortPlan2.strategy === activationStrategy.replace) {
      toLoad.push({ viewPortPlan: _viewPortPlan2, navigationInstruction: navigationInstruction });

      if (_viewPortPlan2.childNavigationInstruction) {
        determineWhatToLoad(_viewPortPlan2.childNavigationInstruction, toLoad);
      }
    } else {
      var _viewPortInstruction3 = navigationInstruction.addViewPortInstruction(viewPortName, _viewPortPlan2.strategy, _viewPortPlan2.prevModuleId, _viewPortPlan2.prevComponent);

      if (_viewPortPlan2.childNavigationInstruction) {
        _viewPortInstruction3.childNavigationInstruction = _viewPortPlan2.childNavigationInstruction;
        determineWhatToLoad(_viewPortPlan2.childNavigationInstruction, toLoad);
      }
    }
  }

  return toLoad;
}

function loadRoute(routeLoader, navigationInstruction, viewPortPlan) {
  var moduleId = viewPortPlan.config.moduleId;

  return loadComponent(routeLoader, navigationInstruction, viewPortPlan.config).then(function (component) {
    var viewPortInstruction = navigationInstruction.addViewPortInstruction(viewPortPlan.name, viewPortPlan.strategy, moduleId, component);

    var childRouter = component.childRouter;
    if (childRouter) {
      var path = navigationInstruction.getWildcardPath();

      return childRouter._createNavigationInstruction(path, navigationInstruction).then(function (childInstruction) {
        viewPortPlan.childNavigationInstruction = childInstruction;

        return _buildNavigationPlan(childInstruction).then(function (childPlan) {
          childInstruction.plan = childPlan;
          viewPortInstruction.childNavigationInstruction = childInstruction;

          return loadNewRoute(routeLoader, childInstruction);
        });
      });
    }

    return undefined;
  });
}

function loadComponent(routeLoader, navigationInstruction, config) {
  var router = navigationInstruction.router;
  var lifecycleArgs = navigationInstruction.lifecycleArgs;

  return routeLoader.loadRoute(router, config, navigationInstruction).then(function (component) {
    var viewModel = component.viewModel;
    var childContainer = component.childContainer;

    component.router = router;
    component.config = config;

    if ('configureRouter' in viewModel) {
      var _ret5 = function () {
        var childRouter = childContainer.getChildRouter();
        component.childRouter = childRouter;

        return {
          v: childRouter.configure(function (c) {
            return viewModel.configureRouter.apply(viewModel, [c, childRouter].concat(lifecycleArgs));
          }).then(function () {
            return component;
          })
        };
      }();

      if ((typeof _ret5 === 'undefined' ? 'undefined' : _typeof(_ret5)) === "object") return _ret5.v;
    }

    return component;
  });
}

var PipelineSlot = function () {
  function PipelineSlot(container, name, alias) {
    

    this.steps = [];

    this.container = container;
    this.slotName = name;
    this.slotAlias = alias;
  }

  PipelineSlot.prototype.getSteps = function getSteps() {
    var _this6 = this;

    return this.steps.map(function (x) {
      return _this6.container.get(x);
    });
  };

  return PipelineSlot;
}();

var PipelineProvider = exports.PipelineProvider = function () {
  PipelineProvider.inject = function inject() {
    return [_aureliaDependencyInjection.Container];
  };

  function PipelineProvider(container) {
    

    this.container = container;
    this.steps = [BuildNavigationPlanStep, CanDeactivatePreviousStep, LoadRouteStep, this._createPipelineSlot('authorize'), CanActivateNextStep, this._createPipelineSlot('preActivate', 'modelbind'), DeactivatePreviousStep, ActivateNextStep, this._createPipelineSlot('preRender', 'precommit'), CommitChangesStep, this._createPipelineSlot('postRender', 'postcomplete')];
  }

  PipelineProvider.prototype.createPipeline = function createPipeline() {
    var _this7 = this;

    var pipeline = new Pipeline();
    this.steps.forEach(function (step) {
      return pipeline.addStep(_this7.container.get(step));
    });
    return pipeline;
  };

  PipelineProvider.prototype._findStep = function _findStep(name) {
    return this.steps.find(function (x) {
      return x.slotName === name || x.slotAlias === name;
    });
  };

  PipelineProvider.prototype.addStep = function addStep(name, step) {
    var found = this._findStep(name);
    if (found) {
      if (!found.steps.includes(step)) {
        found.steps.push(step);
      }
    } else {
      throw new Error('Invalid pipeline slot name: ' + name + '.');
    }
  };

  PipelineProvider.prototype.removeStep = function removeStep(name, step) {
    var slot = this._findStep(name);
    if (slot) {
      slot.steps.splice(slot.steps.indexOf(step), 1);
    }
  };

  PipelineProvider.prototype._clearSteps = function _clearSteps() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    var slot = this._findStep(name);
    if (slot) {
      slot.steps = [];
    }
  };

  PipelineProvider.prototype.reset = function reset() {
    this._clearSteps('authorize');
    this._clearSteps('preActivate');
    this._clearSteps('preRender');
    this._clearSteps('postRender');
  };

  PipelineProvider.prototype._createPipelineSlot = function _createPipelineSlot(name, alias) {
    return new PipelineSlot(this.container, name, alias);
  };

  return PipelineProvider;
}();

var logger = LogManager.getLogger('app-router');

var AppRouter = exports.AppRouter = function (_Router) {
  _inherits(AppRouter, _Router);

  AppRouter.inject = function inject() {
    return [_aureliaDependencyInjection.Container, _aureliaHistory.History, PipelineProvider, _aureliaEventAggregator.EventAggregator];
  };

  function AppRouter(container, history, pipelineProvider, events) {
    

    var _this8 = _possibleConstructorReturn(this, _Router.call(this, container, history));

    _this8.pipelineProvider = pipelineProvider;
    _this8.events = events;
    return _this8;
  }

  AppRouter.prototype.reset = function reset() {
    _Router.prototype.reset.call(this);
    this.maxInstructionCount = 10;
    if (!this._queue) {
      this._queue = [];
    } else {
      this._queue.length = 0;
    }
  };

  AppRouter.prototype.loadUrl = function loadUrl(url) {
    var _this9 = this;

    return this._createNavigationInstruction(url).then(function (instruction) {
      return _this9._queueInstruction(instruction);
    }).catch(function (error) {
      logger.error(error);
      restorePreviousLocation(_this9);
    });
  };

  AppRouter.prototype.registerViewPort = function registerViewPort(viewPort, name) {
    var _this10 = this;

    _Router.prototype.registerViewPort.call(this, viewPort, name);

    if (!this.isActive) {
      var _ret6 = function () {
        var viewModel = _this10._findViewModel(viewPort);
        if ('configureRouter' in viewModel) {
          if (!_this10.isConfigured) {
            var _ret7 = function () {
              var resolveConfiguredPromise = _this10._resolveConfiguredPromise;
              _this10._resolveConfiguredPromise = function () {};
              return {
                v: {
                  v: _this10.configure(function (config) {
                    return viewModel.configureRouter(config, _this10);
                  }).then(function () {
                    _this10.activate();
                    resolveConfiguredPromise();
                  })
                }
              };
            }();

            if ((typeof _ret7 === 'undefined' ? 'undefined' : _typeof(_ret7)) === "object") return _ret7.v;
          }
        } else {
          _this10.activate();
        }
      }();

      if ((typeof _ret6 === 'undefined' ? 'undefined' : _typeof(_ret6)) === "object") return _ret6.v;
    } else {
      this._dequeueInstruction();
    }

    return Promise.resolve();
  };

  AppRouter.prototype.activate = function activate(options) {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.options = Object.assign({ routeHandler: this.loadUrl.bind(this) }, this.options, options);
    this.history.activate(this.options);
    this._dequeueInstruction();
  };

  AppRouter.prototype.deactivate = function deactivate() {
    this.isActive = false;
    this.history.deactivate();
  };

  AppRouter.prototype._queueInstruction = function _queueInstruction(instruction) {
    var _this11 = this;

    return new Promise(function (resolve) {
      instruction.resolve = resolve;
      _this11._queue.unshift(instruction);
      _this11._dequeueInstruction();
    });
  };

  AppRouter.prototype._dequeueInstruction = function _dequeueInstruction() {
    var _this12 = this;

    var instructionCount = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    return Promise.resolve().then(function () {
      if (_this12.isNavigating && !instructionCount) {
        return undefined;
      }

      var instruction = _this12._queue.shift();
      _this12._queue.length = 0;

      if (!instruction) {
        return undefined;
      }

      _this12.isNavigating = true;
      instruction.previousInstruction = _this12.currentInstruction;

      if (!instructionCount) {
        _this12.events.publish('router:navigation:processing', { instruction: instruction });
      } else if (instructionCount === _this12.maxInstructionCount - 1) {
        logger.error(instructionCount + 1 + ' navigation instructions have been attempted without success. Restoring last known good location.');
        restorePreviousLocation(_this12);
        return _this12._dequeueInstruction(instructionCount + 1);
      } else if (instructionCount > _this12.maxInstructionCount) {
        throw new Error('Maximum navigation attempts exceeded. Giving up.');
      }

      var pipeline = _this12.pipelineProvider.createPipeline();

      return pipeline.run(instruction).then(function (result) {
        return processResult(instruction, result, instructionCount, _this12);
      }).catch(function (error) {
        return { output: error instanceof Error ? error : new Error(error) };
      }).then(function (result) {
        return resolveInstruction(instruction, result, !!instructionCount, _this12);
      });
    });
  };

  AppRouter.prototype._findViewModel = function _findViewModel(viewPort) {
    if (this.container.viewModel) {
      return this.container.viewModel;
    }

    if (viewPort.container) {
      var container = viewPort.container;

      while (container) {
        if (container.viewModel) {
          this.container.viewModel = container.viewModel;
          return container.viewModel;
        }

        container = container.parent;
      }
    }

    return undefined;
  };

  return AppRouter;
}(Router);

function processResult(instruction, result, instructionCount, router) {
  if (!(result && 'completed' in result && 'output' in result)) {
    result = result || {};
    result.output = new Error('Expected router pipeline to return a navigation result, but got [' + JSON.stringify(result) + '] instead.');
  }

  var finalResult = null;
  if (isNavigationCommand(result.output)) {
    result.output.navigate(router);
  } else {
    finalResult = result;

    if (!result.completed) {
      if (result.output instanceof Error) {
        logger.error(result.output);
      }

      restorePreviousLocation(router);
    }
  }

  return router._dequeueInstruction(instructionCount + 1).then(function (innerResult) {
    return finalResult || innerResult || result;
  });
}

function resolveInstruction(instruction, result, isInnerInstruction, router) {
  instruction.resolve(result);

  if (!isInnerInstruction) {
    router.isNavigating = false;
    var eventArgs = { instruction: instruction, result: result };
    var eventName = void 0;

    if (result.output instanceof Error) {
      eventName = 'error';
    } else if (!result.completed) {
      eventName = 'canceled';
    } else {
      var _queryString = instruction.queryString ? '?' + instruction.queryString : '';
      router.history.previousLocation = instruction.fragment + _queryString;
      eventName = 'success';
    }

    router.events.publish('router:navigation:' + eventName, eventArgs);
    router.events.publish('router:navigation:complete', eventArgs);
  }

  return result;
}

function restorePreviousLocation(router) {
  var previousLocation = router.history.previousLocation;
  if (previousLocation) {
    router.navigate(router.history.previousLocation, { trigger: false, replace: true });
  } else {
    logger.error('Router navigation failed, and no previous location could be restored.');
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("bluebird")))

/***/ },

/***/ "aurelia-templating-binding":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplatingBindingLanguage = exports.SyntaxInterpreter = exports.ChildInterpolationBinding = exports.InterpolationBinding = exports.InterpolationBindingExpression = exports.AttributeMap = undefined;

var _class, _temp, _dec, _class2, _class3, _temp2, _class4, _temp3;

exports.configure = configure;

var _aureliaLogging = __webpack_require__(40);

var LogManager = _interopRequireWildcard(_aureliaLogging);

var _aureliaBinding = __webpack_require__(9);

var _aureliaTemplating = __webpack_require__("aurelia-templating");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var AttributeMap = exports.AttributeMap = (_temp = _class = function () {
  function AttributeMap(svg) {
    

    this.elements = Object.create(null);
    this.allElements = Object.create(null);

    this.svg = svg;

    this.registerUniversal('accesskey', 'accessKey');
    this.registerUniversal('contenteditable', 'contentEditable');
    this.registerUniversal('tabindex', 'tabIndex');
    this.registerUniversal('textcontent', 'textContent');
    this.registerUniversal('innerhtml', 'innerHTML');
    this.registerUniversal('scrolltop', 'scrollTop');
    this.registerUniversal('scrollleft', 'scrollLeft');
    this.registerUniversal('readonly', 'readOnly');

    this.register('label', 'for', 'htmlFor');

    this.register('input', 'maxlength', 'maxLength');
    this.register('input', 'minlength', 'minLength');
    this.register('input', 'formaction', 'formAction');
    this.register('input', 'formenctype', 'formEncType');
    this.register('input', 'formmethod', 'formMethod');
    this.register('input', 'formnovalidate', 'formNoValidate');
    this.register('input', 'formtarget', 'formTarget');

    this.register('textarea', 'maxlength', 'maxLength');

    this.register('td', 'rowspan', 'rowSpan');
    this.register('td', 'colspan', 'colSpan');
    this.register('th', 'rowspan', 'rowSpan');
    this.register('th', 'colspan', 'colSpan');
  }

  AttributeMap.prototype.register = function register(elementName, attributeName, propertyName) {
    elementName = elementName.toLowerCase();
    attributeName = attributeName.toLowerCase();
    var element = this.elements[elementName] = this.elements[elementName] || Object.create(null);
    element[attributeName] = propertyName;
  };

  AttributeMap.prototype.registerUniversal = function registerUniversal(attributeName, propertyName) {
    attributeName = attributeName.toLowerCase();
    this.allElements[attributeName] = propertyName;
  };

  AttributeMap.prototype.map = function map(elementName, attributeName) {
    if (this.svg.isStandardSvgAttribute(elementName, attributeName)) {
      return attributeName;
    }
    elementName = elementName.toLowerCase();
    attributeName = attributeName.toLowerCase();
    var element = this.elements[elementName];
    if (element !== undefined && attributeName in element) {
      return element[attributeName];
    }
    if (attributeName in this.allElements) {
      return this.allElements[attributeName];
    }

    if (/(^data-)|(^aria-)|:/.test(attributeName)) {
      return attributeName;
    }
    return (0, _aureliaBinding.camelCase)(attributeName);
  };

  return AttributeMap;
}(), _class.inject = [_aureliaBinding.SVGAnalyzer], _temp);

var InterpolationBindingExpression = exports.InterpolationBindingExpression = function () {
  function InterpolationBindingExpression(observerLocator, targetProperty, parts, mode, lookupFunctions, attribute) {
    

    this.observerLocator = observerLocator;
    this.targetProperty = targetProperty;
    this.parts = parts;
    this.mode = mode;
    this.lookupFunctions = lookupFunctions;
    this.attribute = this.attrToRemove = attribute;
    this.discrete = false;
  }

  InterpolationBindingExpression.prototype.createBinding = function createBinding(target) {
    if (this.parts.length === 3) {
      return new ChildInterpolationBinding(target, this.observerLocator, this.parts[1], this.mode, this.lookupFunctions, this.targetProperty, this.parts[0], this.parts[2]);
    }
    return new InterpolationBinding(this.observerLocator, this.parts, target, this.targetProperty, this.mode, this.lookupFunctions);
  };

  return InterpolationBindingExpression;
}();

function validateTarget(target, propertyName) {
  if (propertyName === 'style') {
    LogManager.getLogger('templating-binding').info('Internet Explorer does not support interpolation in "style" attributes.  Use the style attribute\'s alias, "css" instead.');
  } else if (target.parentElement && target.parentElement.nodeName === 'TEXTAREA' && propertyName === 'textContent') {
    throw new Error('Interpolation binding cannot be used in the content of a textarea element.  Use <textarea value.bind="expression"></textarea> instead.');
  }
}

var InterpolationBinding = exports.InterpolationBinding = function () {
  function InterpolationBinding(observerLocator, parts, target, targetProperty, mode, lookupFunctions) {
    

    validateTarget(target, targetProperty);
    this.observerLocator = observerLocator;
    this.parts = parts;
    this.target = target;
    this.targetProperty = targetProperty;
    this.targetAccessor = observerLocator.getAccessor(target, targetProperty);
    this.mode = mode;
    this.lookupFunctions = lookupFunctions;
  }

  InterpolationBinding.prototype.interpolate = function interpolate() {
    if (this.isBound) {
      var value = '';
      var parts = this.parts;
      for (var i = 0, ii = parts.length; i < ii; i++) {
        value += i % 2 === 0 ? parts[i] : this['childBinding' + i].value;
      }
      this.targetAccessor.setValue(value, this.target, this.targetProperty);
    }
  };

  InterpolationBinding.prototype.updateOneTimeBindings = function updateOneTimeBindings() {
    for (var i = 1, ii = this.parts.length; i < ii; i += 2) {
      var child = this['childBinding' + i];
      if (child.mode === _aureliaBinding.bindingMode.oneTime) {
        child.call();
      }
    }
  };

  InterpolationBinding.prototype.bind = function bind(source) {
    if (this.isBound) {
      if (this.source === source) {
        return;
      }
      this.unbind();
    }
    this.source = source;

    var parts = this.parts;
    for (var i = 1, ii = parts.length; i < ii; i += 2) {
      var binding = new ChildInterpolationBinding(this, this.observerLocator, parts[i], this.mode, this.lookupFunctions);
      binding.bind(source);
      this['childBinding' + i] = binding;
    }

    this.isBound = true;
    this.interpolate();
  };

  InterpolationBinding.prototype.unbind = function unbind() {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    this.source = null;
    var parts = this.parts;
    for (var i = 1, ii = parts.length; i < ii; i += 2) {
      var name = 'childBinding' + i;
      this[name].unbind();
    }
  };

  return InterpolationBinding;
}();

var ChildInterpolationBinding = exports.ChildInterpolationBinding = (_dec = (0, _aureliaBinding.connectable)(), _dec(_class2 = function () {
  function ChildInterpolationBinding(target, observerLocator, sourceExpression, mode, lookupFunctions, targetProperty, left, right) {
    

    if (target instanceof InterpolationBinding) {
      this.parent = target;
    } else {
      validateTarget(target, targetProperty);
      this.target = target;
      this.targetProperty = targetProperty;
      this.targetAccessor = observerLocator.getAccessor(target, targetProperty);
    }
    this.observerLocator = observerLocator;
    this.sourceExpression = sourceExpression;
    this.mode = mode;
    this.lookupFunctions = lookupFunctions;
    this.left = left;
    this.right = right;
  }

  ChildInterpolationBinding.prototype.updateTarget = function updateTarget(value) {
    value = value === null || value === undefined ? '' : value.toString();
    if (value !== this.value) {
      this.value = value;
      if (this.parent) {
        this.parent.interpolate();
      } else {
        this.targetAccessor.setValue(this.left + value + this.right, this.target, this.targetProperty);
      }
    }
  };

  ChildInterpolationBinding.prototype.call = function call() {
    if (!this.isBound) {
      return;
    }

    this.rawValue = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
    this.updateTarget(this.rawValue);

    if (this.mode !== _aureliaBinding.bindingMode.oneTime) {
      this._version++;
      this.sourceExpression.connect(this, this.source);
      if (this.rawValue instanceof Array) {
        this.observeArray(this.rawValue);
      }
      this.unobserve(false);
    }
  };

  ChildInterpolationBinding.prototype.bind = function bind(source) {
    if (this.isBound) {
      if (this.source === source) {
        return;
      }
      this.unbind();
    }
    this.isBound = true;
    this.source = source;

    var sourceExpression = this.sourceExpression;
    if (sourceExpression.bind) {
      sourceExpression.bind(this, source, this.lookupFunctions);
    }

    this.rawValue = sourceExpression.evaluate(source, this.lookupFunctions);
    this.updateTarget(this.rawValue);

    if (this.mode === _aureliaBinding.bindingMode.oneWay) {
      (0, _aureliaBinding.enqueueBindingConnect)(this);
    }
  };

  ChildInterpolationBinding.prototype.unbind = function unbind() {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    var sourceExpression = this.sourceExpression;
    if (sourceExpression.unbind) {
      sourceExpression.unbind(this, this.source);
    }
    this.source = null;
    this.value = null;
    this.rawValue = null;
    this.unobserve(true);
  };

  ChildInterpolationBinding.prototype.connect = function connect(evaluate) {
    if (!this.isBound) {
      return;
    }
    if (evaluate) {
      this.rawValue = this.sourceExpression.evaluate(this.source, this.lookupFunctions);
      this.updateTarget(this.rawValue);
    }
    this.sourceExpression.connect(this, this.source);
    if (this.rawValue instanceof Array) {
      this.observeArray(this.rawValue);
    }
  };

  return ChildInterpolationBinding;
}()) || _class2);
var SyntaxInterpreter = exports.SyntaxInterpreter = (_temp2 = _class3 = function () {
  function SyntaxInterpreter(parser, observerLocator, eventManager, attributeMap) {
    

    this.parser = parser;
    this.observerLocator = observerLocator;
    this.eventManager = eventManager;
    this.attributeMap = attributeMap;
  }

  SyntaxInterpreter.prototype.interpret = function interpret(resources, element, info, existingInstruction, context) {
    if (info.command in this) {
      return this[info.command](resources, element, info, existingInstruction, context);
    }

    return this.handleUnknownCommand(resources, element, info, existingInstruction, context);
  };

  SyntaxInterpreter.prototype.handleUnknownCommand = function handleUnknownCommand(resources, element, info, existingInstruction, context) {
    LogManager.getLogger('templating-binding').warn('Unknown binding command.', info);
    return existingInstruction;
  };

  SyntaxInterpreter.prototype.determineDefaultBindingMode = function determineDefaultBindingMode(element, attrName, context) {
    var tagName = element.tagName.toLowerCase();

    if (tagName === 'input' && (attrName === 'value' || attrName === 'files') && element.type !== 'checkbox' && element.type !== 'radio' || tagName === 'input' && attrName === 'checked' && (element.type === 'checkbox' || element.type === 'radio') || (tagName === 'textarea' || tagName === 'select') && attrName === 'value' || (attrName === 'textcontent' || attrName === 'innerhtml') && element.contentEditable === 'true' || attrName === 'scrolltop' || attrName === 'scrollleft') {
      return _aureliaBinding.bindingMode.twoWay;
    }

    if (context && attrName in context.attributes && context.attributes[attrName] && context.attributes[attrName].defaultBindingMode >= _aureliaBinding.bindingMode.oneTime) {
      return context.attributes[attrName].defaultBindingMode;
    }

    return _aureliaBinding.bindingMode.oneWay;
  };

  SyntaxInterpreter.prototype.bind = function bind(resources, element, info, existingInstruction, context) {
    var instruction = existingInstruction || _aureliaTemplating.BehaviorInstruction.attribute(info.attrName);

    instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), info.defaultBindingMode || this.determineDefaultBindingMode(element, info.attrName, context), resources.lookupFunctions);

    return instruction;
  };

  SyntaxInterpreter.prototype.trigger = function trigger(resources, element, info) {
    return new _aureliaBinding.ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), false, true, resources.lookupFunctions);
  };

  SyntaxInterpreter.prototype.delegate = function delegate(resources, element, info) {
    return new _aureliaBinding.ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), true, true, resources.lookupFunctions);
  };

  SyntaxInterpreter.prototype.call = function call(resources, element, info, existingInstruction) {
    var instruction = existingInstruction || _aureliaTemplating.BehaviorInstruction.attribute(info.attrName);

    instruction.attributes[info.attrName] = new _aureliaBinding.CallExpression(this.observerLocator, info.attrName, this.parser.parse(info.attrValue), resources.lookupFunctions);

    return instruction;
  };

  SyntaxInterpreter.prototype.options = function options(resources, element, info, existingInstruction, context) {
    var instruction = existingInstruction || _aureliaTemplating.BehaviorInstruction.attribute(info.attrName);
    var attrValue = info.attrValue;
    var language = this.language;
    var name = null;
    var target = '';
    var current = void 0;
    var i = void 0;
    var ii = void 0;
    var inString = false;
    var inEscape = false;

    for (i = 0, ii = attrValue.length; i < ii; ++i) {
      current = attrValue[i];

      if (current === ';' && !inString) {
        info = language.inspectAttribute(resources, '?', name, target.trim());
        language.createAttributeInstruction(resources, element, info, instruction, context);

        if (!instruction.attributes[info.attrName]) {
          instruction.attributes[info.attrName] = info.attrValue;
        }

        target = '';
        name = null;
      } else if (current === ':' && name === null) {
        name = target.trim();
        target = '';
      } else if (current === '\\') {
        target += current;
        inEscape = true;
        continue;
      } else {
        target += current;

        if (name !== null && inEscape === false && current === '\'') {
          inString = !inString;
        }
      }

      inEscape = false;
    }

    if (name !== null) {
      info = language.inspectAttribute(resources, '?', name, target.trim());
      language.createAttributeInstruction(resources, element, info, instruction, context);

      if (!instruction.attributes[info.attrName]) {
        instruction.attributes[info.attrName] = info.attrValue;
      }
    }

    return instruction;
  };

  SyntaxInterpreter.prototype['for'] = function _for(resources, element, info, existingInstruction) {
    var parts = void 0;
    var keyValue = void 0;
    var instruction = void 0;
    var attrValue = void 0;
    var isDestructuring = void 0;

    attrValue = info.attrValue;
    isDestructuring = attrValue.match(/^ *[[].+[\]]/);
    parts = isDestructuring ? attrValue.split('of ') : attrValue.split(' of ');

    if (parts.length !== 2) {
      throw new Error('Incorrect syntax for "for". The form is: "$local of $items" or "[$key, $value] of $items".');
    }

    instruction = existingInstruction || _aureliaTemplating.BehaviorInstruction.attribute(info.attrName);

    if (isDestructuring) {
      keyValue = parts[0].replace(/[[\]]/g, '').replace(/,/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
      instruction.attributes.key = keyValue[0];
      instruction.attributes.value = keyValue[1];
    } else {
      instruction.attributes.local = parts[0];
    }

    instruction.attributes.items = new _aureliaBinding.BindingExpression(this.observerLocator, 'items', this.parser.parse(parts[1]), _aureliaBinding.bindingMode.oneWay, resources.lookupFunctions);

    return instruction;
  };

  SyntaxInterpreter.prototype['two-way'] = function twoWay(resources, element, info, existingInstruction) {
    var instruction = existingInstruction || _aureliaTemplating.BehaviorInstruction.attribute(info.attrName);

    instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), _aureliaBinding.bindingMode.twoWay, resources.lookupFunctions);

    return instruction;
  };

  SyntaxInterpreter.prototype['one-way'] = function oneWay(resources, element, info, existingInstruction) {
    var instruction = existingInstruction || _aureliaTemplating.BehaviorInstruction.attribute(info.attrName);

    instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), _aureliaBinding.bindingMode.oneWay, resources.lookupFunctions);

    return instruction;
  };

  SyntaxInterpreter.prototype['one-time'] = function oneTime(resources, element, info, existingInstruction) {
    var instruction = existingInstruction || _aureliaTemplating.BehaviorInstruction.attribute(info.attrName);

    instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap.map(element.tagName, info.attrName), this.parser.parse(info.attrValue), _aureliaBinding.bindingMode.oneTime, resources.lookupFunctions);

    return instruction;
  };

  return SyntaxInterpreter;
}(), _class3.inject = [_aureliaBinding.Parser, _aureliaBinding.ObserverLocator, _aureliaBinding.EventManager, AttributeMap], _temp2);

var info = {};

var TemplatingBindingLanguage = exports.TemplatingBindingLanguage = (_temp3 = _class4 = function (_BindingLanguage) {
  _inherits(TemplatingBindingLanguage, _BindingLanguage);

  function TemplatingBindingLanguage(parser, observerLocator, syntaxInterpreter, attributeMap) {
    

    var _this = _possibleConstructorReturn(this, _BindingLanguage.call(this));

    _this.parser = parser;
    _this.observerLocator = observerLocator;
    _this.syntaxInterpreter = syntaxInterpreter;
    _this.emptyStringExpression = _this.parser.parse('\'\'');
    syntaxInterpreter.language = _this;
    _this.attributeMap = attributeMap;
    return _this;
  }

  TemplatingBindingLanguage.prototype.inspectAttribute = function inspectAttribute(resources, elementName, attrName, attrValue) {
    var parts = attrName.split('.');

    info.defaultBindingMode = null;

    if (parts.length === 2) {
      info.attrName = parts[0].trim();
      info.attrValue = attrValue;
      info.command = parts[1].trim();

      if (info.command === 'ref') {
        info.expression = new _aureliaBinding.NameExpression(this.parser.parse(attrValue), info.attrName, resources.lookupFunctions);
        info.command = null;
        info.attrName = 'ref';
      } else {
        info.expression = null;
      }
    } else if (attrName === 'ref') {
      info.attrName = attrName;
      info.attrValue = attrValue;
      info.command = null;
      info.expression = new _aureliaBinding.NameExpression(this.parser.parse(attrValue), 'element', resources.lookupFunctions);
    } else {
      info.attrName = attrName;
      info.attrValue = attrValue;
      info.command = null;
      var interpolationParts = this.parseInterpolation(resources, attrValue);
      if (interpolationParts === null) {
        info.expression = null;
      } else {
        info.expression = new InterpolationBindingExpression(this.observerLocator, this.attributeMap.map(elementName, attrName), interpolationParts, _aureliaBinding.bindingMode.oneWay, resources.lookupFunctions, attrName);
      }
    }

    return info;
  };

  TemplatingBindingLanguage.prototype.createAttributeInstruction = function createAttributeInstruction(resources, element, theInfo, existingInstruction, context) {
    var instruction = void 0;

    if (theInfo.expression) {
      if (theInfo.attrName === 'ref') {
        return theInfo.expression;
      }

      instruction = existingInstruction || _aureliaTemplating.BehaviorInstruction.attribute(theInfo.attrName);
      instruction.attributes[theInfo.attrName] = theInfo.expression;
    } else if (theInfo.command) {
      instruction = this.syntaxInterpreter.interpret(resources, element, theInfo, existingInstruction, context);
    }

    return instruction;
  };

  TemplatingBindingLanguage.prototype.inspectTextContent = function inspectTextContent(resources, value) {
    var parts = this.parseInterpolation(resources, value);
    if (parts === null) {
      return null;
    }
    return new InterpolationBindingExpression(this.observerLocator, 'textContent', parts, _aureliaBinding.bindingMode.oneWay, resources.lookupFunctions, 'textContent');
  };

  TemplatingBindingLanguage.prototype.parseInterpolation = function parseInterpolation(resources, value) {
    var i = value.indexOf('${', 0);
    var ii = value.length;
    var char = void 0;
    var pos = 0;
    var open = 0;
    var quote = null;
    var interpolationStart = void 0;
    var parts = void 0;
    var partIndex = 0;

    while (i >= 0 && i < ii - 2) {
      open = 1;
      interpolationStart = i;
      i += 2;

      do {
        char = value[i];
        i++;

        if (char === "'" || char === '"') {
          if (quote === null) {
            quote = char;
          } else if (quote === char) {
            quote = null;
          }
          continue;
        }

        if (char === '\\') {
          i++;
          continue;
        }

        if (quote !== null) {
          continue;
        }

        if (char === '{') {
          open++;
        } else if (char === '}') {
          open--;
        }
      } while (open > 0 && i < ii);

      if (open === 0) {
        parts = parts || [];
        if (value[interpolationStart - 1] === '\\' && value[interpolationStart - 2] !== '\\') {
          parts[partIndex] = value.substring(pos, interpolationStart - 1) + value.substring(interpolationStart, i);
          partIndex++;
          parts[partIndex] = this.emptyStringExpression;
          partIndex++;
        } else {
          parts[partIndex] = value.substring(pos, interpolationStart);
          partIndex++;
          parts[partIndex] = this.parser.parse(value.substring(interpolationStart + 2, i - 1));
          partIndex++;
        }
        pos = i;
        i = value.indexOf('${', i);
      } else {
        break;
      }
    }

    if (partIndex === 0) {
      return null;
    }

    parts[partIndex] = value.substr(pos);
    return parts;
  };

  return TemplatingBindingLanguage;
}(_aureliaTemplating.BindingLanguage), _class4.inject = [_aureliaBinding.Parser, _aureliaBinding.ObserverLocator, SyntaxInterpreter, AttributeMap], _temp3);
function configure(config) {
  config.container.registerSingleton(_aureliaTemplating.BindingLanguage, TemplatingBindingLanguage);
  config.container.registerAlias(_aureliaTemplating.BindingLanguage, TemplatingBindingLanguage);
}

/***/ },

/***/ "aurelia-templating-router":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.RouteHref = exports.RouterView = exports.TemplatingRouteLoader = undefined;

var _aureliaRouter = __webpack_require__("aurelia-router");

var _routeLoader = __webpack_require__(703);

var _routerView = __webpack_require__("aurelia-templating-router/router-view.js");

var _routeHref = __webpack_require__("aurelia-templating-router/route-href.js");

function configure(config) {
  config.singleton(_aureliaRouter.RouteLoader, _routeLoader.TemplatingRouteLoader).singleton(_aureliaRouter.Router, _aureliaRouter.AppRouter).globalResources('./router-view', './route-href');

  config.container.registerAlias(_aureliaRouter.Router, _aureliaRouter.AppRouter);
}

exports.TemplatingRouteLoader = _routeLoader.TemplatingRouteLoader;
exports.RouterView = _routerView.RouterView;
exports.RouteHref = _routeHref.RouteHref;
exports.configure = configure;

/***/ },

/***/ "aurelia-templating-router/route-href.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouteHref = undefined;

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

var _aureliaTemplating = __webpack_require__("aurelia-templating");

var _aureliaDependencyInjection = __webpack_require__(4);

var _aureliaRouter = __webpack_require__("aurelia-router");

var _aureliaPal = __webpack_require__(14);

var _aureliaLogging = __webpack_require__(40);

var LogManager = _interopRequireWildcard(_aureliaLogging);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }



var logger = LogManager.getLogger('route-href');

var RouteHref = exports.RouteHref = (_dec = (0, _aureliaTemplating.customAttribute)('route-href'), _dec2 = (0, _aureliaTemplating.bindable)({ name: 'route', changeHandler: 'processChange' }), _dec3 = (0, _aureliaTemplating.bindable)({ name: 'params', changeHandler: 'processChange' }), _dec4 = (0, _aureliaTemplating.bindable)({ name: 'attribute', defaultValue: 'href' }), _dec5 = (0, _aureliaDependencyInjection.inject)(_aureliaRouter.Router, _aureliaPal.DOM.Element), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = function () {
  function RouteHref(router, element) {
    

    this.router = router;
    this.element = element;
  }

  RouteHref.prototype.bind = function bind() {
    this.isActive = true;
    this.processChange();
  };

  RouteHref.prototype.unbind = function unbind() {
    this.isActive = false;
  };

  RouteHref.prototype.attributeChanged = function attributeChanged(value, previous) {
    if (previous) {
      this.element.removeAttribute(previous);
    }

    this.processChange();
  };

  RouteHref.prototype.processChange = function processChange() {
    var _this = this;

    return this.router.ensureConfigured().then(function () {
      if (!_this.isActive) {
        return null;
      }

      var href = _this.router.generate(_this.route, _this.params);
      _this.element.setAttribute(_this.attribute, href);
      return null;
    }).catch(function (reason) {
      logger.error(reason);
    });
  };

  return RouteHref;
}()) || _class) || _class) || _class) || _class) || _class);

/***/ },

/***/ "aurelia-templating-router/router-view.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterView = undefined;

var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

var _aureliaDependencyInjection = __webpack_require__(4);

var _aureliaTemplating = __webpack_require__("aurelia-templating");

var _aureliaRouter = __webpack_require__("aurelia-router");

var _aureliaMetadata = __webpack_require__(26);

var _aureliaPal = __webpack_require__(14);

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}



var SwapStrategies = function () {
  function SwapStrategies() {
    
  }

  SwapStrategies.prototype.before = function before(viewSlot, previousView, callback) {
    var promise = Promise.resolve(callback());

    if (previousView !== undefined) {
      return promise.then(function () {
        return viewSlot.remove(previousView, true);
      });
    }

    return promise;
  };

  SwapStrategies.prototype.with = function _with(viewSlot, previousView, callback) {
    var promise = Promise.resolve(callback());

    if (previousView !== undefined) {
      return Promise.all([viewSlot.remove(previousView, true), promise]);
    }

    return promise;
  };

  SwapStrategies.prototype.after = function after(viewSlot, previousView, callback) {
    return Promise.resolve(viewSlot.removeAll(true)).then(callback);
  };

  return SwapStrategies;
}();

var swapStrategies = new SwapStrategies();

var RouterView = exports.RouterView = (_dec = (0, _aureliaTemplating.customElement)('router-view'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaDependencyInjection.Container, _aureliaTemplating.ViewSlot, _aureliaRouter.Router, _aureliaTemplating.ViewLocator, _aureliaTemplating.CompositionTransaction, _aureliaTemplating.CompositionEngine), _dec(_class = (0, _aureliaTemplating.noView)(_class = _dec2(_class = (_class2 = function () {
  function RouterView(element, container, viewSlot, router, viewLocator, compositionTransaction, compositionEngine) {
    

    _initDefineProp(this, 'swapOrder', _descriptor, this);

    _initDefineProp(this, 'layoutView', _descriptor2, this);

    _initDefineProp(this, 'layoutViewModel', _descriptor3, this);

    _initDefineProp(this, 'layoutModel', _descriptor4, this);

    this.element = element;
    this.container = container;
    this.viewSlot = viewSlot;
    this.router = router;
    this.viewLocator = viewLocator;
    this.compositionTransaction = compositionTransaction;
    this.compositionEngine = compositionEngine;
    this.router.registerViewPort(this, this.element.getAttribute('name'));

    if (!('initialComposition' in compositionTransaction)) {
      compositionTransaction.initialComposition = true;
      this.compositionTransactionNotifier = compositionTransaction.enlist();
    }
  }

  RouterView.prototype.created = function created(owningView) {
    this.owningView = owningView;
  };

  RouterView.prototype.bind = function bind(bindingContext, overrideContext) {
    this.container.viewModel = bindingContext;
    this.overrideContext = overrideContext;
  };

  RouterView.prototype.process = function process(viewPortInstruction, waitToSwap) {
    var _this = this;

    var component = viewPortInstruction.component;
    var childContainer = component.childContainer;
    var viewModel = component.viewModel;
    var viewModelResource = component.viewModelResource;
    var metadata = viewModelResource.metadata;
    var config = component.router.currentInstruction.config;
    var viewPort = config.viewPorts ? config.viewPorts[viewPortInstruction.name] : {};

    var layoutInstruction = {
      viewModel: viewPort.layoutViewModel || config.layoutViewModel || this.layoutViewModel,
      view: viewPort.layoutView || config.layoutView || this.layoutView,
      model: viewPort.layoutModel || config.layoutModel || this.layoutModel,
      router: viewPortInstruction.component.router,
      childContainer: childContainer,
      viewSlot: this.viewSlot
    };

    var viewStrategy = this.viewLocator.getViewStrategy(component.view || viewModel);
    if (viewStrategy && component.view) {
      viewStrategy.makeRelativeTo(_aureliaMetadata.Origin.get(component.router.container.viewModel.constructor).moduleId);
    }

    return metadata.load(childContainer, viewModelResource.value, null, viewStrategy, true).then(function (viewFactory) {
      if (!_this.compositionTransactionNotifier) {
        _this.compositionTransactionOwnershipToken = _this.compositionTransaction.tryCapture();
      }

      if (layoutInstruction.viewModel || layoutInstruction.view) {
        viewPortInstruction.layoutInstruction = layoutInstruction;
      }

      viewPortInstruction.controller = metadata.create(childContainer, _aureliaTemplating.BehaviorInstruction.dynamic(_this.element, viewModel, viewFactory));

      if (waitToSwap) {
        return;
      }

      _this.swap(viewPortInstruction);
    });
  };

  RouterView.prototype.swap = function swap(viewPortInstruction) {
    var _this2 = this;

    var work = function work() {
      var previousView = _this2.view;
      var swapStrategy = void 0;
      var viewSlot = _this2.viewSlot;
      var layoutInstruction = viewPortInstruction.layoutInstruction;

      swapStrategy = _this2.swapOrder in swapStrategies ? swapStrategies[_this2.swapOrder] : swapStrategies.after;

      swapStrategy(viewSlot, previousView, function () {
        var waitForView = void 0;

        if (layoutInstruction) {
          if (!layoutInstruction.viewModel) {
            layoutInstruction.viewModel = {};
          }

          waitForView = _this2.compositionEngine.createController(layoutInstruction).then(function (layout) {
            _aureliaTemplating.ShadowDOM.distributeView(viewPortInstruction.controller.view, layout.slots || layout.view.slots);
            return layout.view || layout;
          });
        } else {
          waitForView = Promise.resolve(viewPortInstruction.controller.view);
        }

        return waitForView.then(function (newView) {
          _this2.view = newView;
          return viewSlot.add(newView);
        }).then(function () {
          _this2._notify();
        });
      });
    };

    viewPortInstruction.controller.automate(this.overrideContext, this.owningView);

    if (this.compositionTransactionOwnershipToken) {
      return this.compositionTransactionOwnershipToken.waitForCompositionComplete().then(function () {
        _this2.compositionTransactionOwnershipToken = null;
        return work();
      });
    }

    return work();
  };

  RouterView.prototype._notify = function _notify() {
    if (this.compositionTransactionNotifier) {
      this.compositionTransactionNotifier.done();
      this.compositionTransactionNotifier = null;
    }
  };

  return RouterView;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'swapOrder', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'layoutView', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'layoutViewModel', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'layoutModel', [_aureliaTemplating.bindable], {
  enumerable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("bluebird")))

/***/ },

/***/ "aurelia-validatejs":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validator = exports.ValidationRules = exports.ValidationRule = exports.metadataKey = undefined;
exports.cleanResult = cleanResult;
exports.base = base;
exports.addRule = addRule;
exports.length = length;
exports.presence = presence;
exports.required = required;
exports.date = date;
exports.datetime = datetime;
exports.email = email;
exports.equality = equality;
exports.exclusion = exclusion;
exports.inclusion = inclusion;
exports.format = format;
exports.url = url;
exports.numericality = numericality;
exports.configure = configure;

var _aureliaMetadata = __webpack_require__(26);

var _aureliaValidation = __webpack_require__(707);

var _validate2 = __webpack_require__(1299);

var _validate3 = _interopRequireDefault(_validate2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }



var metadataKey = exports.metadataKey = 'aurelia-validatejs:rules';

var ValidationRule = exports.ValidationRule = function () {
  function ValidationRule(name, config) {
    

    this.name = '';

    this.name = name;
    this.config = config;
  }

  ValidationRule.date = function date() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    return new ValidationRule('date', config);
  };

  ValidationRule.datetime = function datetime() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    return new ValidationRule('datetime', config);
  };

  ValidationRule.email = function email() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    return new ValidationRule('email', config);
  };

  ValidationRule.equality = function equality(config) {
    return new ValidationRule('equality', config);
  };

  ValidationRule.exclusion = function exclusion(config) {
    return new ValidationRule('exclusion', config);
  };

  ValidationRule.format = function format(config) {
    return new ValidationRule('format', config);
  };

  ValidationRule.inclusion = function inclusion(config) {
    return new ValidationRule('inclusion', config);
  };

  ValidationRule.lengthRule = function lengthRule(config) {
    return new ValidationRule('length', config);
  };

  ValidationRule.numericality = function numericality() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    return new ValidationRule('numericality', config);
  };

  ValidationRule.presence = function presence() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    return new ValidationRule('presence', config);
  };

  ValidationRule.url = function url() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

    return new ValidationRule('url', config);
  };

  return ValidationRule;
}();

function cleanResult(data) {
  var result = {};
  for (var prop in data) {
    if (data.hasOwnProperty(prop)) {
      result = {
        propertyName: prop,
        message: data[prop][0]
      };
    }
  }
  return result;
}

var ValidationRules = exports.ValidationRules = function () {
  function ValidationRules() {
    

    this.rules = [];
  }

  ValidationRules.ensure = function ensure(prop) {
    var rules = new ValidationRules();
    return rules.ensure(prop);
  };

  ValidationRules.prototype.on = function on(target) {
    if (target instanceof Function) {
      target = target.prototype;
    }
    _aureliaMetadata.metadata.define(metadataKey, this, target);
    return this;
  };

  ValidationRules.prototype.decorate = function decorate() {
    throw new Error('not implemented');
  };

  ValidationRules.prototype.addRule = function addRule(key, rule) {
    this.rules.push({ key: key, rule: rule });
  };

  ValidationRules.prototype.ensure = function ensure(prop) {
    this.currentProperty = prop;
    return this;
  };

  ValidationRules.prototype.length = function length(configuration) {
    this.addRule(this.currentProperty, ValidationRule.lengthRule(configuration));
    return this;
  };

  ValidationRules.prototype.presence = function presence(configuration) {
    this.addRule(this.currentProperty, ValidationRule.presence(configuration));
    return this;
  };

  ValidationRules.prototype.required = function required(configuration) {
    this.addRule(this.currentProperty, ValidationRule.presence(configuration));
    return this;
  };

  ValidationRules.prototype.numericality = function numericality(configuration) {
    this.addRule(this.currentProperty, ValidationRule.numericality(configuration));
    return this;
  };

  ValidationRules.prototype.date = function date(configuration) {
    this.addRule(this.currentProperty, ValidationRule.date(configuration));
    return this;
  };

  ValidationRules.prototype.datetime = function datetime(configuration) {
    this.addRule(this.currentProperty, ValidationRule.datetime(configuration));
    return this;
  };

  ValidationRules.prototype.email = function email(configuration) {
    this.addRule(this.currentProperty, ValidationRule.email(configuration));
    return this;
  };

  ValidationRules.prototype.equality = function equality(configuration) {
    this.addRule(this.currentProperty, ValidationRule.equality(configuration));
    return this;
  };

  ValidationRules.prototype.format = function format(configuration) {
    this.addRule(this.currentProperty, ValidationRule.format(configuration));
    return this;
  };

  ValidationRules.prototype.inclusion = function inclusion(configuration) {
    this.addRule(this.currentProperty, ValidationRule.inclusion(configuration));
    return this;
  };

  ValidationRules.prototype.exclusion = function exclusion(configuration) {
    this.addRule(this.currentProperty, ValidationRule.exclusion(configuration));
    return this;
  };

  ValidationRules.prototype.url = function url(configuration) {
    this.addRule(this.currentProperty, ValidationRule.url(configuration));
    return this;
  };

  return ValidationRules;
}();

function base(targetOrConfig, key, descriptor, rule) {
  if (key) {
    var target = targetOrConfig;
    targetOrConfig = null;
    return addRule(target, key, descriptor, targetOrConfig, rule);
  }
  return function (t, k, d) {
    return addRule(t, k, d, targetOrConfig, rule);
  };
}

function addRule(target, key, descriptor, targetOrConfig, rule) {
  var rules = _aureliaMetadata.metadata.getOrCreateOwn(metadataKey, ValidationRules, target);
  if (targetOrConfig === null || targetOrConfig === undefined) {
    targetOrConfig = true;
  }
  rules.addRule(key, rule(targetOrConfig));

  if (descriptor) {
    descriptor.configurable = true;
  }
}

function length(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.lengthRule);
}

function presence(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.presence, true);
}

function required(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.presence, true);
}

function date(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.date);
}

function datetime(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.datetime);
}

function email(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.email);
}

function equality(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.equality);
}

function exclusion(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.exclusion);
}

function inclusion(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.inclusion);
}

function format(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.format);
}

function url(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.url);
}

function numericality(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.numericality);
}

var Validator = exports.Validator = function () {
  function Validator() {
    
  }

  Validator.prototype._validate = function _validate(object) {
    var propertyName = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var rules = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    var errors = [];
    if (!rules) {
      rules = _aureliaMetadata.metadata.get(metadataKey, object);
    }
    if (!rules) {
      return errors;
    }
    rules = rules.rules;
    for (var i = 0, ii = rules.length; i < ii; i++) {
      var _propertyName, _validator;

      var ruleInfo = rules[i];
      if (propertyName !== null && ruleInfo.key !== propertyName) {
        continue;
      }
      var _ruleInfo$rule = ruleInfo.rule;
      var name = _ruleInfo$rule.name;
      var config = _ruleInfo$rule.config;

      var validator = (_validator = {}, _validator[propertyName] = (_propertyName = {}, _propertyName[name] = config, _propertyName), _validator);
      var result = (0, _validate3.default)(object, validator);
      if (result) {
        errors.push(new _aureliaValidation.ValidationError(ruleInfo.rule, result[propertyName][0], object, propertyName));
      }
    }
    return errors;
  };

  Validator.prototype.validateProperty = function validateProperty(object, propertyName) {
    var rules = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    return this._validate(object, propertyName, rules);
  };

  Validator.prototype.validateObject = function validateObject(object) {
    var rules = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    return this._validate(object, null, rules);
  };

  return Validator;
}();

function configure(config) {
  config.container.registerInstance(_aureliaValidation.Validator, new Validator());
}

/***/ },

/***/ "aurelia-validation":
/***/ function(module, exports, __webpack_require__) {

"use strict";
// Exports
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__("aurelia-validation/validate-binding-behavior.js"));
__export(__webpack_require__(96));
__export(__webpack_require__(75));
__export(__webpack_require__(714));
__export(__webpack_require__(155));
__export(__webpack_require__("aurelia-validation/validation-errors-custom-attribute.js"));
__export(__webpack_require__("aurelia-validation/validation-renderer-custom-attribute.js"));
__export(__webpack_require__(76));
__export(__webpack_require__(152));
__export(__webpack_require__(251));
__export(__webpack_require__(153));
__export(__webpack_require__(154));
__export(__webpack_require__(253));
var validator_2 = __webpack_require__(76);
var standard_validator_2 = __webpack_require__(251);
var validation_parser_2 = __webpack_require__(154);
var validation_rules_2 = __webpack_require__(253);
/**
 * Aurelia Validation Configuration API
 */
var AureliaValidationConfiguration = (function () {
    function AureliaValidationConfiguration() {
        this.validatorType = standard_validator_2.StandardValidator;
    }
    /**
     * Use a custom Validator implementation.
     */
    AureliaValidationConfiguration.prototype.customValidator = function (type) {
        this.validatorType = type;
    };
    /**
     * Applies the configuration.
     */
    AureliaValidationConfiguration.prototype.apply = function (container) {
        var validator = container.get(this.validatorType);
        container.registerInstance(validator_2.Validator, validator);
    };
    return AureliaValidationConfiguration;
}());
exports.AureliaValidationConfiguration = AureliaValidationConfiguration;
/**
 * Configures the plugin.
 */
function configure(frameworkConfig, callback) {
    // the fluent rule definition API needs the parser to translate messages
    // to interpolation expressions. 
    var parser = frameworkConfig.container.get(validation_parser_2.ValidationParser);
    validation_rules_2.ValidationRules.initialize(parser);
    // configure...
    var config = new AureliaValidationConfiguration();
    if (callback instanceof Function) {
        callback(config);
    }
    config.apply(frameworkConfig.container);
    // globalize the behaviors.
    frameworkConfig.globalResources('./validate-binding-behavior', './validation-errors-custom-attribute', './validation-renderer-custom-attribute');
}
exports.configure = configure;


/***/ },

/***/ "aurelia-validation/validate-binding-behavior.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aurelia_task_queue_1 = __webpack_require__(42);
var validate_trigger_1 = __webpack_require__(96);
var validate_binding_behavior_base_1 = __webpack_require__(713);
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the validate trigger specified by the associated controller's
 * validateTrigger property occurs.
 */
var ValidateBindingBehavior = (function (_super) {
    __extends(ValidateBindingBehavior, _super);
    function ValidateBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateBindingBehavior.prototype.getValidateTrigger = function (controller) {
        return controller.validateTrigger;
    };
    ValidateBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    return ValidateBindingBehavior;
}(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
exports.ValidateBindingBehavior = ValidateBindingBehavior;
/**
 * Binding behavior. Indicates the bound property will be validated
 * manually, by calling controller.validate(). No automatic validation
 * triggered by data-entry or blur will occur.
 */
var ValidateManuallyBindingBehavior = (function (_super) {
    __extends(ValidateManuallyBindingBehavior, _super);
    function ValidateManuallyBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateManuallyBindingBehavior.prototype.getValidateTrigger = function () {
        return validate_trigger_1.validateTrigger.manual;
    };
    ValidateManuallyBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    return ValidateManuallyBindingBehavior;
}(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
exports.ValidateManuallyBindingBehavior = ValidateManuallyBindingBehavior;
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs.
 */
var ValidateOnBlurBindingBehavior = (function (_super) {
    __extends(ValidateOnBlurBindingBehavior, _super);
    function ValidateOnBlurBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateOnBlurBindingBehavior.prototype.getValidateTrigger = function () {
        return validate_trigger_1.validateTrigger.blur;
    };
    ValidateOnBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    return ValidateOnBlurBindingBehavior;
}(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
exports.ValidateOnBlurBindingBehavior = ValidateOnBlurBindingBehavior;
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element is changed by the user, causing a change
 * to the model.
 */
var ValidateOnChangeBindingBehavior = (function (_super) {
    __extends(ValidateOnChangeBindingBehavior, _super);
    function ValidateOnChangeBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateOnChangeBindingBehavior.prototype.getValidateTrigger = function () {
        return validate_trigger_1.validateTrigger.change;
    };
    ValidateOnChangeBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    return ValidateOnChangeBindingBehavior;
}(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
exports.ValidateOnChangeBindingBehavior = ValidateOnChangeBindingBehavior;
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs or is changed by the user, causing
 * a change to the model.
 */
var ValidateOnChangeOrBlurBindingBehavior = (function (_super) {
    __extends(ValidateOnChangeOrBlurBindingBehavior, _super);
    function ValidateOnChangeOrBlurBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateOnChangeOrBlurBindingBehavior.prototype.getValidateTrigger = function () {
        return validate_trigger_1.validateTrigger.changeOrBlur;
    };
    ValidateOnChangeOrBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    return ValidateOnChangeOrBlurBindingBehavior;
}(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
exports.ValidateOnChangeOrBlurBindingBehavior = ValidateOnChangeOrBlurBindingBehavior;


/***/ },

/***/ "aurelia-validation/validation-errors-custom-attribute.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var aurelia_binding_1 = __webpack_require__(9);
var aurelia_dependency_injection_1 = __webpack_require__(4);
var aurelia_templating_1 = __webpack_require__("aurelia-templating");
var validation_controller_1 = __webpack_require__(75);
var ValidationErrorsCustomAttribute = (function () {
    function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
        this.boundaryElement = boundaryElement;
        this.controllerAccessor = controllerAccessor;
        this.errors = [];
    }
    ValidationErrorsCustomAttribute.prototype.sort = function () {
        this.errors.sort(function (a, b) {
            if (a.targets[0] === b.targets[0]) {
                return 0;
            }
            return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
        });
    };
    ValidationErrorsCustomAttribute.prototype.interestingElements = function (elements) {
        var _this = this;
        return elements.filter(function (e) { return _this.boundaryElement.contains(e); });
    };
    ValidationErrorsCustomAttribute.prototype.render = function (instruction) {
        var _loop_1 = function(error) {
            var index = this_1.errors.findIndex(function (x) { return x.error === error; });
            if (index !== -1) {
                this_1.errors.splice(index, 1);
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = instruction.unrender; _i < _a.length; _i++) {
            var error = _a[_i].error;
            _loop_1(error);
        }
        for (var _b = 0, _c = instruction.render; _b < _c.length; _b++) {
            var _d = _c[_b], error = _d.error, elements = _d.elements;
            var targets = this.interestingElements(elements);
            if (targets.length) {
                this.errors.push({ error: error, targets: targets });
            }
        }
        this.sort();
        this.value = this.errors;
    };
    ValidationErrorsCustomAttribute.prototype.bind = function () {
        this.controllerAccessor().addRenderer(this);
        this.value = this.errors;
    };
    ValidationErrorsCustomAttribute.prototype.unbind = function () {
        this.controllerAccessor().removeRenderer(this);
    };
    ValidationErrorsCustomAttribute.inject = [Element, aurelia_dependency_injection_1.Lazy.of(validation_controller_1.ValidationController)];
    ValidationErrorsCustomAttribute = __decorate([
        aurelia_templating_1.customAttribute('validation-errors', aurelia_binding_1.bindingMode.twoWay)
    ], ValidationErrorsCustomAttribute);
    return ValidationErrorsCustomAttribute;
}());
exports.ValidationErrorsCustomAttribute = ValidationErrorsCustomAttribute;


/***/ },

/***/ "aurelia-validation/validation-renderer-custom-attribute.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var validation_controller_1 = __webpack_require__(75);
var ValidationRendererCustomAttribute = (function () {
    function ValidationRendererCustomAttribute() {
    }
    ValidationRendererCustomAttribute.prototype.created = function (view) {
        this.container = view.container;
    };
    ValidationRendererCustomAttribute.prototype.bind = function () {
        this.controller = this.container.get(validation_controller_1.ValidationController);
        this.renderer = this.container.get(this.value);
        this.controller.addRenderer(this.renderer);
    };
    ValidationRendererCustomAttribute.prototype.unbind = function () {
        this.controller.removeRenderer(this.renderer);
        this.controller = null;
        this.renderer = null;
    };
    return ValidationRendererCustomAttribute;
}());
exports.ValidationRendererCustomAttribute = ValidationRendererCustomAttribute;


/***/ }

},[1334]);
//# sourceMappingURL=aurelia.bundle.map