import { BuildSourceService } from 'services'

export const fetchBuildSourcePlans = async ({ formData, formProps }) => {
  const { accountId, appId } = formProps,
    { settingId } = formData

  let serviceId
  if (formProps.artifactType === 'ARTIFACTORY' || formProps.artifactType === 'NEXUS') {
    serviceId = formProps.serviceId
  }

  let streamType
  if (formProps.artifactType === 'AMAZON_S3') {
    streamType = formProps.artifactType
  }

  let repositoryType
  if (formProps.artifactType === 'ARTIFACTORY') {
    repositoryType = formData.repositoryType || formProps.repositoryType || 'any'
  }

  if (appId && settingId) {
    const { plans } = await BuildSourceService.fetchBuildSourcePlans({
      accountId,
      settingId,
      appId,
      serviceId,
      streamType,
      repositoryType
    })

    return plans instanceof Array ? plans : Object.keys(plans).map(key => ({ uuid: key, name: plans[key] }))
  }

  return []
}

export const fetchBuildSourceJobGroups = async ({ formData, formProps }) => {
  const { accountId, appId } = formProps,
    { settingId } = formData,
    jobName = formData.jobname

  let serviceId
  if (formProps.artifactType === 'ARTIFACTORY') {
    serviceId = formProps.serviceId
  }

  if (accountId && appId && settingId) {
    const { groups } = await BuildSourceService.fetchBuildSourceJobGroups({
      accountId,
      settingId,
      appId,
      serviceId,
      jobName
    })
    return groups.map((name, index) => ({ uuid: '' + name, name }))
  }

  return []
}

export const fetchBuildSourceRegions = async ({ formData, formProps }) => {
  const { accountId, appId } = formProps,
    { settingId } = formData

  let serviceId
  if (formProps.artifactType === 'ARTIFACTORY') {
    serviceId = formProps.serviceId
  }

  if (accountId && appId && settingId) {
    const { regions } = await BuildSourceService.fetchBuildSourceRegions({
      accountId,
      settingId,
      appId,
      serviceId
    })
    return Object.keys(regions).map(key => ({ uuid: key, name: regions[key] }))
  }

  return []
}

export const fetchBuildSourceJobs = async ({ formData, formProps }) => {
  const { accountId, appId, serviceId } = formProps,
    { settingId, parentJobName } = formData

  if (accountId && appId && serviceId && settingId) {
    const { jobs } = await BuildSourceService.fetchBuildSourceJobs({
      accountId,
      settingId,
      appId,
      serviceId,
      parentJobName
    })
    return {
      data: jobs,
      transformedData:
        jobs && jobs.length > 0
          ? jobs.map(j => ({ name: j.jobName, uuid: j.jobName }))
          : [{ name: 'No jobs are available', uuid: null }]
    }
  }

  return []
}

export const fetchBuildSourceJobPaths = async ({ formData, formProps }) => {
  const { appId } = formProps,
    { settingId, groupId } = formData,
    jobName = formData.jobname || formData.region

  let streamType
  if (formProps.artifactType === 'AMAZON_S3') {
    streamType = formProps.artifactType
  }

  if (appId && settingId && jobName) {
    const { paths } = await BuildSourceService.fetchBuildSourceJobPaths({
      jobName,
      appId,
      settingId,
      groupId,
      streamType
    })
    return paths
    /* {
      data: paths,
      transformedData:
        paths && paths.length > 0
          ? paths.map(p => ({ name: p, uuid: p }))
          : [{ name: 'No paths are available', uuid: null }]
          */
  }

  return []
}

export async function fetchRepositoryTypes () {
  return [{ name: 'Any (Generic, rpm, maven)', uuid: 'any' }, { name: 'Maven style only', uuid: 'maven' }]
}


// WEBPACK FOOTER //
// ../src/containers/ServiceDetailPage/forms/Shared/SharedDataProviders.js