import get from 'lodash.get'

import _ErrorClass from './error'
import * as _pagination from './pagination'
import _parser from './parser'
import * as _request from './request'

export const isJsonApi = object => {
    return !!get(object, 'data')
}
export const ErrorClass = _ErrorClass
export const pagination = _pagination
export const parser = _parser
export const request = _request

export default {
    isJsonApi,
    ErrorClass: _ErrorClass,
    pagination: _pagination,
    parser: _parser,
    request: _request,
}



// WEBPACK FOOTER //
// ./app/libs/nion-modules/json-api/index.js