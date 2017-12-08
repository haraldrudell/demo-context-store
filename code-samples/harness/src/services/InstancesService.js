import dataService from '../apis/dataService'

// ///////////////////////// Get Data for a single instance ////////////////////////////////////////

// Get Instance statistics, filtered by Application.
export async function getInstanceDetails ({ accountId, instanceId }) {
  const url = `dash-stats/instance-details?accountId=${accountId}&instanceId=${instanceId}`
  let response

  try {
    response = await dataService.fetch(url, {
      method: 'GET'
    })
  } catch (e) {
    return { error: e, status: e.status }
  }
  return { instanceDetails: response.resource }
}

// ///////////////////////// Services API calls ////////////////////////////////////////

// Get Instance statistics, filtered by Application.
export async function getInstancesByApp ({ accountId, instancesByAppFilterTypes = '', queryParams = '' }) {
  const url = `dash-stats/app-instance-summary-stats?accountId=${accountId}` + queryParams + instancesByAppFilterTypes
  let response

  try {
    response = await dataService.fetch(url, {
      method: 'GET'
    })
  } catch (e) {
    return { error: e, status: e.status }
  }
  return { instanceStats: response.resource }
}

// Get Instance statistics, for a single service.
export async function getInstancesByService ({ accountId, instancesByAppFilterTypes = '', serviceId = '' }) {
  const url =
    `dash-stats/service-instance-summary-stats?accountId=${accountId}` +
    `&serviceId=${serviceId}${instancesByAppFilterTypes}`
  let response

  try {
    response = await dataService.fetch(url, {
      method: 'GET'
    })
  } catch (e) {
    return { error: e, status: e.status }
  }
  return { instanceStats: response.resource }
}

// Get instance statistics, broken down by environment.
export async function getInstancesByServiceEnvBuild ({ accountId, queryParams = '' }) {
  const url = `dash-stats/app-instance-stats?accountId=${accountId}` + queryParams
  let response

  try {
    response = await dataService.fetch(url, {
      method: 'GET'
    })
  } catch (e) {
    return { error: e, status: e.status }
  }
  return { serviceCardData: response.resource }
}

// Get lists of Instance data for a single service.
export async function getServiceInstancesLists ({ accountId, serviceId, appId }) {
  const url = `dash-stats/service-instance-dash?accountId=${accountId}&serviceId=${serviceId}&appId=${appId}`
  let response

  try {
    response = await dataService.fetch(url, {
      method: 'GET'
    })
  } catch (e) {
    return { error: e, status: e.status }
  }
  return { serviceInstancesLists: response.resource }
}

// Get lists of Instance data for all services.
export async function getServiceInstancesListsAllServices ({ accountId, serviceId, appId }) {
  const url =
    `dash-stats/service-instance-dash-all-services?accountId=${accountId}` + `&serviceId=${serviceId}&appId=${appId}`
  let response

  try {
    response = await dataService.fetch(url, {
      method: 'GET'
    })
  } catch (e) {
    return { error: e, status: e.status }
  }
  return { serviceInstancesLists: response.resource }
}

// ///////////////////////// Infrastructure API calls ////////////////////////////////////////

// Get instance statistics, broken down by environment.
export async function getInstancesByCloudProvider ({ accountId, queryParams = '' }) {
  return instancesByCloudProvider

  const url = `dash-stats/app-instance-stats?accountId=${accountId}` + queryParams
  let response

  try {
    response = await dataService.fetch(url, {
      method: 'GET'
    })
  } catch (e) {
    return { error: e, status: e.status }
  }
  return response
}

const instancesByCloudProvider = {
  resource: [
    {
      totalCount: 25,
      cloudProviderSummary: {
        id: 's1Id',
        name: 'cloud provider 1',
        type: 'CLOUD_PROVIDER',
        cloudProviderTypeSummary: {
          id: 'app1',
          name: 'My Favorite Cloud Vendor',
          type: 'CLOUD_PROVIDER_TYPE'
        }
      },
      instanceStatsByServiceEnvInfra: [
        {
          serviceSummary: {
            id: 'service1Id',
            name: 'service1',
            type: 'SERVICE',

            appSummary: {
              id: 'app1Id',
              name: 'app1',
              type: 'APPLICATION'
            }
          },
          serviceInfrastructure: {
            id: 'service1Id',
            name: 'service1',
            type: 'SERVICE'
          },
          environementSummary: {
            id: 'service1Id',
            name: 'service1',
            type: 'SERVICE'
          },
          instanceStats: [
            {
              totalCount: 23,
              entitySummaryList: [
                {
                  id: 'instance1Id',
                  name: 'instance1',
                  type: 'INSTANCE'
                },
                {
                  id: 'instance2Id',
                  name: 'instance2',
                  type: 'INSTANCE'
                },
                {
                  id: 'instance3Id',
                  name: 'instance3',
                  type: 'INSTANCE'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}



// WEBPACK FOOTER //
// ../src/services/InstancesService.js