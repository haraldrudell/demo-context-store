import React from 'react'
import { Utils, CompUtils, TableFromSchema } from 'components'
import css from './ServiceInstancesSummaryDetail.css'
import { Link } from 'react-router'
import { TruncateText, ArtifactBuildLabel } from 'components'

export default class ServiceInstancesSummaryDetail extends React.Component {
  redirectToEnvironment = this.props.params.redirectToEnvironment
  redirectToServiceItem = this.props.params.redirectToServiceItem
  redirectToWorkflow = this.props.params.redirectToWorkflow

  formatTime = dateString => <div>{Utils.formatDate(dateString)}</div>
  formatDate = dateString => <div>{Utils.formatDate(dateString, 'MM/DD/YYYY')} </div>
  createStatusElement = status => CompUtils.renderStatusText(status)

  createArtifactString = artifact => (
    <ArtifactBuildLabel artifactSourceName={artifact.name} buildNo={artifact.buildNo} />
  )

  headerRenderer = columnSchema => (
    <div className={`${columnSchema.column.columnHeaderClass}`}>{columnSchema.column.name}</div>
  )

  createEnvironmentsWithLinks = ({ environmentList }) => {
    return (
      <environment-container class="link-style">
        {environmentList &&
          environmentList.map((env, index) => (
            <environment-name class="link-style" key={index} onClick={this.redirectToEnvironment.bind(this, env.id)}>
              <TruncateText class="link-style" inputText={env.name} />
            </environment-name>
          ))}
      </environment-container>
    )
  }

  getDeploymentString = ({ pipeline, startTime }) => {
    const { accountId, appId } = this.props.urlParams
    const { path } = this.props

    return (
      <Link to={path.toDeploymentDetails({ accountId, appId, execId: pipeline.id })}>
        <deployment-string>
          <deployment-name>{pipeline.name}</deployment-name>
          <deployment-time>{this.formatTime(startTime)}</deployment-time>
        </deployment-string>
      </Link>
    )
  }

  renderValue = ({ redirectString, dependentValues, keyString, onClick, className }) => {
    const content = (
      <div onClick={onClick} className={className}>
        <TruncateText targetClass={className} inputText={Utils.getJsonValue(dependentValues, keyString)} />
      </div>
    )

    if (redirectString) {
      return <Link to={redirectString}>{content}</Link>
    } else {
      return content
    }
  }

  renderEnvironment = ({ redirectString, dependentValues, keyString, onClick, className }) => {
    const content = (
      <div onClick={onClick} className={className}>
        {Utils.getJsonValue(dependentValues, keyString)}
      </div>
    )

    if (redirectString) {
      return <Link to={redirectString}>{content}</Link>
    } else {
      return content
    }
  }

  getSharedProps = () => {
    return {
      getRowMetaData: row => row, // passes in entire data object so you can find nested values
      headerRenderer: schema => this.headerRenderer(schema),
      key: Math.random().toString(),
      class: 'align-center',
      columnHeaderClass: 'align-center'
    }
  }

  getCurrentActiveInstancesTableSchema = () => {
    const { accountId, appId } = this.props.urlParams
    const { path } = this.props

    return [
      {
        ...this.getSharedProps(),
        name: 'Environment',
        formatter: props =>
          this.renderEnvironment({
            ...props,
            redirectString: path.toEnvironmentsDetails({
              accountId,
              appId,
              envId: props.dependentValues.environment.id
            }),
            keyString: 'environment.name'
          }),
        columnHeaderClass: 'first-column',
        class: 'link-style first-column'
      },

      {
        ...this.getSharedProps(),
        formatter: props => this.renderValue({ ...props, keyString: 'instanceCount' }),
        name: 'Instances'
      },
      {
        ...this.getSharedProps(),
        name: 'Artifact',
        class: 'align-center',
        columnHeaderClass: 'align-center',
        onClick: this.redirectToServiceItem,
        formatter: props => this.createArtifactString(props.dependentValues.artifact)
      },
      {
        ...this.getSharedProps(),
        name: 'Service Infrastructure',
        formatter: props => this.renderValue({ ...props, keyString: 'serviceInfra.name' }),
        columnHeaderClass: 'align-left',
        class: 'align-left'
      },
      {
        ...this.getSharedProps(),
        name: 'Deployed at',
        columnHeaderClass: 'align-left',
        class: 'align-left',
        formatter: props => this.formatTime(props.dependentValues.deployedAt)
      }
    ]
  }

  getPipelineExecutionHistoryTableSchema = () => {
    return [
      {
        ...this.getSharedProps(),
        name: 'Deployment',
        columnHeaderClass: 'first-column',
        class: 'link-style first-column',
        formatter: props =>
          this.getDeploymentString({
            pipeline: props.dependentValues.pipeline,
            startTime: props.dependentValues.startTime
          })
      },
      {
        ...this.getSharedProps(),
        name: 'Artifact',
        class: 'align-center',
        formatter: props => this.createArtifactString(props.dependentValues.artifact),
        onClick: this.redirectToServiceItem
      },
      {
        name: 'Status',
        ...this.getSharedProps(),
        columnHeaderClass: 'align-left',
        class: 'align-left status-message',
        formatter: props => this.createStatusElement(props.dependentValues.status)
      },
      // {
      //   ...this.getSharedProps(),
      //   name: 'Triggered By',
      //   formatter: props => this.renderValue({ ...props, keyString: 'triggeredBy.name' })
      // },
      {
        ...this.getSharedProps(),
        name: 'Environments',
        formatter: props =>
          this.createEnvironmentsWithLinks({
            environmentList: props.dependentValues.environmentList
          })
      }
    ]
  }
  tablePropsList = [
    {
      title: 'Current Deployment Status',
      tableDataKey: 'currentActiveInstancesList',
      columns: this.getCurrentActiveInstancesTableSchema()
    },
    {
      title: 'Deployment History',
      tableDataKey: 'pipelineExecutionHistoryList',
      columns: this.getPipelineExecutionHistoryTableSchema()
    }
  ]

  baseTableProps = {
    rowHeight: 44,
    numRows: 10,
    hideHeader: true
  }

  render () {
    const { data: dataListsObject = null } = this.props.params
    if (!dataListsObject) {
      return <div />
    }

    return (
      <div className={`${css.main} service-details-table`}>
        {this.tablePropsList.map((tableProps, tableIdx) => {
          const tableData = dataListsObject[tableProps.tableDataKey]
          return <TableFromSchema key={tableIdx} tableProps={tableProps} tableData={tableData} />
        })}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceInstancesSummaryPage/ServiceInstancesSummaryDetail.js