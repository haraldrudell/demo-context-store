export default class Result {
  constructor(v) {
    if (!v || v.isFailure) {
      this.isFailure = true
      this.message = v && v.message || 'Failure'
    } else if (v && v.message) this.message = v.message
  }
  toString() {
    return this.message
  }
}

export class Skip extends Result {
  constructor(o) {
    super(o)
    this.isSkip = true
    this.message = Array.isArray(o.results)
      ? `Skipped due to failures: ${o.results.filter(v => v.isFailure).map(v => v.printable).join(', ')}`
      : 'Skipped'
  }
}