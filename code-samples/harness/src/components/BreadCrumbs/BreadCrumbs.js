import React, { PropTypes } from 'react'
import { Breadcrumb } from 'react-bootstrap'
import css from './BreadCrumbs.css'

class BreadCrumbs extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        link: PropTypes.string
      })
    ).isRequired,
    withBorder: PropTypes.bool
  }

  static defaultProps = {
    data: [
      {
        label: 'page',
        link: '#'
      }
    ],
    withBorder: false
  }

  render () {
    const data = this.props.data || []
    let className = this.props.withBorder ? `${css.main} ${css.withBorder}` : `${css.main}`
    if (this.props.className) {
      className += ' ' + (this.props.className)
    }
    return (
      <div className={className}>
        <Breadcrumb>
          {data.map((ele, index) => {
            if (index < data.length - 1) {
              const link = ele.link ? '/#' + ele.link : 'javascript;;'
              return (
                <Breadcrumb.Item key={index} href={link}>
                  {ele.label}
                </Breadcrumb.Item>
              )
            }

            return (
              <Breadcrumb.Item key={index} active>
                {ele.label}
              </Breadcrumb.Item>
            )
          })}
        </Breadcrumb>
      </div>
    )
  }
}

export default BreadCrumbs



// WEBPACK FOOTER //
// ../src/components/BreadCrumbs/BreadCrumbs.js