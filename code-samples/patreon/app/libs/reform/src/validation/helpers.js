import every from 'lodash/every'

export const makeValidator = rules => (value, props) => {
    return every(rules, rule => rule(value, props))
}

/*
    Provide a list of { rules, errorResult }.
    The provided list will be evaluated in order,
    and the rules within a given list { rules, errorResult } tuple will also be evaluated in order.
    If any rule is violated, the function will short circuit, and return the matching errorResult.

    Example:
        validateOrErrorResult([
            { rules: [type('string'), minLength(1)], errorResult: 'Please enter your PayPal email' },
            { rules: [email], errorResult: (value, props) => `${value} is not a valid email` },
        ])
 */
export const validateOrErrorResult = rulesAndErrorResult => (value, props) => {
    for (let index = 0; index < rulesAndErrorResult.length; index++) {
        const { rules, errorResult } = rulesAndErrorResult[index]
        const validate = makeValidator(rules)
        if (!validate(value, props)) {
            return errorResult instanceof Function
                ? errorResult(value, props)
                : errorResult
        }
    }
    // signals no invalid values found
    return undefined
}

/*
    Helpful utility function for the validations in your arguments to the reform decorator.
    Provide a list of { rules, errorResult }, and this function will return a function that works with reform.
    The provided list will be evaluated in order,
    and the rules within a given list { rules, errorResult } tuple will also be evaluated in order.
    If any rule is violated, the function will short circuit,
    and return the result of the provided `fail` function called with the matching errorResult.

    Example:
        {
            paypalEmail: validateOrFail([
                { rules: [type('string'), minLength(1)], errorResult: 'Please enter your PayPal email' },
                { rules: [email], errorResult: (value, props) => `${value} is not a valid email` },
            ])
        }
 */
export const validateOrFail = rulesAndErrorResult => (value, fail, props) => {
    const errorResult = validateOrErrorResult(rulesAndErrorResult)(value, props)
    if (errorResult) {
        return fail(errorResult)
    }
    // signals no invalid values found
    return undefined
}



// WEBPACK FOOTER //
// ./app/libs/reform/src/validation/helpers.js