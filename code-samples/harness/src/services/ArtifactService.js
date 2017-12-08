import dataService from '../apis/dataService'

export async function fetchArtifacts (appId, envId, serviceIdArr, searchFilter = null) {
  let endPoint = 'artifacts'
  endPoint += '?appId=' + appId
  if (envId) {
    endPoint += `&envId=${envId}`
  }
  let filter = '&search[0][field]=status&search[0][op]=IN'
  filter += '&search[0][value]=READY&search[0][value]=APPROVED&search[0][value]=REJECTED'
  filter += '&search[0][value]=WAITING&search[0][value]=QUEUED&search[0][value]=RUNNING'
  if (serviceIdArr && Array.isArray(serviceIdArr) && serviceIdArr.length > 0) {
    filter += '&search[1][field]=serviceIds&search[1][op]=IN'
    for (const serviceId of serviceIdArr) {
      filter += '&search[1][value]=' + serviceId
    }
  }
  if (searchFilter) {
    filter += `&search[2][field]=metadata.buildNo&search[2][op]=STARTS_WITH&search[2][value]=${searchFilter}`
  }
  if (filter) {
    /*
     Backend-> asked to increase the limit to 500
    */
    filter += '&limit=500'
  }
  endPoint += filter
  const { error, resource } = await dataService.makeRequest(endPoint)
  return { artifacts: resource.response, error }
}

export async function fetchArtifactStreamsByServiceIds (appId, serviceIdArray) {
  let endPoint = 'artifactstreams'
  endPoint += '?appId=' + appId

  const filter = '&search[1][field]=serviceIds&search[1][op]=IN'
  endPoint += filter
  const { error, resource } = await dataService.makeRequest(endPoint)
  return { artifactStreams: resource.response, error }
}



// WEBPACK FOOTER //
// ../src/services/ArtifactService.js