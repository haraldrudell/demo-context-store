import React from 'react'
import { createPageContainer } from 'components'
import css from './AcctConnectorPage.css'
import SettingsList from '../SettingsList/SettingsList.js'
import AcctConnectorUtils from './AcctConnectorUtils.js'

class AcctConnectorPage extends React.Component {
  label = 'Connectors'
  pageName = 'Connectors'
  recordType = 'Connectors'

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

export default createPageContainer()(AcctConnectorPage)



// WEBPACK FOOTER //
// ../src/containers/AcctConnectorPage/AcctConnectorPage.js