import validator from 'email-validator'
import url from 'url'
import get from 'lodash/get'

export const required = value => Boolean(value)

export const or = (validatorA, validatorB) => value =>
    Boolean(validatorA(value) || validatorB(value))
export const and = (validatorA, validatorB) => value =>
    Boolean(validatorA(value) && validatorB(value))

export const type = requiredType => value => typeof value === requiredType
export const isNull = value => value === null

// modelKey is the key name for the input you want to compare against
export const valuesAreEqual = modelKey => (valueA, props) => {
    const valueB = get(props, `model.${modelKey}`, undefined)
    return valueA === valueB
}

export const minLength = requiredMinLength => value =>
    value.length >= requiredMinLength
export const maxLength = requiredMaxLength => value =>
    value.length <= requiredMaxLength
export const exactLength = requiredExactLength => value =>
    value.length === requiredExactLength

export const email = value => validator.validate(value)
export const currency = value =>
    type('string')(value) &&
    Boolean(value.match(/^[1-9]\d*((,\d{3})*(\.\d{2})?)$/))
export const regexMatch = regex => value =>
    type('string')(value) && Boolean(value.match(regex))
export const digitsOnly = value =>
    type('string')(value) && Boolean(value.match(/^\d+$/))

export const greaterThan = compare => value => value > compare
export const lessThan = compare => value => value < compare

export const validDomain = value =>
    type('string')(value) && url.parse(`http://${value}`).hostname === value
export const validURL = value =>
    type('string')(value) &&
    ['http:', 'https:'].includes(url.parse(value).protocol)

// isValid if empty
export const emptyOrValidURL = value => !value || validURL(value)



// WEBPACK FOOTER //
// ./app/libs/reform/src/validation/index.js