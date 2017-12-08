import React from 'react'
import Select from 'react-select'

export default class OverrideSelect extends React.Component {
  componentWillMount () {}

  enumArrToSelectArr (options) {
    const data = []
    for (let i = 0; i < options.length; i++) {
      data.push({
        value: options[i],
        label: options[i]
      })
    }
    return data
  }
  render () {
    const selectProps = this.props.selectprops
    if (selectProps !== null) {
      const options = this.enumArrToSelectArr(selectProps.schema.options || [])

      return (
        <Select
          options={options}
          key={selectProps.id}
          value={selectProps.value ? selectProps.value : null}
          placeholder="Please type/select a configuration..."
          onChange={selected => {
            const val = selected ? selected.value : null
            selectProps.onChange(val)
          }}
          onBlurResetsInput={false}
          onInputChange={e => {
            selectProps.onChange(e)
          }}
          disabled={this.props.disabled}
        />
      )
    }
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplatePage/OverrideSelect.js