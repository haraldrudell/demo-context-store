import React from 'react'
import Select from 'react-select'
import { ArtifactJobSelection, Utils } from 'components'
export const ArtifactSelect = props => {
  const field = props.schema || {}
  const data = (field && field.data) || []
  let options = data.map(s => ({ label: s, value: s }))
  options = Utils.sortDataByKey(options, 'label', 'ASC')

  const value = props.value instanceof Array ? props.value[0] : props.value
  const initialSelected = { label: value, value: value }
  const originalOptions = options.slice()
  if (value && !options.find(option => option.value === value)) {
    options.unshift(initialSelected)
  }
  let component
  return (
    <div id={props.id}>
      <Select.Creatable
        key={props.id + JSON.stringify(options)}
        ref={c => {
          component = c
          const select = c && c.select

          if (select) {
            select.focusOption = option => {
              const typedValue = select.input.value
              select.setState(
                {
                  focusedOption: option
                },
                _ => (select.input.value = typedValue)
              )
            }
          }
        }}
        promptTextCreator={label => `Use custom path: ${label}`}
        newOptionCreator={({ label }) => ({ label, value: label })}
        value={value ? initialSelected : null}
        backspaceRemoves={false}
        placeholder={field.isLoading ? 'Loading...' : 'Select artifact path'}
        options={options}
        disabled={props.disabled}
        valueRenderer={option => {
          const sc = component
          if (sc && !sc.select) {
            return ''
          }

          return option.label
        }}
        autosize={false}
        onOpen={_ => {
          const sc = component
          sc.setState({ inputValue: initialSelected.label }, _ => (sc.select.input.value = initialSelected.label || ''))
        }}
        onFocus={_ => {
          const sc = component
          sc.setState({ inputValue: initialSelected.label }, _ => (sc.select.input.value = initialSelected.label || ''))
        }}
        onChange={selected => {
          if (!selected) {
            selected = { label: null, value: null }
          }
          initialSelected.label = selected.label
          initialSelected.value = selected.value

          options.splice(0, options.length)
          options.concat(originalOptions)
          if (selected.value && !options.find(option => option.value === selected.value)) {
            options.unshift(initialSelected)
          }
          props.onChange(selected.value)
          const sc = component
          sc.setState({ inputValue: initialSelected.label }, _ => {
            sc.select.input.value = initialSelected.label || ''
            sc.select.blurInput()
          })
        }}
      />
    </div>
  )
}

export const ArtifactJobSelect = props => {
  // const options = []
  // const data = Utils.clone(this.state.formData)
  const form = props.formContext
  const { appId } = form.props
  const formData = form.buffer.formData || {}
  const field = props.schema || {}
  const data = field.data || []

  if (!formData.jobname) {
    delete field.parentJobName
  }

  const modifyJobName = (jobName, parentJobName) => {
    field.parentJobName = parentJobName
    props.onChange(jobName)
  }

  const modifyJobNameEnum = list => {
    const oldList = field.enum
    field.enum = oldList.concat(list)
    field.enumNames = oldList.concat(list)
  }

  return (
    <ArtifactJobSelection
      key={Date.now()}
      jobList={data}
      appIdFromUrl={appId}
      settingUuId={formData.settingId}
      modifyJobName={modifyJobName}
      modifyJobNameEnum={modifyJobNameEnum}
      jobName={props.value || ''}
      isLoading={field.isLoading}
    />
  )
}



// WEBPACK FOOTER //
// ../src/containers/ServiceDetailPage/forms/Shared/SharedWidgets.js