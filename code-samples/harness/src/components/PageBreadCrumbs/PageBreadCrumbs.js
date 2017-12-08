import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import { Menu, MenuItem, Popover, Position, PopoverInteractionKind } from '@blueprintjs/core'

import css from './PageBreadCrumbs.css'

const APPLICATION_CHILDREN = [
  { label: 'Services', linkPathFunc: 'toSetupServices' },
  { label: 'Environments', linkPathFunc: 'toSetupEnvironments' },
  { label: 'Workflows', linkPathFunc: 'toSetupWorkflow' },
  { label: 'Pipelines', linkPathFunc: 'toSetupPipeLines' },
  { label: 'Triggers', linkPathFunc: 'toSetupTriggers' }
]

@observer
export default class PageBreadCrumbs extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        link: PropTypes.string,
        header: PropTypes.string
      })
    ).isRequired
  }
  static defaultProps = {
    data: [
      {
        label: 'page'
      }
    ]
  }
  renderHeader = header => {
    return <div className={css.header}>{header}</div>
  }

  renderText = (link, label, className) => {
    if (link) {
      return (
        <a href={link} className={className}>
          {label}
        </a>
      )
    } else {
      return <span className={className}>{label}</span>
    }
  }

  renderDropdown (textEl, dropdown) {
    let items

    if (dropdown === 'applications') {
      const apps = this.props.apps || this.props.dataStore.apps.toJS()
      const { accountId } = this.props.urlParams
      items = apps.map(app => {
        return {
          label: app.name,
          path: this.props.path.toAppDetails({ accountId, appId: app.uuid })
        }
      })
    } else if (dropdown === 'application-children') {
      items = APPLICATION_CHILDREN.map(item => {
        const defaultFn = () => {}
        const linkPathFunc = this.props.path[item.linkPathFunc] || defaultFn
        return {
          label: item.label,
          path: linkPathFunc(this.props.urlParams)
        }
      })
    }

    if (!items || !items.length) {
      return textEl
    }
    return (
      <span>
        {textEl}
        <Popover
          interactionKind={PopoverInteractionKind.CLICK}
          transitionDuration={0}
          popoverClassName="pt-minimal"
          portalClassName={css.topBreadCrumbs}
          content={
            <Menu>
              {items.map((item, itemIdx) => {
                const onClick = e => {
                  console.log('click', item.path)
                  this.props.router.push(item.path)
                }

                return <MenuItem key={itemIdx} text={item.label} onClick={onClick} />
              })}
            </Menu>
          }
          position={Position.BOTTOM_LEFT}
        >
          <button className={'text-btn no-outline ' + css.caret}>
            <i className="caret" />
          </button>
        </Popover>
      </span>
    )
  }
  render () {
    const data = this.props.data || []
    let withHeaderClass = ''
    data.map(item => {
      if (withHeaderClass === '' && item.header) {
        withHeaderClass = css.breadCrumbsWithHeader
      }
    })

    return (
      <ul className={`pt-breadcrumbs ${css.breadCrumbs} ${withHeaderClass}`}>
        {data.map((ele, index) => {
          // const lastBreadCrumbItem = index === data.length - 1 ? 'pt-breadcrumb-current' : ''
          const link = ele.link ? '/#' + ele.link : ''
          const header = ele.header
          // For Account section(connectors,cloudproviders) to have same size for breadcrumbs
          const nonHeaderBreadClass = index === 0 || ele.nonHeader ? css.nonHeaderBread : ''
          const tabClassNames = `pt-breadcrumb ${nonHeaderBreadClass} ${css.breadCrumbItem}`

          let textEl = null
          if (header) {
            textEl = this.renderText(link, ele.label, css.labelItem)
          } else {
            textEl = this.renderText(link, ele.label, css.labelItem + ' ' + tabClassNames)
          }

          return (
            <li key={index}>
              {!header && <span>{this.renderDropdown(textEl, ele.dropdown)}</span>}
              {header && (
                <div className={tabClassNames}>
                  <div className={css.txtHolder}>
                    {ele.header && this.renderHeader(ele.header)}
                    <span>{this.renderDropdown(textEl, ele.dropdown)}</span>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/PageBreadCrumbs/PageBreadCrumbs.js