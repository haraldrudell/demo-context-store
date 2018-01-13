import findObjectWithMatchingModel from 'utilities/payment-form-find-object'

// Globals
let validValueInTaxForm = {}

function isValid(object) {
    object.isValid = true
    object.isInvalid = false

    return object
}

function isInvalid(object) {
    object.isValid = false
    object.isInvalid = true

    return object
}

function isPristine(object) {
    object.isValid = false
    object.isInvalid = false

    return object
}

export const validationsKey = {
    'finished': function(value, params, form, length = 1) {
        value = (value !== null && value !== undefined) ? value : ''

        return (value.length >= Number(length))
    },
    'choiceDecided': function(value, params, form) {
        value = (value !== null && value !== undefined) ? value : ''

        const pairModel = params[1]
        const object = findObjectWithMatchingModel(pairModel, form)
        const objectHasValue = validationsKey['finished'](object.value)
        const targetHasValue = validationsKey['finished'](value)

        if (targetHasValue && !objectHasValue) {
            return true
        }

        if (targetHasValue && objectHasValue) {
            return false
        }

        if (!targetHasValue && !objectHasValue) {
            return false
        }

        return null
    },
    'minValueInclusive': function(value, params, form) {
        value = (value !== null && value !== undefined) ? value : ''

        if (value === '') {
            return null
        }

        return validationsKey['finished'](value, null, null, params[1])
    },
    'maxValueInclusive': function(value, params, form) {
        value = (value !== null && value !== undefined) ? value : ''

        if (value === '') {
            return null
        }

        return (value.length <= Number(params[1]))
    },
    'requiredType': function(value) {
        value = (value !== null && value !== undefined) ? value : ''

        if (value === '') {
            return null
        }

        return (value % 1 === 0)
    },
    'requiredLength': function(value = '', params, form) {
        value = (value !== null && value !== undefined) ? value : ''

        if (value === '') {
            return null
        }

        return (value.length === Number(params[1]))
    }
}

export function setValidationMutationOnEach(object = {}, value, form = {}) {
    let fields = { ...object, value }

    if (fields.hasOwnProperty('validations')) {
        let hasFalse = false

        fields.validations.forEach((type) => {
            const validationState = validationsKey[type[0]](fields.value, type, form)

            if (validationState === false) {
                hasFalse = true

                fields = isInvalid(fields)
            } else if (validationState === true) {
                validValueInTaxForm[object.key] = value

                if (!hasFalse) {
                    fields = isValid(fields)
                }
            } else if (validationState === null) {
                fields = isPristine(fields)
            }
        })

        fields
    } else {
        fields = isPristine(fields)
    }

    return fields
}

function setActionAndTrackAdditions(object, action, form, additions) {
    if (object.hasOwnProperty('key')) {
        if (object.key === action.key || action.key === 'APPLY_TO_ALL') {
            if (object.validations && Array.isArray(object.validations)) {
                object.validations.forEach((validation) => {
                    if (validation[0] === 'choiceDecided') {
                        additions.push(validation[1])
                    }
                })
            }
        }

        if (action.key === 'APPLY_TO_ALL') {
            object = setValidationMutationOnEach(object, object.value, form)
        } else if (object.key === action.key) {
            object = setValidationMutationOnEach(object, action.value, form)
        }
    }

    if (object.hasOwnProperty('conditions')) {
        object.conditions.forEach((type) => {
            if (validValueInTaxForm.hasOwnProperty(type[0]) &&
                type[1] === validValueInTaxForm[type[0]]) {
                object.isHidden = false
            }
        })
    }

    return object
}

function setValue(object, key, form) {
    if (object.hasOwnProperty('key') && object.key === key) {
        return setValidationMutationOnEach(object, object.value, form)
    }

    return object
}

export function setValuesOnForm(state, action) {
    let { form } = state

    let additions = []

    form = form.map(function(item){
        return (Array.isArray(item))
        ? item.map(function(childItem){
            return setActionAndTrackAdditions(childItem, action, form, additions)
        })
        : setActionAndTrackAdditions(item, action, form, additions)
    })

    additions.forEach(function(key){
        form = form.map(function(item){
            return (Array.isArray(item))
            ? item.map(function(childItem){
                return setValue(childItem, key, form)
            })
            : setValue(item, key, form)
        })
    })

    additions = []
    validValueInTaxForm = {}

    return form
}

export function validateForm(state) {
    return setValuesOnForm(state, {
        key: 'APPLY_TO_ALL'
    })
}

export default {
    setValuesOnForm,
    setValidationMutationOnEach,
    validateForm
}



// WEBPACK FOOTER //
// ./app/utilities/payment-form-validation.js