import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsModal } from 'components'
import css from './SetupPage.css'
import { SettingsService } from 'services'

const Action = {
  CHANGE_NAME: 'change-name',
  CHANGE_TYPE: 'change-type',
  CHANGE_VALUE: 'change-value'
}

const SettingType = {
  STRING: 'STRING'
}

export default class ApplicationDefaultsModal extends React.Component {
  state = {
    data: [],
    settings: []
  }

  componentWillMount = async () => {
    const { accountId, appId } = this.props
    const { error, settings } = await SettingsService.fetchApplicationDefaults({ accountId, appId })

    if (error) {
      this.setState({ error })
    } else {
      settings.forEach(setting => {
        setting.originalName = setting.name
        setting.originalType = setting.value.type
        setting.originalValue = setting.value.value
      })
      this.setState({
        settings: settings.sort((e1, e2) => e1.name.toLowerCase() > e2.name.toLowerCase() ? 1 : -1),
        originalSize: settings && settings.length
      })
    }
  }

  onHide = () => {
    this.props.onHide()
  }

  /*
   * Save setting row by row (backend is not able to save multiple settings at the same time).
   */
  onSubmit = async () => {
    const { props: { accountId, appId }, state: { settings } } = this
    const len = settings.length
    let index

    for (index = 0; index < len; index++) {
      const { newItem, dirty, name, value, uuid } = settings[index]

      if (dirty) {
        if (newItem) {
          const { error } = await SettingsService.addApplicationDefaults({
            accountId,
            appId,
            defaults: { name, value }
          })

          if (error) {
            this.setState({ error })
            break
          }
        } else {
          const { error } = await SettingsService.updateApplicationDefaults({
            accountId,
            appId,
            uuid,
            defaults: { name, value }
          })

          if (error) {
            this.setState({ error })
            break
          }
        }
      }
    }

    if (index === len) {
      this.onHide()
    }
  }

  addRow = async () => {
    const { settings } = this.state

    settings.push({
      newItem: true,
      name: '',
      originalName: '',
      originalType: SettingType.STRING,
      originalValue: '',
      value: {
        type: SettingType.STRING,
        value: ''
      }
    })
    this.setState({ settings })
  }

  onChange = (e, type, entry, index) => {
    const { settings } = this.state

    this.setState({ error: undefined })

    switch (type) {
      case Action.CHANGE_NAME:
        entry.name = e.target.value
        break
      case Action.CHANGE_TYPE:
        entry.value.type = e.target.value
        break
      case Action.CHANGE_VALUE:
        entry.value.value = e.target.value
        break
    }

    entry.dirty =
      entry.originalName !== entry.name ||
      entry.originalType !== entry.value.type ||
      entry.originalValue !== entry.value.value

    this.setState({ settings })
  }

  onRemove = async (e, entry, index) => {
    const { props: { accountId, appId }, state: { settings } } = this
    const { newItem, uuid } = entry

    if (newItem) {
      settings.splice(index, 1)
    } else {
      const { error } = await SettingsService.removeApplicationDefaults({ accountId, appId, uuid })
      if (error) {
        this.setState({ error })
      } else {
        settings.splice(index, 1)
      }
    }

    this.setState({ settings })
  }

  renderData = () => {
    const { settings } = this.state

    return (
      <table>
        <thead>
          <tr>
            <th data-name>Name</th>
            <th data-type>Type</th>
            <th data-value>Value</th>
            <th data-action />
          </tr>
        </thead>
        <tbody>
          {settings.map((entry, index) => {
            return (
              <tr key={`row${index + 1}`}>
                <td data-name>
                  <input
                    placeholder="Name"
                    value={entry.name}
                    onChange={e => this.onChange(e, Action.CHANGE_NAME, entry)}
                    required />
                </td>
                <td data-type>
                  <select value={entry.value.type} onChange={e => this.onChange(e, Action.CHANGE_TYPE, entry)}>
                    <option value={SettingType.STRING}>{SettingType.STRING}</option>
                  </select>
                </td>
                <td data-value>
                  <input
                    placeholder="Value"
                    value={entry.value.value}
                    onChange={e => this.onChange(e, Action.CHANGE_VALUE, entry)}
                    required />
                </td>
                <td data-action>
                  <button onClick={e => this.onRemove(e, entry, index)} title="Remove">
                    <i className="icons8-delete" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  render () {
    const { settings, error } = this.state
    const dirty = settings.some(setting => setting.dirty)
    const disabledSubmit = dirty ? undefined : { disabled: true }

    return (
      <WingsModal show={true} onHide={this.onHide} className={css.modal}>
        <Modal.Header closeButton>
          <Modal.Title>Application Defaults</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderData()}
          {error && <p data-error>{error}</p>}
          <form-buttons>
            <button data-attrs="primary" {...disabledSubmit} onClick={this.onSubmit}>SUBMIT</button>
            <button data-attrs="link" onClick={this.addRow}>+ Add Row</button>
          </form-buttons>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/SetupPage/ApplicationDefaultsModal.js