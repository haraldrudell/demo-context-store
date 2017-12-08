import React from 'react'
import Utils from './Utils'
import WingsIcons from '../WingsIcons/WingsIcons'
import TooltipOverlay from '../TooltipOverlay/TooltipOverlay'
import reactUpdate from 'react-addons-update'
import apis from 'apis/apis'
import MultiSelect from '../MultiSelect/MultiSelect'
import AppStorage from '../AppStorage/AppStorage'
import BreadCrumbs from '../BreadCrumbs/BreadCrumbs'

// --- COMPONENT UTILS --- //

export default class CompUtils {
  static toggleSidebar (expandFlag) {
    const { body } = document
    const doExpand = typeof expandFlag === 'boolean' ? expandFlag : body.classList.contains('collapse-sidebar')

    if (doExpand) {
      body.classList.remove('collapse-sidebar')
    } else {
      body.classList.add('collapse-sidebar')
    }

    const path = window.location.href
    if (Utils.isFullScreen(path)) {
      body.className = Utils.addClassName(body.className, 'full-screen')
    } else {
      body.className = Utils.removeClassName(body.className, 'full-screen')
    }
  }

  // helper for Artifact dropdowns
  // filter out artifacts which have the same build source name in selectedArtifactUuids (comma separated string)
  static removeSameBuildSourceArtifacts (artifactsArr, selectedArtifactUuids) {
    // reset 'filteredOut'
    for (const artifact of artifactsArr) {
      artifact.filteredOut = false
    }
    if (selectedArtifactUuids) {
      const arrIds = selectedArtifactUuids.split(',')
      for (const id of arrIds) {
        // Loop through "Selected Artifact IDs" (MultiSelect dropdown's value: splitted by ",")
        const selectedArtifact = artifactsArr.find(a => a.uuid === id)
        for (const artifact of artifactsArr) {
          if (artifact.uuid === selectedArtifact.uuid) {
            artifact.filteredOut = true
          } else {
            const commonServiceIds = Utils.intersect(artifact.serviceIds, selectedArtifact.serviceIds)
            artifact.filteredOut = commonServiceIds.length > 0 ? true : artifact.filteredOut
          }
        }
      }
    }
  }

  // helper for Artifact dropdowns
  // hide MultiSelect's items which have '.filteredOut' === true
  static toggleArtifactDropdownItems (formRef, artifactsArr) {
    const selectEl = Utils.queryRef(formRef, '.__artifactSelect', '.Select')
    const selectMenuEl = selectEl.querySelector('.Select-menu')
    if (selectMenuEl) {
      const divEls = selectMenuEl.querySelectorAll('div') // wrapper elements of dropdown options.
      const filteredOutArtifacts = artifactsArr.filter(a => a.filteredOut === true)
      for (const divEl of divEls) {
        // const isFilteredOut = filteredOutArtifacts.find(a => a.displayName === divEl.textContent)
        // if the dropdown option (divEl.firstChild) was filtered out => hide it.
        const menuItemElVal = divEl.firstChild.dataset.value ? divEl.firstChild.dataset.value : divEl.firstChild.value
        const isFilteredOut = filteredOutArtifacts.find(a => a.uuid === menuItemElVal)
        divEl.style.display = isFilteredOut ? 'none' : 'block'
      }
    }
  }
  static getStatusClassName (status) {
    let className
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED':
        className = 'color-SUCCESS'
        break
      case 'FAILED':
        className = 'color-FAILED'
        break
      case 'PAUSED':
      case 'PAUSING':
      case 'WAITING':
        className = 'status-PAUSING'
        break
      case 'ABORTED':
      case 'ABORTING':
        className = 'status-ABORTED'
        break
      case 'RUNNING':
        className = 'status-RUNNING'
        break
    }
    return className
  }

  // DEPRECATED
  static renderBreadCrumbsForAccount (label) {
    const accountId = AppStorage.get('acctId')
    const accountLabel = 'Account'
    const bData = [
      { label: 'Setup', link: `/account/${accountId}/setup` },
      { label: accountLabel, link: `/account/${accountId}/setup` },
      { label: label }
    ]
    return <BreadCrumbs data={bData} />
  }

  static renderStatusIcon (status, renderText) {
    const className = CompUtils.getStatusClassName(status)
    return (
      <div className="__status">
        {WingsIcons.renderStatusIcon(status, 'small-status-svg icon')}
        {renderText === true ? (
          <span className={className} data-name="workflow-execution-status">
            {status}
          </span>
        ) : null}
      </div>
    )

    /* if (status === 'SUCCESS' || status === 'COMPLETED') {
      el = (
        <span className="__status status-SUCCESS" data-name="workflow-execution-status">
          <i className="icons8-checked status-SUCCESS" title="Success" style={{ marginRight: 5 }} />
          {renderText === true ? (
            <span className="color-SUCCESS">SUCCESS</span>
          ) : null}
        </span>
      )
    } else if (status === 'FAILED') {
      el = (
        <span className="__status status-FAILED" data-name="workflow-execution-status">
          <i className="icons8-high-priority-3 status-FAILED" title="Failed" style={{ marginRight: 5 }} />
          {renderText === true ? (
            <span className="color-FAILED">FAILED</span>
          ) : null}
        </span>
      )
    } else if (status === 'RUNNING') {
      el = (
        <span className="__status status-RUNNING" data-name="workflow-execution-status">
          <i className="icons8-circle-thin" title="Running" style={{ marginRight: 5 }} />
          {renderText === true ? (
            <span>RUNNING</span>
          ) : null}
        </span>
      )
    } else if (status === 'PAUSED') {
      el = (
        <span className="__status status-PAUSED">
          <i className="icons8-pause-filled" title="Paused" style={{ marginRight: 5 }} />
          {renderText === true ? (
            <span>PAUSED</span>
          ) : null}
        </span>
      )
    } else if (status === 'ABORTED') {
      el = (
        <span className="__status status-ABORTED">
          <i className="icons8-cancel" title="Aborted" style={{ marginRight: 5 }} />
          {renderText === true ? (
            <span>ABORTED</span>
          ) : null}
        </span>
      )
    } else if (status === 'PAUSING') {
      el = (
        <span className="__status status-PAUSING">
          <i className="icons8-pause-filled" title="Pausing" style={{ marginRight: 5 }} />
          {renderText === true ? (
            <span>PAUSING</span>
          ) : null}
        </span>
      )
    } else if (status === 'ABORTING') {
      el = (
        <span className="__status status-ABORTING">
          <i className="icons8-cancel" title="Aborting" style={{ marginRight: 5 }} />
          {renderText === true ? (
            <span>ABORTING</span>
          ) : null}
        </span>
      )
    }
    return el*/
  }

  static renderStatusText (status) {
    status = status === 'COMPLETED' ? 'SUCCESS' : status
    return <span className={`__status color-${status}`}>{status}</span>
  }

  // DEPRECATED ! DEPRECATED ! ===> use Wiget with NoDataCard:
  // check state.loadingStatus to render Spinner or No-Data message
  static renderLoadingStatus (ctx, data, noDataComponent, spinnerClass = '') {
    const spinner = <span className={'wings-spinner ' + spinnerClass} />

    switch (ctx.state.loadingStatus) {
      case 1:
        return spinner
      case 2:
        if (!data) {
          return spinner
        } else if (Array.isArray(data) && data.length === 0) {
          return <div>{noDataComponent}</div>
        }
    }
    return null
  }

  static handleStreamData (ctx, resp, stateData, streamObj) {
    if (resp.resource && Array.isArray(stateData.resource.response)) {
      const data = { resource: { response: [] } }
      if (streamObj.type === 'CREATE') {
        data.resource.response = { $unshift: [resp.resource] }
      } else {
        // UPDATE existing element
        let index = -1
        stateData.resource.response.map((item, i) => {
          if (item.uuid === resp.resource.uuid) {
            index = i
            return
          }
        })
        if (index >= 0) {
          data.resource.response[index] = { $set: resp.resource }
        }
      }
      ctx.setState({ data: reactUpdate(stateData, data) })
    }
  }

  static fetchComputeProviders (ctx, callBack) {
    const appIdFromUrl = Utils.appIdFromUrl()
    apis
      .fetchPlugins()
      .then(d => {
        if (Array.isArray(d.resource)) {
          const types = []
          d.resource.forEach(b => {
            if (b.pluginCategories.indexOf('CloudProvider') >= 0) {
              types.push(b.type)
            }
          })

          if (types.length > 0) {
            const str = types.join('&type=')
            apis.service
              .list(apis.getSettingsConfigEndpoint(appIdFromUrl, str))
              .then(r => {
                ctx.setState({ computeProviders: r })
                if (callBack) {
                  callBack()
                }
              })
              .catch(error => {
                throw error
              })
          }
        }
      })
      .catch(error => {
        throw error
      })
  }

  static hostNamesArrayToSelect = (formData, schema, uiSchema, fieldName = 'hostNames', hostsData = []) => {
    const HostNamesSelect = props => {
      const multiSelectData = Utils.enumArrToSelectArr(props.schema.data.enum, props.schema.data.enumNames)
      return <MultiSelect description="Host Name(s)" data={multiSelectData} {...props} />
    }
    // --- function start
    //
    if (fieldName in formData) {
      if (Array.isArray(formData[fieldName])) {
        formData['hostNamesText'] = formData[fieldName].join(',')
      }
      delete formData.hostNames
    }

    delete schema.properties[fieldName]
    schema.required = ['hostNamesText']

    if (hostsData) {
      schema.properties['hostNamesText'] = {
        type: 'string',
        title: 'Host Name(s)',
        data: { enum: hostsData, enumNames: hostsData }
      }
      uiSchema['hostNamesText'] = { 'ui:widget': HostNamesSelect, 'ui:placeholder': 'hostname1\nhostname2' }
    } else {
      schema.properties['hostNamesText'] = { type: 'string', title: 'Host Name(s)' }
      uiSchema['hostNamesText'] = { 'ui:widget': 'textarea', 'ui:placeholder': 'hostname1\nhostname2' }
    }

    const indx = uiSchema['ui:order'].indexOf(fieldName)
    uiSchema['ui:order'].splice(indx, 1, 'hostNamesText')
  }

  static removeFromUISchemaOrder = (uiSchema, fieldName) => {
    const i = uiSchema['ui:order'].findIndex(el => el === fieldName)
    uiSchema['ui:order'].splice(i, 1)
  }

  static renderRiskLevel (riskLevel, btRiskSummary) {
    let ret = null
    if (riskLevel === 'HIGH') {
      ret = (
        <span className="error-text bold">
          <i className="icon icons8-high-priority-3 status-FAILED" />HIGH
        </span>
      )
    } else if (riskLevel === 'MEDIUM') {
      ret = <span className="warning-text bold">MEDIUM</span>
    } else if (riskLevel === 'LOW') {
      ret = <span className="light bold">LOW</span>
    } else {
      ret = <span>{riskLevel}</span>
    }
    let tooltipEl = null
    if (btRiskSummary && Array.isArray(btRiskSummary) && btRiskSummary.length > 0) {
      tooltipEl = (
        <div>
          {btRiskSummary.map(msg => (
            <div key={msg} style={{ marginTop: 15 }}>
              {msg}
            </div>
          ))}
        </div>
      )
    }
    if (riskLevel === 'HIGH' && tooltipEl) {
      return (
        <TooltipOverlay tooltip={tooltipEl} placement="left">
          {ret}
        </TooltipOverlay>
      )
    }
    return ret
  }

  static async setComponentState (component, state) {
    await new Promise(resolve => component.setState(state, _ => resolve()))
  }

  /* used in SearchableSelect - render WFs with "- Incomplete" text in italic */
  static renderWorkflowDropdownOption (option) {
    const optionText = option.label
    const strWithoutStatus = optionText.replace(' - Incomplete', '')
    if (optionText.includes(' - Incomplete') || option.incomplete) {
      return (
        <span className="disable-option">
          {strWithoutStatus} &nbsp;
          <em style={{ color: '#aaa' }}>
            -
            <span style={{ color: '#ff8c00' }}>&nbsp; Incomplete</span>
          </em>
        </span>
      )
    } else {
      return option.label
    }
  }
}



// WEBPACK FOOTER //
// ../src/components/Utils/CompUtils.js