import { camelizeKeys } from 'humps'

export const parseApiResponse = response => {
    return {
        entryRef: camelizeKeys(response),
    }
}

export default parseApiResponse



// WEBPACK FOOTER //
// ./app/libs/nion-modules/generic-patreon-api/parser/index.js