import React from 'react'
import { NavDropdown, MenuItem } from 'react-bootstrap'
import { WingsButtons, SearchBox } from 'components'
import css from './ApplicationPageHeader.css'

const FILTER_ITEMS = ['Name A-Z', 'Name Z-A']

export default class ApplicationPageHeader extends React.Component {
  state= { filter: FILTER_ITEMS[0] }

  componentWillReceiveProps (newProps) {
    if (newProps.filterType) {
      this.setState({ filter: newProps.filterType })
    }
  }

  onFilterMenuChanged = (ev, filter) => {
    if (this.state.filter !== filter.item) {
      this.props.onFilterMenuChanged(filter)
      this.setState({ filter: filter.item })
    }
  }

  render () {
    const className = this.props.isSticky ? css.sticky : css.main
    return (
      <div className={css.common + ' ' + className}>
        <div className="row __buttonRow">
          <div className="__left">
            <span>
              <WingsButtons.Add text="Add Application" className="__addNew"
                onClick={this.props.onAddClick} />
              <span className="__filter hidden-sm hidden-xs">
                <span className="light">Sort by:&nbsp;&nbsp;</span>
                <span>
                  <NavDropdown title={this.state.filter} id="nav-dropdown" className="dropDownHarness">
                    {FILTER_ITEMS.map((item) => {
                      return (
                        <MenuItem key={item} href="#/applications" data-toggle="control-sidebar" title={item}
                          onSelect={(e) => this.onFilterMenuChanged(e, { item })}>
                          {item}
                        </MenuItem>
                      )
                    })}
                  </NavDropdown>
                </span>
              </span>
            </span>
          </div>
          <div className="__right">
            <SearchBox className="wings-card-search __right" onChange={this.props.onSearchChanged} />
          </div>
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ApplicationPage/ApplicationPageHeader.js