import React from 'react'
import { UIButton, NameValueList, Utils } from 'components'
import TriggerUtils from './TriggerUtils'
import css from './TriggerCardView.css'

import dataService from '../../apis/dataService'
const baseUrl = dataService.url

export default class TriggerCardView extends React.Component {
  renderWebhook = trigger => {
    const webHookToken = Utils.getJsonValue(trigger, 'condition.webHookToken') || {}
    const listData = [
      { name: 'URL', value: `${baseUrl}/webhooks/${webHookToken.webHookToken}` },
      { name: 'Method', value: webHookToken.httpMethod },
      { name: 'Payload', value: webHookToken.payload }
    ]
    return (
      <ui-popover-content>
        <header>
          <ui-title>Webhook</ui-title>
        </header>
        <main>
          <NameValueList customWidths={['20%', '80%']} data={listData} />
        </main>
      </ui-popover-content>
    )
  }

  renderNameValueList = trigger => {
    return (
      <div>
        {TriggerUtils.renderCondition(trigger)}
        {TriggerUtils.renderActions(trigger)}
      </div>
    )
  }

  render = () => {
    const triggers = this.props.params.data || []
    return (
      <main className={css.main}>
        {triggers.map((trigger, idx) => {
          // triggers.map - trigger:
          const nameValueList = this.renderNameValueList(trigger)
          return (
            <ui-card key={idx}>
              <header>
                <div className="wings-text-link title" onClick={() => this.props.params.onEdit(trigger)}>
                  {trigger.name}
                </div>
                <ui-card-actions>
                  <UIButton icon="Trash" onClick={() => this.props.params.onDelete(trigger)} />
                </ui-card-actions>
              </header>
              <main>
                {nameValueList}

                {trigger.condition.conditionType === 'WEBHOOK' && (
                  <div className={css.more}>
                    <UIButton onClick={() => this.props.params.onClickWebhook(trigger)}>View Webhook</UIButton>
                  </div>
                )}
              </main>
            </ui-card>
          )
        })}
      </main>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/TriggerPage/TriggerCardView.js