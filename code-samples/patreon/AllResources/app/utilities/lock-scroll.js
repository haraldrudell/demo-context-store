import getScrollbarWidth from 'scrollbar-width'

export function lockScroll () {
    const paddingRight = getScrollbarWidth(true)
    document.body.setAttribute('style', `
        overflow: hidden;
        -ms-touch-action: none;
        touch-action: none;
        padding-right: ${paddingRight}px;
    `)
}

export function unlockScroll () {
    document.body.setAttribute('style', '')
}



// WEBPACK FOOTER //
// ./app/utilities/lock-scroll.js