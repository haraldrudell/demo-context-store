import exists from 'utilities/exists'


export default (thing) => {
    if (Array.isArray(thing)) return thing
    if (!exists(thing)) return []
    return [thing]
}



// WEBPACK FOOTER //
// ./app/utilities/ensure-array.js