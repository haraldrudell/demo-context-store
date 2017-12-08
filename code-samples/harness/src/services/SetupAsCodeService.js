import dataService from '../apis/dataService'
import Utils from '../components/Utils/Utils'

const getEndpoint = ({ accountId, node }) => {
  let url = ''
  const entityUuid = node.restName === 'setup' ? '' : node.uuid // '/setup' doesn't need uuid
  url = `setup-as-code/yaml/${node.restName}/${entityUuid}?accountId=${accountId}`
  url += node.appId ? `&appId=${node.appId}` : ''
  return url
}

/* Return tree structure data */
export async function getSetupData (accountId) {
  const url = `setup-as-code/yaml/directory?accountId=${accountId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'GET'
    })
    return { data: response.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

/* Get YAML content of a node (from tree structure data) */
export async function getNodeData ({ accountId, node }) {
  const url = getEndpoint({ accountId, node })
  let nodeData = null
  if (url) {
    try {
      const response = await dataService.fetch(url, {
        method: 'GET'
      })
      nodeData = Utils.getJsonValue(response, 'resource') || ''
    } catch (e) {
      return { error: e, status: e.status }
    }
  }
  return { nodeData }
}

/*
  Update YAML content of a node (from tree structure data)
  deleteEnabled: after confirmation, set to true to force delete
*/
export async function updateNodeData ({ accountId, node, content, deleteEnabled = false }) {
  let url = getEndpoint({ accountId, node })
  url += '&' + (deleteEnabled === true ? 'deleteEnabled=true' : '')
  if (url) {
    try {
      const response = await dataService.fetch(url, {
        method: 'PUT',
        body: {
          yamlPayload: content,
          path: node.directoryPath.path
        }
      })
      let error = null
      if (response && response.responseMessages && response.responseMessages.length > 0) {
        error = { ...response.responseMessages[0] }
      }
      return { response, error }
    } catch (e) {
      return { error: e, status: e.status }
    }
  }
}

/* Get a list of config versions of an entity */
export async function getVersions ({ accountId, entityId, type }) {
  const url = `yaml-history/${accountId}?entityId=${entityId}&type=${type}`
  try {
    const response = await dataService.fetch(url, {
      method: 'GET'
    })
    return { versions: response.resource.versions }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

/* Get details of 1 version */
export async function getVersion ({ accountId, entityId, type, versionId }) {
  let url = `yaml-history/${accountId}?entityId=${entityId}&type=${type}`
  url += `&versionId=${versionId}`
  try {
    const response = await dataService.fetch(url, {
      method: 'GET'
    })
    return { data: response.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function getGitSync ({ accountId, node }) {
  const url = `setup-as-code/yaml/git-config/${accountId}?accountId=${accountId}` // + (appId ? `&appId=${appId}` : '')
  try {
    // don't use dataService.fetch, it will encodeURI again on the already-encoded URL with "%2F" (/)
    const response = await dataService.isomorphicFetch(url, {
      method: 'GET'
    })
    const json = await response.json()
    return { gitSync: json.resource }
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function updateGitSync ({ accountId, node, data }) {
  const method = data && data.createdAt ? 'PUT' : 'POST'
  const entityId = accountId || ''

  const restId = method === 'POST' ? '' : '/' + encodeURIComponent(entityId)
  const url = `setup-as-code/yaml/git-config${restId}?accountId=${accountId}`
  if (url) {
    try {
      const response = await dataService.fetch(url, {
        method,
        body: {
          ...data
        }
      })
      let error = null
      if (response && response.responseMessages && response.responseMessages.length > 0) {
        error = { ...response.responseMessages[0] }
      }
      return { response, error }
    } catch (e) {
      return { error: e, status: e.status }
    }
  }
}

export async function fetchWebhookToken ({ accountId, entityId }) {
  let endPoint = `setup-as-code/yaml/webhook/${entityId}`
  endPoint += '?accountId=' + accountId

  const { error, resource } = await dataService.makeRequest(endPoint)
  return { webhookToken: resource.webhookToken, error }
}



// WEBPACK FOOTER //
// ../src/services/SetupAsCodeService.js