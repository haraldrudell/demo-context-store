import React from 'react'
import UIButton from '../UIButton/UIButton'
import css from './Pills.css'

export default class Pills extends React.Component {
  renderAddButton = () => {
    const data = this.props.data || []
    if (this.props.max && data.length >= this.props.max) {
      return null
    }
    const parentName = this.props['data-name'] || 'pills'
    return (
      <button className={`ui-btn ${css.add}`} onClick={this.props.onAdd} data-name={`${parentName}-add-button`}>
        <i className="icons8-plus-math" />Add
      </button>
    )
  }

  render () {
    const data = this.props.data || []
    const { readOnly = false } = this.props
    return (
      <ul className={css.main} data-name={this.props['data-name']}>
        {data.map(item => {
          if (!item) {
            return null
          }
          if (readOnly) {
            return (
              <li key={item.uuid} className={css.pill}>
                <span className="wings-text-link" onClick={() => this.props.onEdit(item)}>
                  {item.name || item.uuid}
                </span>
              </li>
            )
          }
          return (
            <li key={item.uuid} className={css.pill}>
              <span className="wings-text-link" onClick={() => this.props.onEdit(item)}>
                {item.name || item.uuid}
              </span>
              <UIButton icon="Cross" onClick={() => this.props.onDelete(item)} />
            </li>
          )
        })}
        {!readOnly && this.renderAddButton()}
      </ul>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/Pills/Pills.js