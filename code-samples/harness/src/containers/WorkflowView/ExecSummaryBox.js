import React from 'react'
import { NavDropdown } from 'react-bootstrap'
import { CompUtils, Utils } from 'components'
import css from './ExecSummaryBox.css'

export default class ExecSummaryBox extends React.Component {
  render () {
    const { hasDetails } = this.props
    const propsData = this.props.data

    let infoCommand = ''
    let infoStrategy = ''

    if (propsData.workflowType === 'SIMPLE') {
      infoCommand = Utils.getJsonValue(propsData, 'executionArgs.commandName')
      infoStrategy = Utils.getJsonValue(propsData, 'executionArgs.executionStrategy')
    }
    const artifacts = Utils.getJsonValue(propsData, 'executionArgs.artifactIdNames') || {}
    const artifactNames = []
    for (const key in artifacts) {
      artifactNames.push(artifacts[key])
    }
    const finalStatus = CompUtils.renderStatusIcon(propsData.status, true)
    if (!propsData.status) {
      return null // don't render when data is not ready
    }
    const execArtifacts = Utils.getJsonValue(propsData, 'executionArgs.artifacts') || []

    return (
      <section className={css.main}>
        {finalStatus}

        {hasDetails && (
          <NavDropdown title="Details">
            {execArtifacts.map((artifact, artifactIndex) => {
              const serviceNames = []
              const execSummaries = propsData.serviceExecutionSummaries || []

              for (const svcId of artifact.serviceIds) {
                execSummaries.map(execSumm => {
                  if (execSumm.contextElement.elementType === 'SERVICE' && execSumm.contextElement.uuid === svcId) {
                    serviceNames.push(execSumm.contextElement.name)
                  }
                })
              }

              const lineItemdata = [
                { title: 'Service', value: serviceNames },
                {
                  /* title: 'Artifact', value: infoArtifactsLonger */
                },
                { title: 'Command', value: infoCommand },
                { title: 'Strategy', value: infoStrategy },
                {
                  /* { title: 'Instances', value: infoTotalInstances },*/
                },
                {
                  /* { title: 'Revision', value: artifact.revision },*/
                },
                { title: 'Build Source', value: artifact.artifactSourceName },
                { title: 'Build No.', value: artifact.metadata.buildNo }
              ]

              return (
                <div key={artifactIndex}>
                  {lineItemdata.map((lineItem, index) => {
                    if (!lineItem.value) {
                      return null
                    }

                    return (
                      <div key={index} className="__row">
                        <span className="__summaryHeader">{lineItem.title}:</span>
                        <span>{lineItem.value}</span>
                      </div>
                    )
                  })}

                  {/* Add a div that acts as a horizontal separator line for all but the final section. */}
                  {artifactIndex === execArtifacts.length - 1 ? null : <div className={css.artifactSummary}> </div>}
                </div>
              )
            })}
          </NavDropdown>
        )}
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/ExecSummaryBox.js