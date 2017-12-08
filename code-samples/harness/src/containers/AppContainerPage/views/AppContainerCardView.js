import React from 'react'
import css from './AppContainerCardView.css'
import { ActionsDropdown } from '../../../components/ActionsDropdown/ActionsDropdown.js'
import { NameValueList } from 'components'

export default class AppContainerCardView extends React.Component {
  renderKvPairs = ({ item }) => {
    const data = [
      { name: 'Family', value: item.family + ' ' + item.version },
      { name: 'Description', value: item.description }
    ]
    return <NameValueList data={data} />
  }

  renderActionIcons = ({ item }) => {
    const actionIcons = [
      {
        label: 'Edit',
        element: <edit-icon />,
        onClick: () => this.props.params.onEdit(item)
      },
      {
        label: 'Delete',
        element: <delete-icon />,
        onClick: () => this.props.params.onDelete(item.uuid)
      },
      {
        label: 'Download',
        element: <i className="icons8-installing-updates-2" />,
        onClick: this.props.params.downloadFile.bind(this, item)
      }
    ]
    return { actionIcons }
  }

  render () {
    return (
      <section className={css.main}>
        {this.props.params.data.map((item, index) => (
          <ui-card key={index} data-name={item.name}>
            <header>
              <card-title class="link-style" onClick={this.props.params.downloadFile.bind(this, item)}>
                {item.name}
              </card-title>
              <ui-card-actions>
                <ActionsDropdown {...this.renderActionIcons({ item })} />
              </ui-card-actions>
            </header>
            <main>{this.renderKvPairs({ item })}</main>
          </ui-card>
        ))}
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AppContainerPage/views/AppContainerCardView.js