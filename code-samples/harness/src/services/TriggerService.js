import dataService from '../apis/dataService'

export async function fetchTriggers ({ accountId, appId }) {
  const url = `/triggers?accountId=${accountId}&appId=${appId}`
  const { resource, error } = await dataService.makeRequest(url, { method: 'GET' })
  if (error) {
    return { error }
  } else {
    const triggers = resource.response
    return { triggers }
  }
}

export async function addTrigger ({ accountId, appId, data }) {
  const url = `/triggers?accountId=${accountId}&appId=${appId}`
  const { resource, error } = await dataService.makeRequest(url, { method: 'POST', body: data })
  return { response: resource, error }
}

export async function deleteTrigger ({ accountId, appId, id }) {
  const url = `/triggers/${id}?accountId=${accountId}&appId=${appId}`
  const { resource, error } = await dataService.makeRequest(url, { method: 'DELETE' })
  return { resource, error }
}

export async function translateCron ({ accountId, expression }) {
  const url = `/triggers/cron/translate?accountId=${accountId}`
  const data = { expression }
  const { resource, error } = await dataService.makeRequest(url, { method: 'POST', body: data })
  return { response: resource, error }
}



// WEBPACK FOOTER //
// ../src/services/TriggerService.js