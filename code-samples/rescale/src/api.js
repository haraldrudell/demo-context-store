/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import axios from 'axios'

const url = 'http://localhost:3001/api/jobs'

export async function getJobs() {
  // {"data":{"jobs":[{"name":
  const resp = await axios.get(url)
  const {jobs} = Object(Object(resp).data)
  if (Array.isArray(jobs)) return jobs
  throw new Error('Bad jobs response')
}
