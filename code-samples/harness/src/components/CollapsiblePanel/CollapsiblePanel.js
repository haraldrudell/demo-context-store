import React from 'react'
import { Collapse } from '@blueprintjs/core'
import UIButton from '../UIButton/UIButton'
import css from './CollapsiblePanel.css'

/**
 * Example:
 * <CollapsiblePanel name="panel-1" className="" title="Artifact Servers"
 *  isOpen={this.state.isOpen} onToggle={} summary={}>
 *      {children}
 * </CollapsiblePanel> // end.
 */
export default class CollapsiblePanel extends React.Component {
  state = {
    isOpen: !!this.props.isOpen
  }

  componentWillReceiveProps (newProps) {
    this.setState({ isOpen: newProps.isOpen })
  }

  onClick = () => {
    const isOpenNew = !this.state.isOpen
    this.setState({ isOpen: isOpenNew })
    if (this.props.onToggle) {
      this.props.onToggle(isOpenNew, this.props.name)
    }
  }

  render () {
    const { title, children, className = '', summary } = this.props
    const { isOpen } = this.state
    const icon = isOpen ? 'ArrowDown' : 'ArrowRight'

    let isDisabled = {}
    if (this.props.disabled === true) {
      isDisabled = { disabled: true }
    }

    return (
      <section className={css.main + ' ' + className} data-open={isOpen}>
        <header>
          <UIButton icon={icon} onClick={this.onClick} {...isDisabled}>
            {title}
          </UIButton>
          {isOpen === false && summary && <aside>{summary}</aside>}
        </header>
        <Collapse isOpen={isOpen}>{children}</Collapse>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/CollapsiblePanel/CollapsiblePanel.js