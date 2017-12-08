import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  settingSchemaPath: ({ accountId }) => `/plugins/${accountId}/installed/settingschema`
})

export async function getSettingsSchema ({ accountId }) {
  const url = endpoints.settingSchemaPath({ accountId })
  const { error, resource } = await dataService.makeRequest(url, { method: 'get' })
  return { error, resource }
}



// WEBPACK FOOTER //
// ../src/services/PluginService.js