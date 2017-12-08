import React from 'react'
import { UIButton, CompUtils, Utils } from 'components'
import css from './SecretsManagementPage.css'
import SecretManagementListView from './views/SecretManagementListView.js'
import KmsListPage from './KmsListPage'

const sideBarList = {
  'Cloud Providers': { category: 'CLOUD_PROVIDER', items: [] },

  Connectors: {
    category: 'CONNECTOR',
    items: ['Artifact Servers', 'Colloboration Providers', 'Verification Providers']
  },
  /* 'Configuration Variables': {
    category: 'SERVICE_VARIABLE',
    items: []
  },

  'Configuration Files': {
    category: 'CONFIG_FILE',
    items: []
  },*/
  'Execution Credentials': {
    category: 'SETTING',
    items: ['SSH', 'Encrypted Text', 'Encrypted Files']
  }
}

class SecretsManagementPage extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()

  state = {
    showConfigureKMS: false,
    content: '',
    selectedClass: {
      'Cloud Providers': css.selected
    },
    selectedObj: {
      resourceName: 'Cloud Providers',
      category: 'CLOUD_PROVIDER'
    }
  }

  renderSideBar = () => {
    return (
      <div className={css.sideBar}>
        <ul className={css.containerUl}>
          {Object.keys(sideBarList).map(item => {
            const clsName = sideBarList[item] && sideBarList[item].items.length > 0 ? css.parentItem : css.item
            const isParent = sideBarList[item].items.length > 0 ? true : false
            return (
              <li className={clsName} key={item}>
                <span
                  className={this.state.selectedClass[item]}
                  onClick={this.onClickOfListItem.bind(this, item, sideBarList[item].category, isParent)}
                  data-category={sideBarList[item].category}
                >
                  {item}
                </span>
                {sideBarList[item].items.length > 0 && this.renderSubList(item)}
              </li>
            )
          })}
        </ul>
        {this.renderConfigureKMSButton()}
      </div>
    )
  }

  renderSubList = parentItem => {
    const childList = sideBarList[parentItem].items
    const category = sideBarList[parentItem].category
    if (childList && childList.length > 0) {
      return (
        <ul>
          {childList.map(item => {
            return (
              <li className={css.subItem} key={item}>
                <span
                  className={this.state.selectedClass[item]}
                  onClick={this.onClickOfListItem.bind(this, item, category, false)}
                  data-category={category}
                >
                  {item}
                </span>
              </li>
            )
          })}
        </ul>
      )
    } else {
      return null
    }
  }

  onClickOfListItem = (item, category, isParent) => {
    if (!isParent) {
      this.selectedCategory = category
      this.selectedItem = item
      const selectedClass = {}
      selectedClass[item] = css.selected

      const obj = {}
      obj['resourceName'] = item
      obj['category'] = category

      this.setState({ selectedClass, selectedObj: obj, showConfigureKMS: false })
    }
  }

  onClickOfConfigureKMS = async () => {
    // if (!this.isLoading) {
    await CompUtils.setComponentState(this, { showConfigureKMS: true, selectedClass: {}, selectedObj: {} })
    // }
  }

  renderConfigureKMSButton = () => {
    return (
      <UIButton icon="Setup" className={css.configureBtn} onClick={this.onClickOfConfigureKMS}>
        Configure Secret Managers
      </UIButton>
    )
  }

  hideConfigureKMSModal = async () => {
    await CompUtils.setComponentState(this, { showConfigureKMSModal: false })
  }

  updateLoadingStatus = isLoading => {
    this.isLoading = isLoading
  }

  render () {
    return (
      <page-container class={css.main}>
        {this.renderSideBar()}

        <div className={css.content}>
          {this.state.showConfigureKMS && <KmsListPage {...this.props} />}
          {!this.state.showConfigureKMS && (
            <SecretManagementListView
              updateLoadingStatus={this.updateLoadingStatus}
              selectedObj={this.state.selectedObj}
              {...this.props}
            />
          )}
        </div>
      </page-container>
    )
  }
}

export default SecretsManagementPage



// WEBPACK FOOTER //
// ../src/containers/SecretsManagementPage/SecretsManagementPage.js