import last from 'lodash/last'
import pick from 'lodash/pick'

function stackFileNames() {
    if (Error.captureStackTrace) {
        let orig = Error.prepareStackTrace
        Error.prepareStackTrace = function(_, stack) {
            return stack
        }
        let fakeError = new Error()
        Error.captureStackTrace(fakeError, stackFileNames)
        let stack = fakeError.stack
        Error.prepareStackTrace = orig
        return stack.map(stackElement => stackElement.getFileName())
    }
    const fakeError = new Error()
    if (fakeError && fakeError.stack) {
        // TODO: this regex isn't fully cross-browser. Safari, in particular, does not work.
        const matches = /.*@([^>\s]*\.[^>\s:]*)/.exec(fakeError.stack)
        if (matches) {
            return matches
        }
    }
    return []
}

const getSimpleFileName = fullFilePath => {
    const fileName = last(fullFilePath.split('/'))
    return fileName.split('.')[0]
}

const getCallerFile = () => {
    try {
        const fileNames = stackFileNames()
        while (fileNames) {
            const fileName = fileNames.shift()
            if (fileName) {
                const simpleFilename = getSimpleFileName(fileName)
                const blacklist = ['fixture', 'commons', 'manifest']
                if (blacklist.indexOf(simpleFilename) === -1) {
                    return fileName
                }
            } else {
                return fileName
            }
        }
    } catch (err) {
        console.error(err)
    }
    return undefined
}

const getFrozenBundleName = () => {
    try {
        return getSimpleFileName(getCallerFile())
    } catch (err) {
        console.error(err)
    }
    return undefined
}

export default source => {
    const frozenBundleName = getFrozenBundleName()

    source.printFixture = () => {
        const route =
            source.location.pathname +
            (source.location.search ? `?${source.location.search}` : '')

        const objectToPrint = {
            script: frozenBundleName,
            route,
            window: {
                location: pick(source.location, [
                    'hostname',
                    'pathname',
                    'href',
                    'search',
                    'query',
                ]),
                patreon: source.patreon,
            },
        }
        if (objectToPrint.window.patreon.csrfSignature) {
            objectToPrint.window.patreon.csrfSignature = 'nonce-csrf-signature'
        }

        return JSON.stringify(objectToPrint, undefined, 4)
    }
}



// WEBPACK FOOTER //
// ./app/utilities/test/fixture.js