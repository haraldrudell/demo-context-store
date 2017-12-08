import React from 'react'
import { LabellingDropdown } from '../../components/LabellingDropdown/LabellingDropdown'
import { Dropdown, MenuItem } from 'react-bootstrap'
import css from './WidgetHeader2.css'

export default class WidgetHeader2 extends React.Component {
  state = {}
  showSortDropDown = false
  initialSortCategoryIdx = 0
  defaultMenuTitles = [
    'Most Recent',
    'Application Name',
    'Workflow Name',
    'Service Name'
  ]

  defaultHeaderParams = {
    hideHeader: false,
    headerClass: css.headerClass,
    headerComponent: null,
    showSort: true,
    showSearch: true,
    leftItem: <div></div>
  }

  setMenuItem (index) {
    this.initialSortCategoryIdx = index
    this.props.headerParams.sortMenuFunction(this.props.headerParams.sortMenuData[index])
  }

  renderMenuTitles (menuTitles) {
    const width = '285px'
    const dropdownStyles = { width }

    return (
      <Dropdown.Menu style={dropdownStyles}>
        {menuTitles.map((title, idx) => {
          return <MenuItem key={idx} onSelect={this.setMenuItem.bind(this, idx)}>{title}</MenuItem>
        })}
      </Dropdown.Menu>
    )
  }

  render () {
    const headerParams = this.defaultHeaderParams
    Object.assign(headerParams, this.props.headerParams) // merge "this.props.headerParams" into "defaultParams"

    let menuTitles = this.defaultMenuTitles

    // If menuTitles are provided, use them
    if (this.props.headerParams &&
        this.props.headerParams.sortMenuData) {

      // Only show sort dropdown if sortMenuData is present
      this.showSortDropDown = true
      menuTitles = this.props.headerParams.sortMenuData.map(item => item.title)
    }

    return (
      <div className={'generic-header' + ' ' + css.main}>
        <div className="left"> {headerParams.leftItem} </div>

        <div className="right">
          <div className="sort-dropdown">
            { this.showSortDropDown && headerParams.showSort &&
              <LabellingDropdown
                width = "250px"
                title = "Sort by" // title can be a component
                label = {menuTitles[this.initialSortCategoryIdx]} // label can be a component, too
                items = {this.renderMenuTitles(menuTitles)}
              />
            }
          </div>

          { /* #TODO: Search Logic is not yet implemented  */ }
          {headerParams.showSearch &&
            <div className={`ui-card-search pt-input-group ${css.search}`}>
              <input className="pt-input" type="search" placeholder="Search" dir="auto" />
              <span className="pt-icon pt-icon-search"></span>
            </div>
          }
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/WidgetHeader2/WidgetHeader2.js