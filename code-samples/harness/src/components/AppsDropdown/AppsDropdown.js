import React from 'react'
import { observer } from 'mobx-react'
import { Dropdown, FormControl, Checkbox } from 'react-bootstrap'
import { LabellingDropdown } from '../LabellingDropdown/LabellingDropdown'
import Utils from '../Utils/Utils'
import { browserHistory } from 'react-router'

@observer
export class AppsDropdown extends React.Component {
  state = {
    filterText: ''
  }

  buildLabel () {
    const { store } = this.props
    let label = store.apps.length ? 'All' : '...'
    const selectedApps = store.getSelectedApps()

    if (selectedApps && selectedApps.length) {
      label = selectedApps
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
        .map(app => app.name)
        .join(', ')
    }

    return label
  }

  onShow = () => {
    setTimeout(() => this.filterInput.focus(), 0)
  }

  onHide = () => {
    this.setState({ filterText: '' })
    this.forceUpdate()
  }

  handleFilterChange = e => {
    this.setState({ filterText: e.target.value })
    this.forceUpdate()
  }

  componentDidMount () {
    this.updateURL()
  }

  onSelect = (appId, e) => {
    const { props: { onSelected = () => {}, store }, state: { appStates = {} } } = this
    const app = store.apps.filter(app => app.appId === appId)[0]

    app.isSelected = app.isSelected ? false : true
    appStates[app.appId] = app.isSelected

    this.updateURL()
    this.setState({ appStates })
    this.forceUpdate() // mobx is slow to trigger re-rendering of subscribers, force updating instead

    onSelected(store.getSelectedApps()) // notify subscribers, immediately
  }

  updateURL = ({ shouldCleanStore } = { shouldCleanStore: true }) => {
    const { store } = this.props
    const selectedApps = store.getSelectedApps()
    const appIds = selectedApps.map(app => app.appId)
    const queryParams = Utils.getQueryParametersFromUrl(window.location.hash)

    // Last item got deselected? Clean up store
    if (shouldCleanStore && appIds.length === 0) {
      store.clearSelectedApps()
    }

    queryParams.appId = appIds
    browserHistory.replace(Utils.buildUrlFromQueryParams(queryParams))
  }

  shouldCloseOnClick = (isOpen, event, { source }) => {
    return source === 'rootClose'
  }

  highlightTextWithFilter = text => {
    const { state: { filterText = '' } } = this

    return Utils.highlightTextWithFilter(text, filterText)
  }

  clearAll = () => {
    const { store, onSelected = () => null } = this.props
    store.clearSelectedApps()
    this.updateURL({ shouldCleanStore: false })
    this.forceUpdate()
    onSelected(store.getSelectedApps())
  }

  renderMenuItems () {
    const { state } = this
    let { filterText = '' } = state
    const { props: { store: { apps } } } = this
    const width = '285px'

    if (!apps) {
      return null
    }

    filterText = filterText.toLowerCase()
    const filteredApps = apps
      .filter(app => !filterText || app.name.toLowerCase().indexOf(filterText) !== -1)
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
    const selectedCount = apps.reduce((sum, app) => sum + (app.isSelected ? 1 : 0), 0)

    return (
      <Dropdown.Menu style={{ width }} bsRole="menu">
        <li className="no-hover on-top" key="filter">
          <FormControl
            type="text"
            value={this.state.filterText}
            placeholder=""
            onChange={this.handleFilterChange}
            inputRef={ref => (this.filterInput = ref)}
          />
          <section className="clear">
            <label>{selectedCount > 0 && <strong>{selectedCount} selected</strong>}</label>
            <a onClick={selectedCount !== 0 && this.clearAll} className={selectedCount === 0 ? 'disabled' : ''}>
              Clear All
            </a>
          </section>
        </li>
        {filteredApps.map(app => (
          <li key={app.appId + app.isSelected} onClick={e => this.onSelect(app.appId, e)}>
            <Checkbox
              inline
              checked={app.isSelected === true}
              onChange={e => {
                e.stopPropagation()
                this.onSelect(app.appId, e)
              }}
              onClick={e => e.stopPropagation()}
            >
              {this.highlightTextWithFilter(app.name)}
            </Checkbox>
          </li>
        ))}
      </Dropdown.Menu>
    )
  }

  shouldComponentUpdate () {
    let { appStates } = this.state
    const { props: { store: { apps } } } = this
    let shouldUpdate = false

    if (!apps || !apps.length) {
      return false
    }

    if (!appStates) {
      appStates = {}
      apps.forEach(app => (appStates[app.appId] = app.isSelected))
      this.setState({ appStates })
      shouldUpdate = true
    } else {
      const appIds = []

      apps.forEach(app => {
        const { appId } = app

        if (appStates[appId] === undefined || appStates[appId] !== app.isSelected) {
          appStates[appId] = app.isSelected
          shouldUpdate = true
        }

        appIds.push(appId)
      })

      // Remove apps that not in the store any more
      Object.keys(appStates).forEach(appId => {
        if (appIds.indexOf(appId) === -1) {
          delete appStates[appId]
        }
      })

      if (shouldUpdate) {
        this.setState({ appStates })
      }
    }

    return shouldUpdate
  }

  render () {
    return (
      <LabellingDropdown
        width="250px"
        title="Applications"
        className="apps-dropdown"
        label={this.buildLabel()}
        shouldCloseOnClick={this.shouldCloseOnClick}
        onShow={this.onShow}
        onHide={this.onHide}
        items={this.renderMenuItems()}
      />
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/AppsDropdown/AppsDropdown.js