import {
    type,
    minLength,
    email,
    valuesAreEqual,
} from 'libs/reform/src/validation'
import { validateOrFail } from 'libs/reform/src/validation/helpers'

export default (propName, dataKey = 'signup') => ({
    [propName]: {
        dataKey,
        initialModel: {
            name: '',
            email: '',
            confirmEmail: '',
            password: '',
        },
        validation: {
            name: validateOrFail([
                {
                    rules: [type('string'), minLength(1)],
                    errorResult: 'Name is required.',
                },
            ]),
            email: validateOrFail([
                {
                    rules: [type('string'), email],
                    errorResult: 'Please enter a valid email.',
                },
            ]),
            confirmEmail: validateOrFail([
                {
                    rules: [type('string'), email, valuesAreEqual('email')],
                    errorResult: 'Your email confirmation does not match.',
                },
            ]),
            password: validateOrFail([
                {
                    rules: [type('string'), minLength(6)],
                    errorResult: 'Password needs to be at least 6 characters.',
                },
            ]),
        },
    },
})



// WEBPACK FOOTER //
// ./app/features/Auth/reform-declarations/signup.js