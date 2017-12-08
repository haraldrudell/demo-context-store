import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  subnetPath: ({ computeProviderId }) => `infrastructure-mappings/compute-providers/${computeProviderId}/subnets`,
  secuirtyGroupPath: ({ computeProviderId }) =>
    `infrastructure-mappings/compute-providers/${computeProviderId}/security-groups`,
  rolesPath: ({ computeProviderId }) => `infrastructure-mappings/compute-providers/${computeProviderId}/roles`
})

export async function getRoles ({ appId, deploymentType, computeProviderId }) {
  const url = endpoints.rolesPath({ computeProviderId }, { appId, computeProviderId })
  const { error, resource } = await dataService.makeRequest(url)
  return { roles: resource, error }
}

export async function getVPCForApplication ({ applicationId, computeProviderId, region }) {
  let url = `infrastructure-mappings/compute-providers/${computeProviderId}/vpcs`
  url += `?appId=${applicationId}&region=${region}`

  try {
    const response = await dataService.fetch(url, {
      method: 'GET'
    })
    return response.resource
  } catch (e) {
    return { error: e, status: e.status }
  }
}

export async function getSubnetIdsForApplication ({ applicationId, computeProviderId, region, vpcIds }) {
  const url = endpoints.subnetPath({ computeProviderId }, { appId: applicationId, region, vpcIds: vpcIds })
  const { error, resource } = await dataService.makeRequest(url)
  return { subnets: resource, error }
}

export async function getSecurityGroupIdsForApplication ({ applicationId, computeProviderId, region, vpcIds }) {
  const url = endpoints.secuirtyGroupPath({ computeProviderId }, { appId: applicationId, region, vpcIds: vpcIds })
  const { error, resource } = await dataService.makeRequest(url)
  return { securityGroups: resource, error }
}



// WEBPACK FOOTER //
// ../src/services/AWSLambdaInfraService.js