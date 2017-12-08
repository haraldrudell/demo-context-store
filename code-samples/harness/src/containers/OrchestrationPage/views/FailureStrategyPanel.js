import React from 'react'
import Select from 'react-select'
import { Utils, MultiSelect } from 'components'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import css from './SettingPanel.css'

export default class FailureStrategyPanel extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  // static propTypes = {} // React.PropTypes
  state = {
    togglerClass: this.props.showSummary === true ? '__collapsed' : '__expanded',
    failureStrategies: []
  }
  appIdFromUrl = Utils.appIdFromUrl()
  idFromUrl = Utils.getIdFromUrl()

  componentWillMount () {
    Utils.loadCatalogsToState(this)
  }

  componentWillReceiveProps (newProps) {
    const { failureStrategies, selectedPhaseStep } = newProps
    this.setState({ failureStrategies, selectedPhaseStep })
  }

  toggleSettingBox = () => {
    const newClass = this.state.togglerClass === '__expanded' ? '__collapsed' : '__expanded'
    this.setState({ togglerClass: newClass })
  }

  onSettingDropdownChange = (idx, settingKey, item) => {
    const settingArr = this.state['failureStrategies']
    if (['conditions', 'failureTypes', 'specificSteps'].indexOf(settingKey) >= 0) {
      const arr = item === '' ? [] : item.split(',')
      settingArr[idx][settingKey] = arr
    } else {
      settingArr[idx][settingKey] = item.value
    }
    this.setState({
      failureStrategies: settingArr
    })
    // this.props.onChange(settingArr)
  }

  onSubmit = () => {
    this.props.onChange(this.state.failureStrategies)
  }

  // transform state's Failure Strategy Array to Array for PUT API
  transformFailureStrategies = stateFailureStrategyArr => {
    const ret = []
    for (const failureStrategy of stateFailureStrategyArr) {
      ret.push({
        // failureTypes: [ failureStrategy.failureType ],
        failureTypes: failureStrategy.failureTypes,
        executionScope: failureStrategy.executionScope,
        repairActionCode: failureStrategy.repairActionCode,
        specificSteps: failureStrategy.specificSteps
      })
    }
    return ret
  }

  onSettingAdd = () => {
    const settingArr = this.state['failureStrategies']
    settingArr.push({})
    this.setState({
      failureStrategies: settingArr
    })
  }

  onManage = () => {
    const settingArr = this.state['failureStrategies']
    settingArr.push({})
    this.setState({
      failureStrategies: settingArr
    })
    this.props.onManage()
  }

  onSettingDelete = idx => {
    const settingArr = this.state['failureStrategies']
    settingArr.splice(idx, 1)
    this.props.onChange(this.state.failureStrategies)
    this.setState({
      failureStrategies: settingArr
    })
    // this.props.onChange(this.transformFailureStrategies(settingArr))
  }

  onRetryFieldChange = (ev, idx, settingKey) => {
    const settingArr = this.state['failureStrategies']
    if (settingKey === 'retryIntervals') {
      const arr = ev.target.value.split(',')
      const intervalArr = []
      for (const val of arr) {
        intervalArr.push(parseInt(val, 10))
      }
      settingArr[idx][settingKey] = intervalArr
    } else {
      settingArr[idx][settingKey] = parseInt(ev.target.value, 10)
    }
  }

  retryIntervalsHelpEl = () => {
    const tooltip = (
      <Popover title={'Retry Intervals (s)'}>
        <span>Multiple retry intervals can be entered using comma, such as 10, 30 etc.</span>
      </Popover>
    )
    return (
      <span>
        &nbsp;
        <OverlayTrigger placement="right" overlay={tooltip}>
          <i className="icons8-help-filled" />
        </OverlayTrigger>
      </span>
    )
  }

  render () {
    const steps = Utils.getJsonValue(this, 'state.selectedPhaseStep.steps') || []
    const failureStrategies = this.props.failureStrategies || []
    const isCustomModal = !!this.props.isCustomModal

    const specificSteps = steps.map(step => {
      return { label: step.name, value: step.name }
    })
    const scopeTypes = Utils.catalogToSelectArr(Utils.getJsonValue(this, 'state.catalogs.EXECUTION_SCOPE'))
    const failureTypes = Utils.catalogToSelectArr(Utils.getJsonValue(this, 'state.catalogs.FAILURE_TYPE'))
    const failureActions = Utils.catalogToSelectArr(Utils.getJsonValue(this, 'state.catalogs.REPAIR_ACTION_CODE'))
    let actionsAfterRetry = Utils.catalogToSelectArr(Utils.getJsonValue(this, 'state.catalogs.ACTION_AFTER_RETRY'))
    actionsAfterRetry = actionsAfterRetry.filter(item => item.value !== 'RETRY')

    return (
      <section className={css.main}>
        <div
          className={
            `__settingBox ${this.state.togglerClass}` + (this.props.showSummary !== true ? ' __settingBoxModal' : '')
          }
        >
          {this.props.showSummary === true && <h4 onClick={() => this.toggleSettingBox()}>Failure Strategy</h4>}

          {this.props.showSummary === true ? (
            <div className="__settingContent">
              {failureStrategies.map((failStrat, idx) => {
                failStrat.failureTypes = failStrat.failureTypes || []
                if (failStrat.failureTypes.length === 0) {
                  return null
                }
                const repairObj = failureActions.find(item => item.value === failStrat.repairActionCode)
                const repairText = repairObj && repairObj.label ? repairObj.label : ''
                const scopeObj = scopeTypes.find(item => item.value === failStrat.executionScope)
                const scopeText = scopeObj && scopeObj.label ? scopeObj.label : ''

                const types = []
                for (const type of failStrat.failureTypes) {
                  const failureType = failureTypes.find(t => t.value === type)
                  if (failureType) {
                    types.push(failureType.label)
                  }
                }
                return (
                  <div className="__settingItem" key={'failureStrategies_' + idx}>
                    <div className="__settingRow">
                      <span className="__settingIcon">&#9900;</span>
                      <span className="__deleteIcon">
                        <i className="icons8-pencil-tip icon" onClick={ev => this.props.onEdit(failStrat)} />
                        <i className="icons8-delete" onClick={ev => this.onSettingDelete(idx)} />
                      </span>
                      <span>
                        <span className="bold">{repairText}</span> {}
                        on <span className="bold">{types.join(' or ')}</span> {}
                        within {scopeText}
                      </span>
                    </div>
                  </div>
                )
              })}
              <div className="__settingFooter">
                <button className="__accent" onClick={this.onManage} disabled={this.props.loadingStatus !== 2}>
                  <strong>+ Add Failure Strategy</strong>
                </button>
              </div>
            </div>
          ) : (
            <div className="__settingContent">
              {failureStrategies.map((failStrat, idx) => {
                if (!isCustomModal) {
                  // rendering for Modal
                  if (this.props.editingItem && this.props.editingItem.hasOwnProperty('id')) {
                    // only render editingItem. Otherwise, return:
                    if (failStrat.id !== this.props.editingItem.id) {
                      return null
                    }
                  } else if (idx !== failureStrategies.length - 1) {
                    // this.props.editingItem === null => Adding a New Rule => only render the last Rule (newly added)
                    return null
                  }
                }
                failStrat.failureTypes = failStrat.failureTypes || []
                failStrat.specificSteps = failStrat.specificSteps || []
                failStrat.retryIntervals = failStrat.retryIntervals || []
                return (
                  <div
                    className={'__settingItem' + (isCustomModal === true && ' __customItem')}
                    key={'failureStrategies_' + idx}
                  >
                    <div className="__settingRow">
                      {(this.props.showSummary === true || isCustomModal === true) && (
                        <span className="__deleteIcon" onClick={item => this.onSettingDelete(idx)}>
                          <i className="icons8-delete" />
                        </span>
                      )}
                      <span className="__settingFormCol">Failure</span>
                      <MultiSelect
                        data={failureTypes}
                        value={failStrat.failureTypes.join(',')}
                        onChange={item => this.onSettingDropdownChange(idx, 'failureTypes', item)}
                      />
                    </div>
                    {isCustomModal === false && (
                      <div className="__settingRow">
                        <span className="__settingFormCol">Scope</span>
                        <Select
                          name="form-field-name"
                          placeholder="Select..."
                          value={failStrat.executionScope}
                          options={scopeTypes}
                          clearable={false}
                          autosize={true}
                          searchable={false}
                          onChange={item => this.onSettingDropdownChange(idx, 'executionScope', item)}
                        />
                      </div>
                    )}
                    <div className="__settingRow">
                      <span className="__settingFormCol">Action</span>
                      <Select
                        name="form-field-name"
                        placeholder="Select..."
                        value={failStrat.repairActionCode}
                        options={failureActions}
                        clearable={false}
                        autosize={true}
                        searchable={false}
                        onChange={item => this.onSettingDropdownChange(idx, 'repairActionCode', item)}
                      />
                    </div>

                    {failStrat.repairActionCode === 'RETRY' && (
                      <div>
                        <div className="__settingRow">
                          <span className="__settingFormCol">Retry Count</span>
                          <input
                            className="form-control __retryField"
                            defaultValue={failStrat.retryCount}
                            onChange={ev => this.onRetryFieldChange(ev, idx, 'retryCount')}
                          />
                        </div>
                        <div className="__settingRow">
                          <span className="__settingFormCol">
                            Retry Intervals (s)
                            {this.retryIntervalsHelpEl()}
                          </span>
                          <input
                            className="form-control __retryField"
                            defaultValue={failStrat.retryIntervals.join(', ')}
                            onChange={ev => this.onRetryFieldChange(ev, idx, 'retryIntervals')}
                          />
                        </div>
                        <div className="__settingRow">
                          <span className="__settingFormCol">Action after retry attempts</span>
                          <Select
                            name="form-field-name"
                            placeholder="Select..."
                            value={failStrat.repairActionCodeAfterRetry}
                            options={actionsAfterRetry}
                            clearable={false}
                            autosize={true}
                            searchable={false}
                            onChange={item => this.onSettingDropdownChange(idx, 'repairActionCodeAfterRetry', item)}
                          />
                        </div>
                      </div>
                    )}

                    {isCustomModal === true && (
                      <div className="__settingRow">
                        <span className="__settingFormCol">Specific Steps</span>
                        <MultiSelect
                          data={specificSteps}
                          value={failStrat.specificSteps.join(',')}
                          onChange={item => this.onSettingDropdownChange(idx, 'specificSteps', item)}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
              {this.props.isCustomModal === true && (
                <div className="__settingFooter">
                  <button className="__accent" onClick={() => this.onSettingAdd()}>
                    <strong>+ Add Failure Strategy</strong>
                  </button>
                </div>
              )}
              {!this.props.showSummary && (
                <div className="__footer">
                  <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/views/FailureStrategyPanel.js