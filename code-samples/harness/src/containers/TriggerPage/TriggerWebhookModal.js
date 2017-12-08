import React from 'react'
import { Modal } from 'react-bootstrap'
import { UIButton, WingsModal, NameValueList, Utils } from 'components'
import css from './TriggerWebhookModal.css'

import dataService from '../../apis/dataService'
const baseUrl = dataService.url

export default class TriggerWebhookModal extends React.Component {
  state = {
    showCurl: false
  }

  renderWebhook = trigger => {
    const webHookToken = Utils.getJsonValue(trigger, 'condition.webHookToken') || {}
    const url = `${baseUrl}/webhooks/${webHookToken.webHookToken}`
    const listData = [
      { name: 'URL', value: url },
      { name: 'Method', value: webHookToken.httpMethod },
      { name: 'Header', value: 'content-type: application/json' },
      { name: 'Payload', value: webHookToken.payload }
    ]
    return (
      <div>
        <h4>Webhook</h4>
        <NameValueList data={listData} />
      </div>
    )
  }

  renderCurl = trigger => {
    const webHookToken = Utils.getJsonValue(trigger, 'condition.webHookToken') || {}
    const url = `${baseUrl}/webhooks/${webHookToken.webHookToken}`
    const curl = `curl -X POST -H 'content-type: application/json' --url ${url} -d '${webHookToken.payload}'`
    return (
      <div className={css.command}>
        <h4>Curl Command</h4>
        <div>{curl}</div>
      </div>
    )
  }

  onClickShowCurl = () => {
    this.setState({ showCurl: true })
  }

  onHide = () => {
    this.props.onHide()
  }

  render () {
    const { data } = this.props
    return (
      <WingsModal show={true} onHide={this.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Trigger</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{this.renderWebhook(data)}</div>

          <div className={css.curl}>
            {this.state.showCurl ? (
              <div>{this.renderCurl(data)}</div>
            ) : (
              <UIButton onClick={this.onClickShowCurl}>Show Curl Command</UIButton>
            )}
          </div>

          <UIButton type="button" onClick={this.onHide}>
            Close
          </UIButton>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/TriggerPage/TriggerWebhookModal.js