import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  autoScalingGroupPath: ({ computeProviderId }) =>
    `/infrastructure-mappings/compute-providers/${computeProviderId}/auto-scaling-groups`,
  tagsPath: ({ computeProviderId }) => `/infrastructure-mappings/compute-providers/${computeProviderId}/tags`,
  subnetPath: ({ computeProviderId }) => `infrastructure-mappings/compute-providers/${computeProviderId}/subnets`,
  secuirtyGroupPath: ({ computeProviderId }) =>
    `infrastructure-mappings/compute-providers/${computeProviderId}/security-groups`
})

export async function getAutoScalingGroups ({ appId, computeProviderId, region }) {
  const url = endpoints.autoScalingGroupPath({ computeProviderId }, { appId, region })
  const { error, resource } = await dataService.makeRequest(url)
  return { autoScalingGroups: resource, error }
}

export async function getTags ({ appId, computeProviderId, region }) {
  const url = endpoints.tagsPath({ computeProviderId }, { appId, region })
  const { error, resource } = await dataService.makeRequest(url)
  return { tags: resource, error }
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

export async function getClassicLoadBalancers ({ appId, region, computeProviderId }) {
  let url = `/infrastructure-mappings/compute-providers/${computeProviderId}/classic-load-balancers`
  url += '?appId=' + appId + '&region=' + region
  try {
    const response = await dataService.fetch(url, {
      method: 'GET'
    })
    return response.resource
  } catch (e) {
    return { error: e, status: e.status }
  }
}



// WEBPACK FOOTER //
// ../src/services/AWSSSHInfraService.js