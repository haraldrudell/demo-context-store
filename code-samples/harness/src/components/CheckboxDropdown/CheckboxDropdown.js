import React from 'react'
import { observer } from 'mobx-react'
import { Dropdown, FormControl, Checkbox } from 'react-bootstrap'
import { LabellingDropdown } from '../LabellingDropdown/LabellingDropdown'
import Utils from '../Utils/Utils'
import css from './CheckboxDropdown.css'

@observer
export class CheckboxDropdown extends React.Component {
  state = {
    filterText: '',
    itemStates: {}
  }

  // This is necessary for some reason.
  componentWillReceiveProps = () => this.forceUpdate()

  buildLabel = () => {
    let label = this.props.items && this.props.items.length ? 'All' : '...'
    const selectedItems = this.props.items ? this.props.items.filter(item => item.isSelected) : []

    if (selectedItems && selectedItems.length) {
      label = selectedItems
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
        .map(item => item.name)
        .join(', ')
    }

    return label
  }

  onShow = () => setTimeout(() => this.filterInput.focus(), 0)
  clearSelectedItems = () => this.props.items.forEach(item => (item.isSelected = false))
  shouldCloseOnClick = (isOpen, event, { source }) => source === 'rootClose'
  highlightTextWithFilter = text => Utils.highlightTextWithFilter(text, this.state.filterText || '')
  onHide = () => {
    this.props.onHide ? this.props.onHide() : ''
    this.setState({ filterText: '' })
    this.forceUpdate()
  }

  handleFilterChange = e => {
    this.setState({ filterText: e.target.value })
    this.forceUpdate()
  }

  onSelect = (itemId, e) => {
    const item = this.props.items.filter(item => item[this.props.idRefKey] === itemId)[0]
    item.isSelected = item.isSelected ? false : true
    this.props.onSelectItem ? this.props.onSelectItem() : ''
    this.forceUpdate() // mobx is slow to trigger re-rendering of subscribers, force updating instead
  }

  clearAll = () => {
    this.clearSelectedItems()
    this.forceUpdate()
    this.props.onSelectItem ? this.props.onSelectItem() : ''
  }

  getLabelText = item => (
    <label-text onClick={e => e.stopPropagation()}>
      <main-label onClick={e => e.stopPropagation()}>{this.highlightTextWithFilter(item.name)}</main-label>
      {item.labelExtension && (
        <label-extension onClick={e => e.stopPropagation()}>{item.labelExtension}</label-extension>
      )}
    </label-text>
  )

  renderMenuItems = () => {
    const { state } = this
    let { filterText = '' } = state
    const width = '285px'

    if (!this.props.items) {
      return null
    }

    filterText = filterText.toLowerCase()
    const filteredItems = this.props.items
      .filter(item => !item.hide)
      .filter(item => !filterText || item.name.toLowerCase().indexOf(filterText) !== -1)
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
    const selectedCount = this.props.items.reduce((sum, item) => sum + (item.isSelected ? 1 : 0), 0)

    return (
      <Dropdown.Menu style={{ width }} bsRole="menu">
        <li className="no-hover on-top" key="filter">
          <FormControl
            type="text"
            value={this.state.filterText}
            placeholder=""
            onChange={this.handleFilterChange}
            inputRef={ref => (this.filterInput = ref)}
          />
          <section className="clear">
            <label>{selectedCount > 0 && <strong>{selectedCount} selected</strong>}</label>
            <a onClick={selectedCount !== 0 && this.clearAll} className={selectedCount === 0 ? 'disabled' : ''}>
              Clear All
            </a>
          </section>
        </li>
        {filteredItems.map((item, itemIdx) => (
          <li key={itemIdx} onClick={e => this.onSelect(item[this.props.idRefKey], e)}>
            <Checkbox
              inline
              checked={item.isSelected === true}
              onChange={e => {
                e.stopPropagation()
                this.onSelect(item[this.props.idRefKey], e)
              }}
              onClick={e => e.stopPropagation()}
            >
              {this.getLabelText(item)}
            </Checkbox>
          </li>
        ))}
      </Dropdown.Menu>
    )
  }

  render = () => {
    const { className } = this.props

    const defaultDropdownProps = {
      title: this.props.title,
      className: 'apps-dropdown',
      label: this.buildLabel(),
      shouldCloseOnClick: this.shouldCloseOnClick,
      onShow: this.onShow,
      onHide: this.onHide.bind(this),
      items: this.renderMenuItems()
    }

    const dropdownProps = Object.assign({}, defaultDropdownProps, this.props.dropdownProps)

    return (
      <div className={`${css.main} ${className}`}>
        <LabellingDropdown {...dropdownProps} />
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/CheckboxDropdown/CheckboxDropdown.js