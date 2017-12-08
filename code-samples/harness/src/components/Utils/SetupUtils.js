import React from 'react'

const SETUP_EVENT = 'SetupEvent'
const store = window.sessionStorage || {}

export default class SetupUtils {

/*
const SERVICE_NOT_CONFIGURED = 'SERVICE_NOT_CONFIGURED'
const NO_HOST_CONFIGURED = 'NO_HOST_CONFIGURED'
const NO_RELEASE_FOUND = 'NO_RELEASE_FOUND'
const NO_ARTIFACT_SOURCE_FOUND = 'NO_ARTIFACT_SOURCE_FOUND'
const NO_ARTIFACT_FOUND = 'NO_ARTIFACT_FOUND'
const NO_DEPLOYMENT_FOUND = 'NO_DEPLOYMENT_FOUND'
*/

  static makeLink (notification) {
    const { url, code, message } = notification
    const _ar = (message) ? message.split(':') : ['']
    return (
      <span>
        <a href={url} onClick={(e) => SetupUtils.onClick(e, code)}> {_ar[0]} </a>
            &nbsp;{_ar[1]}
      </span>
    )
  }


  static onClick (e, code) {
    store.setItem(SETUP_EVENT, code)
  }

  static setCode (code) {
    store.setItem(SETUP_EVENT, code)
  }

  static hasCode (code) {
    const k = store.getItem(SETUP_EVENT)
    return k ? (k === code ) : false
  }

  static setupClassName (code) {
    return SetupUtils.hasCode(code) ? 'setupLink' : ''
  }

  static verify (code) {
    const stCode = store.getItem(SETUP_EVENT)

    if ((stCode === code)) {
      store.removeItem(SETUP_EVENT)
      return true
    }

    return false
  }


  static allContants () {
    console.log (SERVICE_NOT_CONFIGURED)
  }


}




// WEBPACK FOOTER //
// ../src/components/Utils/SetupUtils.js