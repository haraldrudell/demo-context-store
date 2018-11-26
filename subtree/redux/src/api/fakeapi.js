/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import data from 'src/server/data'
import { createJob } from 'src/server/transforms'
let debug = true
debug = debug

export const getSoftware = () => data.software
export const getHardware = () => data.hardware
export function createJob(o) {
  return post(createEndpoint, o)
}
export async function getJobs() {
  return data.jobs
}

export function setDebug(debug0) {
  debug = debug0
}
