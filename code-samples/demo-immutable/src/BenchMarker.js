/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default class BenchMarker {
  constructor(constructions) {
    const names = constructions.map(o => o.name)
    const speeds = this.sortSpeeds(constructions)
    Object.assign(this, {constructions,names, speeds})
  }

  getFunctionNames() {
    return this.names
  }

  getFunctionByIndex(i) {
    const o = this.constructions[i]
    if (!o) throw new Error(`Constructions: Unknown constructions index: ${i}`)
    return o.f
  }

  sortSpeeds(constructions) {
    const speeds = constructions
      .map(({name, f}) => ({name, duration: f.getDuration(), f}))
      .sort((a, b) => a.duration < b.duration ? -1 : a.duration === b.duration ? 0 : 1)
    const minDuration = speeds[0].duration
    return {
      names: speeds.map(o => o.name),
      normalized: speeds.map(o => o.duration / minDuration),
      functions: speeds.map(o => o.f),
    }
  }

  getSpeedNames() {
    return this.speeds.names
  }

  getNormalizedSpeedByIndex(i) {
    const speed = this.speeds.normalized[i]
    if (speed == null) throw new Error(`Constructions: Unknown speed index: ${i}`)
    return speed
  }

  getSpeedFunctionByIndex(i) {
    const f = this.speeds.functions[i]
    if (f == null) throw new Error(`Constructions: Unknown speed index: ${i}`)
    return f
  }
}

