import { type, minLength, email } from 'libs/reform/src/validation'
import { validateOrFail } from 'libs/reform/src/validation/helpers'

export default (propKey, dataKey = 'login') => ({
    [propKey]: {
        dataKey,
        initialModel: {
            email: '',
            password: '',
        },
        validation: {
            email: validateOrFail([
                {
                    rules: [type('string'), email],
                    errorResult: 'Please enter a valid email.',
                },
            ]),
            password: validateOrFail([
                {
                    rules: [type('string'), minLength(1)],
                    errorResult: 'Please enter a password.',
                },
            ]),
        },
    },
})



// WEBPACK FOOTER //
// ./app/features/Auth/reform-declarations/login.js