/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import axios from 'axios'

const baseUrl = 'http://localhost:3000'
const baseApiUrl = `${baseUrl}/api`
const jobsEndpoint = `${baseApiUrl}/jobs`
const softwareEndpoint = `${baseApiUrl}/software`
const hardwareEndpoint = `${baseApiUrl}/hardware`
const createEndpoint = jobsEndpoint

let debug = true

export const getSoftware = () => getOptions(softwareEndpoint)
export const getHardware = () => getOptions(hardwareEndpoint)

export function setDebug(debug0) {
  debug = debug0
}

async function get(url) {
  debug && console.log(`GET ${url}`)
  const resp = await axios.get(url)
  return Object(Object(resp).data)
}

async function post(url, data) {
  debug && console.log(`POST ${url}`)
  const resp = await axios.post(url, data)
  return Object(Object(resp).data)
}

export function createJob(o) {
  return post(createEndpoint, o)
}

export async function getJobs() {
  // {"data":{"jobs":[{"name":
  const {jobs} = await get(jobsEndpoint)
  if (!Array.isArray(jobs)) throw new Error('Bad jobs response')
  return jobs
}

async function getOptions(endPoint) {
  // {"options":[{"label":
  const {options} = await get(endPoint)
  if (!Array.isArray(options)) throw new Error(`Bad response from: ${endPoint}`)
  return options
}
