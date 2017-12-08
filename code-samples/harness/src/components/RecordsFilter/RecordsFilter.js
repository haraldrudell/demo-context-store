import React from 'react'
import css from './RecordsFilter.css'
import { observer } from 'mobx-react'
import Utils from '../Utils/Utils'
import { CheckboxDropdown } from '../CheckboxDropdown/CheckboxDropdown'
import { WorkflowService, PipelinesService } from 'services'
import { TimePickerPrecision, DateInput } from '@blueprintjs/datetime'
import { Button } from 'react-bootstrap'

@observer
export default class RecordsFilter extends React.Component {
  state = {
    __update: null,
    filterDefinitions: {}
  }

  statuses = [
    { name: 'Paused', id: 'PAUSED' },
    { name: 'Pausing', id: 'PAUSING' },
    { name: 'Waiting', id: 'WAITING' },
    { name: 'Error', id: 'ERROR' },
    { name: 'Failed', id: 'FAILED' },
    { name: 'Success', id: 'SUCCESS' },
    { name: 'Aborted', id: 'ABORTED' },
    { name: 'Aborting', id: 'ABORTING' },
    { name: 'Running', id: 'RUNNING' },
    { name: 'Queued', id: 'QUEUED' }
  ]

  componentWillMount = () => this.init()

  init = () => {
    this.initFilterDefinitions()
    this.fetchDataForFilterDropdowns()
  }

  initFilterDefinitions = () => {
    const filterDefinitions = {
      apps: {
        title: 'Applications',
        clearFilterFunction: this.clearListFilter,
        isFilterActiveFunction: this.isListFilterActive,
        items: [],
        idRefKey: 'appId',
        onSelectItem: this.onAppsSelectItem.bind(this),
        dependentFilters: ['pipelines', 'workflows', 'services', 'environments']
      },
      pipelines: {
        title: 'Pipelines',
        clearFilterFunction: this.clearListFilter,
        isFilterActiveFunction: this.isListFilterActive,
        onSelectItem: this.onSelectItem,
        items: [],
        idRefKey: 'uuid',
        parentAppReferenceKey: 'appId'
      },
      workflows: {
        title: 'Workflows',
        clearFilterFunction: this.clearListFilter,
        isFilterActiveFunction: this.isListFilterActive,
        onSelectItem: this.onSelectItem,
        items: [],
        idRefKey: 'uuid',
        parentAppReferenceKey: 'appId'
      },
      services: {
        title: 'Services',
        clearFilterFunction: this.clearListFilter,
        isFilterActiveFunction: this.isListFilterActive,
        onSelectItem: this.onSelectItem,
        items: [],
        idRefKey: 'uuid',
        parentAppReferenceKey: 'appId'
      },
      environments: {
        title: 'Environments',
        clearFilterFunction: this.clearListFilter,
        isFilterActiveFunction: this.isListFilterActive,
        onSelectItem: this.onSelectItem,
        items: [],
        idRefKey: 'uuid',
        parentAppReferenceKey: 'appId'
      },
      statuses: {
        title: 'Status',
        clearFilterFunction: this.clearListFilter,
        isFilterActiveFunction: this.isListFilterActive,
        onSelectItem: this.onSelectItem,
        items: [],
        idRefKey: 'id'
      },
      startTime: {
        title: 'Start Time',
        clearFilterFunction: this.clearTimeFilter,
        isFilterActiveFunction: this.isTimeFilterActive,
        value: null
      },
      endTime: {
        title: 'End Time',
        clearFilterFunction: this.clearTimeFilter,
        isFilterActiveFunction: this.isTimeFilterActive,
        value: null
      }
    }
    this.setState({ filterDefinitions })
  }

  // figure out parent name before hand
  createParentAppString = ({ item, parentAppReferenceKey, parentList }) => {
    if (parentAppReferenceKey) {
      const appName = Utils.getAppName(parentList, item[parentAppReferenceKey]) || ''
      item.labelExtension = ` (app: ${appName})`
    } else {
      return ''
    }
  }

  fetchDataForFilterDropdowns = async () => {
    // clone apps
    const apps = JSON.parse(JSON.stringify(this.props.apps || []))
    apps.forEach(app => (app.isSelected = false))
    // This is not in use, but is set up as a placeholder for when the filter params will be persisted in localStorage.
    // this.props.store.apps = apps

    await this.fetchData()
    const filterDefinitions = this.state.filterDefinitions

    filterDefinitions.apps.items = apps
    filterDefinitions.statuses.items = this.statuses
    filterDefinitions.services.items = this.getAllChildItemsOfParent({ parentList: apps, childRef: 'services' })
    filterDefinitions.environments.items = this.getAllChildItemsOfParent({
      parentList: apps,
      childRef: 'environments'
    })

    // Add parent name to data object to display as part of the filter line item.
    filterDefinitions.apps.dependentFilters.forEach(dependentFilterName => {
      const dependentFilter = filterDefinitions[dependentFilterName]
      dependentFilter.items.forEach(item => {
        const parentAppReferenceKey = dependentFilter.parentAppReferenceKey
        const parentList = apps
        this.createParentAppString({ item, parentAppReferenceKey, parentList })
      })
    })

    this.setState({ filterDefinitions })
  }

  isTimeFilterActive = filterDef => filterDef.value
  isListFilterActive = filterDef => filterDef.items.filter(item => item.isSelected).length > 0
  clearTimeFilter = filterDef => (filterDef.value = null)
  clearListFilter = filterDef => {
    filterDef.items.map(item => (item.isSelected = false))
    filterDef.items.map(item => (item.hide = false))
  }

  getNumActiveFilters = () =>
    Object.keys(this.state.filterDefinitions)
      .map(filterDefKey => {
        const filterDef = this.state.filterDefinitions[filterDefKey]
        return filterDef.isFilterActiveFunction(filterDef)
      })
      .reduce((count, result) => count + (result ? 1 : 0))

  fetchData = async () => {
    const { accountId } = this.props.urlParams
    const fetchKey = +new Date()
    this.fetchKey = fetchKey

    const getPipelines = PipelinesService.getPipelines(accountId)
    const getWorkflows = WorkflowService.getWorkflows(accountId)
    const { pipelines: pipelines = [], error: pipelinesError } = await getPipelines
    const { workflows: workflows = [], error: workflowsError } = await getWorkflows

    const filterDefinitions = this.state.filterDefinitions

    if (this.fetchKey === fetchKey) {
      if (pipelinesError) {
      } else if (workflowsError) {
      } else {
        filterDefinitions.pipelines.items = pipelines
        filterDefinitions.workflows.items = workflows
        this.setState({ filterDefinitions })
      }
    }
  }

  renderFilter = ({ filterProps }) => <CheckboxDropdown {...this.props} {...filterProps} />

  // TODO: put this in a conditional under onSelectItem, and pass a single callback, instead of one for each
  // filter def.
  onAppsSelectItem = () => {
    const parentFilterDef = this.state.filterDefinitions.apps
    const parentIdKey = 'uuid'
    const childFiltersDefs = this.state.filterDefinitions.apps.dependentFilters
    const parentRefInChild = 'appId'
    this.updateDependentFilters({ parentFilterDef, parentIdKey, childFiltersDefs, parentRefInChild })
    this.setState({ __update: 'app filter changed' })
  }

  onSelectItem = () => null

  updateDependentFilters = ({ parentFilterDef, parentIdKey, childFiltersDefs, parentRefInChild }) => {
    const idsOfSelectedItemsInParent = parentFilterDef.items
      .filter(item => item.isSelected)
      .map(item => item[parentIdKey])
    const ctx = this
    childFiltersDefs.forEach(childFilterName => {
      const filterDefinitions = ctx.state.filterDefinitions
      // If no parent filter items are selected, treat the situation as if all the parent filter items are selected.
      // This is because the dropdown is designed so that when none are selected, the filter is not being applied,
      // which is the same as having all selected.
      if (idsOfSelectedItemsInParent.length === 0) {
        filterDefinitions[childFilterName].items.forEach(item => (item.hide = false))
        return
      }

      filterDefinitions[childFilterName].items.forEach(item => {
        const itemNotPresentInParent = !idsOfSelectedItemsInParent.includes(item[parentRefInChild])
        if (itemNotPresentInParent) {
          item.hide = true
          item.isSelected = false
        } else {
          item.hide = false
        }
      })
      ctx.setState({ filterDefinitions })
    })
  }

  getAllChildItemsOfParent = ({ parentList, childRef }) =>
    parentList.reduce((allChildren, parent) => allChildren.concat(...parent[childRef]), [])

  getIdsOfSelectedItems = itemName => {
    const filterParams = this.state.filterDefinitions[itemName]
    const selectedIds = filterParams.items.filter(item => item.isSelected).map(item => item[filterParams.idRefKey])
    return selectedIds
  }

  createUrlParams = () => {
    // TODO: change this to object instead of an array.
    // Break it into define and update methods.
    const dbQueryDefs = [
      {
        property: 'appId',
        operation: 'IN',
        operationTarget: this.getIdsOfSelectedItems('apps')
      },
      {
        property: 'pipelineSummary.pipelineId',
        operation: 'IN',
        operationTarget: this.getIdsOfSelectedItems('pipelines')
      },
      {
        property: 'workflowId',
        operation: 'IN',
        operationTarget: this.getIdsOfSelectedItems('workflows')
      },
      {
        property: 'serviceIds',
        operation: 'IN',
        operationTarget: this.getIdsOfSelectedItems('services')
      },
      {
        property: 'envId',
        operation: 'IN',
        operationTarget: this.getIdsOfSelectedItems('environments')
      },
      {
        property: 'status',
        operation: 'IN',
        operationTarget: this.getIdsOfSelectedItems('statuses')
      },
      {
        property: 'createdAt',
        operation: 'GT',
        operationTarget: this.state.filterDefinitions.startTime.value
      },
      {
        property: 'createdAt',
        operation: 'LT',
        operationTarget: this.state.filterDefinitions.endTime.value
      }
    ]

    return Utils.getUrlParamsFromDbQueryDefs({ dbQueryDefs })
  }

  reFetchData = () => {
    const urlParams = this.createUrlParams()
    this.props.onRefilter({ urlParams })
    this.props.updateParentState({ numFiltersApplied: this.getNumActiveFilters() })
  }

  updateTimeFilter = (dataKey, timeObj) => {
    const filterDefinitions = this.state.filterDefinitions
    filterDefinitions[dataKey].value = timeObj.getTime()
    this.setState({ filterDefinitions })
  }

  clearDateFilter = (dataKey, ev) => {
    ev.stopPropagation()
    const filterDefinitions = this.state.filterDefinitions
    filterDefinitions[dataKey].value = null
    this.setState({ filterDefinitions })
  }

  renderDatePicker = ({ dataKey, label, value }) => {
    const dateDatePickerProps = {
      value: value ? new Date(value) : null,
      onChange: this.updateTimeFilter.bind(this, dataKey),
      format: 'MM/DD/YYYY h:mm A',
      timePrecision: TimePickerPrecision.MINUTE,
      className: css.timepopover,
      closeOnSelection: false
    }

    return (
      <date-picker-button>
        <date-label>{label}</date-label>
        <date-value>
          <DateInput {...dateDatePickerProps} />
          <clear-button onClick={this.clearDateFilter.bind(this, dataKey)} class="icons8-delete" />
        </date-value>
      </date-picker-button>
    )
  }

  clearFilters = () => {
    const filterDefinitions = this.state.filterDefinitions
    Object.keys(filterDefinitions).map(filterDefKey => {
      const filterDef = filterDefinitions[filterDefKey]
      filterDef.clearFilterFunction(filterDef)
    })
    this.setState({ filterDefinitions })
    this.forceUpdate()
    this.applyFilters()
  }

  applyFilters = () => this.reFetchData()

  render = () => {
    const leftFiltersColumn1 = [this.state.filterDefinitions.pipelines, this.state.filterDefinitions.workflows]
    const leftFiltersColumn2 = [this.state.filterDefinitions.services, this.state.filterDefinitions.environments]

    const startTimeProps = {
      label: this.state.filterDefinitions.startTime.title,
      value: this.state.filterDefinitions.startTime.value,
      dataKey: 'startTime'
    }

    const endTimeProps = {
      label: this.state.filterDefinitions.endTime.title,
      value: this.state.filterDefinitions.endTime.value,
      dataKey: 'endTime'
    }

    const showFilters = this.props.showFilters ? '' : 'wings-hide'

    return (
      <div className={`${css.main} ${showFilters}`}>
        <action-buttons-row>
          <clear-button onClick={this.props.onClose} class="icons8-delete" />
        </action-buttons-row>

        <filters-container>
          <left-filters>
            <dropdown-items applications>
              {this.renderFilter({ filterProps: this.state.filterDefinitions.apps })}
            </dropdown-items>
            <left-child-filters>
              <app-column-container>
                {leftFiltersColumn1.map((filterProps, filterIdx) => (
                  <dropdown-items key={filterIdx}>{this.renderFilter({ filterProps })}</dropdown-items>
                ))}
              </app-column-container>
              <app-column-container>
                {leftFiltersColumn2.map((filterProps, filterIdx) => (
                  <dropdown-items key={filterIdx}>{this.renderFilter({ filterProps })}</dropdown-items>
                ))}
              </app-column-container>
            </left-child-filters>
          </left-filters>
          <right-filters>
            <dropdown-items>{this.renderFilter({ filterProps: this.state.filterDefinitions.statuses })}</dropdown-items>
            {this.renderDatePicker(startTimeProps)}
            {this.renderDatePicker(endTimeProps)}
          </right-filters>
        </filters-container>
        <buttons-container>
          <clear-filters-button>
            <Button
              onClick={this.clearFilters.bind(this)}
              bsStyle="default"
              type="submit"
              className="submit-button clear-filters-button"
            >
              CLEAR
            </Button>
          </clear-filters-button>
          <apply-filters-button>
            <Button
              onClick={this.applyFilters}
              bsStyle="default"
              type="submit"
              className="submit-button apply-filters-button"
            >
              APPLY
            </Button>
          </apply-filters-button>
        </buttons-container>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/RecordsFilter/RecordsFilter.js