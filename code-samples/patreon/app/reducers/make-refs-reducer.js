import mapOrCall from 'utilities/map-or-call'
import boundReducer from 'reducers/bound-reducer'


export const REF_REDUCER_INITIAL_STATE = { _fetchedAt: null }

const _validateModelFetchedAt = (model, modelRef) => {
    let errorMessage = null
    if (!model || (modelRef._fetchedAt && (model._fetchedAt !== modelRef._fetchedAt))) {
        errorMessage = `_fetchedAt timestamp of ${modelRef.type} ${modelRef.id} reference and model did not match!`
        if (modelRef._fetchedAt > model._fetchedAt) {
            errorMessage += ` REFERENCE is more recent. Are you missing data in your response, or updating your reducer too often?`
        } else {
            errorMessage += ` MODEL is more recent. Do you need to notify your reducer?`
        }
        console.warn(errorMessage)
    }
}

const getModelCb = (denormalized) => (modelRef) => {
    const model = (denormalized[modelRef.type] || {})[modelRef.id]
    if (model && process.env.NODE_ENV !== 'production') {
        _validateModelFetchedAt(model, modelRef)
    }
    return model
}

export const getModelsFromRef = (denormalized, refOrRefs) => {
    if (!refOrRefs) {
        refOrRefs = {}
    }
    const finalRef = mapOrCall(refOrRefs, getModelCb(denormalized)) || {}
    finalRef._fetchedAt = refOrRefs._fetchedAt
    finalRef.meta = refOrRefs.meta
    finalRef.links = refOrRefs.links
    return finalRef
}

export const makeRefsCollectionReducer = (modelType, updatingActionTypes) => {
    const initialState = []
    initialState.type = modelType
    initialState._fetchedAt = null

    return boundReducer(updatingActionTypes, initialState)
}

/* state = one or a collection of of models / modelRefs (models can be used as modelRefs).*/
export const refreshModelsReducer = (state, action) => getModelsFromRef(action.meta.nextDataState, state)



// WEBPACK FOOTER //
// ./app/reducers/make-refs-reducer.js