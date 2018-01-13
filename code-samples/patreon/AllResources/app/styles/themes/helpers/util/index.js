import map from 'lodash/map'
import get from 'lodash/get'
import { getThemePrimitives } from 'styles/themes'

export const generateDynamicHelperFunction = (namespace, methodName) => {
    return (...args) => props =>
        get(props.theme, namespace)[methodName](...args)
}

export const generateStaticHelperFunction = (namespace, propertyName) => {
    return () => props => get(props.theme, namespace)[propertyName]
}

const primitives = getThemePrimitives()
export const generateHelpers = namespace => {
    const helpers = {}

    map(get(primitives, namespace), (property, propertyName) => {
        if (typeof property === 'function') {
            helpers[propertyName] = generateDynamicHelperFunction(
                namespace,
                propertyName,
            )
        } else if (typeof property === 'object') {
            helpers[propertyName] = property
        } else {
            helpers[propertyName] = generateStaticHelperFunction(
                namespace,
                propertyName,
            )
        }
    })

    return helpers
}

export const generateComponentHelpers = () => {
    const output = {}
    map(primitives.components, (componentPrimitives, componentName) => {
        output[componentName] = generateHelpers(['components', componentName])
    })

    return output
}



// WEBPACK FOOTER //
// ./app/styles/themes/helpers/util/index.js