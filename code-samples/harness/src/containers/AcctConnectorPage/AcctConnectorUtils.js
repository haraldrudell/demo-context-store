import { PageBreadCrumbs } from 'components'
import React from 'react'

export default class AcctConnectorUtils {
  static renderTitleBreadCrumbs = ({ path, urlParams, label }) => {
    const bData = [{ label: 'Setup', link: path.toSetup(urlParams) }, { label, nonHeader: true }]
    return <PageBreadCrumbs data={bData} />
  }
}



// WEBPACK FOOTER //
// ../src/containers/AcctConnectorPage/AcctConnectorUtils.js