import dataService from '../apis/dataService'

export async function fetchAlerts ({ accountId }) {
  let endPoint = 'alerts'
  endPoint += `?accountId=${accountId}&status=Open`

  const { resource, error } = await dataService.makeRequest(endPoint)
  return { alerts: resource.response, error }
}



// WEBPACK FOOTER //
// ../src/services/AlertService.js