import dataService from '../apis/dataService'

const APPLICATION_LIMIT = 100
/* Use in TestPage to demonstrate a typical API fetch function */
export async function dummyApiFetch (ms) {
  const sleep = ms =>
    new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  await sleep(ms)
  const dummyResponse = [{ uuid: 1, name: 'Item 1' }, { uuid: 2, name: 'Item 2' }]
  try {
    // const response = await dataService.fetch(url, { method: 'GET' })
    return { data: dummyResponse }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function getApplications (accountId, filterText) {
  let url = `apps?accountId=${accountId}`
  let filter
  if (filterText) {
    filter = `&search[0][field]=name&search[0][op]=STARTS_WITH&search[0][value]=${filterText}`
    url += filter
  }
  url += `&limit=${APPLICATION_LIMIT}`

  try {
    const response = await dataService.fetch(url, {
      method: 'GET'
    })
    return { response: response.resource.response }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function geteditApplicationEndPoint (applicationId) {
  const url = `apps/${applicationId}`
  return url
}

// --------- CRUD --------- //

export async function createApplication (accountId, formData) {
  const url = `apps?accountId=${accountId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'POST',
      body: formData
    })
    return { response: response.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function deleteApplication (applicationId) {
  const url = `apps/${applicationId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'DELETE'
    })
    return { reponse: response.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function editApplication (applicationId, formData) {
  const url = `apps/${applicationId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'PUT',
      body: formData
    })
    return { reponse: response.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}



// WEBPACK FOOTER //
// ../src/services/ApplicationService.js