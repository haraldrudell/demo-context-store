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

export async function getJobs() {
  // {"data":{"jobs":[{"name":
  const resp = await axios.get(jobsEndpoint)
  const {jobs} = Object(Object(resp).data)
  if (Array.isArray(jobs)) return jobs
  throw new Error('Bad jobs response')
}

export const getSoftware = () => getOptions(softwareEndpoint)
export const getHardware = () => getOptions(hardwareEndpoint)

export async function getOptions(endPoint) {
  // {"options":[{"label":
  const resp = await axios.get(endPoint)
  const {list} = Object(Object(resp).options)
  if (Array.isArray(list)) return list
  throw new Error(`Bad response from: ${endPoint}`)
}

export function makeUrl(uri) {
  return `${baseImageUrl}${uri}`
}
