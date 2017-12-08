import React from 'react'

const Spinner = props => {
  const customClass = props.className || ''
  return (
    <span className={`wings-spinner ${customClass}`} />
  )
}

const BlockingSpinner = props => {
  return (
    <ui-blocking-spinner>
      <Spinner {...props} />
    </ui-blocking-spinner>
  )
}

const InfiniteScrollingSpinner = props => {
  return (
    <ui-infinite-scrolling-spinner>
      <Spinner {...props} />
    </ui-infinite-scrolling-spinner>
  )
}

export { Spinner, BlockingSpinner, InfiniteScrollingSpinner }


// WEBPACK FOOTER //
// ../src/components/Spinner/Spinner.js