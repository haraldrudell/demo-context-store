/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import axios from 'axios'

const jobsEndpoint = 'http://localhost:3001/api/jobs'
const baseUrl = ''//'http://localhost:3001'

export async function getJobs() {
  // {"data":{"jobs":[{"name":
  const resp = await axios.get(jobsEndpoint)
  const {jobs} = Object(Object(resp).data)
  if (Array.isArray(jobs)) return jobs
  throw new Error('Bad jobs response')
}

export function makeUrl(uri) {
  return `${baseUrl}${uri}`
}
