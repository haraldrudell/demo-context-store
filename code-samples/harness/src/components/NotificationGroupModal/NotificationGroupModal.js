import React from 'react'
import { Modal } from 'react-bootstrap'
import WingsForm from '../WingsForm/WingsForm'
import AppStorage from '../AppStorage/AppStorage'
import WingsModal from '../WingsModal/WingsModal'
import Utils from '../Utils/Utils'
import apis from 'apis/apis'

const log = type => {} // console.log.bind(console, type)

export default class NotificationGroupModal extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  state = {
    formData: {},
    schema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', title: 'Group Name', default: '' },
        email: { type: 'string', title: 'Email Addresses', default: '' },
        slack: { type: 'string', title: 'Slack Channels', default: '' }
      }
    },
    uiSchema: {
      email: { 'ui:placeholder': 'Email1, Email2,...' },
      slack: { 'ui:placeholder': 'Channel1, Channel2,...' }
    }
  }
  acctId = AppStorage.get('acctId')
  pluginNames = []

  componentWillMount () {
    Utils.loadCatalogsToState(this)
    this.context.pubsub.subscribe('appsEvent', (msg, appData) => {
      if (appData.catalogs && appData.catalogs.NOTIFICATION_GROUP_CHANNEL_TYPE) {
        this.pluginNames = []
        for (const p of appData.catalogs.NOTIFICATION_GROUP_CHANNEL_TYPE) {
          this.pluginNames.push(p.value)
          let title = p.value
          if (p.value === 'SLACK') {
            title = 'Slack Channels'
          } else if (p.value === 'EMAIL') {
            title = 'Email Addresses'
          }
          this.state.schema.properties[p.value] = { type: 'string', title, default: '' }
        }
      }
    })

    // apis.fetchPlugins(this.acctId).then((data) => {
    //   const plugins = data.resource
    //   this.pluginNames = []
    //   for (const p of plugins) {
    //     if (p.pluginCategories && p.pluginCategories.indexOf('Collaboration') >= 0) {
    //       this.pluginNames.push(p.type)
    //       let title = p.type
    //       if (p.type === 'SLACK') {
    //         title = 'Slack Channels'
    //       } else if (p.type === 'SMTP') {
    //         title = 'Email Addresses'
    //       }
    //       this.state.schema.properties[ p.type ] = { type: 'string', title, default: '' }
    //     }
    //   }
    // })
  }

  componentWillReceiveProps (newProps) {
    const formData = newProps.data
    if (newProps.data && newProps.data.addressesByChannelType) {
      formData.email = newProps.data.addressesByChannelType.EMAIL
        ? newProps.data.addressesByChannelType.EMAIL.join(', ')
        : ''
      formData.slack = newProps.data.addressesByChannelType.SLACK
        ? newProps.data.addressesByChannelType.SLACK.join(', ')
        : ''
    }
    this.setState({ formData })
  }

  onChange = ({ formData }) => {}

  onSubmit = ({ formData }) => {
    const addressesByChannelType = {}
    for (const name of this.pluginNames) {
      addressesByChannelType[name] = formData[name].split(',')
    }

    const slack = formData.slack ? formData.slack.split(',').map(item => item.trim()) : ''
    const email = formData.email ? formData.email.split(',').map(item => item.trim()) : ''

    const submitData = {
      name: formData.name,
      addressesByChannelType: {
        EMAIL: email,
        SLACK: slack
      }
    }
    console.log('submitting', submitData)

    if (formData.uuid) {
      apis.updateNotificationGroup(submitData, formData.uuid).then(data => {
        this.props.onSubmit(data.resource)
      })
    } else {
      apis.addNotificationGroup(submitData).then(data => {
        this.props.onSubmit(data.resource)
      })
    }
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Notification Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="NotificationGroup"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
          />
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/NotificationGroupModal/NotificationGroupModal.js