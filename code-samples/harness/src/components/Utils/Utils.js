/* eslint no-restricted-globals: 0 */
import React from 'react'
import ReactDOM from 'react-dom'
import Transmit from 'react-setup-transmit'
import apis from 'apis/apis'
import AppStorage from '../AppStorage/AppStorage'
import moment from 'moment'
import pubsub from 'pubsub-js'
import escapeHTML from 'escape-html'
import DataStore from '../../utils/DataStore'
import ScrollEvents from 'scroll-events'
import TemplateUtils from './TemplateUtils'
import FormUtils from './FormUtils'

let activeUrl = null
const checkMultiCallsObj = {}

export default class Utils {
  static getDefaultContextTypes () {
    return {
      pubsub: React.PropTypes.object, // isRequired
      catalogs: React.PropTypes.object, // isRequired
      app: React.PropTypes.object, // isRequired
      apps: React.PropTypes.array
    }
  }

  static loadCatalogsToState (ctx) {
    Utils.loadChildContextToState(ctx, 'catalogs')
  }

  // subscribe to 'appsEvent' (published by App.js after loading data) to get data from context & set to state
  // require this in your component:
  // static contextTypes = { ... }
  // get data from ctx.context. If data is not available, subscribe to 'appsEvent' to get & set data
  static loadChildContextToState (ctx, key) {
    const _obj = {}
    if (ctx.context[key]) {
      _obj[key] = ctx.context[key]
      ctx.setState(_obj)
    }

    if (ctx.context.pubsub) {
      if (!ctx.pubsubToken) {
        ctx.pubsubToken = []
      }
      ctx.pubsubToken.push(
        ctx.context.pubsub.subscribe('appsEvent', (msg, appData) => {
          ctx.context[key] = appData[key]
          _obj[key] = ctx.context[key]
          ctx.setState(_obj)
        })
      )
    }
  }

  static unsubscribeAllPubSub (ctx) {
    if (ctx.context.pubsub && ctx.pubsubToken && ctx.pubsubToken.map) {
      ctx.pubsubToken.map(item => {
        ctx.context.pubsub.unsubscribe(item)
      })
    }
  }

  /**
   * Find a parent element by traversing up.
   * @param {Object} child - DOM element.
   * @param {string} selector - Selector to find parent. e.g. '#id123' or '.content' or 'div'.
   * @returns {Object} - Return parent dom element (return itself if it satisfies the selector).
   */
  static findParentByChild (child, selector) {
    let el = child
    const isClassName = selector[0] === '.' ? true : false
    const isId = selector[0] === '#' ? true : false
    if (isId || isClassName) {
      selector = selector.slice(1)
    }
    while (el) {
      const classes = el.getAttribute('class')
      if (
        (isId && el.getAttribute('id') === selector) ||
        (isClassName && classes && classes.split(' ').indexOf(selector) >= 0) ||
        el.tagName === selector.toUpperCase()
      ) {
        break
      }
      el = el.parentElement
    }
    return el
  }

  /**
   * Returns a random integer between min (included) and max (included): [min, max].
   * @param {number} min - Min.
   * @param {number} max - Max.
   */
  static randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Toggle element by setting display style to 'block' or 'none'.
   * @example - toggle({ overlayEl: el, show: false }).
   * @param {Object} param - Object parameter { name: domEl, show: boolean }.
   */
  static toggle (param) {
    const el = param[Object.keys(param)[0]] // first param object.
    el.style.display = param.show ? 'block' : 'none'
  }

  /**
   * Helper function to get Transmit Fragments object from the array of fragments.
   * @param {Array} fragmentArr - Array of fragments which declare functions to fetch data.
   * @returns {Object} - Transmit's fragment object.
   */
  static getTransmitFragments (fragmentArr) {
    return fragmentArr.reduce((res, item) => {
      const key = Object.keys(item)[0]
      const fragmentParams = item[key]
      // eslint-disable-next-line no-undef
      const c = typeof __CLIENT__ !== 'undefined' && __CLIENT__
      res[key] = () => (c ? Promise.resolve() : fragmentParams[0].apply(this, fragmentParams.slice(1)))
      return res
    }, {})
  }

  /**
   * Client-side helper to invoke functions in 'fragmentArr' to fetch data to the state.
   * @param {Array} fragmentArr - Array of fragments which declare functions to fetch data.
   * @param {Object} ctx - Context (e.g. this).
   * @param {callbackFn} [callbackFn] - Callback function to handle each fragment.
   *   @callback callbackFn
   *   @param {string} callbackFn.key - Fragment key.
   *   @param {Object} callbackFn.data - Fragment data.
   * @param {allDoneFn} [allDoneFn] - Callback function when all requests completed.
   *   @callback allDoneFn
   */
  static fetchFragmentsToState (fragmentArr, ctx, callbackFn, allDoneFn) {
    ctx.setState({ loadingStatus: 1 })
    let counter = 0
    const allData = {}
    const fragmentKeys = fragmentArr.map(obj => Object.keys(obj)[0])

    fragmentArr.map(item => {
      const allKeys = Object.keys(item)
      const key = allKeys[0]
      const fragmentParams = item[key]
      const fragmentFn = fragmentParams[0]
      fragmentFn.apply(ctx, fragmentParams.slice(1)).then(data => {
        const state = {}
        state[key] = data
        allData[key] = data
        ctx.setState(state)
        if (callbackFn) {
          callbackFn(key, data)
        }
        counter++
        if (counter === fragmentKeys.length) {
          ctx.setState({ loadingStatus: 2 })
          if (allDoneFn) {
            allDoneFn(allData)
          }
        }
      })
    })
  }

  /**
   * Helper function to wrap Component with Transmit Container to fetch fragments for server rendering.
   * @param {Class} Component - Component to wrap.
   * @param {Array} fragmentArr - Array of fragments which declare functions to fetch data.
   * @returns {Object} - Transmit Container.
   */
  static createTransmitContainer (Component, fragmentArr) {
    const fragments = this.getTransmitFragments(fragmentArr)
    return Transmit.createContainer(Component, {
      initialVariables: {},
      fragments
    })
  }

  /**
   * Utility method to get a deep JSON property's value.
   * @param {Object} obj - Object.
   * @example - Utils.getJsonValue(this, 'state.userObj.email')
   * @returns {Object} - Value object or null if property does not exist.
   */
  static getJsonValue (obj /* , level1, level2, ... levelN */) {
    if (typeof obj === 'undefined' || obj === null) {
      return null
    }
    let args = Array.prototype.slice.call(arguments)

    if (typeof args[1] === 'string' && args[1].indexOf('.') > 0) {
      args = args[1].split('.')
    } else {
      args.shift() // shift out 'obj'
    }
    for (let i = 0; i < args.length; i++) {
      if (!obj) {
        return null
      }
      if (!obj.hasOwnProperty(args[i])) {
        return null
      }
      obj = obj[args[i]]
    }
    return obj
  }

  static setJsonValue (obj, path, value) {
    path = path.split('.')
    let i
    for (i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]]
    }
    obj[path[i]] = value
  }

  static getJsonFields (sourceObj, fieldNames) {
    const newObj = {}
    const fieldsArr = fieldNames.split(',')
    for (let i = 0; i < fieldsArr.length; i++) {
      const fieldName = fieldsArr[i].trim()
      newObj[fieldName] = sourceObj[fieldName]
    }
    return newObj
  }

  static getJsonFieldsStr (sourceObj, fieldNames) {
    return JSON.stringify(this.getJsonFields(sourceObj, fieldNames))
  }

  // Find key's values from a nested object - http://jsfiddle.net/fzpwy5sx/1/
  // Example: findNested(uiSchema, 'sshPassword')
  static findNested (obj, key, memo) {
    let i
    const proto = Object.prototype
    const ts = proto.toString
    const hasOwn = proto.hasOwnProperty.bind(obj)
    if ('[object Array]' !== ts.call(memo)) {
      memo = []
    }
    for (i in obj) {
      if (hasOwn(i)) {
        if (i === key) {
          memo.push(obj[i])
        } else if ('[object Array]' === ts.call(obj[i]) || '[object Object]' === ts.call(obj[i])) {
          this.findNested(obj[i], key, memo)
        }
      }
    }
    return memo
  }

  static generateUuid (separatorStr) {
    // RFC4122 version 4 - source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    const sepStr = typeof separatorStr !== 'undefined' ? separatorStr : '-'
    let d = new Date().getTime()
    if (window.performance && typeof window.performance.now === 'function') {
      d += window.performance.now() // use high-precision timer if available
    }
    const uuid = `xxxxxxxx${sepStr}xxxx${sepStr}4xxx${sepStr}yxxx${sepStr}xxxxxxxxxxxx`.replace(/[xy]/g, c => {
      const r = ((d + Math.random() * 16) % 16) | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
  }

  static showModal (modalData) {
    this.setState({ showModal: true, modalData })
  }

  static showCloneModal (cloneData) {
    const data = {}
    data.uuid = cloneData.uuid
    data.name = cloneData.name
    if (cloneData.hasOwnProperty('description')) {
      data.description = cloneData.description
    }
    this.setState({ showCloneModal: true, cloneData: data })
  }

  static hideCloneModal () {
    this.setState({ showCloneModal: false })
  }

  static hideModal (optionalStateVar) {
    const stateVar = optionalStateVar && typeof optionalStateVar === 'string' ? optionalStateVar : 'showModal'
    this.setState({ [stateVar]: false })
  }

  // DEPRECATED - See TestPage
  static getIdFromUrl () {
    // get Id at the second part from the last. For example:
    // http://localhost:8000/?#/app/14307E234E6741889C94B0D579992EFE/pipeline/24A8F887CDDA4A52BF2DE23D584D68C0/editor
    // return: 24A8F887CDDA4A52BF2DE23D584D68C0
    return window.location.href
      .split('/')
      .slice(-2, -1)
      .toString()
      .split('?')[0]
  }

  // DEPRECATED - See TestPage
  static appIdFromUrl () {
    const query = Utils.getQueryParametersFromUrl(window.location.hash)
    const _appId = query && query.hasOwnProperty('appId') ? query.appId[0] : ''
    if (_appId) {
      return _appId
    }
    if (window.location.href.indexOf('app/') >= 0) {
      return window.location.href
        .split('app/')
        .slice(-1)[0]
        .split('/')[0]
    }
    return ''
  }

  // DEPRECATED - See TestPage
  static envIdFromUrl () {
    if (window.location.href.indexOf('env/') >= 0) {
      return window.location.href
        .split('env/')
        .slice(-1)[0]
        .split('/')[0]
    }
    return ''
  }

  // DEPRECATED - See TestPage
  static workflowIdFromUrl () {
    if (window.location.href.indexOf('workflow/') >= 0) {
      return window.location.href
        .split('workflow/')
        .slice(-1)[0]
        .split('/')[0]
    }
    return ''
  }
  // TODO: DEPRECATE
  static redirect (
    {
      appId,
      envId,
      serviceId,
      serviceTemplateId,
      pipelineId,
      workflowId,
      orchestrationId,
      releaseId,
      executionId,
      page
    },
    getUrlOnly = false
  ) {
    if (typeof appId === 'boolean') {
      appId = Utils.appIdFromUrl()
    }
    if (typeof envId === 'boolean') {
      envId = Utils.envIdFromUrl()
    }
    let url = ''

    if (appId && serviceId) {
      url = `#/app/${appId}/service/${serviceId}`
    } else if (appId && envId) {
      url = `#/app/${appId}/env/${envId}`
      if (serviceTemplateId) {
        url += `/service-template/${serviceTemplateId}`
      } else if (orchestrationId) {
        url += `/orchestration/${orchestrationId}`
      } else if (executionId) {
        url += `/execution/${executionId}`
      }
    } else if (appId && releaseId) {
      url = `#/app/${appId}/release/${releaseId}`
    } else if (appId && workflowId) {
      url = `#/app/${appId}/workflow/${workflowId}`
    } else if (appId && pipelineId) {
      url = `#/app/${appId}/pipeline/${pipelineId}`
    } else if (appId) {
      url = `#/app/${appId}`
    }
    url += '/' + page
    if (getUrlOnly === true) {
      return url
    }
    window.location = url
  }

  static goToActivity (activityUuid) {
    Utils.redirect({
      appId: true,
      envId: true,
      page: 'activities?details=' + activityUuid
    })
  }

  static deleteArrayItemById (arr, item) {
    if (!item) {
      return arr
    }
    let foundIndex = -1
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i].id === item.id) {
        foundIndex = i
        break
      }
    }
    if (foundIndex >= 0) {
      delete arr[foundIndex]
      arr = arr.filter(n => n)
    }
    return arr
  }

  static intersect (array1, array2) {
    return array1.filter(n => {
      return array2.indexOf(n) !== -1
    })
  }

  /**
   * Utility method to get Bearer auth header.
   * @returns {string} - Returns Bearer AuthHeader.
   */
  static getBearerHeader () {
    return 'Bearer ' + AppStorage.get('token')
  }

  /**
   * Utility method to get Bearer auth header.
   * @returns {string} - Returns Bearer AuthHeader.
   */
  static getBearerToken () {
    return AppStorage.get('token')
  }

  /**
   * Utility method to check if the AppStorage has the token.
   * @param {Object} nextState - Next router state.
   * @param {Object} replace - Replace router state.
   */
  static requireAuth (nextState, replace) {
    const pathname = nextState && nextState.location && nextState.location.pathname

    // Note: react-router issue: state is not passed properly to login route, save and restore url manually
    if (pathname) {
      Utils.saveActiveUrl(pathname)
    }

    if (!AppStorage.has('token')) {
      replace({
        pathname: '/login',
        state: { nextPathname: pathname }
      })
    } else {
      apis.service.ensureBearerToken(AppStorage.get('token'))
    }
  }

  static getActiveUrl () {
    return activeUrl
  }

  static saveActiveUrl (url) {
    activeUrl = activeUrl || url

    if (!activeUrl) {
      const loc = location.hash.substring(1)

      if (loc && loc.toLowerCase().indexOf('/login') !== 0) {
        activeUrl = loc
      }
    }
  }

  static clearActiveUrl () {
    activeUrl = null
  }

  static clearLoginData () {
    AppStorage.remove('acctId')
    AppStorage.remove('token')
    AppStorage.remove('email')
    apis.service.clearBearerAuthMiddleware()
  }

  static generateNodeId () {
    return 'node_' + this.generateUuid('')
  }

  static getRootUrl () {
    return (
      location.pathname
        .split('/')
        .slice(0, -1)
        .join('/') + '/'
    )
  }

  static addNotification (ref, type, msg, moreOptions) {
    ref.addNotification({
      message: msg,
      level: type,
      position: 'tc',
      ...moreOptions
    })
  }

  /**
   * Utility method to format api Long time.
   * @param {Object} timeObj - Long Time.
   * @param {string} format - Custom format ('MM/DD/YYYY HH:mm a' is default) .
   */
  static formatDate (timeObj, format = 'MM/DD/YYYY hh:mm a') {
    return timeObj ? moment.unix(timeObj / 1000).format(format) : ''
  }

  static formatDuration (durationSecs) {
    const val = moment()
      .startOf('day')
      .seconds(durationSecs)
    let str = val.hours() + 'h ' + val.minutes() + 'm ' + val.seconds() + 's '
    str = (' ' + str)
      .replace(' 0h 0m', '')
      .replace(' 0h', '')
      .replace(' 0m', '')
    return str
  }

  /**
   * Utility method to download file that comes as part of api response.
   * @param {string} url - GET URL.
   * @param {string} fileName - Filename to use.
   */
  static downloadFile (url, fileName) {
    apis.service
      .isomorphicFetch(url, { headers: {} })
      .then(res => {
        res.blob().then(data => {
          // const data = new Blob([content], { })
          const csvURL = window.URL.createObjectURL(data)
          const tempLink = document.createElement('a')
          tempLink.href = csvURL
          tempLink.setAttribute('download', fileName)
          setTimeout(() => {
            tempLink.dispatchEvent(new MouseEvent('click'))
          }, 1)
          setTimeout(() => {
            tempLink.remove()
            window.URL.revokeObjectURL(data)
          }, 5)
          return
        })
      })
      .catch(error => {
        throw error
      })
  }

  /**
   * Utility method to download file (a) server sends download url, (b) client gives the url to browser to download.
   * @param {string} url - GET URL.
   */
  static async getDownloadUrl (url) {
    try {
      const response = await apis.service.list(url)
      return { url: response.resource.downloadUrl }
    } catch (e) {
      return { error: e }
    }
  }

  /**
   * Utility method to download file (a) server sends download url, (b) client gives the url to browser to download.
   * @param {string} url - GET URL.
   * @deprecated This method does not work in Safari (use getDownloadUrl instead)
   */
  static downloadUrl (url) {
    apis.service
      .list(url)
      .then(resp => {
        if (resp.resource && resp.resource.downloadUrl) {
          const downloadUrl = resp.resource.downloadUrl
          const tempLink = document.createElement('a')
          tempLink.href = downloadUrl
          tempLink.setAttribute('download', true)
          tempLink.target = '_blank'
          setTimeout(() => {
            tempLink.dispatchEvent(new MouseEvent('click'))
          }, 1)
          setTimeout(() => {
            tempLink.remove()
          }, 5)
        } else {
          console.error('Unable to find downloadUrl', resp)
        }
      })
      .catch(error => {
        throw error
      })
  }

  // DEPRECATED! => Don't use state.app, use dataStore.apps & findByUuid
  static findApp (ctx) {
    const appIdFromUrl = Utils.appIdFromUrl()
    if (ctx.state && ctx.state.app) {
      if (ctx.state.app.uuid === appIdFromUrl) {
        return ctx.state.app
      }
    }
    return null
  }

  static findAppEnvs (ctx) {
    const currentApp = this.findApp(ctx)
    if (currentApp) {
      return currentApp.environments
    }
    return null
  }

  static updateJson () {
    const destination = {}
    const sources = [].slice.call(arguments, 0)
    sources.forEach(source => {
      for (const prop in source) {
        if (prop in destination && Array.isArray(destination[prop])) {
          // Concat Arrays
          destination[prop] = destination[prop].concat(source[prop])
        } else if (prop in destination && typeof destination[prop] === 'object') {
          // Merge Objects
          destination[prop] = Object.assign({}, destination[prop], source[prop])
        } else {
          // Set new values
          destination[prop] = source[prop]
        }
      }
    })
    return destination
  }

  static showNotification (ctx, notification = {}) {
    if (ctx && ctx.context && ctx.context.pubsub) {
      ctx.context.pubsub.publish('GlobalNotification', notification)
    }
  }

  static isFullScreen (path) {
    return path.indexOf('/applications') >= 0 || path.indexOf('/dashboard') >= 0 || path.indexOf('/infrastructure') >= 0
  }

  static hasSetupSideBar (path) {
    return (
      path.indexOf('/setup') > 0 ||
      path.indexOf('/services') > 0 ||
      path.indexOf('/service/') > 0 ||
      path.indexOf('/hosts') > 0 ||
      path.indexOf('/tags') > 0 ||
      path.indexOf('/service-template') > 0 ||
      path.indexOf('/app-container') > 0 ||
      path.indexOf('/environment') > 0 ||
      path.indexOf('/workflows') > 0 ||
      path.indexOf('/workflow') > 0 ||
      (path.indexOf('/env') > 0 && path.indexOf('/detail') > 0 && path.indexOf('/execution') < 0) ||
      (path.indexOf('/orchestration') > 0 && path.indexOf('/editor') > 0) ||
      path.indexOf('/general') > 0 ||
      path.indexOf('/artifact-setup') > 0
    )
  }

  static hasAccountSideBar (path) {
    return path.indexOf('/account') >= 0
  }

  // check if current page url needs Environments Drop-down
  static hasEnvDropdown (url) {
    return url.indexOf('/execution') >= 0 || url.indexOf('/activities') >= 0 || url.indexOf('/service-instances') >= 0
  }

  static isServiceDetail () {
    const href = window.location.href
    return href.indexOf('/service') > 0 && href.indexOf('/detail') > 0
  }
  static isWorkflowEditor () {
    const href = window.location.href
    return href.indexOf('/workflow') > 0 && href.indexOf('/editor') > 0
  }

  static isCommandEditor () {
    const href = window.location.href
    return href.indexOf('/command') > 0 && href.indexOf('/editor') > 0
  }

  static getPageClass () {
    const href = window.location.href
    let cssClass = 'fixed-page-width' // default css class name
    if ((href.indexOf('/execution') > 0 && href.indexOf('/detail') > 0) || href.indexOf('/editor') > 0) {
      cssClass = ''
    }
    return cssClass
  }

  // convert array ['uuid1', 'uuid2', ...] to [ { uuid: 'uuid1' }, { uuid: 'uuid2' }, ... ] for backend use.
  static mapToUuidArray (idArray) {
    const _list = []
    if (idArray && Array.isArray(idArray)) {
      idArray.map(item => {
        if (item === '') {
          return
        }

        _list.push({ uuid: item })
      })
    }
    return _list
  }

  // deep clone the whole object
  static clone (object) {
    return JSON.parse(JSON.stringify(object))
  }

  static getProgressPercentages (node) {
    const progress = { donePct: 0, failedPct: 0, runningPct: 0 }
    const nodeStatus = node.status
    if (node.executionSummary && node.executionSummary.breakdown) {
      switch (nodeStatus) {
        case 'SUCCESS':
        case 'FAILED':
        case 'RUNNING':
          progress.donePct = Math.round(
            node.executionSummary.breakdown.value.success / node.executionSummary.total.value * 100
          )
          progress.failedPct = Math.round(
            node.executionSummary.breakdown.value.failed / node.executionSummary.total.value * 100
          )
          break
        case 'PAUSED':
          progress.runningPct = Math.round(
            node.executionSummary.breakdown.value.inprogress / node.executionSummary.total.value * 100
          )
          break
      }
    }
    progress.sumPct = progress.runningPct + progress.failedPct + progress.donePct
    return progress
  }

  static updateSetupMessages () {
    pubsub.publish('UpdateSetupMessage', 'update')
  }

  static noDataMsg (arr) {
    let el = null
    if (!arr || arr.length === 0) {
      el = <h4 className="light col-md-12 wings-card-col">There is no data</h4>
    }
    return el
  }

  static getAppName (applications, applicationId) {
    if (applications) {
      const filteredApp = applications.find(app => app.appId === applicationId)
      if (filteredApp) {
        return filteredApp.name
      }
      return ''
    }
  }

  static findByUuid (objArray, uuid) {
    if (!objArray) {
      return null
    }
    return objArray.find(obj => obj.uuid === uuid)
  }

  // helper function for json schema form to query for form elements
  static queryRef (reactRef, queryStr, childQueryStr) {
    const refEl = ReactDOM.findDOMNode(reactRef)
    if (refEl) {
      const mainEl = refEl.querySelector(queryStr)
      if (mainEl && childQueryStr) {
        return mainEl.querySelector(childQueryStr)
      }
      return mainEl
    }
    return null
  }

  // DEPRECATED !!!   => use FormUtils
  // helper function for json schema form to set/unset 'required' for a field
  static setFormRequired (formSchema, fieldName, flag) {
    if (!formSchema || !formSchema.required) {
      return
    }
    // first, just remove fieldName from formSchema.required array
    if (formSchema.required.indexOf(fieldName) >= 0) {
      const newArr = []
      for (const name of formSchema.required) {
        if (name === fieldName) {
          continue
        }
        newArr.push(name)
      }
      formSchema.required = newArr
    }
    // then set/unset
    if (flag) {
      formSchema.required.push(fieldName)
    } else {
      // do nothing (already removed from the 1st step)
    }
  }

  // remove 1 class name from existingClassNames
  static removeClassName (existingClassNames, nameToRemove) {
    const arr = existingClassNames.split(' ')
    return arr.filter(className => className !== nameToRemove).join(' ')
  }

  // add a Class, ensure no duplicate
  static addClassName (existingClassNames, nameToAdd) {
    const newClasses = this.removeClassName(existingClassNames, nameToAdd)
    return newClasses + ' ' + nameToAdd
  }

  // example: http://jsfiddle.net/0mLb4vnp/7/
  static debounce (func, wait, immediate) {
    let timeout
    return () => {
      const context = this
      const args = arguments
      const later = () => {
        timeout = null
        if (!immediate) {
          func.apply(context, args)
        }
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) {
        func.apply(context, args)
      }
    }
  }

  // convert form's enum array to data array for MultiSelect
  static enumArrToSelectArr (enumArr, enumNamesArr) {
    const data = []
    for (let i = 0; i < enumArr.length; i++) {
      data.push({
        value: enumArr[i],
        label: enumNamesArr[i]
      })
    }
    return data
  }

  static getSelectOptionsForPipelineOrWorkflow (itemArray, type = 'workflows') {
    const data = []
    for (const item of itemArray) {
      const itemObj = { value: item.uuid, label: item.name }
      if ( (type === 'workflows' && !item.orchestrationWorkflow.valid) || (type === 'pipelines' && !item.valid)) {
        itemObj['incomplete'] = true
        itemObj['disabled'] = true
      }
      data.push(itemObj)
    }
    return data
  }

  // convert a Catalog Array to data array for Select component
  static catalogToSelectArr (catalogArr) {
    const data = []
    if (catalogArr) {
      for (const item of catalogArr) {
        data.push({
          label: item.name,
          value: item.value
        })
      }
    }
    return data
  }

  // format given string 1000 = 1K etc.
  static kFormatter (num) {
    return num > 999 ? (num / 1000).toFixed(1) + 'K' : num
  }

  static isRunning (statusStr) {
    return statusStr === 'STARTING' || statusStr === 'RUNNING'
  }

  static isSuccess (statusStr) {
    return statusStr === 'SUCCESS' || statusStr === 'COMPLETED'
  }

  static checkMultiCalls (keyName, withinTime) {
    if (typeof checkMultiCallsObj[keyName] === 'undefined') {
      checkMultiCallsObj[keyName] = 1
      setTimeout(() => {
        delete checkMultiCallsObj[keyName]
      }, withinTime)
      return false
    } else if (checkMultiCallsObj[keyName]) {
      checkMultiCallsObj[keyName]++
    }
    return true
  }

  /* example: insertArrayAt(arr, 1, ['x', 'y']) */
  static insertArrayAt (array, index, arrayToInsert) {
    Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert))
    return array
  }

  static moveArrayItem (arr, fromIndex, toIndex) {
    const element = arr[fromIndex]
    arr.splice(fromIndex, 1)
    arr.splice(toIndex, 0, element)
  }

  // try this here: https://jsfiddle.net/q28h7obo/
  static slugifyHttpStencilUrl (url) {

    if (!url) {
      return ''
    }

    return url
      .toString()
      .toLowerCase()
      .replace(/http\:\/\//g, '')
      .replace(/https\:\/\//g, '')
      .replace(/\//g, '_')
      .replace(/\./g, '_')
      .replace(/\s+/g, '_') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '_') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
      .replace(/[\s_-]+/g, '_')
  }

  static getCamelCase (str) {
    return str
      .replace(/\s(.)/g, $1 => {
        return $1.toUpperCase()
      })
      .replace(/\s/g, '')
      .replace(/^(.)/, $1 => {
        return $1.toLowerCase()
      })
  }

  static generateStepName (stencilData, formData, stepsArr) {
    if (!stencilData) {
      return ''
    }
    let newName = ''

    // if (stencilData.type === 'HTTP') {
    //   newName = 'Http_' + Utils.slugifyHttpStencilUrl(formData.url)
    // } else {

    // get all steps with the same type
    const arr = stepsArr ? stepsArr.filter(step => step.type === stencilData.type) : null
    if (arr) {
      if (arr.length === 0) {
        newName = formData ? formData.stencilData.name : stencilData.name
      } else if (arr.length > 0) {
        let maxIdx = 1
        for (const step of arr) {
          const arr = step.name.split('_')
          const idx = parseInt(arr[arr.length - 1], 10)
          maxIdx = Math.max(maxIdx, isNaN(idx) ? 0 : idx)
        }
        newName = (formData ? formData.stencilData.name : stencilData.name) + '_' + (maxIdx + 1)
      }
    } else {
      newName = stencilData.name + '_' + Math.floor(Math.random() * 9999 + 1)
    }
    // }
    return newName
  }

  static isSubWorkflow (nodeType) {
    return nodeType && (nodeType === 'SUB_WORKFLOW' || nodeType === 'PHASE' || nodeType === 'PHASE_STEP')
  }

  static isRunning (status) {
    return status && (status === 'RUNNING' || status === 'STARTING')
  }

  static isFirstLevelNode (node) {
    return node.type === 'PHASE' || node.name.indexOf('PRE_') >= 0 || node.name.indexOf('POST_') >= 0
  }

  static publishErrorNotification (pubsub, messages, type) {
    const body = document.querySelector('body')
    const modal = body.querySelectorAll('.modal-content')
    const dialog = modal !== null ? Utils.findDialog(modal[modal.length - 1]) : null
    Utils.publishNotification(dialog, type, messages)
  }

  static publishNotification (dialog, type, messages) {
    const messageStr = messages.join(',')
    if (dialog === null) {
      pubsub.publish('GlobalNotification', {
        alertStyle: type,
        autoClose: type !== 'error',
        message: messageStr
      })
    } else {
      pubsub.publish('ModalNotification', {
        alertStyle: type,
        autoClose: type !== 'error',
        message: messageStr
      })
    }
  }

  // Deployment sorting functions

  static sortByMostRecent (data) {
    if (data.length > 1) {
      return Utils.sortDataByKey(data, 'startTs', 'DESC')
    }
    return data
  }

  static sortByAppName (data) {
    if (data.length > 1) {
      return Utils.sortDataByKey(data, 'appName', 'ASC')
    }
    return data
  }

  static sortServiceSummaryCardsByApplicationName (data) {
    if (data.length > 1) {
      return Utils.sortDataByNestedKey({
        data,
        keys: ['serviceSummary', 'appSummary', 'name'],
        order: 'ASC'
      })
    }
    return data
  }

  static sortServiceSummaryCardsByServiceName (data) {
    if (data.length > 1) {
      return Utils.sortDataByNestedKey({
        data,
        keys: ['serviceSummary', 'name'],
        order: 'ASC'
      })
    }
    return data
  }

  static sortByObjectName (data) {
    if (data.length > 1) {
      return Utils.sortDataByKey(data, 'name', 'ASC')
    }
    return data
  }

  /*
  To find the modal,if it is hidden/not
  Shows error notification on the modal if it is open
  else shows GlobalNotification
  */
  static findDialog (element) {
    while (element) {
      const parent = element.parentElement
      if (parent !== null) {
        const role = parent.getAttribute('role')

        if (role === 'dialog') {
          if (parent.matches('.in')) {
            return Utils.findHiddenParent(parent)
          } else {
            return null
          }
        }
        element = parent
      } else {
        return null
      }
    }
    return null
  }

  /* If the modal is hidden it would be wrapped
    within the parent who has aria-hidden true
  */
  static findHiddenParent (element) {
    let elementRef = element
    let count = 0
    while (elementRef) {
      if (count < 2) {
        elementRef = elementRef.parentElement
        count++
      } else {
        break
      }
    }
    const hidden = elementRef.getAttribute('aria-hidden')
    return hidden ? null : element
  }

  static isInProgressNode (node) {
    return node.status === 'RUNNING' || node.status === 'STARTING'
  }

  static logOptionsToString (arr) {
    const strArr = []
    for (const obj of arr) {
      strArr.push(obj.key + ': ' + obj.value)
    }
    return strArr.join(', ')
  }

  static logOptionsFromString (str) {
    const retArr = []
    const strArr = str.split(',')
    for (const str of strArr) {
      const arr = str.split(':')
      retArr.push({ key: arr[0].trim(), value: arr[1].trim() })
    }
    return retArr
  }

  static getCatalogDisplayText (catalogs, catalogKey, val, searchField = 'value', fieldName = 'displayText') {
    if (catalogs && catalogs[catalogKey]) {
      const obj = catalogs[catalogKey].find(o => o[searchField] === val)
      return obj ? obj[fieldName] : ''
    }
    return ''
  }

  static getCloudProviderName (type) {
    if (type === 'GCP') {
      return 'Google Cloud Account Name'
    } else if (type === 'AWS') {
      return 'AWS Account Name'
    } else if (type === 'PHYSICAL_DATA_CENTER') {
      return 'Data Center Name'
    }
  }

  static buildErrorMessage (r, type) {
    if (r.responseMessages && r.responseMessages.length > 0) {
      const messages = []

      r.responseMessages.map(item => {
        messages.push(item.message)
      })
      return messages
    }
  }

  static request (ctx, promise) {
    ctx.setState({ submitting: true })
    return promise
      .then(res => {
        ctx.setState({ submitting: false })
        return res
      })
      .catch(error => {
        ctx.setState({ submitting: false })
        throw error
      })
  }

  static showBugMuncher () {
    // bugmuncher.set_options({ 'hide_button': false })
    document.getElementById('bugmuncher_button').style.display = ''
  }

  static hideBugMuncher () {
    // bugmuncher.set_options({ 'hide_button': true })
    document.getElementById('bugmuncher_button').style.display = 'none'
  }

  static sortDataByKey (data, key, order) {
    const isAscending = order === 'ASC'
    return data.sort(function (item1, item2) {
      const val1 = item1[key] ? item1[key].toString().toLowerCase() : ''
      const val2 = item2[key] ? item2[key].toString().toLowerCase() : ''
      if (val1 < val2) {
        return isAscending ? -1 : 1 // Lower if ascending
      } else if (val1 > val2) {
        return isAscending ? 1 : -1 // Higher if ascending
      }
      return 0
    })
  }

  // Sorts array of objects based on the value of a deeply nested property.
  // Properties should be ordered sequentially in keys array.
  static sortDataByNestedKey ({ data, keys, order }) {
    function getNestedValue (data, keys) {
      let result = data
      keys.forEach(key => (result ? (result = result[key]) : null))

      return result ? result.toString().toLowerCase() : ''
    }

    const isAscending = order === 'ASC'
    return data.sort(function (item1, item2) {
      if (getNestedValue(item1, keys) < getNestedValue(item2, keys)) {
        return isAscending ? -1 : 1 // Lower if ascending
      } else if (getNestedValue(item1, keys) > getNestedValue(item2, keys)) {
        return isAscending ? 1 : -1 // Higher if ascending
      }
      return 0
    })
  }

  /*
  to modify encrypted feilds from backend encrypted fileds h
  as schema property as type:Object
  converting them to be string
  */
  static modifyEncryptedFieldsOnSchema (schema, encryptedFields) {
    if (!encryptedFields) {
      return
    } else if (encryptedFields.length === 0) {
      return
    }

    for (const feild of encryptedFields) {
      if (schema.properties.hasOwnProperty(feild)) {
        const prevPropObj = schema.properties[feild]
        const title = prevPropObj.title
        schema.properties[feild] = { type: 'string', title: title }
      }
    }
  }

  // get Service Names (array) from Service Ids array ['id1', 'id2',...]
  static serviceIdsToNames (allApps, serviceIdsArr) {
    const serviceNamesArr = []
    serviceIdsArr.map(serviceId => {
      allApps.map(app => {
        const svc = app.services.find(s => s.uuid === serviceId)
        if (svc) {
          serviceNamesArr.push(svc.name)
        }
      })
    })
    return serviceNamesArr
  }

  static getUniqueArray (arr, uniqueField) {
    const seen = {}
    const out = []
    const len = arr.length
    let j = 0
    for (let i = 0; i < len; i++) {
      const item = arr[i]
      if (seen[item.uuid] !== 1) {
        seen[item.uuid] = 1
        out[j++] = item
      }
    }
    return out
  }

  static truncate (str, maxLen, dotdotdotStr = '...') {
    return str.slice(0, maxLen) + (str.length > maxLen ? dotdotdotStr : '')
  }

  // DEPRECATED - See TestPage (use: this.props.urlParams.accountId)
  static accountIdFromUrl () {
    const backup = Utils.cachedAccountId() // TODO: Refactor to have account id in URL;
    if (window.location.href.indexOf('account/') >= 0) {
      return (
        window.location.href
          .split('account/')
          .slice(-1)[0]
          .split('/')[0] || backup
      )
    }
    return backup || ''
  }

  // DEPRECATED - See TestPage
  static cachedAccountId () {
    return AppStorage.get('acctId')
  }

  static buildUrl (accountId, queryParamsObj, pageName) {
    let url = '#/account/'
    // const index = 0
    if (accountId) {
      url += `${accountId}/${pageName}?`
    }
    /*  const appIds = queryParamsObj.appId
    if (appIds && appIds.length > 0) {
      for (const appId of appIds) {
        if (index > 0) {
          url += `&appId=${appId}`
        } else {
          url += `appId=${appId}`
        }
        index++
      }
    }*/
    const queryString = Object.keys(queryParamsObj)
      .map(key => {
        const keyObj = queryParamsObj[key]
        if (Array.isArray(keyObj)) {
          return queryParamsObj[key].map(value => key + '=' + value).join('&')
        } else {
          return key + '=' + queryParamsObj[key]
        }
      })
      .join('&')

    url += queryString
    return url
  }

  static buildUrlFromQueryParams (queryParams) {
    const queryString = Object.keys(queryParams)
      .map(key => queryParams[key].map(value => key + '=' + value).join('&'))
      .join('&')
    return '/' + location.hash.split('?')[0] + (queryString ? '?' + queryString : '')
  }

  static redirectToUrl (url) {
    window.location = url
  }
  // search = ?appId=BcLyUhmBTmu4FY44jj-r9A
  // https://stackoverflow.com/questions/22942257/
  // get-url-query-string-parameters-when-there-are-multiple-parameters-with-the-same
  static getQueryParametersFromUrl (search) {
    const queryObj = search.split(/[?&]/).reduce(function (a, b, c) {
      const p = b.split('=')
      const k = p[0]
      const v = decodeURIComponent(p[1])
      if (!p[1]) {
        return a
      }
      a[k] = a[k] || []
      a[k].push(v)
      return a
    }, {})
    return queryObj
  }

  /**
   * Helper function to get Transmit Fragments object from the array of fragments.
   * @param {Object} fragmentObj - Object of fragments which declares functions to fetch data.
   * @returns {Object} - Transmit's fragment object.
   */
  static getFragments (fragmentObj) {
    const fragments = {}
    for (const key in fragmentObj) {
      const fn = fragmentObj[key][0]
      const fnParams = fragmentObj[key].slice(1)
      // eslint-disable-next-line no-undef
      const c = typeof __CLIENT__ !== 'undefined' && __CLIENT__
      fragments[key] = () => (c ? Promise.resolve() : fn.apply(this, fnParams))
    }
    return fragments
  }

  /**
   * Helper function to wrap Component with Transmit Container to fetch fragments for server rendering.
   * @param {Class} Component - Component to wrap.
   * @param {Array} fragmentObj - Object of fragments which declare functions to fetch data.
   * @returns {Object} - Transmit Container.
   */
  static createFragmentContainer (Component, fragmentObj) {
    const fragments = this.getTransmitFragments(fragmentObj)
    return Transmit.createContainer(Component, {
      initialVariables: {},
      fragments
    })
  }

  /**
   * Client-side helper to invoke functions in 'fragmentArr' to fetch data to the state.
   * @param {Object} fragmentObj - Object of fragments which declares functions to fetch data.
   * @param {Object} ctx - Context (e.g. this).
   * @param {callbackFn} [callbackFn] - Callback function to handle each fragment.
   *   @callback callbackFn
   *   @param {string} callbackFn.key - Fragment key.
   *   @param {Object} callbackFn.data - Fragment data.
   *   @param {allDoneFn} [allDoneFn] - Callback function when all requests completed.
   */
  static fetchToState (fragmentObj, ctx, callbackFn, allDoneFn) {
    let counter = 0
    const allData = {}
    const keys = fragmentObj ? Object.keys(fragmentObj) : []

      // eslint-disable-next-line no-undef
      const c = typeof __CLIENT__ !== 'undefined' && __CLIENT__
      if (c && keys.length > 0 && !ctx.props[keys[0]]) {
      // if client-side & data was not injected in props by server-rendering (Transmit) => fetch data
      for (const key in fragmentObj) {
        const fn = fragmentObj[key][0]
        const fnParams = fragmentObj[key].slice(1)
        fn(fnParams).then(data => {
          const state = {}
          state[key] = data
          allData[key] = data
          ctx.setState(state)
          if (callbackFn) {
            callbackFn(key, data) // invoke the callback function when each request is done.
          }
          counter++
          if (counter === keys.length) {
            if (allDoneFn) {
              allDoneFn(allData)
            }
          }
        })
      }
    } else {
      ctx.setState(ctx.props)
    }
  }

  static pluralize (number) {
    return number > 1 ? 's' : ''
  }

  static limitToTop (x, arr1, arr2) {
    const top = arr => Utils.limitToTop(x, arr)
    if (arr2) {
      return top(top(arr1).concat(top(arr2)))
    } else if (arr1) {
      arr1.splice(10, arr1.length)
      return arr1
    } else {
      return []
    }
  }

  static highlightTextWithFilter (text, filterText) {
    if (filterText && text) {
      const index = text.toLowerCase().indexOf(filterText.toLowerCase())

      if (index !== -1) {
        const html =
          escapeHTML(text.substring(0, index)) +
          '<mark>' +
          escapeHTML(text.substring(index, index + filterText.length)) +
          '</mark>' +
          escapeHTML(text.substring(index + filterText.length))
        return React.createElement('span', {
          dangerouslySetInnerHTML: { __html: html }
        })
      } else {
        return text
      }
    } else {
      return text
    }
  }

  static formatMetric = (metricData, metricName, oldOrNew) => {
    // if API does not return a metric & type => use these default types
    const DEFAULT_TYPES = {
      'Total Calls': 'COUNT',
      '95th Percentile Response Time (ms)': 'TIME_MS',
      'Errors per Minute': 'RATE',
      'Stall Count': 'COUNT',
      'Number of Slow Calls': 'COUNT',
      'Number of Very Slow Calls': 'COUNT'
    }
    let ret = Utils.getJsonValue(metricData, `metricsMap.${metricName}.${oldOrNew}.value`) || 0
    let type = Utils.getJsonValue(metricData, `metricsMap.${metricName}.metricType`)
    type = type || Utils.getJsonValue(DEFAULT_TYPES, metricName) || 'COUNT'

    const val = Math.round(ret)
    if (type === 'COUNT') {
      ret = Math.round(ret)
    } else if (type === 'TIME_MS') {
      ret = val > 999 ? Math.round(val / 1000) + 's' : val + 'ms'
    } else if (type === 'TIME_S') {
      ret = Math.round(ret) + 's'
    } else {
      ret = Math.round(ret)
    }
    ret = val === 0 || ret === '0' ? <span className="light">Not available</span> : ret
    return ret
  }

  static buildSelectedAppIdsQueryParams = () => {
    const queryParams = DataStore.getSelectedApps()
      .map(app => 'appId=' + app.appId)
      .join('&')
    return queryParams ? '&' + queryParams : ''
  }

  // redirect to new Setup Pages

  // DEPRECATED
  static redirectToWorkflow = deployment => {
    const appId = deployment.appId
    const envId = deployment.envId
    const executionId = deployment.uuid || deployment.executionId

    const url = `/#/app/${appId}/env/${envId}/execution/${executionId}/detail`
    window.location = url
  }

  /*
   * Listen to scroll down event on a DOM element (default window).
   * handler: event handler
   * distance: distance to bottom, default is 50 pixels
   * element: event target element, default is window
   */
  static onScrollDownEvent = ({ handler = done => done(), distance = 50, element = window, progress = () => null }) => {
    const scrollEvents = ScrollEvents.getInstance(element)
    let handlerInProgress = false

    scrollEvents.on('scroll:progress', () => {
      progress(scrollEvents)

      if (handlerInProgress) {
        return
      }

      const { clientHeight, scrollHeight, scrollPosition } = scrollEvents
      const direction = ScrollEvents.directionToString(scrollEvents.directionY)

      if (direction === 'down' && scrollPosition.y + clientHeight + distance >= scrollHeight) {
        handlerInProgress = true
        handler(() => (handlerInProgress = false))
      }
    })

    return scrollEvents
  }

  /* Filter Workflow Variables by entityType */
  static filterWorkflowVariablesByEntityType = (workflowVariables, entityType) => {
    for (const variable of workflowVariables) {
      if (variable.metadata.entityType === entityType) {
        return variable
      }
    }
  }

  static findAllUserVariablesByEntityType = (userVariables, entityType) => {
    if (userVariables) {
      return userVariables.filter(userVariable => userVariable.metadata.entityType === entityType)
    }
  }
  /*
  This is to strip off special charecters and extract the value
  if expression is ${123} => we need 123
*/
  static stripOffSpecialCharecters = expression => {
    return expression.replace(/[^\w\s]/gi, '')
  }
  /*
  To Avoid duplicate expressions
  default template field value -> will be service/env/serviceinfra
  if they exist we should add service2 and if service2 exists it should be
  service3
 */
  static getNumberFromTemplateExpression = expression => {
    const numbers = expression.match(/\d/g)
    if (numbers) {
      return Number(numbers.join(''))
    }
    return 1
  }
  static findDuplicateUserVariable = (userVariables, name) => {
    const expressionValue = Utils.stripOffSpecialCharecters(name)
    if (userVariables && name) {
      return userVariables.find(userVariable => userVariable.name === expressionValue)
    }
  }
  /* get template expressions from phases */
  static getTemplateExpressionFromPhases = (phases, entityType) => {
    const templateEntities = []
    for (const phase of phases) {
      const templateExpressions = phase.templateExpressions
      if (templateExpressions) {
        const templateEntity = Utils.filterWorkflowVariablesByEntityType(templateExpressions, entityType)
        if (templateEntity) {
          templateEntities.push(templateEntity)
        }
      }
    }
    return templateEntities
  }

  /* Get Envnames for phases with templateexpressions */
  static getEnvironmentName = (workflow, env) => {
    let envName
    if (workflow) {
      if (workflow.templateExpressions) {
        const templateExpressions = workflow.templateExpressions
        const envVariable = Utils.filterWorkflowVariablesByEntityType(
          templateExpressions,
          Utils.entityTypes.environment
        )
        envName = envVariable ? envVariable.expression : (env) ? env.name : ''
      } else {
        envName = env ? env.name : ''
      }
    }
    return envName
  }

  /* Get ServiceNames for workflow with template expressions */
  static getServiceNames = workflow => {
    let serviceNames
    if (workflow) {
      const phases = workflow.orchestrationWorkflow ? workflow.orchestrationWorkflow.workflowPhases : []
      if (phases && phases.length > 0) {
        const templateExpressions = Utils.getTemplateExpressionFromPhases(phases, Utils.entityTypes.service)
        if (templateExpressions) {
          const nonTemplateServices = Utils.getNonTemplatizeServices( workflow.templatizedServiceIds, workflow)
          const templateServices = templateExpressions.map(item => item.expression)

          serviceNames = templateServices.concat(nonTemplateServices).join(',')
        } else {
          serviceNames = workflow.services.map(svc => svc.name).join(', ')
        }
      } else {
        serviceNames = workflow.services.map(svc => svc.name).join(', ')
      }
    }


    return serviceNames
  }


  static getNonTemplatizeServices = ( templatizedServiceIds, workflow) => {

    const nonTemplateServices = workflow.services.filter ( (item) => !templatizedServiceIds.includes(item.uuid))
    return nonTemplateServices.map ( (item) => item.name )
  }

  /* Template Expression entity types */
  static entityTypes = {
    environment: 'ENVIRONMENT',
    service: 'SERVICE',
    infraMapping: 'INFRASTRUCTURE_MAPPING'
  }

  static encryptTypes = {
    TEXT: 'SECRET_TEXT',
    FILE: 'CONFIG_FILE'
  }
  static encryptionTitles = {
    KMS: 'Amazon KMS',
    VAULT: 'HashiCorpVault'
  }
  static encryptionTypes = {
    KMS: 'KMS',
    VAULT: 'VAULT'
  }

  static async sleep (ms) {
    await new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  static async setComponentState (component, state) {
    await new Promise(resolve => component.setState(state, _ => resolve()))
  }

  /* Setup As Code: check if a tree node is a folder node */
  static isFolderSetupNode (node) {
    return node && node.type === 'folder'
  }
  // Filtering workflowhases by serviceid this will be used at multiple places
  static filterWorkflowPhasesByServiceId = (selectedWorkflow, serviceId) => {
    const workflowPhases = selectedWorkflow ? selectedWorkflow.orchestrationWorkflow.workflowPhases : []
    const filteredPhaseByServiceId = workflowPhases.find(phase => phase.serviceId === serviceId)
    if (filteredPhaseByServiceId) {
      return filteredPhaseByServiceId
    }
  }

  /* Setup As Code: check if a tree node is a folder node */
  static isFolderSetupNode (node) {
    return node && node.type === 'folder'
  }

  static defaultTemplateFieldDataForServiceInfra = formData => {}

  // reorder array of Nodes using the order of the Links to avoid "tangled" nodes issue:
  static reorderNodesByLinks ({ nodes, links }) {
    if (!nodes || nodes.length <= 1) {
      return nodes
    }
    const firstNode = nodes.find(n => n.origin === true) // nodes[0]

    const newNodesArr = [firstNode]
    let nextNode = firstNode
    for (let i = 0; i < links.length; i++) {
      const foundLink = links.find(link => link.from === nextNode.id)
      if (foundLink && foundLink.to) {
        nextNode = nodes.find(n => n.id === foundLink.to)
        if (nextNode) {
          newNodesArr.push(nextNode)
        }
      }
    }
    return newNodesArr
  }

  // auto generate x, y to place nodes from left to right:
  static autoPlaceNodes (nodes, startX = 40, startY = 40) {
    let cnt = 0
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].name && nodes[i].name.indexOf('Rollback') >= 0) {
        continue
      }
      nodes[i].x = startX + 150 * cnt
      nodes[i].y = startY
      cnt++
    }
  }
  static checkSSHUserExistenceOnRequiredEntities = requiredEntities => {
    if (requiredEntities && requiredEntities.length > 0) {
      if (requiredEntities.indexOf('SSH_USER') > -1) {
        return true
      }
    }
    return false
  }
  static checkAritfactExistenceOnRequiredEntities = requiredEntities => {
    if (requiredEntities && requiredEntities.length > 0) {
      if (requiredEntities.indexOf('ARTIFACT') > -1) {
        return true
      }
    }
    return false
  }

  static addValidStatusToWorkflow = (workflows, fieldName, type = 'workflows') => {
    for (const wf of workflows) {
      if ((type === 'workflows' && wf.orchestrationWorkflow.valid === false) || (type === 'pipelines' && !wf.valid)) {
        wf[fieldName] += ' - Incomplete'
      }
    }
  }
  /*
     Add Environment to the workflow name if it is not templatized workflow
     if templatized and environment is templatized add TEMPLATE to workflowname
  */
  static addEnvironmentNameToWorkflow = (workflows, fieldName, environments) => {
    for (const workflow of workflows) {
      const envId = workflow.envId
      const templatized = workflow.templatized
      const userVariables = workflow.orchestrationWorkflow.userVariables
      const envEntities = TemplateUtils.filterWorkflowVariables(
        userVariables,
        TemplateUtils.entityTypes.environment,
        'metadata',
        'entityType'
      )
      if (templatized && envEntities.length > 0) {
        workflow[fieldName] += ' (TEMPLATE)'
      } else if (envId) {
        const envName = Utils.searchEntities(environments, 'uuid', envId, 'name')
        workflow[fieldName] += ` (${envName})`
      }
    }
  }
  /*
  Find any entity(apps/environments/services and etc,)
  can filter by id and return any property
  as this logic is common named it as entities
 */
  static searchEntities = (entities, filterBy, searchValue, returnValue) => {
    if (entities.length > 0) {
      const filteredEntities = entities.find(entity => entity[filterBy] === searchValue)
      return filteredEntities[returnValue]
    }
  }

  static AWSDeploymentTypes = {
    CodeDeploy: 'AWS_CODEDEPLOY',
    Lambda: 'AWS_LAMBDA'
  }
  static infraMappingTypes = {
    DC_SSH: 'PHYSICAL_DATA_CENTER_SSH',
    AWS_SSH: 'AWS_SSH',
    AWS_ECS: 'AWS_ECS',
    AWS_AWSLAMBDA: 'AWS_AWS_LAMBDA',
    AWS_AWSCODEDEPLOY: 'AWS_AWS_CODEDEPLOY',
    DIRECT_KUBERNETES: 'DIRECT_KUBERNETES',
    GCP_KUBERNETES: 'GCP_KUBERNETES'
  }

  static connectorTypes = {
    ELK: 'ELK',
    SUMO: 'SUMO',
    NEW_RELIC: 'NEW_RELIC'
  }

  static workflowTypes = {
    BUILD: 'BUILD',
    BASIC: 'BASIC',
    CANARY: 'CANARY'
  }
  // ///////////////////// transform dbQueries into API call structure and encode //////////////////////////
  // Example query:
  // const dbQueries = [
  //   {
  //     property: 'pipelineSummary.pipelineId',
  //     operation: 'IN',
  //     operationTarget: ['v4CNQ5U-QUq6j_cHIq_CQQ', 'v4CNQ5U-QUq6j_cHIq_CQQ']
  //   }
  // ]
  // will return an output in this format:
  // &search[0][field]=envId&search[0][op]=IN&search[0][value]=VbQD8W8ISg-jKQw7YAwjOA

  static getUrlParamsFromDbQueryDefs = ({ dbQueryDefs }) => {
    // Each paramGroup needs a sequential index.
    const paramGroupIndex = { value: -1 }
    const result = dbQueryDefs
      .map(dbQueryDef => Utils.getUrlParamsFromDbQueryDef({ dbQueryDef, paramGroupIndex }))
      .join('')
    console.log('result')
    console.log(result)
    return result
  }

  static getUrlParamsFromDbQueryDef = ({ dbQueryDef, paramGroupIndex }) => {
    let operationTarget = ''

    if (!dbQueryDef.operationTarget) {
      return ''
    }

    switch (dbQueryDef.operation) {
      case 'IN':
        if (dbQueryDef.operationTarget.length === 0) {
          return ''
        }

        paramGroupIndex.value += 1
        const array = dbQueryDef.operationTarget
        operationTarget = Utils.transformDbQueryArray({ array, paramGroupIndex })
        break
      case 'CONTAINS':
      case 'GT': // greater than
      case 'LT': // less than
      default:
        paramGroupIndex.value += 1
        operationTarget = Utils.transformDbQueryString({ dbQueryDef, paramGroupIndex })
        break
    }

    return [
      `&search[${paramGroupIndex.value}][field]=${dbQueryDef.property}`,
      `&search[${paramGroupIndex.value}][op]=${dbQueryDef.operation}`,
      `${operationTarget}`
    ].join('')
  }

  static transformDbQueryArray = ({ array, paramGroupIndex }) =>
    array.map(el => `&search[${paramGroupIndex.value}][value]=${el}`).join('')

  static transformDbQueryString = ({ dbQueryDef, paramGroupIndex }) => {
    return `&search[${paramGroupIndex.value}][value]=${dbQueryDef.operationTarget}`
  }

  static expandEnvType = ({ envType }) => {
    if (envType === 'NON_PROD') {
      return 'Non-Production'
    } else if (envType === 'PROD') {
      return 'Production'
    }
    return envType
  }

  static filterGlobalKMS = (kmsList, globalAccountId) => {
    if (kmsList) {
      return kmsList.find(item => item.accountId === globalAccountId)
    }
  }

  static filterCustomKMS = (kmsList, globalAccountId) => {
    if (kmsList) {
      return kmsList.filter(item => item.accountId !== globalAccountId)
    }
  }

  static renderHelpTextForPattern = className => {
    return (
      <span className={className}>
        <span>For Any type: e.g. path1/path2/myservice-*.jar</span>
        <span>Maven style only type: e.g. com/mycompany/myservice/.*/myservice*.jar</span>
      </span>
    )
  }

  static renderVendorImage = ({ vendor }) => {
    const logoMap = {
      DEFAULT_LOGO: 'logo-data-center.png',

      APP_DYNAMICS: 'logo-appd.png',
      AWS: 'logo-aws.png',
      BAMBOO: 'logo-bamboo.png',
      DOCKER: 'logo-docker.png',
      GCP: 'logo-google-cloud.png',
      JENKINS: 'logo-jenkins.png',
      PHYSICAL_DATA_CENTER: 'logo-data-center.png',
      SLACK: 'logo-slack.png',
      SPLUNK: 'logo-splunk.png',

      ELK: 'logo-elk.png',
      ARTIFACTORY: 'logo-artifactory.png',
      ELB: 'logo-elb.png',
      LOGZ: 'logo-logzio.png',
      NEW_RELIC: 'logo-newrelic.png',
      NEXUS: 'logo-nexus.png',
      SMTP: 'logo-smtp.png',
      SUMO: 'logo-sumologic.png',

      HOST_CONNECTION_ATTRIBUTES: null
    }

    const imageFile = logoMap[vendor]
    const imageEl = imageFile ? <img src={`/img/vendor-logos/${imageFile}`} /> : null

    return imageEl
  }

  // Example: Utils.toLabelValueOptions(pipelines, 'name', 'uuid')
  static toLabelValueOptions (arr, labelField, valueField) {
    if (!arr) {
      return []
    }
    return arr.map(item => {
      return { label: item[labelField], value: item[valueField] }
    })
  }

  static renderUrlForConnectorsCardView (item, category) {
    return Object.keys(item.value).map(key => {
      if (
        key.indexOf('host') >= 0 ||
        key.indexOf('Url') >= 0 ||
        (key.indexOf('accessKey') >= 0 && category !== 'Artifact')
      ) {
        return item.value[key]
      }
      return null
    })
  }

  static disableNonSecretKeysOnSchema ({ schema, uiSchema, secretKeys } ) {
    const properties = schema.properties

    Object.keys(properties).map(property => {
      if ( secretKeys && !secretKeys.includes(property)) {
        if (!uiSchema[property]) {
          uiSchema[property] = {}
        }
        uiSchema[property]['ui:disabled'] = true
      }
    })
    return uiSchema
  }


  static updateValuePropertyWithEnums = async ({ formObject, result, context }) => {
    const { schema, formData, uiSchema } = formObject
    const jsonSchema = schema ? schema : FormUtils.clone(context.state.schema)
    const displaySchema = uiSchema ? uiSchema : FormUtils.clone(context.state.uiSchema)
    const sortedContent = Utils.sortDataByKey(result, 'name', 'ASC')
    const uuidArray = sortedContent.map(item => item.uuid).concat(['New'])
    const enumNamesArr = sortedContent.map(item => item.name).concat(['+ Add New Encrypted Text'])

    jsonSchema.properties.value['enum'] = uuidArray

    jsonSchema.properties.value['enumNames'] = enumNamesArr
    displaySchema.value = { 'ui:placeholder': 'Select Encrypted Text' }
    formData.value = formData.encryptedValue ? formData.encryptedValue : ''
    context.setState({ formData, schema: jsonSchema, uiSchema: displaySchema })
  }

  static isYamlEnabled (accountId) {
    const href = window.location.href
    return accountId === 'kmpySmUISimoRrJL6NL73w' ||
      accountId === 'zEaak-FLS425IEO7OLzMUg' ||
      accountId === 'wFHXHD0RRQWoO8tIZT5YVw' ||
      href.includes('ci.wings.software') ||
      href.includes('ci2.harness.io') ||
      href.includes('qa.harness.io')
  }

  static getValueForConfig ( config) {
    if (config) {
      return config.type === 'ENCRYPTED_TEXT' ? config.secretTextName : config.value
    }
  }

  static getEncryptFileName = (encryptFiles, id) => {
    if (encryptFiles && encryptFiles.length > 0) {
      const filteredFile = encryptFiles.find(item => item.uuid === id)
      if (filteredFile) {
        return filteredFile.name
      }
    }
  }

  static getFilePathForConfig ( config) {
    if (config) {
      return config.type === 'ENCRYPTED_TEXT' ? config.secretTextName : config.value
    }
  }

}





// WEBPACK FOOTER //
// ../src/components/Utils/Utils.js