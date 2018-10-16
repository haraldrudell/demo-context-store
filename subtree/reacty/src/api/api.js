/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import axios from 'axios'

const baseUrl = 'http://localhost:3001'
const baseImageUrl = '' //baseUrl
const baseApiUrl = `${baseUrl}/api`
const jobsEndpoint = `${baseApiUrl}/jobs`
const softwareEndpoint = `${baseApiUrl}/software`
const hardwareEndpoint = `${baseApiUrl}/hardware`
const createEndpoint = `${baseApiUrl}/create`

async function get(url) {
  console.log(`GET ${url}`)
  const resp = await axios.get(url)
  return Object(Object(resp).data)
}

async function post(url, data) {
  console.log(`POST ${url}`)
  const resp = await axios.post(url, data)
  return Object(Object(resp).data)
}

export async function createJob(o) {
  return post(createEndpoint, o)
}

export async function getJobs() {
  // {"data":{"jobs":[{"name":
  const {jobs} = await get(jobsEndpoint)
  if (Array.isArray(jobs)) return jobs
  throw new Error('Bad jobs response')
}

export const getSoftware = () => getOptions(softwareEndpoint)
export const getHardware = () => getOptions(hardwareEndpoint)

async function getOptions(endPoint) {
  // {"options":[{"label":
  const {options} = await get(endPoint)
  if (Array.isArray(options)) return options
  throw new Error(`Bad response from: ${endPoint}`)
}

export function makeUrl(uri) {
  return `${baseImageUrl}${uri}`
}
