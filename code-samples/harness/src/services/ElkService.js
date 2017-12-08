import dataService from '../apis/dataService'

export async function getIndices ({ accountId, serverConfigId }) {
  const url = `elk/get-indices?accountId=${accountId}&serverConfigId=${serverConfigId}`
  let response

  try {
    response = await dataService.fetch(url, {
      method: 'GET'
    })
  } catch (e) {
    return { error: e, status: e.status }
  }
  return { indexList: response.resource }
}

export async function getSampleRecord ({ accountId, serverConfigId, index }) {
  const url = `elk/get-sample-record?accountId=${accountId}&serverConfigId=${serverConfigId}&index=${index}`
  let response

  try {
    response = await dataService.fetch(url, {
      method: 'GET'
    })
  } catch (e) {
    return { error: e, status: e.status }
  }
  return { sampleRecord: response.resource }
}



// WEBPACK FOOTER //
// ../src/services/ElkService.js