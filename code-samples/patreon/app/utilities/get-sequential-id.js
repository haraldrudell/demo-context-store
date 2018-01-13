/*  Helper for maintaining incremental ids. You can create as many separate
counters as you want to prevent confusion, but it's up to you what to do with
the numbers (prefixes are recommended, like getOptimisticId below). */


function* _counter() {
    let index = 0
    while (index < Infinity) {
        yield ++index
    }
}

const optimisticIds = _counter()

const popoverIds = _counter()

export const optimisticId = () => `opt_${optimisticIds.next().value}`

export const popoverId = () => `${popoverIds.next().value}`



// WEBPACK FOOTER //
// ./app/utilities/get-sequential-id.js