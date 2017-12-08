import React from 'react'
import css from './OverviewCard.css'
import { ActionsDropdown } from '../ActionsDropdown/ActionsDropdown.js'
import NameValueList from '../NameValueList/NameValueList'

export class OverviewCard extends React.Component {
  state = {}

  renderKvPairs = ({ kvPairs }) => {
    return <NameValueList data={kvPairs} customWidths={['15%', '85%']} customKeys={['key', 'value']} />
  }

  // For service name includes artifact type also
  getDataName = ({ kvPairs }) => {
    const item = kvPairs.find(pair => pair.key === 'Name')
    if (item) {
      return item.value
    }
  }

  render = () => {
    const { header: { title, actionIconFunctions } } = this.props
    let { kvPairs = [] } = this.props

    // remove undefined elements
    kvPairs = kvPairs.filter(kvPair => kvPair)

    const actionIcons = [
      {
        label: 'Edit',
        element: <edit-icon class="harness-icon" />,
        onClick: actionIconFunctions.edit
      },
      {
        label: 'Clone',
        element: <clone-icon class="harness-icon" />,
        onClick: actionIconFunctions.clone
      }
    ]

    const actionsDropdownProps = { actionIcons }
    const dataTitle = this.getDataName({ kvPairs })
    return (
      <overview-card class={css.main} data-name={dataTitle}>
        <ui-card>
          <ui-card-header>
            <card-title>{title}</card-title>
            <ui-card-actions>
              <ActionsDropdown {...actionsDropdownProps} />
            </ui-card-actions>
          </ui-card-header>
          <ui-card-main>{this.renderKvPairs({ kvPairs })}</ui-card-main>
        </ui-card>
      </overview-card>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/OverviewCard/OverviewCard.js