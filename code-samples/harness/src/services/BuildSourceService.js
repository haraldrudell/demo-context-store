import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  buildSourcePlans: _ => 'build-sources/plans',
  buildSourceJobs: _ => 'build-sources/jobs',
  buildSourceJobPaths: ({ jobName }) => `build-sources/jobs/${encodeURIComponent(jobName)}/paths`,
  buildSourceJobGroups: ({ jobName }) => `build-sources/jobs/${encodeURIComponent(jobName)}/groupIds`,
  buildSourceRegions: _ => 'awshelper/regions'
})

export async function fetchBuildSourcePlans ({ accountId, appId, settingId, serviceId, streamType, repositoryType }) {
  // endpoints.buildSourcePlans(path,query)
  const url = endpoints.buildSourcePlans({}, { accountId, appId, settingId, serviceId, streamType, repositoryType })

  const { error, resource } = await dataService.makeRequest(url)

  return { plans: resource, error }
}

export async function fetchBuildSourceJobGroups ({ jobName, accountId, appId, settingId, serviceId }) {
  // endpoints.buildSourceJobPaths(path,query)
  const url = endpoints.buildSourceJobGroups({ jobName }, { accountId, appId, settingId, serviceId })

  const { error, resource } = await dataService.makeRequest(url)

  return { groups: resource, error }
}

export async function fetchBuildSourceJobs ({ accountId, appId, settingId, serviceId, parentJobName }) {
  // endpoints.buildSourceJobs(path,query)
  const url = endpoints.buildSourceJobs({}, { accountId, appId, settingId, serviceId, parentJobName })

  const { error, resource } = await dataService.makeRequest(url)

  return { jobs: resource, error }
}

export async function fetchBuildSourceJobPaths ({
  jobName,
  accountId,
  appId,
  settingId,
  serviceId,
  groupId,
  streamType
}) {
  // endpoints.buildSourceJobPaths(path,query)
  const url = endpoints.buildSourceJobPaths(
    { jobName },
    { accountId, appId, settingId, serviceId, groupId, streamType }
  )

  const { error, resource } = await dataService.makeRequest(url)

  return { paths: resource, error }
}

export async function fetchBuildSourceRegions ({ accountId }) {
  // endpoints.buildSourceJobPaths(path,query)
  const url = endpoints.buildSourceRegions({}, { accountId })

  const { error, resource } = await dataService.makeRequest(url)

  return { regions: resource, error }
}


// WEBPACK FOOTER //
// ../src/services/BuildSourceService.js