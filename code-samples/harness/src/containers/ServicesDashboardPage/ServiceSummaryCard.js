import React from 'react'
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import { TruncateText, ArtifactBuildLabel } from 'components'
import css from './ServiceSummaryCard.css'
import Utils from '../../components/Utils/Utils'
import { InstancesService } from 'services'

export default class ServiceSummaryCard extends React.Component {
  state = { popoverData: { instanceDetails: [], deploymentDetails: [] } }

  redirectToServiceItem = (serviceId, appId) => this.props.params.onArtifactClick(serviceId, appId)
  redirectToServiceInstancesSummaryPage = (serviceId, appId) => this.props.params.onServiceClick(serviceId, appId)
  redirectToEnvironment = (envId, appId) => this.props.params.onEnvironmentClick(envId, appId)

  fetchInstanceDetails = async instanceId => {
    const accountId = this.props.routeParams.accountId
    const { instanceDetails } = await InstancesService.getInstanceDetails({ accountId, instanceId })
    const popoverData = { instanceDetails: [], deploymentDetails: [] }

    popoverData.deploymentDetails.push({ key: 'Deployed at', value: Utils.formatDate(instanceDetails.lastDeployedAt) })
    popoverData.deploymentDetails.push({ key: 'Deployed by', value: instanceDetails.lastDeployedByName })
    if (instanceDetails.lastPipelineExecutionName && instanceDetails.lastPipelineExecutionName.length > 0) {
      popoverData.deploymentDetails.push({ key: 'Pipeline', value: instanceDetails.lastPipelineExecutionName })
    }
    popoverData.deploymentDetails.push({ key: 'Workflow', value: instanceDetails.lastWorkflowExecutionName })

    popoverData.instanceDetails['Compute Provider'] = instanceDetails.computeProviderName

    if (instanceDetails.instanceInfo) {
      const instanceInfo = instanceDetails.instanceInfo

      if (instanceDetails.instanceType === 'KUBERNETES_CONTAINER_INSTANCE') {
        popoverData.instanceDetails.push({ key: 'Cluster', value: Utils.getJsonValue(instanceInfo, 'clusterName') })
        popoverData.instanceDetails.push({
          key: 'Replication Controller',
          value: Utils.getJsonValue(instanceInfo, 'replicationControllerName')
        })
        popoverData.instanceDetails.push({ key: 'Pod', value: Utils.getJsonValue(instanceInfo, 'podName') })
      } else if (instanceDetails.instanceType === 'ECS_CONTAINER_INSTANCE') {
        popoverData.instanceDetails.push({ key: 'Cluster', value: Utils.getJsonValue(instanceInfo, 'clusterName') })
        popoverData.instanceDetails.push({
          key: 'Task Definition ARN',
          value: Utils.getJsonValue(instanceInfo, 'taskDefinitionArn')
        })
        popoverData.instanceDetails.push({ key: 'Task ARN', value: Utils.getJsonValue(instanceInfo, 'taskArn') })
      } else if (instanceDetails.instanceType === 'PHYSICAL_HOST_INSTANCE') {
        popoverData.instanceDetails.push({ key: 'Host', value: Utils.getJsonValue(instanceInfo, 'hostName') })
        popoverData.instanceDetails.push({
          key: 'Host DNS Name',
          value: Utils.getJsonValue(instanceInfo, 'hostPublicDns')
        })
      } else if (instanceDetails.instanceType === 'EC2_CLOUD_INSTANCE') {
        popoverData.instanceDetails.push({ key: 'Host', value: Utils.getJsonValue(instanceInfo, 'hostName') })
        popoverData.instanceDetails.push({
          key: 'Host DNS Name',
          value: Utils.getJsonValue(instanceInfo, 'hostPublicDns')
        })
        if (instanceInfo.ec2Instance) {
          const ec2Instance = instanceInfo.ec2Instance
          popoverData.instanceDetails.push({ key: 'State', value: Utils.getJsonValue(ec2Instance, 'state', 'name') })
          popoverData.instanceDetails.push({
            key: 'InstanceType',
            value: Utils.getJsonValue(ec2Instance, 'instanceType')
          })
        }
      }
    }
    popoverData.instanceDetails.push({ key: 'Artifact', value: instanceDetails.lastArtifactName })

    this.setState({ popoverData })
  }

  disablePopoverWhenContentTruncated = event => {
    const isEllipsed = event.target.offsetWidth < event.target.scrollWidth
    this.setState({ disablePopover: !isEllipsed })
  }

  hoverOnValue = e => this.disablePopoverWhenContentTruncated(e)

  renderInstancePopover = ({ title, lineItems }) => (
    <group>
      <header>{title}</header>
      <table>
        <tbody>
          {lineItems.map((lineItem, lineItemIdx) => (
            <tr key={lineItemIdx}>
              <td>
                <key>{lineItem.key}:</key>
              </td>
              <td>
                <value>
                  <TruncateText inputText={lineItem.value} />
                </value>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </group>
  )

  renderServiceSummaryCard = service => (
    <div className="environment-container">
      {service.instanceStatsByEnvList.map((envInstanceMap, envIdx) => (
        <div key={envIdx} className="environment">
          <div className="env-label-box">
            <span className="env-label">{envInstanceMap.environmentSummary.name}</span>
            <div className="horizontal-bar" />
          </div>
          <div className="build-container">
            {envInstanceMap.instanceStatsByArtifactList.map((artifact, artifactIdx) => (
              <div key={artifactIdx} className="build-row">
                <div className="build-label-string">
                  <ArtifactBuildLabel
                    artifactSourceName={artifact.entitySummary.artifactSourceName}
                    buildNo={artifact.entitySummary.buildNo}
                  />
                  <span className="instances-string">
                    {`(${artifact.instanceStats.totalCount +
                      ' ' +
                      (artifact.instanceStats.totalCount === 1 ? 'instance' : 'instances')})`}
                  </span>
                </div>

                <div className="instance-container">
                  {/* Create a row of little blue boxes */}
                  {artifact.instanceStats.entitySummaryList.map((instance, instanceIdx) => (
                    <Popover
                      key={instanceIdx}
                      interactionKind={PopoverInteractionKind.HOVER}
                      position={Position.TOP}
                      hoverCloseDelay={100}
                      hoverOpenDelay={100}
                      transitionDuration={0}
                      popoverDidOpen={() => this.fetchInstanceDetails(instance.id)}
                      enforceFocus={false}
                      popoverClassName={'instance-popover'}
                    >
                      <blue-square />
                      <table-popover>
                        {this.renderInstancePopover({
                          title: 'Instance Details',
                          lineItems: this.state.popoverData.instanceDetails
                        })}
                        {this.renderInstancePopover({
                          title: 'Deployment',
                          lineItems: this.state.popoverData.deploymentDetails
                        })}
                      </table-popover>
                    </Popover>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  render () {
    const { service } = this.props
    return (
      <div className={css.main}>
        <ui-card>
          <header>
            <div className="header-left">
              <span
                className="service-name link-style"
                onClick={this.redirectToServiceInstancesSummaryPage.bind(
                  this,
                  service.serviceSummary.id,
                  service.serviceSummary.appSummary.id
                )}
              >
                {service.serviceSummary.name}
              </span>

              <span className="app-label"> Application:</span>
              <span className="app-name">{service.serviceSummary.appSummary.name}</span>
            </div>
            <div className="header-right">
              <blue-square no-hover class="total-square" />
              <span>{`${service.totalCount} instance${Utils.pluralize(service.totalCount)}`.toUpperCase()}</span>
            </div>
          </header>

          <main>{this.renderServiceSummaryCard(service)}</main>
        </ui-card>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServicesDashboardPage/ServiceSummaryCard.js