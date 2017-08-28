import Task from './Task'

export default class LoggingTask extends Task {
  async _begin() {
    console.log(`Starting: ${this.printable}`)
    return super._begin()
  }

  _end(result) {
    const v = super._end(result)
    console.log(`Completed ${v.printable}: ${v}`)
    return v
  }

  _skip(results) {
    const v = super._skip(results)
    console.log(`Skip ${v.printable}: ${v}`)
    return v
  }
}