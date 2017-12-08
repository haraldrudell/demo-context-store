import React from 'react'
import css from './SettingsListCards.css'
import { ActionsDropdown } from '../../components/ActionsDropdown/ActionsDropdown.js'
import { UIButton, Utils } from 'components'
import * as Icons from 'styles/icons'

export default class SettingsListCards extends React.Component {
  state = { categories: [], componentInitialized: false, expandCollapseStatuses: null }

  renderDisplayName (type) {
    if (this.props.params.plugins) {
      const obj = this.props.params.plugins.find(ps => ps.type === type)
      return obj ? obj.displayName : type
    }
    return type
  }

  renderMoreProperties = ({ category, item }) => {
    return (
      <kv-pair>
        <kv-pair-key>{category === 'LoadBalancer' ? 'Access key' : 'URL'}</kv-pair-key>
        <kv-pair-value>
          {Object.keys(item.value).map(key => {
            if (
              key.indexOf('host') >= 0 ||
              key.indexOf('Url') >= 0 ||
              (key.indexOf('accessKey') >= 0 && category !== 'Artifact')
            ) {
              return item.value[key]
            }
            return null
          })}
        </kv-pair-value>
      </kv-pair>
    )
  }

  renderPropertiesList = ({ category, item }) => {
    const nameKey = this.isCloudProvidersPage ? Utils.getCloudProviderName(item.value.type) : 'Name'

    return (
      <kv-pairs>
        <kv-pair>
          <kv-pair-key>{nameKey}</kv-pair-key>
          <kv-pair-value data-name={item.name}>{item.name}</kv-pair-value>
        </kv-pair>
        {!this.isCloudProvidersPage && this.renderMoreProperties({ category, item })}
      </kv-pairs>
    )
  }

  renderVendorImage = ({ vendor, defaultName }) => {
    const element = Utils.renderVendorImage({ vendor })

    if (element) {
      return <vendor-logo>{element}</vendor-logo>
    } else {
      return (
        <vendor-logo>
          {Utils.renderVendorImage({ vendor: 'DEFAULT_LOGO' })}
          <vendor-default-name>{defaultName}</vendor-default-name>
        </vendor-logo>
      )
    }
  }

  renderCardsForConnectorType = ({ data, category }) => {
    return data[category].map((item, index) => {
      const onEdit = this.props.params.onEdit.bind(this, item)
      const actionIcons = [
        {
          label: 'Edit',
          element: <edit-icon />,
          onClick: onEdit
        },
        {
          label: 'Delete',
          element: <delete-icon />,
          onClick: this.props.params.onDelete.bind(this, item.uuid)
        }
      ]

      return (
        <ui-card key={item.uuid} data-name={item.name}>
          <ui-card-header>
            <card-title onClick={onEdit} class="link-style">
              {item.name}
            </card-title>
            <ui-card-actions>
              <ActionsDropdown actionIcons={actionIcons} />
            </ui-card-actions>
          </ui-card-header>
          <ui-card-main>
            {this.renderVendorImage({ vendor: item.value.type, defaultName: item.value.type })}
            {this.renderPropertiesList({ category, item })}
          </ui-card-main>
        </ui-card>
      )
    })
  }

  toggleSectionFolding = ({ category }) => {
    const data = this.state.data
    const expandCollapseStatuses = this.state.expandCollapseStatuses

    expandCollapseStatuses[category].expandSection = !expandCollapseStatuses[category].expandSection
    this.setState({ data, expandCollapseStatuses })
  }

  componentWillReceiveProps = newProps => {
    const { recordType = '', data = {} } = newProps.params
    this.isCloudProvidersPage = recordType === 'CloudProviders'

    const allCategories = Object.keys(data).sort()
    const filteredCategories = allCategories.filter(category => category !== 'ConnectionAttributes')
    let categories = []
    const expandCollapseStatuses = this.state.expandCollapseStatuses || {}

    if (this.isCloudProvidersPage) {
      categories = filteredCategories.filter(category => category === 'CloudProvider')
    } else {
      categories = filteredCategories.filter(category => category !== 'CloudProvider')

      if (!this.state.componentInitialized) {
        categories.forEach(category => {
          expandCollapseStatuses[category] = { expandSection: false }
        })
      }
    }

    return this.setState({ data, categories, expandCollapseStatuses, componentInitialized: true })
  }

  disableButton = () => !this.props.params.plugins

  renderCards = ({ category, buttonText }) => {
    if (!this.isCloudProvidersPage && this.state.expandCollapseStatuses[category]) {
      if (!this.state.expandCollapseStatuses[category].expandSection) {
        return null
      }
    }

    return (
      <collapsable-content>
        <div className="add-icon">
          <UIButton
            icon="Add"
            medium
            data-name={buttonText}
            onClick={() => this.props.params.onAdd(category)}
            disabled={this.disableButton()}
          >
            {buttonText}
          </UIButton>
        </div>

        {this.renderCardsForConnectorType({ data: this.state.data, category })}
      </collapsable-content>
    )
  }

  expandCollapseStatuses = ({ category }) => {
    const sectionCollapsedIcon = (
      <button className="text-btn section-toggle">
        <Icons.ArrowRight className="md-icon" />
      </button>
    )

    const sectionExpandedIcon = (
      <button className="text-btn section-toggle">
        <Icons.ArrowDown className="md-icon" />
      </button>
    )

    if (!this.state.expandCollapseStatuses[category]) {
      return sectionCollapsedIcon
    } else {
      return this.state.expandCollapseStatuses[category].expandSection ? sectionExpandedIcon : sectionCollapsedIcon
    }
  }

  render () {
    const singleSection = this.state.categories.length === 1

    return (
      <div className={css.main}>
        {this.state.categories.map((category, categoryIndex) => {
          let buttonText = ''
          let connectorTypeHeaderTitle = ''
          let sectionToggleDataName = ''

          if (this.isCloudProvidersPage) {
            buttonText = 'Add Cloud Provider'
          } else {
            if (category === 'Artifact') {
              buttonText = 'Add ' + category + ' Server'
              connectorTypeHeaderTitle = category + ' Servers'
            } else {
              buttonText = 'Add ' + category + ' Provider'
              connectorTypeHeaderTitle = category + ' Providers'
            }
            sectionToggleDataName = `${category}-toggle`
          }

          const sectionToggleIcon = this.expandCollapseStatuses({ category })

          const connectorTypeHeader = (
            <connector-type-section data-name={connectorTypeHeaderTitle} hide={singleSection}>
              <connector-type-section-title>
                <title-items onClick={e => this.toggleSectionFolding({ category })}>
                  <div data-name={sectionToggleDataName}>{sectionToggleIcon}</div>
                  <section-title>{connectorTypeHeaderTitle}</section-title>
                </title-items>
              </connector-type-section-title>
            </connector-type-section>
          )

          return (
            <connector-type-container key={categoryIndex}>
              {connectorTypeHeader}
              {this.renderCards({ category, buttonText })}
            </connector-type-container>
          )
        })}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/SettingsList/SettingsListCards.js