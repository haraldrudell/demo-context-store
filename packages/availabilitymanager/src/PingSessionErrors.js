/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/

export class PingError extends Error {}

export class PacketTooBigError extends PingError {
  constructor(source) {
    super(`Packet too big (source=${source})`)
    this.source = source
  }
}

export class DestinationUnreachableError extends PingError {
  constructor(source) {
    super(`Destination unreachable (source=${source})`)
    this.source = source
  }
}

export class ParameterProblemError extends PingError {
  constructor(source) {
    super(`Parameter problem (source=${source})`)
    this.source = source
  }
}

export class RedirectReceivedError extends PingError {
  constructor(source) {
    super(`RedirectReceivedError (source=${source})`)
    this.source = source
  }
}

export class RequestTimedOutError extends PingError {
  constructor() {
    super('RequestTimedOutError')
  }
}

export class SourceQuenchError extends PingError {
  constructor(source) {
    super(`Source quench (source=${source})`)
    this.source = source
  }
}

export class TimeExceededError extends PingError {
  constructor(source) {
    super(`Time exceeded (source=${source})`)
    this.source = source
  }
}
