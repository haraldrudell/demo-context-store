import forEach from 'lodash/forEach'
import set from 'lodash/set'

export const storedSelectors = {}

export const addSelector = (dataKey, selectorKey, selector) => {
    set(storedSelectors, [dataKey, selectorKey], selector)
}

// Call this method to add a dictionary of reducers by actionType to the reducers for a specific dataKey
export const addAllSelectors = (dataKey, selectorsByKey) => {
    forEach(selectorsByKey, (selector, selectorKey) => {
        addSelector(dataKey, selectorKey, selector)
    })
}



// WEBPACK FOOTER //
// ./app/libs/mallard/src/selectors/stored.js