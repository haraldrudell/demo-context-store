import React from 'react'
import { Utils, TableFromSchema } from 'components'
import css from './DashboardServiceInstancesTables.css'
import { Link } from 'react-router'

export default class DashboardServiceInstancesTables extends React.Component {
  formatTime = dateString => Utils.formatDate(dateString)

  renderServiceNameString = ({ props }) => {
    const { dependentValues: service } = props
    const { urlParams: { accountId }, path } = this.props

    return (
      <Link to={path.toServiceDetails({ accountId, appId: service.appSummary.id, serviceId: service.id })}>
        <service-name-string>
          <service-name>{service.name}</service-name>
          <app-name>{`(${service.appSummary.name})`}</app-name>
        </service-name-string>
      </Link>
    )
  }

  headerRenderer = columnSchema => (
    <div className={`${columnSchema.column.columnHeaderClass}`}>{columnSchema.column.name}</div>
  )

  currentActiveInstancesTableSchema = [
    {
      name: 'Service',
      key: 'name',
      columnHeaderClass: 'first-column',
      class: 'link-style first-column',
      headerRenderer: schema => this.headerRenderer(schema),
      getRowMetaData: row => row, // passes in entire data object so you can find nested values
      formatter: props => this.renderServiceNameString({ props })
    },
    {
      name: 'Production Instances',
      key: 'numProdInstances',
      columnHeaderClass: 'align-center',
      class: 'align-center',
      headerRenderer: schema => this.headerRenderer(schema)
    },
    {
      name: 'Non-Production Instances',
      key: 'numNonProdInstances',
      columnHeaderClass: 'align-center',
      class: 'align-center',
      headerRenderer: schema => this.headerRenderer(schema)
    }

    // TODO be enabled when API is ready
    // {
    //   columnHeaderTitle: 'Last Production Deployment',
    //   getRowData: row => this.formatTime(row.deployedAt)
    // }
  ]

  baseTableProps = {
    rowHeight: 44,
    numRows: 10,
    hideHeader: true
  }

  tablePropsList = [
    {
      title: '',
      tableDataKey: 'currentActiveInstancesList',
      columns: this.currentActiveInstancesTableSchema,
      ...this.baseTableProps
    }
  ]

  render = () => {
    const { data: dataListsObject = null } = this.props

    if (!dataListsObject) {
      return <div />
    }

    return (
      <div className={css.main}>
        {this.tablePropsList.map((tableProps, tableIdx) => {
          const tableData = dataListsObject[tableProps.tableDataKey]

          return <TableFromSchema key={tableIdx} tableProps={tableProps} tableData={tableData} />
        })}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/Dashboard/DashboardServiceInstancesTables.js