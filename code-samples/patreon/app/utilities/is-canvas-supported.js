const isCanvasSupported = () => {
    const elem = document.createElement('canvas')
    return !!(elem.getContext && elem.getContext('2d'))
}

export default isCanvasSupported



// WEBPACK FOOTER //
// ./app/utilities/is-canvas-supported.js