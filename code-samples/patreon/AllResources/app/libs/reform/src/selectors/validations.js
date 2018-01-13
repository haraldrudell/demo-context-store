import get from 'lodash/get'
import set from 'lodash/set'
import union from 'lodash/union'
import { selectModel } from './models'
import { selectDirtyState } from './dirty-states'

export const storedValidators = {}

export const addValidator = (key, validationSchema) => {
    set(storedValidators, [key], validationSchema)
}

const defaultState = { isValid: true, fields: {} }

const getValidationErrors = (schema, reformProps) =>
    /*
        This is a re-implementation of https://github.com/davezuko/react-reformed/blob/49f36e3259e023587e28d3dec2400ac2b4431299/src/validateSchema.js
        That passes more context to the validation test function (specifically, the whole props object)
    */
    Boolean(reformProps.model)
        ? union(
              Object.keys(schema),
              Object.keys(reformProps.model),
          ).reduce((acc, key) => {
              const value = reformProps.model[key]
              const test = schema[key]

              let errors = []
              if (test) {
                  let error
                  test(
                      value,
                      emittedError => {
                          error = emittedError
                      },
                      reformProps,
                  )
                  errors = error ? (Array.isArray(error) ? error : [error]) : []
              }

              return {
                  ...acc,
                  isValid: !errors.length && acc.isValid,
                  fields: {
                      ...acc.fields,
                      [key]: {
                          isValid: !errors.length,
                          errors,
                      },
                  },
              }
          }, defaultState)
        : defaultState

export const selectValidation = dataKey => state => {
    const model = selectModel(dataKey)(state)
    const dirtyState = selectDirtyState(dataKey)(state)
    const validationSchema = get(storedValidators, dataKey, {})

    return getValidationErrors(validationSchema, {
        dirtyState,
        model,
    })
}



// WEBPACK FOOTER //
// ./app/libs/reform/src/selectors/validations.js