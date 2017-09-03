/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/

import {
  DestinationUnreachableError,
  PacketTooBigError,
  ParameterProblemError,
  RedirectReceivedError,
  RequestTimedOutError,
  SourceQuenchError,
  TimeExceededError,
} from './PingSessionErrors'

import {Socket, default as raw} from 'raw-socket'

export * from './PingSessionErrors'

export default class PingSession extends Socket  {
  static NetworkProtocol = {
    IPv4: 'IPv4',
    IPv6: 'IPv6',
  }

  constructor ({networkProtocol, _debug, defaultTTL}) {
    super({
      addressFamily: networkProtocol === PingSession.NetworkProtocol.IPv6
        ? raw.AddressFamily.IPv6
        : raw.AddressFamily.IPv4,
      protocol: networkProtocol === PingSession.NetworkProtocol.IPv6
        ? raw.Protocol.ICMPv6
        : raw.Protocol.ICMP,
    })
    this.pingAddressFamily = networkProtocol === PingSession.NetworkProtocol.IPv6
      ? raw.AddressFamily.IPv6
      : raw.AddressFamily.IPv4
    this.pingLevel = this.pingAddressFamily === raw.AddressFamily.IPv6
      ? raw.SocketLevel.IPPROTO_IPV6
      : raw.SocketLevel.IPPROTO_IP
    this._pingDebug = !!_debug
    this.pingDefaultTTL = options.ttl > 0 ? Number(options.ttl) : 128
    this.pingRequests = {}
    this.pingPending = 0
    this.on('close', this.pingSocketClose)
    this.on('message', this.pingProcessMessage)
    this.pingSetTTL(this.pingDefaultTTL)
  }

  async pingHost({target, retries, timeout, packetSize}) {
    const request = new Request({
      target: String(target || ''),
      retries: retries >= 0 ? Number(retries) : 1,
      timeout: timeout >= 0 ? Number(timeout) : 2e3, // ms,
      packetSize: packetSize >= 8 ? Number(packetSize) : 8, // bytes + header 20 bytes
      onBeforeSocketSend: this.pingSetTTLFromRequest,
      onSocketSend: this.pingOnSocketSend,
      onTimeout: this.pingTimeout,
    })
    this.pingEnqueueRequest(request)
    return request.promise
  }

  pingEnqueueRequest(request) {
    request.buffer = this.getRequestBuffer(request)
    if (this._pingDebug) this._debugRequest (request.target, request)
    this.pingRequests[request.id] = request
    this.pingPending++
    this.pingSend(request)
  }

  pingSend(request) {
    if (this.recvPaused) this.resumeRecv() // Resume readable events if the raw socket is paused
    const {target, buffer, beforeSocketSend, afterSocketSend} = request
    this.send(buffer, 0, buffer.length, target, beforeSocketSend, afterSocketSend)
  }

  pingOnSocketSend = (request, error, bytes) => {
    if (!request.sent) request.sent = new Date()
    if (!error) request.setTimeout()
    else {
      this.pingRemoveRequest(request.id)
      request.reject(error)
    }
  }

  pingTimeout = request => {
    if (request.retries > 0) {
      request.retries--
      this.pingSend(request)
    } else {
      this.pingRemoveRequest(request.id)
      request.reject(new RequestTimedOutError('Request timed out'), request.target, request.sent, new Date())
    }
  }

  pingProcessMessage = (buffer, source) => {
    if (this._pingDebug) this._debugResponse(source, buffer)
    const request = this.getRequestFromBuffer(buffer)
    if (request) {
      /**
       ** If we ping'd ourself (i.e. 127.0.0.1 or ::1) then it is likely we
      ** will receive the echo request in addition to any corresponding echo
      ** responses.  We discard the request packets here so that we don't
      ** delete the request from the from the request queue since we haven't
      ** actually received a response yet.
      **/
      if (this.pingAddressFamily === raw.AddressFamily.IPv6) {
        if (request.type === 128) return
      } else if (request.type === 8) return

      this.pingRemoveRequest (request.id)
      if (this.pingAddressFamily === raw.AddressFamily.IPv6) {
        if (request.type === 1) request.callback (new DestinationUnreachableError(source), request.target, request.sent, new Date())
        else if (request.type === 2) request.callback (new PacketTooBigError(source), request.target, request.sent, new Date())
        else if (request.type === 3) request.callback (new TimeExceededError(source), request.target, request.sent, new Date ())
        else if (request.type == 4) request.callback (new ParameterProblemError(source), request.target, request.sent, new Date())
        else if (request.type == 129) request.callback (null, request.target, request.sent, new Date())
        else request.callback (new Error (`Unknown response type ${request.type} (source=${source})`), request.target, request.sent, new Date ())
      } else {
        if (request.type === 0) request.callback (null, request.target, request.sent, new Date())
        else if (request.type === 3) request.callback (new DestinationUnreachableError(source), request.target, request.sent, new Date())
        else if (request.type === 4) request.callback (new SourceQuenchError(source), request.target, request.sent, new Date())
        else if (request.type === 5) request.callback (new RedirectReceivedError(source), request.target, request.sent, new Date())
        else if (request.type == 11) request.callback (new TimeExceededError(source), request.target, request.sent, new Date())
        else request.callback(new Error (`Unknown response type ${request.type} (source=${source})`), request.target, request.sent, new Date())
      }
    }
  }

  close() {
    super.close()
    this.pingFlush()
    return this
  }

  pingSocketClose = () => this.pingFlush(new Error('Socket closed'))

  pingFlush(error) {
    for (id in this.pingRequests) {
      var request = this.pingRemoveRequest(id)
      var sent = request.sent ? request.sent : new Date()
      request.callback(error, request.target, sent, new Date())
    }
  }

  getRequestFromBuffer(buffer) {
    const {offset, type, code} = this.pingAddressFamily == raw.AddressFamily.IPv6
      ? this.parseIpv6Buffer(buffer)
      : this.parseIpv4Buffer(buffer)

    if (buffer.readUInt16BE(offset + 4) === this.sessionId) { // Response is for a request we generated
      buffer[offset + 4] = 0
      const id = buffer.readUInt16BE(offset + 6)
      const req = this.pingRequests[id]
      if (req) {
        req.type = type
        req.code = code
      }
    }
    return req
  }

  parseIpv4Buffer(buffer) {
    const result = {}
    // Need at least 20 bytes for an IP header, and it should be IPv4
    if (buffer.length >= 20 && (buffer[0] & 0xf0) === 0x40) {
      const ip_length = (buffer[0] & 0x0f) * 4 // The length of the IPv4 header is in mulitples of double words
      if (buffer.length - ip_length >= 8) { // ICMP header is 8 bytes, we don't care about the data for now
        const ip_icmp_offset = ip_length
        if (buffer.length - ip_icmp_offset >= 8) { // ICMP message not too short
          result.type = buffer.readUInt8(ip_icmp_offset)
          result.code = buffer.readUInt8(ip_icmp_offset + 1)
          // For error type responses the sequence and identifier cannot be
          // extracted in the same way as echo responses, the data part contains
          // the IP header from our request, followed with at least 8 bytes from
          // the echo request that generated the error, so we first go to the IP
          // header, then skip that to get to the ICMP packet which contains the
          // sequence and identifier.
          if (type === 3 || type === 4 || type === 5 || type === 11) {
            const ip_icmp_ip_offset = ip_icmp_offset + 8
            // Need at least 20 bytes for an IP header, and it should be IPv4
            if (buffer.length - ip_icmp_ip_offset >= 20 && (buffer[ip_icmp_ip_offset] & 0xf0) === 0x40) {
              const ip_icmp_ip_length = (buffer[ip_icmp_ip_offset] & 0x0f) * 4 // The length of the IPv4 header is in mulitples of double words
              if (buffer.length - ip_icmp_ip_offset - ip_icmp_ip_length >= 8) // ICMP message not too short
                result.offset = ip_icmp_ip_offset + ip_icmp_ip_length
            }
          } else result.offset = ip_icmp_offset
        }
      }
    }
    return result
  }

  parseIpv6Buffer(buffer) {
    // IPv6 raw sockets don't pass the IPv6 header back to us
    // We don't believe any IPv6 options will be passed back to us so we
    // don't attempt to pass them here.
    const result = {offset: 0}
    if (buffer.length >= 8) {
      result.type = buffer.readUInt8(offset)
      result.code = buffer.readUInt8(offset + 1)
    }
    return result
  }

  getRequestBuffer(request) {
    const buffer = new Buffer(this.pingPacketSize)

    // Since our buffer represents real memory we should initialise it to
    // prevent its previous contents from leaking to the network.
    for (let i = 8; i < this.pingPacketSize; i++) buffer[i] = 0
    const type = this.pingAddressFamily === raw.AddressFamily.IPv6 ? 128 : 8
    buffer.writeUInt8 (type, 0)
    buffer.writeUInt8 (0, 1)
    buffer.writeUInt16BE (0, 2)
    buffer.writeUInt16BE (this.sessionId, 4)
    buffer.writeUInt16BE (request.id, 6)
    raw.writeChecksum (buffer, 2, raw.createChecksum(buffer))
    return buffer
  }

  pingRemoveRequest(id) {
    const request = this.pingRequests[id]
    if (request) {
      request.clearTimeout()
      delete this.pingRequests[request.id]
      this.pingPending--
    }
    if (!this.pingPending && !this.recvPaused) this.pauseRecv()
    return request
  }

  pingSetTTLFromRequest = request => this.pingSetTTL(request.ttl || this.pingDefaultTTL)

  pingSetTTL(ttl) {
    if (ttl !== this.pingTTL) this.setOption(this.pingLevel, raw.SocketOption.IP_TTL, this.pingTTL = ttl)
  }

  _debugRequest = (target, req) => console.log (`request: addressFamily=${this.pingAddressFamily} target=${req.target} id=${req.id} buffer=${req.buffer.toString ('hex')}`)
  _debugResponse = (source, buffer) => console.log (`response: addressFamily=${this.pingAddressFamily} source=${source} buffer=${buffer.toString ('hex')}`)
}

export const NetworkProtocol = PingSession.NetworkProtocol
