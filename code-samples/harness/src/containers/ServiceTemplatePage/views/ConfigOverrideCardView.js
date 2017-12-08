import React from 'react'
import { PanelGroup, Panel } from 'react-bootstrap'
import { Utils } from 'components'
import apis from 'apis/apis'
import css from './InfrastructureMappingCardView.css'
import filesize from 'filesize'
const allServices = 'All'
export default class ConfigOverrideCardView extends React.Component {
  state = {
    configVarExpanded: {},
    configFileExpanded: {},
    overridesData: [],
    noConfigsCls: 'hide',
    spinnerClass: ''
  }
  filteredData = []
  componentDidMount () {}
  componentWillReceiveProps (newProps) {
    let filteredData

    if (newProps.params.data !== null) {
      filteredData = this.filterServicesByOverrides(newProps.params.data)
      if (filteredData.length === 0) {
        this.setState({ noConfigsCls: '' })
      } else if (filteredData.length > 0) {
        this.setState({ noConfigsCls: 'hide' })
      }
      if (newProps.selectedPanel) {
        this.setScrollIntoView(newProps.selectedPanel)
      }
      this.setConfigExpand(filteredData, newProps.selectedPanel)
    }
  }
  setScrollIntoView = selectedPanel => {
    const selectedPanelRef = this.refs[selectedPanel]
    if (selectedPanelRef) {
      selectedPanelRef.scrollIntoView({ block: 'end', behavior: 'smooth' })
    }
  }
  componentDidMount () {
    if (this.props.selectedPanel) {
      this.setScrollIntoView(this.props.selectedPanel)
    }
    /* setTimeout(() => this.setState({ spinnerClass: 'hide' }), 1500)*/
  }
  setExpansion = (selectedServicePanelName, serviceName, index) => {
    if (index === 0) {
      if (serviceName === selectedServicePanelName) {
        return true
      } else {
        return !selectedServicePanelName ? true : false
      }
      // return true
    } else if (serviceName === selectedServicePanelName) {
      return true
    }
    return false
  }

  setExpansionForAllServices = (currentFileExpanded, currentVarExpanded, selectedServicePanelName) => {
    if (this.props.envServiceVariables.length > 0 || selectedServicePanelName === allServices) {
      currentVarExpanded[allServices] = {}
      currentVarExpanded[allServices].expanded = this.setExpansion(selectedServicePanelName, allServices, 0)
      currentVarExpanded[allServices].className = currentVarExpanded[allServices].expanded ? 'expanded' : ''
    }
    if (this.props.envFileOverrides.length > 0 || selectedServicePanelName === allServices) {
      currentFileExpanded[allServices] = {}
      currentFileExpanded[allServices].expanded = this.setExpansion(selectedServicePanelName, allServices, 0)
      currentFileExpanded[allServices].className = currentFileExpanded[allServices].expanded ? 'expanded' : ''
    }
    if (this.props.envServiceVariables.length > 0 || this.props.envFileOverrides.length > 0) {
      return true
    }
    return false
  }

  setConfigExpand = (filteredData, selectedServicePanelName) => {
    const currentVarExpanded = Utils.clone(this.state.configVarExpanded)
    const currentFileExpanded = Utils.clone(this.state.configFileExpanded)
    let index = 0
    // const resLen = filteredData.length - 1
    const hasAllOverrides = this.setExpansionForAllServices(
      currentFileExpanded,
      currentVarExpanded,
      selectedServicePanelName
    )
    index = hasAllOverrides ? 1 : 0

    if (filteredData && filteredData.length > 0) {
      for (const data of filteredData) {
        const config = data.name
        if (
          data.serviceVariablesOverrides.length > 0 &&
          (!currentVarExpanded.hasOwnProperty(config) ||
            (index === 0 && config !== selectedServicePanelName) ||
            config === selectedServicePanelName)
        ) {
          currentVarExpanded[data.name] = {}
          currentVarExpanded[data.name].expanded = this.setExpansion(selectedServicePanelName, config, index)
          currentVarExpanded[config].className = currentVarExpanded[data.name].expanded ? 'expanded' : ''
        }
        if (
          data.configFilesOverrides.length > 0 &&
          (!currentFileExpanded.hasOwnProperty(config) ||
            (index === 0 && config !== selectedServicePanelName) ||
            config === selectedServicePanelName)
        ) {
          currentFileExpanded[data.name] = {}
          currentFileExpanded[data.name].expanded = this.setExpansion(selectedServicePanelName, config, index)
          currentFileExpanded[config].className = currentFileExpanded[data.name].expanded ? 'expanded' : ''
        }
        index++
      }
      this.setState({
        configVarExpanded: currentVarExpanded,
        configFileExpanded: currentFileExpanded
      })
    }
    if (hasAllOverrides) {
      this.setState({
        configVarExpanded: currentVarExpanded,
        configFileExpanded: currentFileExpanded
      })
    }
    this.setState({ overridesData: filteredData })
  }

  downloadFile = (e, item) => {
    e.preventDefault()
    Utils.downloadFile(apis.getConfigDownloadUrl(this.props.params.appIdFromUrl, item.uuid), item.fileName)
  }

  checksum = item => {
    if (item) {
      let _r = item.checksumType ? item.checksumType : ''
      _r += item.checksum ? ':' + item.checksum : ''
      return _r.length > 0 ? _r : null
    }
    return null
  }

  displayConfig (configFileOverrides, serviceTemplate) {
    const __keys = configFileOverrides.map(file => file.relativeFilePath)
    const __objServiceConfigs = {}

    __keys.forEach(k => {
      const f = configFileOverrides.filter(c => c.relativeFilePath === k)
      __objServiceConfigs[k] = f
    })
    const __objKeys = Object.keys(__objServiceConfigs)
    return (
      <div className="__override-content">
        {__objKeys.map((key, index) => (
          <div key={key}>
            <div className="__file-info __override-info">
              <span className="__fileHeading">
                {key} &nbsp;
                <span className="__fileSize">({filesize(__objServiceConfigs[key][0].size)})</span>
              </span>
              <span className="__file-actions">
                <span>
                  {!__objServiceConfigs[key][0].encrypted && (
                    <i
                      className="icons8-installing-updates-2"
                      title="Download"
                      onClick={e => this.downloadFile(e, __objServiceConfigs[key][0])}
                    />
                  )}
                  <i
                    className="icons8-pencil-tip"
                    title="Edit"
                    onClick={this.props.params.onEditConfigFileOverride.bind(this, serviceTemplate, [
                      __objServiceConfigs[key][0]
                    ])}
                  />
                  <i
                    className="icons8-delete"
                    onClick={this.props.params.onDeleteConfigOverride.bind(
                      this,
                      serviceTemplate,
                      __objServiceConfigs[key][0]
                    )}
                  />
                </span>
              </span>
            </div>

            {index < __objKeys.length - 1 && <div className="__border" />}
          </div>
        ))}
      </div>
    )
  }
  getOverrides (configurations, overrides) {
    if (configurations.length === 0) {
      return overrides
    } else if (overrides.length === 0) {
      return configurations
    }
    const result = configurations.reduce((res, key, index) => {
      if (overrides.indexOf(configurations[index]) === -1) {
        // delete configVariables[index].value
        overrides.push(configurations[index])
      }
      return overrides
    }, [])

    return result
  }

  getValue = item => {}

  displayServiceVariables (serviceVariablesOverrides, serviceTemplate) {
    const __keys = serviceVariablesOverrides.map(variable => variable.name)
    const __objServiceVariables = {}
    __keys.forEach(k => {
      const f = serviceVariablesOverrides.filter(c => c.name === k)
      __objServiceVariables[k] = f
    })
    const __objKeys = Object.keys(__objServiceVariables)
    return (
      <div className="__override-content">
        {__objKeys.map((key, index) => (
          <div key={key}>
            <div className="__override-info">
              <span className="__subHeading">{key}</span>
              <span className="__override-val">
                {Utils.getValueForConfig(__objServiceVariables[key][0])}

                <span className="__override-actions">
                  <span>
                    <i
                      className="icons8-pencil-tip"
                      title="Edit"
                      onClick={this.props.params.onEditConfigVarOverride.bind(this, serviceTemplate, [
                        __objServiceVariables[key][0]
                      ])}
                    />
                    <i
                      className="icons8-delete"
                      onClick={this.props.params.onDeleteConfigVarOverride.bind(
                        this,
                        serviceTemplate,
                        __objServiceVariables[key][0]
                      )}
                    />
                  </span>
                </span>
              </span>

              {/* <div className="__list-view" >

                   {this.displayServiceList(__objServiceVariables[key], serviceTemplate)}
                 </div>*/}
            </div>
            {index < __objKeys.length - 1 && <div className="__border" />}
          </div>
        ))}
      </div>
    )
  }
  getOverrideType (overrideType) {
    if (overrideType !== undefined && overrideType !== null && this.props.overrideScope) {
      return this.props.overrideScope.find(type => type.value === overrideType).name
    }
  }
  displayServiceList (serviceArr, serviceTemplate) {
    if (serviceArr.length > 0) {
      return (
        <ol>
          {serviceArr.map((config, cIndx) => (
            <li key={cIndx * 10}>
              <div className="__override-item">
                <span className="__override-val">{serviceArr[cIndx].value}</span>

                {/* serviceArr[cIndx] !== null ? ( <span >
                 ({this.getOverrideType(serviceArr[cIndx].overrideType)})
              </span>) : null)}*/}
                <span className="wings-card-actions __override-actions">
                  <span>
                    <i
                      className="icons8-pencil-tip"
                      title="Edit"
                      onClick={this.props.params.onEditConfigVarOverride.bind(this, serviceTemplate, [
                        serviceArr[cIndx]
                      ])}
                    />
                    <i
                      className="icons8-delete"
                      onClick={this.props.params.onDeleteConfigVarOverride.bind(
                        this,
                        serviceTemplate,
                        serviceArr[cIndx]
                      )}
                    />
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ol>
      )
    }
  }

  editConfigurationOverride (modalData) {}

  displayVariableOverrides (serviceTemplate) {
    if (serviceTemplate !== null) {
      const serviceVariablesOverrides = serviceTemplate.serviceVariablesOverrides

      return (
        <div className="col-md-6 overrides-width override-columns">
          <div className="__override-header __border">
            <span className="__serviceName">{serviceTemplate.name}</span>
          </div>
          {serviceVariablesOverrides &&
            serviceVariablesOverrides.length > 0 &&
            this.displayServiceVariables(serviceVariablesOverrides, serviceTemplate)}
        </div>
      )
    }
  }

  displayFileOverrides (serviceTemplate) {
    if (serviceTemplate !== null) {
      // const configFiles = serviceTemplate.serviceConfigFiles
      const configFilesOverrides = serviceTemplate.configFilesOverrides
      // const overridesList = this.getOverrides(Utils.clone(configFiles), Utils.clone(configFilesOverrides))
      // const artifactType = serviceTemplate.serviceArtifactType
      return (
        <div className="col-md-6 overrides-width second-column override-columns">
          <div className="__override-header __border">
            <span className="__serviceName">{serviceTemplate.name}</span>
          </div>
          {configFilesOverrides && this.displayConfig(configFilesOverrides, serviceTemplate)}
        </div>
      )
    }
  }

  getServicesForVarOverrides = services => {
    return services.filter(service => service.serviceVariablesOverrides.length > 0)
  }
  getServicesForFileOverrides = services => {
    return services.filter(service => service.configFilesOverrides.length > 0)
  }
  //   {fileOverrideServices && this.displayFileOverrides(fileOverrideServices)}
  //  {this.displayVariableOverrides(item)}
  filterServicesByOverrides = data => {
    const filteredData = Object.keys(data).reduce((result, key, index) => {
      const varOverrides = data[key].serviceVariablesOverrides
      const fileOverides = data[key].configFilesOverrides
      if (varOverrides.length > 0 && fileOverides.length > 0) {
        result.push(data[key])
      } else if (varOverrides.length > 0 && fileOverides.length === 0) {
        result.push(data[key])
      } else if (fileOverides.length > 0 && varOverrides.length === 0) {
        result.push(data[key])
      }
      return result
    }, [])

    return Utils.sortDataByKey(filteredData, 'name')
  }
  onSelectConfigVarPanel = serviceName => {
    const boolValue = this.state.configVarExpanded[serviceName].expanded
    const expanded = this.state.configVarExpanded
    expanded[serviceName].expanded = !boolValue
    expanded[serviceName].className = expanded[serviceName].expanded ? 'expanded' : ''
    this.setState({ expanded })
  }
  onSelectConfigFilePanel = serviceName => {
    const boolValue = this.state.configFileExpanded[serviceName].expanded
    const expanded = this.state.configFileExpanded
    expanded[serviceName].expanded = !boolValue
    expanded[serviceName].className = expanded[serviceName].expanded ? 'expanded' : ''
    this.setState({ expanded })
  }
  renderInfoForNoOverrides = () => {
    if (
      this.state.overridesData.length === 0 &&
      this.props.loadingStatus === 2 &&
      this.props.envServiceVariables.length === 0 &&
      this.props.envFileOverrides.length === 0
    ) {
      const className = this.props.noConfigsCls !== 'hide' ? this.props.noConfigsCls : this.state.noConfigsCls
      return (
        <main className={`no-data-box ${className}`}>
          No Service Configuration Overrides.
          <span
            className="wings-text-link cta-button"
            onClick={() => {
              this.props.params.onConfigAdd()
            }}
          >
            {' '}
            Add Configuration Overrides
          </span>
        </main>
      )
    }
  }
  renderEnvironmentVariableOverridesPanel = () => {
    if (this.props.envServiceVariables.length > 0) {
      return (
        <Panel
          header="Variable Overrides"
          eventKey="1"
          collapsible
          onSelect={this.onSelectConfigVarPanel.bind(this, 'All')}
          className={this.renderClassNameForAllServicesVarOverrides()}
          expanded={this.renderExpandedClass('variable')}
        >
          <div className="Override-List">
            <div>
              <div className="__varOverride-firstCol">Configuration Variable</div>
              <div className="__varOverride-secondCol">Override Value</div>
            </div>
            {this.props.envServiceVariables.map((item, index) => {
              return (
                <div className="__override-content">
                  <div key={item.name}>
                    <div className="__override-info">
                      <span className="__subHeading">{item.name}</span>
                      <span className="__override-val">
                        {Utils.getValueForConfig(item)}
                        <span className="__override-actions">
                          <span>
                            <i
                              className="icons8-pencil-tip"
                              title="Edit"
                              onClick={this.props.params.onEditAllConfigVarOverride.bind(this, [item])}
                            />
                            <i
                              className="icons8-delete"
                              onClick={this.props.params.onDeleteAllConfigVarOverride.bind(this, item)}
                            />
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>
      )
    }
  }
  renderClassNameForAllServicesFileOverrides = () => {
    const configFileExpanded = Utils.clone(this.state.configFileExpanded)
    if (configFileExpanded.hasOwnProperty('All') && configFileExpanded['All'].className) {
      return configFileExpanded['All'].className
    }
  }
  renderClassNameForAllServicesVarOverrides = () => {
    const configVarExpanded = Utils.clone(this.state.configVarExpanded)
    if (configVarExpanded.hasOwnProperty('All') && configVarExpanded['All'].className) {
      return configVarExpanded['All'].className
    }
  }
  renderExpandedClass = type => {
    if (type === 'variable') {
      const configVarExpanded = Utils.clone(this.state.configVarExpanded)
      if (configVarExpanded.hasOwnProperty('All')) {
        return configVarExpanded['All'].expanded
      }
    } else if (type === 'file') {
      const configFileExpanded = Utils.clone(this.state.configFileExpanded)
      if (configFileExpanded.hasOwnProperty('All')) {
        return configFileExpanded['All'].expanded
      }
    }
  }
  renderEnvFileOverridesPanel = () => {
    if (this.props.envFileOverrides.length > 0) {
      return (
        <Panel
          header="File Overrides"
          eventKey="2"
          collapsible
          onSelect={this.onSelectConfigFilePanel.bind(this, 'All')}
          className={this.renderClassNameForAllServicesFileOverrides()}
          expanded={this.renderExpandedClass('file')}
        >
          <div className="Override-List">
            <div>
              <span className="__varOverride-firstCol">Relative FilePath(Size)</span>
            </div>
            {this.props.envFileOverrides.map((item, index) => {
              return (
                <div className="__override-content">
                  <div key={item.name}>
                    <div className="__file-info __override-info">
                      <span className="__fileHeading">{item.fileName}</span>
                      <span className="__fileSize">({filesize(item.size)})</span>
                      <span className="__file-actions">
                        <span>
                          {!item.encrypted && (
                            <i
                              className="icons8-installing-updates-2"
                              title="Download"
                              onClick={e => this.downloadFile(e, item)}
                            />
                          )}
                          <i
                            className="icons8-pencil-tip"
                            title="Edit"
                            onClick={this.props.params.onEditAllConfigFileOverride.bind(this, [item])}
                          />
                          <i
                            className="icons8-delete"
                            onClick={this.props.params.onDeleteAllConfigFileOverride.bind(this, item)}
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>
      )
    }
  }
  renderOverridesForEnvironment = () => {
    if (this.props.envServiceVariables.length > 0 || this.props.envFileOverrides.length > 0) {
      return (
        <div key={'env'} className="override-items ">
          <div className="row __details">
            <div className="col-md-2 __serviceNameDiv">
              <div className="service-name">All Services</div>
              <span />
            </div>

            <PanelGroup>
              {this.props.envServiceVariables.length > 0 && (
                <div className="col-md-10 overrides-width header-columns configvar-Overrides">
                  {this.renderEnvironmentVariableOverridesPanel()}
                </div>
              )}
              {this.props.envFileOverrides.length > 0 && (
                <div className="col-md-10 overrides-width header-columns configFile-Overrides">
                  {this.renderEnvFileOverridesPanel()}
                </div>
              )}
            </PanelGroup>
          </div>
          {this.state.overridesData.length > 0 && <div className="__border" />}
        </div>
      )
    } else {
      return null
    }
  }
  render () {
    return (
      <div className={`${css.main} box-solid wings-card`}>
        <div className="box-header">
          <div className="wings-card-header">
            <div>Service Configuration Overrides</div>
            <a className={'wings-text-link __config-button'} onClick={() => this.props.params.onConfigAdd()}>
              <i className="icons8-plus-math" /> Add Configuration Overrides
            </a>
          </div>
        </div>
        <div className="box-body wings-card-body">
          {this.renderOverridesForEnvironment()}

          {this.state.overridesData.length > 0 &&
            this.state.overridesData.map((item, index) => (
              <div key={index} className="override-items">
                <div className="row __details" key={item.uuid} ref={item.name}>
                  <div className="col-md-2 __serviceNameDiv">
                    <div
                      className="service-name"
                      onClick={() => {
                        // Utils.redirect({ appId: item.appId, serviceId: item.serviceId, page: 'detail' })
                      }}
                    >
                      {item.name}
                    </div>
                    <span className="__artifactType">
                      ({Utils.getCatalogDisplayText(this.props.catalogs, 'ARTIFACT_TYPE', item.serviceArtifactType)})
                    </span>
                  </div>
                  {/* Override list*/}
                  <PanelGroup activeKey="1">
                    {item.serviceVariablesOverrides.length > 0 && (
                      <div className="col-md-10 overrides-width header-columns configvar-Overrides">
                        <Panel
                          header="Variable Overrides"
                          eventKey="1"
                          collapsible
                          onSelect={this.onSelectConfigVarPanel.bind(this, item.name)}
                          className={this.state.configVarExpanded[item.name].className}
                          expanded={this.state.configVarExpanded[item.name].expanded}
                        >
                          <div className="Override-List">
                            <div>
                              <div className="__varOverride-firstCol">Configuration Variable</div>
                              <div className="__varOverride-secondCol">Override Value</div>
                            </div>
                            {this.displayServiceVariables(item.serviceVariablesOverrides, item)}
                          </div>
                        </Panel>
                      </div>
                    )}
                    {item.configFilesOverrides.length > 0 && (
                      <div className="col-md-10 overrides-width header-columns configFile-Overrides">
                        <Panel
                          header="File Overrides"
                          eventKey="2"
                          collapsible
                          onSelect={this.onSelectConfigFilePanel.bind(this, item.name)}
                          className={this.state.configFileExpanded[item.name].className}
                          expanded={this.state.configFileExpanded[item.name].expanded}
                        >
                          <div className="Override-List">
                            <div>
                              <span className="__varOverride-firstCol">Relative FilePath(Size)</span>
                            </div>
                            {this.displayConfig(item.configFilesOverrides, item)}
                          </div>
                        </Panel>
                      </div>
                    )}
                  </PanelGroup>
                </div>
                {index < this.state.overridesData.length - 1 && <div className="__border" />}
              </div>
            ))}
          {this.renderInfoForNoOverrides()}
          {this.props.loadingStatus !== 2 && <span className={'wings-spinner'} />}
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplatePage/views/ConfigOverrideCardView.js