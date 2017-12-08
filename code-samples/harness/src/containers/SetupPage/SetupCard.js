import React from 'react'
import css from './SetupCard.css'
import { Link } from 'react-router'
import { TruncateText } from '../../components/TruncateText/TruncateText'

export default class SetupCard extends React.Component {
  renderItemList = ({ items }) => {
    const { onItemClickPath = '' } = this.props
    const numItemsToShow = 10 // These are truncated anyways, so don't waste cycles creating hidden contents
    // const numCommas = items.length < numItemsToShow ? items.length - 1 : numItemsToShow - 1

    return items.slice(0, numItemsToShow).map((item, itemIndex) => (
      <Link key={itemIndex} to={onItemClickPath({ item, id: item.uuid })}>
        <item-name class="link-style">{item.name}</item-name>
      </Link>
    ))
  }

  renderItems = () => {
    const { items = [] } = this.props
    const content = <div>zippy</div>
    const ellipsisText = <div>(more)</div>

    const popoverProps = {
      noPopover: true,
      isArray: true,
      content,
      ellipsisText,
      inputText: this.renderItemList({ items })
    }

    return (
      <ui-card-main>
        <item-count>{`(${items.length})`}</item-count>
        <items-array>
          <TruncateText {...popoverProps} />
        </items-array>
        <more-button>
          <Link to={this.props.onCardClickPath}>(more)</Link>
        </more-button>
      </ui-card-main>
    )
  }

  render = () => {
    const { dataName = '', title = '', icon = <div />, onCardClickPath = '' } = this.props

    return (
      <div data-name={dataName} className={css.main}>
        <ui-card>
          <ui-card-header>
            <icon>{icon}</icon>
            <Link data-name="services-link" to={onCardClickPath}>
              <title>{title}</title>
            </Link>
          </ui-card-header>
          {this.renderItems()}
        </ui-card>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/SetupPage/SetupCard.js