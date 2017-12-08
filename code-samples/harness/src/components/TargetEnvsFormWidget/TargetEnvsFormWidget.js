import React, { PropTypes } from 'react'

export default class TargetEnvsFormWidget extends React.Component {

  static propTypes = {
    onShowTargetModal: PropTypes.func.isRequired
  }

  static defaultProps = {
    onShowTargetModal: () => {}
  }

  showTargetModal = () => {
    this.props.onShowTargetModal()
  }

  onChange = (event) => {
    const checked = event.target.checked
    this.props.params.onChange(event.target.checked)

    if (!checked) {
      this.showTargetModal()
    }
  }

  render () {
    const props = this.props.params
    return (
      <div className="checkbox ">
        <label>
          <input type="checkbox" id="root_target" value="on"
            required={props.required}
            checked={typeof props.value === 'undefined' ? false : props.value}
            onChange={this.onChange.bind(this)} />
          <strong>Target to all environments</strong>
        </label>
      </div>
    )
  }
}





// WEBPACK FOOTER //
// ../src/components/TargetEnvsFormWidget/TargetEnvsFormWidget.js