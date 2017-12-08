import React from 'react'
import { UIButton } from 'components'

class TestPageCardView extends React.Component {
  render () {
    const data = this.props.params.data || []
    return (
      <div>
        {data.map((item, idx) => {
          return (
            <ui-card key={idx}>
              <header>
                <card-title onClick={() => this.props.params.onNameClick(item)}>
                  <item-name class="wings-text-link">Card Header {idx}</item-name>
                  <item-description>Description</item-description>
                </card-title>
                <ui-card-actions>
                  <UIButton icon="Edit" onClick={() => this.props.params.onEdit(item)} />
                  <UIButton icon="Trash" onClick={() => this.props.params.onDelete(item)} />
                </ui-card-actions>
              </header>
              <main>Card Body {idx}</main>
            </ui-card>
          )
        })}
      </div>
    )
  }
}

export default TestPageCardView



// WEBPACK FOOTER //
// ../src/containers/TestPage/TestPageCardView.js