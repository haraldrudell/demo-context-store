import React from 'react'
import { Utils, createPageContainer, PageBreadCrumbs } from 'components'

import css from './AcctCatalogPage.css'
import AppContainerPage from '../AppContainerPage/AppContainerPage'

class AcctCatalogPage extends React.Component {
  state = { data: {}, showModal: false, modalData: {} }
  acctId = Utils.accountIdFromUrl()
  title = this.renderTitleBreadCrumbs()
  pageName = 'Catalogs'

  componentWillMount = () => this.fetchData()

  fetchData = () => {}
  renderTitleBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const bData = [{ label: 'Setup', link: path.toSetup(urlParams) }, { label: 'Catalogs', nonHeader: true }]
    return <PageBreadCrumbs data={bData} />
  }
  render () {
    return (
      <section className={css.main}>
        <AppContainerPage />
      </section>
    )
  }
}
export default createPageContainer()(AcctCatalogPage)



// WEBPACK FOOTER //
// ../src/containers/AcctCatalogPage/AcctCatalogPage.js