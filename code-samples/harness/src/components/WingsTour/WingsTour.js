import React, { PropTypes } from 'react'
import ProductTourModal from './ProductTourModal'

export default class WingsTour extends React.Component {

  static propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    onSubmit: PropTypes.func
  }

  onTourSubmit = () => {
    this.props.onHide()
  }

  componentWillReceiveProps (newProps) {
  }


  render () {

    if (!this.props.show) {
      return null
    }

    if (this.props.tourType === 'product') {
      return <ProductTourModal
        show={this.props.show}
        onHide={this.props.onHide.bind(this)}
        onSubmit={this.onTourSubmit.bind(this)}
        {...this.props} />
    }

    return null
  }

}



// WEBPACK FOOTER //
// ../src/components/WingsTour/WingsTour.js