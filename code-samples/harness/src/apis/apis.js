/* eslint-disable */
/* disable eslint to avoid long url errors */
import dataService from 'apis/dataService'
import AppStorage from '../components/AppStorage/AppStorage'

const ARTIFACTS_FETCH_LIMIT = 1000

// --- APP

const fetchCatalogs = () => {
  return dataService.list('catalogs').catch(error => {
    throw error
  })
}

const fetchOneApp = appId => {
  const _url = appId ? 'apps/' + appId : 'apps'
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const fetchAllApps = (acctId, filter = '') => {
  const _url = `apps?accountId=${acctId}`
  return dataService.list(_url + filter).catch(error => {
    throw error
  })
}

// --- APPLICATIONS OVERVIEW

const getExecutionsEndPoint = (appId, filter) => {
  return `executions?appId=${appId}` + (filter ? `&${filter}` : '')
}

// --- APP CONTAINERS
const getAppContainersEndpoint = (acctId, id, isDownload = false) => {
  let endpoint = 'app-containers' + (id ? '/' + id : '')
  endpoint += isDownload ? '/download' : ''
  return `${endpoint}?accountId=${acctId}`
}

const fetchAppContainers = acctId => {
  return dataService.list(getAppContainersEndpoint(acctId)).catch(error => {
    throw error
  })
}

// -- ARTIFACTS

const getArtifactEndPoint = (appId, id) => {
  const _url = id ? `artifacts/${id}` : 'artifacts'
  return _url + '?appId=' + appId
}

const fetchServiceArtifactStreamDataForDeployment = (appId, serviceIdArr) => {
  const url = getArtifactStreamsEndPoint(appId)
  const filter = '&search[1][field]=serviceIds&search[1][op]=IN'
  return dataService.list(url + filter).catch(error => {
    throw error
  })
}
const fetchArtifacts = (appId, envId, envObj, serviceId, serviceIdArr, searchFilter = null) => {
  let url = getArtifactEndPoint(appId)

  if (envId) {
    // for PROD, only use status=APPROVED
    // for nonPROD, use &status=READY or APPROVED or REJECTED
    url += `&envId=${envId}`
    let filter = '&search[0][field]=status&search[0][op]=IN'
    if (envObj && envObj.environmentType === 'PROD') {
      filter += '&search[0][value]=APPROVED'
    } else {
      filter += '&search[0][value]=READY&search[0][value]=APPROVED&search[0][value]=REJECTED'
      filter += '&search[0][value]=WAITING&search[0][value]=QUEUED&search[0][value]=RUNNING'
    }
    if (serviceId) {
      filter += `&services=${serviceId}`
    }
    if (serviceIdArr && Array.isArray(serviceIdArr) && serviceIdArr.length > 0) {
      filter += '&search[1][field]=serviceIds&search[1][op]=IN'
      for (const serviceId of serviceIdArr) {
        filter += '&search[1][value]=' + serviceId
      }
    }
    if (searchFilter) {
      filter += `&search[2][field]=metadata.buildNo&search[2][op]=STARTS_WITH&search[2][value]=${searchFilter}`
    }
    /*
      increased the limit to 200,by default it is 50
      backend asked to add this to increase to 200
    */
    if (filter) {
      filter += '&limit=' + ARTIFACTS_FETCH_LIMIT
    }
    url += filter
  }
  return dataService.list(url)
}

const fetchArtifactsForPipeLines = (appId, serviceIdArr, searchFilter = null) => {
  let url = getArtifactEndPoint(appId)
  let filter = '&search[0][field]=status&search[0][op]=IN'
  filter += '&search[0][value]=READY&search[0][value]=APPROVED&search[0][value]=REJECTED'
  if (serviceIdArr && Array.isArray(serviceIdArr) && serviceIdArr.length > 0) {
    filter += '&search[1][field]=serviceIds&search[1][op]=IN'
    for (const serviceId of serviceIdArr) {
      filter += '&search[1][value]=' + serviceId
    }
    if (searchFilter) {
      filter += `&search[2][field]=metadata.buildNo&search[2][op]=STARTS_WITH&search[2][value]=${searchFilter}`
    }
    url += `${filter}&limit=${ARTIFACTS_FETCH_LIMIT}`
  }
  return dataService.list(url)
}

// --- SERVICES
const getServiceEndpoint = (appId, id) => {
  const endpoint = 'services' + (id ? '/' + id : '')
  return appId ? `${endpoint}?appId=${appId}` : endpoint
}

const getServiceContainerEndpoint = (appId, serviceId, action, advanced) => {
  const endpoint = 'services/' + serviceId + '/containers/' + action + '?'
  let url = appId ? `${endpoint}&appId=${appId}` : endpoint
  url += advanced ? '&advanced=true' : ''
  return url
}

const updateContainerTasks = (appId, serviceId, taskId, advanced) => {
  let url = 'services/' + serviceId + '/containers/tasks/' + taskId + `?appId=${appId}`
  url += advanced ? '&advanced=true' : ''
  return url
}

const fetchServiceContainerTasks = (appId, serviceId) => {
  return dataService.list(getServiceContainerEndpoint(appId, serviceId, 'tasks')).catch(error => {
    throw error
  })
}

const fetchServiceContainerTaskStencils = (appId, serviceId) => {
  return dataService.list(getServiceContainerEndpoint(appId, serviceId, 'tasks/stencils')).catch(error => {
    throw error
  })
}

const fetchAWSLambdaSpecs = (appId, serviceId) => {
  let url = `/services/${serviceId}/lambda-specifications`
  url += `?appId=${appId}`
  return dataService.list(url).catch(error => {
    throw error
  })
}

const fetchServices = appId => {
  return dataService.list(getServiceEndpoint(appId)).catch(error => {
    throw error
  })
}

const fetchService = (appId, serviceId) => {
  return dataService.list(getServiceEndpoint(appId, serviceId)).catch(error => {
    throw error
  })
}

// --- CONFIGS

const getConfigEndpoint = (appId, entityId, id, entityType = 'SERVICE') => {
  const endpoint = 'configs' + (id ? '/' + id : '')
  return entityId ? `${endpoint}?appId=${appId}&entityId=${entityId}&entityType=${entityType}` : endpoint
}

const getConfigDownloadUrl = (appId, uuid, version) => {
  let _url = `configs/${uuid}/download?appId=${appId}`
  _url += version ? `&version=${version}` : ''
  return _url
}

// --- COMMANDS

const getCommandEndPoint = (appId, serviceId, commandName) => {
  return `/services/${serviceId}/commands/${commandName}?appId=${appId}`
}

// --- DEPLOYMENTS / EXECUTIONS
const fetchOrchestrations = (appId, envId) => {
  let _url = `orchestrations?appId=${appId}`
  _url += envId ? `&envId=${envId}` : ''
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const getOrchestrationEndpoint = (appId, id, version) => {
  const endpoint = 'orchestrations' + (id ? '/' + id : '')
  const _url = `${endpoint}?appId=${appId}`
  return version ? `${_url}&version=${version}` : _url
}

const fetchWorkflow = (appId, id, version) => {
  return dataService.list(getOrchestrationEndpoint(appId, id, version)).catch(error => {
    throw error
  })
}

const fetchStencils = appId => {
  return dataService.list(`workflows/stencils?appId=${appId}`).catch(error => {
    throw error
  })
}

const fetchOrchestrationStencils = (appId, workflowId, phaseId) => {
  let _url = `workflows/stencils?appId=${appId}&workflowId=${workflowId}`
  if (phaseId !== undefined) {
    _url += `&phaseId=${phaseId}`
  }
  return dataService.list(_url).catch(error => {
    throw error
  })
}

// --- WORKFLOWS (NEW)

const getWorkflowEndpoint = (appId, id, action, idForAction) => {
  const endpoint =
    'workflows' + (id ? '/' + id : '') + (action ? '/' + action : '') + (idForAction ? '/' + idForAction : '')
  let _url = `${endpoint}?appId=${appId}`
  _url += '&sort[0][field]=createdAt&sort[0][direction]=DESC'
  return _url
}

const getWorkflowPhaseEndpoint = (appId, workflowId, phaseId, action) => {
  const endpoint = `workflows/${workflowId}/phases` + (phaseId ? '/' + phaseId : '') + (action ? '/' + action : '')
  const _url = `${endpoint}?appId=${appId}`
  return _url
}

const fetchWorkflows = (appId, envId) => {
  let _url = `/workflows?appId=${appId}&previousExecutionsCount=2`
  _url += envId ? `&envId=${envId}` : ''
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const fetchWorkflowById = (appId, id, version) => {
  const _url = getWorkflowEndpoint(appId, id) + (version ? `&version=${version}` : '')
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const updateWorkflowPreDeploy = (appId, id, data) => {
  return dataService
    .fetch(getWorkflowEndpoint(appId, id, 'pre-deploy'), {
      method: 'PUT',
      body: data
    })
    .catch(error => {
      throw error
    })
}

const updateWorkflowPostDeploy = (appId, id, data) => {
  return dataService
    .fetch(getWorkflowEndpoint(appId, id, 'post-deploy'), {
      method: 'PUT',
      body: data
    })
    .catch(error => {
      throw error
    })
}

const updateWorkflowNotifications = (appId, id, data) => {
  return dataService
    .fetch(getWorkflowEndpoint(appId, id, 'notification-rules'), {
      method: 'PUT',
      body: data
    })
    .catch(error => {
      throw error
    })
}

const updateWorkflowFailureStrategies = (appId, id, data) => {
  return dataService
    .fetch(getWorkflowEndpoint(appId, id, 'failure-strategies'), {
      method: 'PUT',
      body: data
    })
    .catch(error => {
      throw error
    })
}

const updateSubworkflowNode = (appId, workflowId, subworkflowId, nodeId, data) => {
  return dataService
    .fetch(getWorkflowEndpoint(appId, workflowId, 'nodes', nodeId) + '&subworkflowId=' + subworkflowId, {
      method: 'PUT',
      body: data
    })
    .catch(error => {
      throw error
    })
}

// --- DEPLOYMENT DETAILS (PLAY BACK)

const getExecutionEndpoint = (appId, envId, execId, fromTimestamp, offset) => {
  let _url = (execId ? 'executions/' + execId : 'executions') + '?limit=10'
  _url += offset ? `&offset=${offset}` : ''
  _url += appId ? '&appId=' + appId : ''
  _url += envId ? '&envId=' + envId : ''
  if (fromTimestamp) {
    _url += `&search[0][field]=createdAt&search[0][op]=GT&search[0][value]=${fromTimestamp}`
  } else {
    _url += '&sort[0][field]=createdAt&sort[0][direction]=DESC'
  }
  return _url
}

// type: PAUSE_ALL, RESUME_ALL, ABORT_ALL
const interruptWorkflow = (appId, envId, execId, type) => {
  return dataService
    .fetch(getExecutionEndpoint(appId, envId, execId), {
      method: 'PUT',
      body: {
        executionInterruptType: type
      }
    })
    .catch(error => {
      throw error
    })
}

// --- SERVICE INSTANCES

const getInstancesEndpoint = (appId, envId, serviceId) => {
  const url = `service-instances?appId=${appId}&envId=${envId}`
  return url + (serviceId ? `&serviceId=${serviceId}` : '')
}

const fetchInstances = (appId, envId, serviceId) => {
  return dataService.list(getInstancesEndpoint(appId, envId, serviceId))
}

// --- SERVICE TEMPLATES

const getServiceTemplatesEndpoint = (appId, envId, id) => {
  const endpoint = 'service-templates' + (id ? '/' + id : '')
  return envId ? `${endpoint}?appId=${appId}&envId=${envId}` : endpoint
}

const getServiceTemplatesByServiceEndpoint = (appId, envId, serviceId) => {
  const endpoint = `service-templates?appId=${appId}&envId=${envId}`
  return endpoint + `&serviceId=${serviceId}`
}

// --- NOTIFICATION

const getNotificationEndpoint = (appId, acctId, notificationId, action, filter) => {
  let _url = 'notifications'
  if (notificationId && action) {
    _url += `/${notificationId}/action/${action}`
  }

  if (appId) {
    _url += `?appId=${appId}&accountId=${acctId}` + (filter ? '&' + filter : '')
  } else {
    _url += `?accountId=${acctId}&${filter}`
  }
  return _url
}

const fetchTaskNotifications = (appId, acctId, filter) => {
  const _url = getNotificationEndpoint(appId, acctId, null, null, filter)
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const fetchNotificationCounters = appId => {
  const accountId = AppStorage.get('acctId')
  let _url = 'statistics/notification-count?'
  _url += accountId ? '&accountId=' + accountId : ''
  _url += appId ? '&appId=' + appId : ''
  return dataService.list(_url).catch(error => {
    throw error
  })
}

// --- NOTIFICATION-SETUP

const getNotificationSetupEndpoint = (action, id) => {
  const accountId = AppStorage.get('acctId')
  const _url = 'notification-setup/' + action + (id ? '/' + id : '') + '?accountId=' + accountId
  return _url
}

const fetchNotificationGroups = appId => {
  return dataService.list(getNotificationSetupEndpoint('notification-groups')).catch(error => {
    throw error
  })
}

const addNotificationGroup = data => {
  return dataService
    .fetch(getNotificationSetupEndpoint('notification-groups'), {
      method: 'POST',
      body: data
    })
    .catch(error => {
      throw error
    })
}

const updateNotificationGroup = (data, id) => {
  return dataService
    .fetch(getNotificationSetupEndpoint('notification-groups', id), {
      method: 'PUT',
      body: data
    })
    .catch(error => {
      throw error
    })
}

const deleteNotificationGroup = id => {
  return dataService
    .fetch(getNotificationSetupEndpoint('notification-groups', id), {
      method: 'DELETE'
    })
    .catch(error => {
      throw error
    })
}

// --- HISTORY

const getHistoryEndPoint = (appId, id) => {
  const _url = id ? `history/${id}` : 'history'
  return _url + `?appId=${appId}`
}

const fetchHistory = (appId, id) => {
  return dataService.list(getHistoryEndPoint(appId, id)).catch(error => {
    throw error
  })
}

// --- RELEASES
const fetchReleases = appId => {
  return dataService.list('releases?overview=true&limit=3&appId=' + appId).catch(error => {
    throw error
  })
}

// --- STATISTICS

const getStatisticsEndpoint = (appId, statistic, filter = '') => {
  const accountId = AppStorage.get('acctId')

  let url = `statistics/${statistic}?`
  url += accountId ? `accountId=${accountId}&` : ''
  url += appId ? `appId=${appId}&${filter}` : `${filter}`
  return url
}

const fetchStatistics = (statistic, filter = '') => {
  return dataService.list(getStatisticsEndpoint(null, statistic, filter)).catch(error => {
    throw error
  })
}

// --- EXECUTIONS
const fetchExecutions = appId => {
  const url = 'executions' + (appId ? '?appId=' + appId : '')
  return dataService.list(url).catch(error => {
    throw error
  })
}

const fetchExecutionsByTimeRange = (appId, startTime, endTime) => {
  const accountId = AppStorage.get('acctId')
  let url = `executions?accountId=${accountId}`
  url += appId ? (appId.indexOf('appId') === -1 ? `&appId=${appId}&` : appId) : ''
  url +=
    '&search[0][field]=createdAt' +
    '&search[0][op]=GT&search[0][value]=' +
    startTime +
    '&search[1][field]=createdAt&search[1][op]=LT&search[1][value]=' +
    endTime +
    '&sort[0][field]=createdAt&sort[0][direction]=DESC' +
    '&limit=100'
  return dataService.list(url).catch(error => {
    throw error
  })
}

// --- ORG SETTINGS
const getSettingsEndpoint = (appId, acctId, id, isPluginSetting, category) => {
  const endpoint = 'settings' + (id ? '/' + id : '')
  // let _url = (isPluginSetting) ? `${endpoint}?isPluginSetting=true` : `${endpoint}?isPluginSetting=false`
  let _url = isPluginSetting ? `${endpoint}?isPluginSetting=true` : `${endpoint}?`
  _url += category ? `&category=${category}` : ''
  _url += acctId ? `&accountId=${acctId}` : ''
  _url += appId ? `&appId=${appId}` : ''
  return _url
}

const getSettingsUploadEndpoint = (appId, acctId, isPluginSetting, data) => {
  const endpoint = 'settings/upload'
  let _url = isPluginSetting ? `${endpoint}?isPluginSetting=true` : `${endpoint}?isPluginSetting=false`
  _url += acctId ? `&accountId=${acctId}` : ''
  _url += appId ? `&appId=${appId}` : ''
  return _url
}

const editGCPUploadEndPoint = (attrId, appId, acctId) => {
  let endpoint = 'settings' + ('/' + attrId + '/upload/?')
  endpoint += acctId ? `&accountId=${acctId}` : ''
  endpoint += appId ? `&appId=${appId}` : ''
  return endpoint
}
const fetchOrgSettings = (appId, acctId, id) => {
  if (acctId === undefined) {
    acctId = AppStorage.get('acctId')
  }
  return dataService.list(getSettingsEndpoint(appId, acctId, id, null, 'SETTING')).catch(error => {
    throw error
  })
}

const fetchOrgConnectors = (appId, acctId, id) => {
  const endpoint = 'settings' + (id ? '/' + id : '')
  // let _url = (isPluginSetting) ? `${endpoint}?isPluginSetting=true` : `${endpoint}?isPluginSetting=false`
  let _url = `${endpoint}?`
  _url += acctId ? `&accountId=${acctId}` : ''
  _url += appId ? `&appId=${appId}` : ''
  // _url += (category ? `&category=${category}` : '')
  _url += '&search[0][field]=category&search[0][op]=IN'
  _url += '&search[0][value]=CLOUD_PROVIDER&search[0][value]=CONNECTOR'

  return dataService.list(_url).catch(error => {
    throw error
  })
}

const fetchInstalledSettingSchema = () => {
  const accountId = AppStorage.get('acctId')
  const _url = 'plugins/' + accountId + '/installed/settingschema'

  return dataService.list(_url).catch(error => {
    throw error
  })
}

// -- ACTIVITIES
const getActivitiesEndpoint = (appIds, accountId) => {
  let _url = `/activities?accountId=${accountId}&`

  if (appIds.length > 0) {
    let appIdString = ''
    appIds.forEach(id => {
      appIdString += `appId=${id}&`
    })

    _url += appIdString
    _url = _url.slice(0, -1)
  }
  return _url
}

const getStateExecutionEndPoint = (appId, envId, executionId, stateExecutionId) => {
  return `executions/${executionId}/node/${stateExecutionId}?appId=${appId}&envId=${envId}`
}

const fetchActivitiesData = (appIds, accountId) => {
  return dataService.list(getActivitiesEndpoint(appIds, accountId)).catch(error => {
    throw error
  })
}

const fetchRecentFailures = appId => {
  const accountId = AppStorage.get('acctId')

  let _url = 'activities?status=FAILED'
  _url += accountId ? '&accountId=' + accountId : ''
  _url += appId ? '&appId=' + appId : ''
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const fetchDashboardActivities = filter => {
  const accountId = AppStorage.get('acctId')
  let _url = 'activities?'
  _url += accountId ? 'accountId=' + accountId : '&'
  _url += filter ? filter : ''
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const fetchDashboardExecutions = () => {
  const accountId = AppStorage.get('acctId')
  let _url = 'executions?includeGraph=false'
  _url += accountId ? '&accountId=' + accountId : ''
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const fetchInstanceActivities = (appId, envId, serviceInstanceId) => {
  const url = getActivitiesEndpoint(appId, envId) + '&limit=5&serviceInstanceId=' + serviceInstanceId
  return dataService.list(url).catch(error => {
    throw error
  })
}

const fetchInstanceArtifacts = (appId, envId, serviceInstanceId) => {
  const url =
    getActivitiesEndpoint(appId, envId) +
    '&search[0][field]=artifactId&search[0][op]=EXISTS&limit=5&serviceInstanceId=' +
    serviceInstanceId
  return dataService.list(url).catch(error => {
    throw error
  })
}

// -- BUILD SOURCE
const getSettingsConfigEndpoint = (appId, settingsType) => {
  const accountId = AppStorage.get('acctId')
  return `settings?accountId=${accountId}&type=${settingsType}`
}

const getBuildSourceJobsEndpoint = (appId, jobName, action, settingId, groupId) => {
  let _url = `build-sources/jobs/${jobName}/${action}?appId=${appId}&settingId=${settingId}`
  // groupId may have '/' at the end (ex: "/org/apache/"), Chrome will remove it => fix: add 1 extra '&' to the end
  _url += groupId ? '&groupId=' + groupId + '&' : ''
  return _url
}

const getBuildSourcePlansEndpoint = (appId, settingId, serviceId) => {
  if (serviceId) {
    return `build-sources/plans?appId=${appId}&settingId=${settingId}&serviceId=${serviceId}`
  }
  return `build-sources/plans?appId=${appId}&settingId=${settingId}`
}

const getBuildSourcePlansWithStreamTypeEndpoint = (appId, settingId, streamType) => {
  return `build-sources/plans?appId=${appId}&settingId=${settingId}&streamType=${streamType}`
}

const getJenkinsBuildJobsEndPoint = (appId, settingId, parentJobName) => {
  if (!parentJobName) {
    return `build-sources/jobs?appId=${appId}&settingId=${settingId}`
  } else {
    return `build-sources/jobs?appId=${appId}&settingId=${settingId}&parentJobName=${parentJobName}`
  }
}

const getBuildSourcePathsEndPoint = (appId, jobName, settingId) => {
  const url = `build-sources/jobs/${jobName}/paths?appId=${appId}&settingId=${settingId}`
  return url
}

const getBuildSourcePathsWithStreamTypeEndPoint = (appId, jobName, settingId, streamType) => {
  const url = `build-sources/jobs/${jobName}/paths?appId=${appId}&settingId=${settingId}&streamType=${streamType}`
  return url
}

const getBuildNumbersEndPoint = (appId, artifactStreamId, sourceSettingId) => {
  return (
    'build-sources/builds?' +
    'appId=' +
    appId +
    '&artifactStreamId=' +
    artifactStreamId +
    '&settingId=' +
    sourceSettingId
  )
}

const fetchBuildSourceTypes = (appId, serviceId) => {
  return dataService.list(`artifactstreams/buildsource-types?appId=${appId}&serviceId=${serviceId}`).catch(error => {
    throw error
  })
}

// -- Registration
const getRegisterVerifyEndPoint = token => {
  return '/users/verify/' + token
}

const fetchSuggestedAccountName = currentAccountName => {
  return dataService.list(`users/account-name/${currentAccountName}`).catch(error => {
    throw error
  })
}

const verifyEmail = email => {
  const _url = 'users/verify-email?email=' + email
  return dataService.list(_url).catch(error => {
    throw error
  })
}

// -- Tags
const getTagsEndpoint = (appId, envId) => {
  return appId ? 'tags?appId=' + appId + '&envId=' + envId : 'tags'
}
const fetchTagsData = (appId, envId) => {
  return dataService.list(getTagsEndpoint(appId, envId)).catch(error => {
    throw error
  })
}

const getAllHostsEndpoint = (appId, envId) => {
  return envId ? `hosts?appId=${appId}&envId=${envId}` : `hosts?appId=${appId}`
}

const fetchAllHosts = (appId, envId) => {
  return dataService.list(getAllHostsEndpoint(appId, envId)).catch(error => {
    throw error
  })
}

const getEnvironmentEndPoint = (appId, envId) => {
  const _url = envId ? `environments/${envId}` : 'environments'
  return _url + '?appId=' + appId
}

const fetchEnv = (appId, envId) => {
  return dataService.list(getEnvironmentEndPoint(appId, envId)).catch(error => {
    throw error
  })
}

const fetchServiceTemplates = (appId, envId, id) => {
  return dataService.list(getServiceTemplatesEndpoint(appId, envId, id)).catch(error => {
    throw error
  })
}
const fetchServiceTemplatesByService = (appId, envId, serviceId) => {
  return dataService.list(getServiceTemplatesByServiceEndpoint(appId, envId, serviceId)).catch(error => {
    throw error
  })
}

const fetchClassicLoadBalancers = (appId, region, computeProviderId) => {
  let _url = `/infrastructure-mappings/compute-providers/${computeProviderId}/classic-load-balancers`
  _url += '?appId=' + appId + '&region=' + region
  return dataService.list(_url)
}

// -- INFRASTRUCTURE

const fetchInfrastructures = (filter = '') => {
  return dataService.list(`infrastructures?${filter}`).catch(error => {
    throw error
  })
}

// -- PIPELINES

const fetchPipelines = appId => {
  return dataService.list(`pipelines?appId=${appId}`).catch(error => {
    throw error
  })
}

const fetchPipelineServices = (appId, pipelineId) => {
  const accountId = AppStorage.get('acctId')
  return dataService
    .list(`pipelines/${pipelineId}?accountId=${accountId}&appId=${appId}&withServices=true`)
    .catch(error => {
      throw error
    })
}

const fetchPipelineExecutions = appId => {
  const accountId = AppStorage.get('acctId')
  let _url = 'pipelines/executions?'
  _url += accountId ? '&accountId=' + accountId : ''
  _url += appId ? '&appId=' + appId : ''
  return dataService.list(_url).catch(error => {
    throw error
  })
}
const fetchDashboardPipelineExecutions = () => {
  const acctId = AppStorage.get('acctId')
  const _url = 'pipelines/executions?accountId=' + acctId
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const approvePipelineExec = (appId, execId, approvalId, comments, action) => {
  const url = `pipelines/executions/${execId}/approval?appId=${appId}`
  const body = {
    approvalId: approvalId,
    comments: comments
  }
  if (typeof action !== 'undefined') {
    body.action = action
  }
  return dataService
    .fetch(url, {
      method: 'PUT',
      body: body
    })
    .catch(error => {
      throw error
    })
}

// -- ARTIFACT STREAM

const getArtifactStreamsEndPoint = (appId, id) => {
  const _url = id ? `artifactstreams/${id}` : 'artifactstreams'
  return _url + '?appId=' + appId
  // use new API now: (11/12/2017)
  // const _url = id ? `triggers/${id}` : 'triggers'
  // return _url + '?appId=' + appId
}

const getArtifactStreamActionEndPoint = (appId, streamId, id) => {
  const _url = id ? `artifactstreams/${streamId}/actions/${id}` : `artifactstreams/${streamId}/actions`
  return _url + '?appId=' + appId
}

const fetchArtifactStreamsData = appId => {
  return dataService.list(getArtifactStreamsEndPoint(appId)).catch(error => {
    throw error
  })
}

const fetchTriggers = appId => {
  const url = 'triggers?appId=' + appId
  // #TODO: use TriggerService
  return dataService.list(url).catch(error => {
    throw error
  })
}

const fetchServiceArtifactStreamData = (appId, serviceId) => {
  const url = getArtifactStreamsEndPoint(appId)
  const filter = `&serviceId=${serviceId}`
  return dataService.list(url + filter).catch(error => {
    throw error
  })
}

const fetchArtifactStreamStencils = (appId, serviceId) => {
  return dataService.list(`artifactstreams/stencils?appId=${appId}&serviceId=${serviceId}`).catch(error => {
    throw error
  })
}

// -- VERSIONING

const fetchEntityVersions = (entityType, uuid, parentUuid) => {
  const url =
    `versions?entityType=${entityType}` +
    (uuid ? '&entityUuid=' + uuid : '') +
    (parentUuid ? '&entityParentUuid=' + parentUuid : '')
  return dataService.list(url).catch(error => {
    throw error
  })
}

// -- ACCOUNT

const getDeleteUserEndPoint = (id, accountId) => {
  let endpoint = 'users' + (id ? '/' + id : '')
  endpoint += `?accountId=${accountId}`
  return endpoint
}
const getRegisterEndPoint = id => {
  return 'users' + (id ? '/' + id : '')
}

const getUserInviteEndPoint = accountId => {
  return 'users/invites' + `?accountId=${accountId}`
}

const getEditUserEndPoint = userId => {
  return 'users' + ('/' + userId)
}

const getInviteCompletionEndPoint = (inviteId, accountId) => {
  let endpoint = 'users/invites' + ('/' + inviteId)
  endpoint += `?accountId=${accountId}`
  return endpoint
}

// const fetchLoadBalancerNames = (computeProviderId) => {
//   const accountId = AppStorage.get('acctId')
//   let _url = 'infrastructure-mappings/compute-providers/' + (computeProviderId + '/') + 'load-balancers'
//   _url += `?accountId=${accountId}`
//   const list = dataService.list(_url).catch(error => { throw error })
//   return list
// }

// const fetchTargetGroupNames = (computeProviderId, loadBalancerName) => {
//   const accountId = AppStorage.get('acctId')
//   let _url = 'infrastructure-mappings/compute-providers/' + (computeProviderId + '/')
//   _url += 'load-balancer/' + loadBalancerName + '/' + 'target-groups'
//   _url += `?accountId=${accountId}`
//   return dataService.list(_url).catch(error => { throw error })
// }

const fetchLoadBalancerNames = (appId, infraMappingId) => {
  let _url = 'infrastructure-mappings/' + infraMappingId + '/load-balancers'
  _url += `?appId=${appId}`
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const fetchTargetGroupNames = (appId, infraMappingId, loadBalancerName) => {
  let _url = `infrastructure-mappings/${infraMappingId}/load-balancers/${loadBalancerName}/target-groups`
  _url += `?appId=${appId}`
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const fetchECSServiceRoles = computeProviderId => {
  const accountId = AppStorage.get('acctId')
  let _url = '/infrastructure-mappings/compute-providers/' + computeProviderId + '/roles'
  _url += `?accountId=${accountId}`
  const list = dataService.list(_url).catch(error => {
    throw error
  })
  return list
}
const getUserEndPoint = (acctId, id) => {
  const _url = 'users' + (id ? '/' + id : '')
  return `${_url}?accountId=${acctId}`
}

const getRoleEndPoint = (acctId, id) => {
  const _url = 'roles' + (id ? '/' + id : '')
  return `${_url}?accountId=${acctId}`
}

const getDelegatesEndPoint = (acctId, id) => {
  const _url = 'delegates' + (id ? '/' + id : '')
  return `${_url}?accountId=${acctId}`
}

const getDelegatesDownloadUrl = acctId => {
  return `delegates/downloadUrl?accountId=${acctId}`
}

const fetchUsers = acctId => {
  return dataService.list(getUserEndPoint(acctId)).catch(error => {
    throw error
  })
}

const fetchUser = () => {
  return dataService.list('users/user').catch(error => {
    throw error
  })
}

const fetchRoles = acctId => {
  return dataService.list(getRoleEndPoint(acctId)).catch(error => {
    throw error
  })
}

const fetchPlugins = isSettingSchema => {
  const acctId = AppStorage.get('acctId')
  let _url = 'plugins/' + acctId + '/installed'
  _url += isSettingSchema ? '/settingschema' : ''
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const fetchDelegates = acctId => {
  if (acctId) {
    return dataService.list(getDelegatesEndPoint(acctId)).catch(error => {
      throw error
    })
  }
}

// --- Cloudwatch

const fetchCloudwatchNamespaces = (settingId, region) => {
  const acctId = AppStorage.get('acctId')
  const _url = `cloudwatch/namespaces?settingId=${settingId}&region=${region}`
  return dataService.list(`${_url}&accountId=${acctId}`).catch(error => {
    throw error
  })
}

const fetchCloudwatchMetrics = (settingId, region, namespace) => {
  // Fetch-plus is trying to redo encodeURI even if i do encodeURIComponent
  // So AWS/FBS => encodeURIComponent('AWS/FBS') = AWS%2FEBS
  // fetch-plus('AWS%2FEBS') now becomes AWS%252FEBS
  // So using isomorphic-fetch to overcome this issue
  // see issue https://github.com/RickWong/fetch-plus/issues/29
  const __ns = encodeURIComponent(namespace)
  const _url = `cloudwatch/namespaces/${__ns}/metrics?settingId=${settingId}&region=${region}`
  const acctId = AppStorage.get('acctId')
  return dataService
    .isomorphicFetch(`${_url}&accountId=${acctId}`, { headers: {} })
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw res.json()
      }
    })
    .catch(error => {
      throw error
    })
}

const fetchCloudwatchMetricDimensions = (settingId, region, namespace, metric) => {
  // see issue https://github.com/RickWong/fetch-plus/issues/29
  const __ns = encodeURIComponent(namespace)
  const __metr = encodeURIComponent(metric)
  const _url = `cloudwatch/namespace/${__ns}/metrics/${__metr}/dimensions?settingId=${settingId}&region=${region}`
  const acctId = AppStorage.get('acctId')
  return dataService
    .isomorphicFetch(`${_url}&accountId=${acctId}`, { headers: {} })
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        throw res.json()
      }
    })
    .catch(error => {
      throw error
    })
}

// --- service-variables
const getServiceVariablesEndpoint = (appId, entityId, id, entityType = 'SERVICE') => {
  const endpoint = 'service-variables' + (id ? '/' + id : '')
  return entityId ? `${endpoint}?appId=${appId}&entityId=${entityId}&entityType=${entityType}` : endpoint
}

const fetchServiceVariables = (appId, entityId) => {
  return dataService.list(getServiceVariablesEndpoint(appId, entityId)).catch(error => {
    throw error
  })
}

// --- App Dynamics

const fetchMetrics = (acctId, appId, stateExecutionId) => {
  // const acctId = AppStorage.get('acctId')
  // let _url = `appdynamics/generate-metrics?accountId=${acctId}`
  // _url += `&appdynamicsAppId=${appdynamicsAppId}&tierId=${tierId}&startTimeInMillis=${startTimeMs}`
  const _url = `appdynamics/generate-metrics?accountId=${acctId}&appId=${appId}&stateExecutionId=${stateExecutionId}`
  return dataService.list(_url).catch(error => {
    throw error
  })
}

const fetchNewRelicMetrics = (acctId, appId, stateExecutionId, workflowExecutionId) => {
  // const acctId = AppStorage.get('acctId')
  // let _url = `appdynamics/generate-metrics?accountId=${acctId}`
  // _url += `&appdynamicsAppId=${appdynamicsAppId}&tierId=${tierId}&startTimeInMillis=${startTimeMs}`
  let _url = `newrelic/generate-metrics?accountId=${acctId}&appId=${appId}`
  _url += `&stateExecutionId=${stateExecutionId}&workflowExecutionId=${workflowExecutionId}`
  return dataService.list(_url).catch(error => {
    throw error
  })
}

// --- Infrastructures
const getInfrastructureMappingEndPoint = (appId, envId, serviceId, id) => {
  let endpoint = 'infrastructure-mappings' + (id ? '/' + id : '')
  endpoint += `?appId=${appId}` + (envId ? `&envId=${envId}` : '') + (serviceId ? `&serviceId=${serviceId}` : '')
  return endpoint
}

const fetchInfrastructureMapping = (appId, envId) => {
  return dataService.list(getInfrastructureMappingEndPoint(appId, envId)).catch(error => {
    throw error
  })
}
const fetchInfraEnvironmentMapping = (appId, envId, serviceId) => {
  return `infrastructure-mappings/infra-types/?appId=${appId}&envId=${envId}&serviceId=${serviceId}`
}
const fetchElasticLoadBalancerNames = (accountId, accessKey, secretKey, region) => {
  return `infrastructure-mappings/elastic-load-balancers/?accountId=${accountId}&accessKey=${accessKey}&secretKey=${secretKey}&region=${region}`
}
const getInfraClusterMappingEndPoint = (appId, deploymentType, region, computeProviderId) => {
  let _url = `infrastructure-mappings/compute-providers/${computeProviderId}/clusters/?appId=${appId}&deploymentType=${deploymentType}`
  _url += region ? `&region=${region}` : ''
  return _url
}
const fetchInfraMappingsByService = (appId, serviceId, envId) => {
  return dataService.list(getInfrastructureMappingEndPoint(appId, envId, serviceId)).catch(error => {
    throw error
  })
}

const fetchInfrastructuresStencils = appId => {
  return dataService.list(`infrastructure-mappings/stencils?appId=${appId}`).catch(error => {
    throw error
  })
}

// const getInfraMappingHostsEndPoint = (appId, envId, serviceId, computeProviderId) => {
//   // adding a null check to avoid api calls
//   if (appId && envId && serviceId && computeProviderId) {
//     return `infrastructure-mappings/compute-providers/${computeProviderId}/hosts?appId=${appId}&envId=${envId}&serviceId=${serviceId}`
//   }
// }

const getInfraMappingHostsEndPoint = (appId, infraMappingId) => {
  // adding a null check to avoid api calls
  if (appId && infraMappingId) {
    //localhost:9090/api/infrastructure-mappings/ewVA2Dh4TR-yX28t_pLHHg/hosts?appId=Lr6pDIXOT12qbnYLAKvuZQ
    https: return `infrastructure-mappings/${infraMappingId}/hosts?appId=${appId}`
  }
}

const getInfraMappingLaunchConfigsEndPoint = (appId, envId, infraMappingId) => {
  return `infrastructure-mappings/${infraMappingId}/launchconfigs?appId=${appId}&envId=${envId}`
}
const fetchApplicationNamesForCodeDeploy = (appId, region, computeProviderId) => {
  let _url = `infrastructure-mappings/compute-providers/${computeProviderId}`
  _url += `/codedeploy/application-names?appId=${appId}&region=${region}`
  return dataService.list(_url)
}
const fetchDeploymentGroupsForCodeDeploy = (appId, region, computeProviderId, applicationName) => {
  let _url = `infrastructure-mappings/compute-providers/${computeProviderId}`
  _url += `/codedeploy/deployment-groups?appId=${appId}&region=${region}&applicationName=${applicationName}`
  return dataService.list(_url)
}
const fetchDeploymentConfigsForCodeDeploy = (appId, region, computeProviderId) => {
  let _url = `infrastructure-mappings/compute-providers/${computeProviderId}`
  _url += `/codedeploy/deployment-configs?appId=${appId}&region=${region}`
  return dataService.list(_url)
}

const getResendEmailApi = emailId => {
  const url = `users/resend-verification-email/${emailId}`
  return dataService.list(url).catch(error => {
    throw error
  })
}
const onSubmitForSettingsEndPoint = (acctId, data) => {
  const appId = ''
  const isEditing = data.uuid === undefined ? false : true
  if (isEditing) {
    return dataService.replace(getSettingsEndpoint(appId, acctId, data.uuid), { body: JSON.stringify(data) })
  } else {
    data.accountId = acctId
    return dataService.create(getSettingsEndpoint(appId, acctId, null), { body: JSON.stringify(data) })
  }
}

const validateHostsForInfraMappingEndPoint = (appId, envId) => {
  return `infrastructure-mappings/validate-hosts?appId=${appId}&envId=${envId}`
}

// --- LOGIN

const resetPassword = (data, resetToken) => {
  const _url = 'users/reset-password' + (resetToken ? '/' + resetToken : '')
  return dataService
    .fetch(_url, {
      method: 'POST',
      body: data
    })
    .catch(error => {
      throw error
    })
}

const getCloneWorkflowUrl = (workflowId, appId) => {
  const _url = `/workflows/${workflowId}/clone?appId=${appId}`
  return _url
}
const getClonePipelineUrl = (pipelineId, appId) => {
  const _url = `/pipelines/${pipelineId}/clone?appId=${appId}`
  return _url
}

const getCloneServiceUrl = (serviceId, appId) => {
  const _url = `/services/${serviceId}/clone?appId=${appId}`
  return _url
}
// https:// localhost:9090/api/services/{serviceId}/commands/{commandName}/clone?appId={appId}
const getCloneCommandUrl = (serviceId, commandName, appId) => {
  const _url = `/services/${serviceId}/commands/${commandName}/clone?appId=${appId}`
  return _url
}

const getAppDynamicsApplications = (accountId, settingId) => {
  const _url = `/appdynamics/applications?accountId=${accountId}&settingId=${settingId}`
  return _url
}
const getTierNameForAppDynamicsApplication = (accountId, settingId, appDynamicsAppId) => {
  const _url =
    `/appdynamics/tiers?settingId=${settingId}` + `&accountId=${accountId}&appdynamicsAppId=${appDynamicsAppId}`
  return _url
}

const fetchComputeProviders = (appId, callBack) => {
  fetchPlugins()
    .then(d => {
      if (Array.isArray(d.resource)) {
        const types = []
        d.resource.forEach(b => {
          if (b.pluginCategories.indexOf('CloudProvider') >= 0) {
            types.push(b.type)
          }
        })

        if (types.length > 0) {
          const str = types.join('&type=')
          dataService
            .list(getSettingsConfigEndpoint(appId, str))
            .then(r => {
              if (callBack) {
                callBack(r)
              }
            })
            .catch(error => {
              throw error
            })
        }
      }
    })
    .catch(error => {
      throw error
    })
}

// -- Splunk Verification Data

const fetchSplunkData = (applicationId, stateExecutionId, stateType) => {
  const accountId = AppStorage.get('acctId')

  const url =
    stateType.toLowerCase() +
    `/get-analysis-summary?accountId=${accountId}&applicationId=${applicationId}&stateExecutionId=${stateExecutionId}`
  return dataService.list(url).catch(error => {
    throw error
  })
}
const fetchServiceVariablesForEnvironment = (applicationId, environmentId) => {
  const url = `service-variables?appId=${applicationId}&entityId=${environmentId}`
  return dataService.list(url).catch(error => {
    throw error
  })
}
const fetchServiceFileOverridesForEnvironment = (applicationId, environmentId) => {
  /*
    https://localhost:9090/api/configs?appId=9VW2ww3fS0uTl3EQjxJidw&entityId=dv_
    dRH_8RlSFWxd5hAs6_Q&entityType=ENVIRONMENT
   */
  const url = `configs?appId=${applicationId}&entityId=${environmentId}`
  return dataService.list(url).catch(error => {
    throw error
  })
}
// https://localhost:9090/api/awshelper/regions?accountId=kmpySmUISimoRrJL6NL73w
const getAWSRegionNames = async accountId => {
  if (!accountId) {
    accountId = AppStorage.get('acctId')
  }
  const url = `awshelper/regions?accountId=${accountId}`
  return await dataService.list(url).catch(error => {
    throw error
  })
}

export default {
  service: dataService,
  getArtifactEndPoint,
  getCloneServiceUrl,
  getCloneCommandUrl,
  getCloneWorkflowUrl,
  getClonePipelineUrl,
  getAppDynamicsApplications,
  getTierNameForAppDynamicsApplication,
  getServiceTemplatesByServiceEndpoint,
  fetchServiceTemplatesByService,
  fetchArtifacts,
  fetchArtifactsForPipeLines,
  fetchInstances,
  fetchTaskNotifications,
  fetchNotificationCounters,
  getNotificationEndpoint,
  fetchHistory,
  getHistoryEndPoint,
  onSubmitForSettingsEndPoint,
  fetchReleases,
  fetchExecutions,
  fetchExecutionsByTimeRange,
  getServiceEndpoint,
  fetchServices,
  fetchService,
  getAppContainersEndpoint,
  fetchAppContainers,
  getConfigEndpoint,
  getConfigDownloadUrl,
  getCommandEndPoint,
  getSettingsEndpoint,
  fetchOrgSettings,
  getStatisticsEndpoint,
  fetchStatistics,
  getActivitiesEndpoint,
  fetchActivitiesData,
  fetchRecentFailures,
  fetchDashboardActivities,
  fetchInstanceActivities,
  fetchInstanceArtifacts,
  fetchDashboardExecutions,
  getSettingsConfigEndpoint,
  getBuildSourceJobsEndpoint,
  getBuildSourcePathsEndPoint,
  getBuildSourcePathsWithStreamTypeEndPoint,
  getBuildNumbersEndPoint,
  fetchOrchestrations,
  getExecutionsEndPoint,
  getStateExecutionEndPoint,
  getRegisterVerifyEndPoint,
  fetchSuggestedAccountName,
  fetchElasticLoadBalancerNames,
  verifyEmail,
  getServiceTemplatesEndpoint,
  getTagsEndpoint,
  fetchTagsData,
  getAllHostsEndpoint,
  fetchAllHosts,
  getEnvironmentEndPoint,
  fetchEnv,
  fetchServiceTemplates,
  fetchAllApps,
  fetchOneApp,
  fetchUser,
  fetchCatalogs,
  fetchInfrastructures,
  fetchPipelines,
  fetchPipelineExecutions,
  fetchArtifactStreamsData,
  getArtifactStreamsEndPoint,
  getArtifactStreamActionEndPoint,
  fetchEntityVersions,
  getOrchestrationEndpoint,
  fetchWorkflow,
  fetchStencils,
  getUserEndPoint,
  fetchUsers,
  getRoleEndPoint,
  fetchRoles,
  fetchPlugins,
  fetchDelegates,
  fetchInstalledSettingSchema,
  getBuildSourcePlansEndpoint,
  getBuildSourcePlansWithStreamTypeEndpoint,
  getDelegatesDownloadUrl,
  getRegisterEndPoint,
  fetchCloudwatchNamespaces,
  fetchCloudwatchMetrics,
  fetchCloudwatchMetricDimensions,
  getWorkflowPhaseEndpoint,
  fetchWorkflows,
  fetchWorkflowById,
  getWorkflowEndpoint,
  updateWorkflowPreDeploy,
  updateWorkflowPostDeploy,
  updateWorkflowNotifications,
  updateWorkflowFailureStrategies,
  getServiceVariablesEndpoint,
  fetchServiceVariables,
  fetchInfrastructuresStencils,
  fetchInfraEnvironmentMapping,
  fetchInfrastructureMapping,
  fetchClassicLoadBalancers,
  getInfraClusterMappingEndPoint,
  getInfrastructureMappingEndPoint,
  fetchNotificationGroups,
  addNotificationGroup,
  updateNotificationGroup,
  deleteNotificationGroup,
  updateSubworkflowNode,
  getInfraMappingHostsEndPoint,
  fetchServiceArtifactStreamData,
  getInfraMappingLaunchConfigsEndPoint,
  fetchArtifactStreamStencils,
  fetchPipelineServices,
  fetchBuildSourceTypes,
  getResendEmailApi,
  getServiceContainerEndpoint,
  updateContainerTasks,
  fetchServiceContainerTasks,
  fetchServiceContainerTaskStencils,
  fetchDashboardPipelineExecutions,
  approvePipelineExec,
  fetchInfraMappingsByService,
  validateHostsForInfraMappingEndPoint,
  getSettingsUploadEndpoint,
  getUserInviteEndPoint,
  getInviteCompletionEndPoint,
  getEditUserEndPoint,
  getDeleteUserEndPoint,
  fetchLoadBalancerNames,
  fetchApplicationNamesForCodeDeploy,
  fetchDeploymentConfigsForCodeDeploy,
  fetchDeploymentGroupsForCodeDeploy,
  fetchTargetGroupNames,
  fetchECSServiceRoles,
  fetchOrgConnectors,
  fetchOrchestrationStencils,
  resetPassword,
  editGCPUploadEndPoint,
  interruptWorkflow,
  fetchMetrics,
  fetchNewRelicMetrics,
  fetchComputeProviders,
  fetchServiceArtifactStreamDataForDeployment,
  fetchSplunkData,
  fetchServiceVariablesForEnvironment,
  fetchServiceFileOverridesForEnvironment,
  getAWSRegionNames,
  getJenkinsBuildJobsEndPoint,
  fetchAWSLambdaSpecs,
  fetchTriggers
}



// WEBPACK FOOTER //
// ../src/apis/apis.js