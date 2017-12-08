import React from 'react'
import { createPageContainer, ActionsDropdown, WingsIcons, Utils } from 'components'
import css from './KmsCardView.css'
const globalAccountId = '__GLOBAL_ACCOUNT_ID__'

export default class KmsCardView extends React.Component {
  componentWillMount () {
    //
    this.getQueryParameters()
  }

  getQueryParameters = () => {
    if (this.props.urlParams) {
      const { accountId } = this.props.urlParams
      this.acctId = accountId
    }
  }

  renderCardDetails = item => {
    return (
      <ui-card key={item.uuid}>
        <header />
      </ui-card>
    )
  }

  renderContent = () => {
    return <div className={css.main}>{this.renderKmsTable()}</div>
  }

  renderKmsTable = () => {
    const configuredKmsList = this.props.params.data
    if (configuredKmsList) {
      const globalKMSList = configuredKmsList.filter(item => item.accountId === globalAccountId)
      const customKMSList = configuredKmsList.filter(item => item.accountId !== globalAccountId)
      const kmsList = customKMSList.concat(globalKMSList)
      return (
        <ui-card className={css.kmsTable}>
          <main>
            {kmsList.map(item => {
              return this.renderListItemContent(item)
            })}
          </main>
        </ui-card>
      )
    }
  }

  checkIfItemIsGlobal = item => {
    return item.accountId === globalAccountId
  }
  renderListItemContent = item => {
    const actionIcons = [
      {
        label: 'Deprecate',
        element: <WingsIcons.DeprecateIcon className={css.deprecateIcon} />,
        onClick: this.props.params.onMigrateKMS.bind(null, item)
      },
      {
        label: 'Delete',
        element: <delete-icon class="harness-icon" />,
        onClick: this.props.params.deleteKMS.bind(null, item)
      }
    ]
    const actionsDropdownProps = { actionIcons }
    const isGlobal = this.checkIfItemIsGlobal(item)

    const className = isGlobal ? css.bgWhite : css.item
    const cardTitleCls = isGlobal ? css.globalCardName : css.kmsName
    return (
      <div className={`${css.kmsItem} ${className}`}>
        <header>
          <card-title>
            <item-name class={`${cardTitleCls}`} onClick={!isGlobal && this.props.params.onEditKMS.bind(this, item)}>
              {item.name}
            </item-name>
            <item-description> ({Utils.encryptionTitles[item.encryptionType]})</item-description>
          </card-title>
          {this.renderCheckMark(item)}
        </header>

        <main>
          <span className={css.encryptedCount}>{item.numOfEncryptedValue} Encrypted Keys</span>
          {!isGlobal && (
            <ui-card-actions>
              <ActionsDropdown {...actionsDropdownProps} />
            </ui-card-actions>
          )}
        </main>
      </div>
    )
  }

  renderCheckMark = item => {
    if (item.default) {
      return (
        <div className={css.defaultStatus}>
          <WingsIcons.TickMark className={css.defaultIcon} />
          Default
        </div>
      )
    } else {
      return <div />
    }
  }
  render () {
    return this.renderContent()
  }
}
createPageContainer()(KmsCardView)



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/views/KmsCardView.js