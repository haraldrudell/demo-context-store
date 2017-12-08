import React from 'react'
import css from './AcctNotificationGroupCardView.css'
import { ActionsDropdown } from '../../../components/ActionsDropdown/ActionsDropdown.js'

export default class AcctNotificationGroupCardView extends React.Component {
  renderEmail = ({ item }) => {
    const emails = item.addressesByChannelType.EMAIL
    const hasEmails = emails && emails.length > 0 && emails.toString() !== ''

    if (true || hasEmails) {
      return (
        <kv-pair key={Math.random()}>
          <kv-pair-key>Email</kv-pair-key>
          <kv-pair-value>{hasEmails && item.addressesByChannelType.EMAIL.join(', ')}</kv-pair-value>
        </kv-pair>
      )
    } else {
      return null
    }
  }

  renderSlacks = ({ item }) => {
    const slacks = item.addressesByChannelType.SLACK
    const hasSlacks = slacks && slacks.length > 0 && slacks.toString() !== ''

    if (true || hasSlacks) {
      return (
        <kv-pair key={Math.random()}>
          <kv-pair-key>Slack</kv-pair-key>
          <kv-pair-value>{hasSlacks && item.addressesByChannelType.SLACK.join(', ')}</kv-pair-value>
        </kv-pair>
      )
    } else {
      return null
    }
  }

  renderKvPairs = ({ item }) => (
    <kv-pairs>
      {this.renderEmail({ item })}
      {this.renderSlacks({ item })}
    </kv-pairs>
  )

  renderActionIcons = ({ item }) => {
    const actionIcons = [
      {
        label: 'Edit',
        element: <edit-icon />,
        onClick: () => this.props.params.onEdit(item)
      },
      {
        label: 'Delete',
        element: <delete-icon />,
        onClick: () => this.props.params.onDelete(item.uuid)
      }
    ]
    return { actionIcons }
  }

  render () {
    return (
      <section className={css.main}>
        {this.props.params.data.map((item, index) => {
          const adminRole = item.roles.find(role => role.roleType === 'ACCOUNT_ADMIN')

          return (
            <ui-card key={index} data-name={item.name}>
              <header>
                <card-title class="link-style" onClick={() => this.props.params.onEdit(item)}>
                  {item.name}
                </card-title>
                {!adminRole && (
                  <ui-card-actions>
                    <ActionsDropdown {...this.renderActionIcons({ item })} />
                  </ui-card-actions>
                )}
              </header>
              <main>{this.renderKvPairs({ item })}</main>
            </ui-card>
          )
        })}
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AcctNotificationGroupPage/views/AcctNotificationGroupCardView.js