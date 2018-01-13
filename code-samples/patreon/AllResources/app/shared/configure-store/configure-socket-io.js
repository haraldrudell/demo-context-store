import io from 'socket.io-client'
import { REQUEST_SUCCESS_SUFFIX } from 'actions/request-action-types'
import parseJsonApiResponse from 'utilities/parse-json-api-response'
import { isJSONAPIPayload } from 'shared/middleware/prepare-json-api-response'

const emitSocketMsg = 'socket/EMIT_MSG'
export const EMIT_SOCKET_MSG = emitSocketMsg
// Add the request success suffix so that our API middleware parses this data as if it were json-api it is json-api
const receivedSocketMsg = `socket/RECEIVED_MSG${REQUEST_SUCCESS_SUFFIX}`
export const RECEIVED_SOCKET_MSG = receivedSocketMsg

const createSocketIoMiddleware = (inputSocket) => {
    const emitBound = inputSocket.emit.bind(inputSocket)
    return ({ dispatch }) => {
        // On receiving any event, dispatch RECEIVED_SOCKET_MSG with the event name and data
        inputSocket.on('*', (eventName, payload) => {
            dispatch({
                type: RECEIVED_SOCKET_MSG,
                event: eventName,
                payload: isJSONAPIPayload(payload) ? parseJsonApiResponse(payload) : payload
            })
        })

        // On any action of type EMIT_SOCKET_MSG, emit the event before continuing the action processing
        return next => action => {
            if (action.type && action.type === EMIT_SOCKET_MSG) {
                emitBound(action.event, action.payload)
                next(action)
            } else {
                next(action)
            }
        }
    }
}

const socketIoMiddleware = (socketHost) => {
    const socket = io(socketHost)

    // Patch socket to emit all events to '*' as well as their original names
    const originalOnEvent = socket.onevent
    socket.onevent = function (packet) {
        const args = packet.data || []
        originalOnEvent.call(this, packet)
        packet.data = ['*'].concat(args)
        originalOnEvent.call(this, packet)
    }

    return createSocketIoMiddleware(socket)
}

export default (socketHost) => {
    return {
        middleware: [ socketIoMiddleware(socketHost) ]
    }
}



// WEBPACK FOOTER //
// ./app/shared/configure-store/configure-socket-io.js