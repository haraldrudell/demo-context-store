import { getThemePrimitives } from 'styles/themes'

export default (props, propName, componentName) => {
    componentName = componentName || 'undefined'

    const theme = getThemePrimitives()
    const unitRange = theme.units.getRange()

    if (props[propName]) {
        const value = props[propName]
        if (typeof value !== 'number') {
            return new Error(`${propName} in ${componentName} must be a number.`)
        }

        if (value > unitRange.max || value < unitRange.min) {
            return new Error(`${propName} in ${componentName} invalid unit value (min: ${unitRange.min}, max: ${unitRange.max})`)
        }
    }
}



// WEBPACK FOOTER //
// ./app/utilities/validation/props/unit-range/index.js