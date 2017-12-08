import React from 'react'
import { createPageContainer } from 'components'
import css from './AcctCloudProviderPage.css'
import SettingsList from '../SettingsList/SettingsList.js'
import AcctConnectorUtils from '../AcctConnectorPage/AcctConnectorUtils.js'

class AcctCloudProviderPage extends React.Component {
  label = 'Cloud Providers'
  pageName = 'Cloud Providers'
  recordType = 'CloudProviders'

  title = AcctConnectorUtils.renderTitleBreadCrumbs({
    path: this.props.path,
    urlParams: this.props.urlParams,
    label: this.label
  })

  render () {
    const settingsListProps = {
      recordType: this.recordType,
      urlParams: this.props.urlParams
    }

    return (
      <section className={css.main}>
        <SettingsList {...settingsListProps} />
      </section>
    )
  }
}

export default createPageContainer()(AcctCloudProviderPage)



// WEBPACK FOOTER //
// ../src/containers/AcctCloudProviderPage/AcctCloudProviderPage.js