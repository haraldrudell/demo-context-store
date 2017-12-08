import React from 'react'
import Select from 'react-select'
import { Utils, MultiSelect, NotificationGroupModal } from 'components'
import { observer } from 'mobx-react'
import css from './SettingPanel.css'

@observer
class NotificationStrategyPanel extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  // static propTypes = {} // React.PropTypes
  state = {
    togglerClass: this.props.showSummary === true ? '__collapsed' : '__expanded',
    notificationRules: [],
    showModal: false
  }
  appIdFromUrl = Utils.appIdFromUrl()
  idFromUrl = Utils.getIdFromUrl()

  componentWillMount () {
    Utils.loadCatalogsToState(this)
    this.props.dataStore.fetchNotificationGroups(this.appIdFromUrl)
  }

  componentWillReceiveProps (newProps) {
    this.setState({ notificationRules: newProps.notificationRules })
  }

  toggleSettingBox = () => {
    const newClass = this.state.togglerClass === '__expanded' ? '__collapsed' : '__expanded'
    this.setState({ togglerClass: newClass })
  }

  onSettingDropdownChange = (idx, settingKey, item) => {
    const settingArr = this.state['notificationRules']
    if (settingKey === 'conditions' || settingKey === 'failureTypes') {
      const arr = item === '' ? [] : item.split(',')
      settingArr[idx][settingKey] = arr
    } else {
      settingArr[idx][settingKey] = item.value
    }
    this.setState({
      notificationRules: settingArr
    })
    // this.props.onChange(this.transformNotificationRules(settingArr))
  }

  onSubmit = () => {
    this.props.onChange(this.transformNotificationRules(this.state.notificationRules))
  }

  onNotifGroupDropdownChange = (idx, item) => {
    if (item.indexOf('NEW') >= 0) {
      this.setState({ showModal: true })
      return
    }
    const settingArr = this.state['notificationRules']
    const arr = item.split(',')
    settingArr[idx]['notificationGroups'] = Utils.mapToUuidArray(arr)
    this.setState({
      notificationRules: settingArr
    })
    // this.props.onChange(this.transformNotificationRules(settingArr))
  }

  // transform state's Rule Array to Array for PUT API
  transformNotificationRules = stateRuleArr => {
    const rules = []
    for (const rule of stateRuleArr) {
      rules.push({
        conditions: rule.conditions,
        executionScope: rule.executionScope,
        notificationGroups: rule.notificationGroups,
        batchNotifications: rule.batchNotifications,
        active: true
      })
    }
    return rules
  }

  onSettingAdd = () => {
    const settingArr = this.state['notificationRules']
    settingArr.push({})
    this.setState({
      notificationRules: settingArr
    })
  }

  onManage = () => {
    const settingArr = this.state['notificationRules']
    settingArr.push({})
    this.setState({
      notificationRules: settingArr
    })
    this.props.onManage()
  }

  onSettingDelete = idx => {
    const settingArr = this.state['notificationRules']
    settingArr.splice(idx, 1)
    this.props.onChange(this.transformNotificationRules(settingArr))
    this.setState({
      notificationRules: settingArr
    })
  }

  onGroupAdded = newGroup => {
    this.props.dataStore.notificationGroups.push(newGroup)
    Utils.hideModal.bind(this)()
  }

  render () {
    const notificationRules = this.props.notificationRules || []

    const notifConditions = Utils.catalogToSelectArr(Utils.getJsonValue(this, 'state.catalogs.NOTIFICATION_CONDITION'))
    const scopeTypes = Utils.catalogToSelectArr(Utils.getJsonValue(this, 'state.catalogs.EXECUTION_SCOPE'))
    const notifBatch = [{ label: 'No Batching', value: false }, { label: 'Batch All', value: true }]
    const notifGroups = [
      {
        label: '+ New Group',
        value: 'NEW'
      }
    ]

    let enableSubmit = true

    if (this.props.dataStore.notificationGroups && this.props.dataStore.notificationGroups.length > 0) {
      for (const group of this.props.dataStore.notificationGroups) {
        notifGroups.push({
          label: group.name,
          value: group.uuid
        })
      }
    }
    return (
      <section className={css.main}>
        <div
          className={
            `__settingBox ${this.state.togglerClass}` + (this.props.showSummary !== true ? ' __settingBoxModal' : '')
          }
        >
          {this.props.showSummary === true && <h4 onClick={() => this.toggleSettingBox()}>Notification Strategy</h4>}

          {this.props.showSummary === true
            ? <div className="__settingContent">
              {notificationRules.map((notif, idx) => {
                notif.conditions = notif.conditions || []
                notif.notificationGroups = notif.notificationGroups || []
                // const notifGroupValue = notif.notificationGroups.map(item => item.uuid).join(',')
                if (notif.notificationGroups.length === 0) {
                  return null
                }
                const groupNames = notif.notificationGroups.map(group => {
                  const groupObj = this.props.dataStore.notificationGroups.slice().find(g => g.uuid === group.uuid)
                  return groupObj ? groupObj.name : ''
                })
                let groupNamesText = ''
                if (groupNames.length > 0) {
                  groupNamesText = groupNames[0]
                  groupNamesText += groupNames.length >= 2 ? ' and ' + (groupNames.length - 1) + ' more' : ''
                }
                const scope = scopeTypes.find(item => item.value === notif.executionScope)
                const scopeText = scope ? scope.label : ''

                return (
                  <div className="__settingItem" key={'notificationRules_' + idx}>
                    <div className="__settingRow">
                      <span className="__settingIcon">&#9900;</span>
                      <span className="__deleteIcon">
                        <i className="icons8-pencil-tip icon" onClick={ev => this.props.onEdit(notif)} />
                        <i className="icons8-delete" onClick={ev => this.onSettingDelete(idx)} />
                      </span>
                      <span>
                          Notify <span className="bold">{groupNamesText}</span> on {}
                        <span className="bold capitalize">{notif.conditions.join(' or ').toLowerCase()}</span> {}
                          within <span className="capitalize">{scopeText}</span>
                        {/* - Groups: {notif.notificationGroups.map(item => item.name).join(', ')} */}
                      </span>
                    </div>
                  </div>
                )
              })}
              <div className="__settingFooter">
                <button onClick={this.onManage} disabled={this.props.loadingStatus !== 2}>
                    + Add Notification Strategy
                </button>
              </div>
            </div>
            : <div className="__settingContent">
              {notificationRules.map((notif, idx) => {
                // rendering for Modal
                if (this.props.editingItem && this.props.editingItem.uuid) {
                  // only render editingItem. Otherwise, return:
                  if (notif.uuid !== this.props.editingItem.uuid) {
                    return null
                  }
                } else if (idx !== notificationRules.length - 1) {
                  // this.props.editingItem === null => Adding a New Rule => only render the last Rule (newly added)
                  return null
                }
                notif.conditions = notif.conditions || []
                notif.notificationGroups = notif.notificationGroups || []
                const notifGroupValue = notif.notificationGroups.map(item => item.uuid).join(',')

                enableSubmit = notif.conditions.length > 0 && notif.notificationGroups.length > 0

                {
                  /* Prepopulate Scope field.*/
                }
                notif.executionScope = notif.executionScope ? notif.executionScope : scopeTypes[0].value

                {
                  /* Prepopulate Batch field.*/
                }
                notif.batchNotifications = notif.batchNotifications ? notif.batchNotifications : notifBatch[0].value

                return (
                  <div className="__settingItem" key={'notificationRules_' + idx}>
                    <div className="__settingRow">
                      {this.props.showSummary === true &&
                          <span className="__deleteIcon" onClick={item => this.onSettingDelete(idx)}>
                            <i className="icons8-delete" />
                          </span>}
                      <span className="__settingFormCol">Condition*</span>
                      <MultiSelect
                        data={notifConditions}
                        value={notif.conditions.join(',')}
                        onChange={item => this.onSettingDropdownChange(idx, 'conditions', item)}
                      />
                    </div>
                    <div className="__settingRow">
                      <span className="__settingFormCol">Scope</span>
                      <Select
                        name="form-field-name"
                        placeholder="Select..."
                        value={notif.executionScope}
                        options={scopeTypes}
                        clearable={false}
                        autosize={true}
                        searchable={false}
                        onChange={item => this.onSettingDropdownChange(idx, 'executionScope', item)}
                      />
                    </div>
                    <div className="__settingRow">
                      <span className="__settingFormCol">Notification Group*</span>
                      <MultiSelect
                        data={notifGroups}
                        value={notifGroupValue}
                        onChange={item => this.onNotifGroupDropdownChange(idx, item)}
                      />
                    </div>
                    <div className="__settingRow">
                      <span className="__settingFormCol">Batch</span>
                      <Select
                        name="form-field-name"
                        placeholder="Select..."
                        value={notif.batchNotifications}
                        options={notifBatch}
                        clearable={false}
                        autosize={true}
                        searchable={false}
                        onChange={item => this.onSettingDropdownChange(idx, 'batchNotifications', item)}
                      />
                    </div>
                  </div>
                )
              })}
              {/* <div className="__settingFooter">
                <button onClick={() => this.onSettingAdd()}>+ Add Notification Strategy</button>
              </div> */}
            </div>}

          {!this.props.showSummary &&
            <div className="__footer">
              <button type="submit" disabled={!enableSubmit} className="btn btn-primary" onClick={this.onSubmit}>
                Submit
              </button>
            </div>}
        </div>

        <NotificationGroupModal
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onGroupAdded}
        />
      </section>
    )
  }
}

export default NotificationStrategyPanel



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/views/NotificationStrategyPanel.js