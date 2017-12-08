import dataService from '../apis/dataService'

export async function getDelegatesByAccount ({ accountId }) {
  const url = `delegates?accountId=${accountId}`

  try {
    const res = await dataService.fetch(url, {
      method: 'GET'
    })
    return { delegates: res.resource.response }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function getDelegateScopes ({ accountId }) {
  const url = `delegate-scopes?accountId=${accountId}`

  try {
    const res = await dataService.fetch(url, {
      method: 'GET'
    })
    return { scopes: res.resource.response }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function createScope (accountId, data) {
  const url = `delegate-scopes?accountId=${accountId}`
  try {
    const res = await dataService.fetch(url, {
      method: 'POST',
      body: data
    })
    return { scope: res.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function updateScope (accountId, scopeId, data) {
  const url = `delegate-scopes/${scopeId}?accountId=${accountId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'PUT',
      body: data
    })
    return { response }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function deleteScope (accountId, scopeId) {
  const url = `delegate-scopes/${scopeId}?accountId=${accountId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'DELETE'
    })
    return { response }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function updateDelegateScopes (accountId, delegateId, includeScopes, excludeScopes) {
  const url = `delegates/${delegateId}/scopes?accountId=${accountId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'PUT',
      body: {
        includeScopeIds: includeScopes,
        excludeScopeIds: excludeScopes
      }
    })
    return { response }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function updateDelegate (accountId, delegateId, data) {
  const url = `delegates/${delegateId}?accountId=${accountId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'PUT',
      body: data
    })
    return { response }
  } catch (e) {
    return { error: e, status: e.status }
  }
}



// WEBPACK FOOTER //
// ../src/services/DelegatesService.js