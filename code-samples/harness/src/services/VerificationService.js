import dataService from '../apis/dataService'

export async function fetchAppDynamicsMetrics ({ accountId, appId, stateExecutionId, execId }) {
  let url = `appdynamics/generate-metrics?accountId=${accountId}&appId=${appId}`
  url += `&stateExecutionId=${stateExecutionId}&workflowExecutionId=${execId}`

  const { resource, error } = await dataService.makeRequest(url)
  return { resource, error }
}

export async function fetchNewRelicChartData ({
  accountId,
  stateExecutionId,
  workFlowExecutionId,
  transactionName,
  metricName
}) {
  let url = `newrelic/get-tooltip?accountId=${accountId}`
  url += `&stateExecutionId=${stateExecutionId}`
  url += `&workFlowExecutionId=${workFlowExecutionId}`
  url += `&transactionName=${encodeURIComponent(transactionName)}`
  url += `&metricName=${metricName}`
  url += `&analysisMinute=${14}`

  // const { resource, error } = await dataService.makeRequest(url, { method: 'POST' })
  // return { resource, error }

  try {
    // don't use dataService.fetch, it will encodeURI again on the already-encoded URL with "%2F" (/)
    const response = await dataService.isomorphicFetch(url, {
      method: 'POST'
    })
    const json = await response.json()
    return { resource: json.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}



// WEBPACK FOOTER //
// ../src/services/VerificationService.js