import React from 'react'
import css from './NameValueList.css'

/**
 * Example:
 * <NameValueList data={array} className={}
 *    customKeys={['customName', 'customValue']}  // optional props
 *    customWidths={['15%', '85%']}     // optional props
 *    headers={['Name', 'Value']}       // optional props
 *    renderName={} renderValue={} />   // optional props
 */
export default class NameValueList extends React.Component {
  render () {
    const { data, customKeys = [], customWidths = [], renderName = null, renderValue = null } = this.props
    const propsClassName = this.props.className || ''

    const nameStyle = { width: '30%' } // default Column Width
    const valueStyle = { width: '70%' }
    if (customWidths.length === 2) {
      nameStyle.width = customWidths[0]
      valueStyle.width = customWidths[1]
    }

    return (
      <section className={css.main + ' ' + propsClassName}>
        {this.props.headers &&
          this.props.headers.length === 2 && (
            <h3>
              <span style={nameStyle}>{this.props.headers[0]}</span>
              <span style={valueStyle}>{this.props.headers[1]}</span>
            </h3>
          )}

        <dl>
          {data.reduce((arr, item, idx) => {
            let nameEl = item.name || ''
            let valueEl = item.value || ''
            // use "customKeys" to map to custom fields (optional)
            if (customKeys.length === 2) {
              nameEl = item[customKeys[0]] || ''
              valueEl = item[customKeys[1]] || ''
            }

            // render nameEl
            if (renderName) {
              nameEl = renderName(item)
            }
            // render valueEl
            if (renderValue) {
              valueEl = renderValue(item)
            }
            // render <dt> and <dd>
            return arr.concat([
              <dt key={'dt_' + idx} style={nameStyle}>
                {nameEl}
              </dt>,
              <dd key={'dd_' + idx} style={valueStyle}>
                {valueEl}
              </dd>
            ])
          }, [])}
        </dl>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/NameValueList/NameValueList.js