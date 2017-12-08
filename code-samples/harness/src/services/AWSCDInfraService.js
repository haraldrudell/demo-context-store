import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  appsPath: ({ computeProviderId }) =>
    `infrastructure-mappings/compute-providers/${computeProviderId}/codedeploy/application-names`,

  depGroupsPath: ({ computeProviderId }) =>
    `infrastructure-mappings/compute-providers/${computeProviderId}/codedeploy/deployment-groups`,

  depConfigsPath: ({ computeProviderId }) =>
    `/infrastructure-mappings/compute-providers/${computeProviderId}/codedeploy/deployment-configs`
})

export async function getApplicationNamesForCodeDeploy ({ appId, region, computeProviderId }) {
  const url = endpoints.appsPath({ computeProviderId }, { appId, region })

  const { error, resource } = await dataService.makeRequest(url)
  return { applications: resource, error }
}

export async function getDeploymentGroupsForCodeDeploy ({ appId, region, computeProviderId, applicationName }) {
  const url = endpoints.depGroupsPath({ computeProviderId }, { appId, region, applicationName })

  const { error, resource } = await dataService.makeRequest(url)
  return { deploymentGroups: resource, error }
}

export async function getDeploymentConfigsForCodeDeploy ({ appId, region, computeProviderId }) {
  const url = endpoints.depConfigsPath({ computeProviderId }, { appId, region })

  const { error, resource } = await dataService.makeRequest(url)
  return { deploymentConfigs: resource, error }
}



// WEBPACK FOOTER //
// ../src/services/AWSCDInfraService.js