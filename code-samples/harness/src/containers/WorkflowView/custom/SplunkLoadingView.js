import React from 'react'
import { ContentLoader } from 'components'

window.ContentLoader = ContentLoader

const SplunkLoadingView = () => {
  // TODO inline styles should be moved
  return (
    <div style={{ margin: '25px' }}>
      <h3
        style={{
          fontSize: '24px',
          fontWeight: 'normal',
          marginBottom: '15px'
        }}
      >
        Loading Analysis (takes 2 to 3 minutes)...
      </h3>
      <ContentLoader.InfoStyle />
      <div style={{ marginTop: '20px' }} />
      <ContentLoader.ListStyle />
    </div>
  )
}

export default SplunkLoadingView



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/custom/SplunkLoadingView.js