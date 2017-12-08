import React from 'react'
import { WingsDynamicForm, CollapsiblePanel, CompUtils, UIButton, NameValueList } from 'components'
import css from './TriggerSteps.css'

const baseSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    uuid: { type: 'string', title: 'uuid' },
    name: { type: 'string', title: 'Name' },
    description: { type: 'string', title: 'Description' }
  }
}
const baseUiSchema = {
  uuid: { 'ui:widget': 'hidden' }, // for Edit
  name: { 'ui:placeholder': '' }
}
const widgets = {}

export default class TriggerStepOverview extends React.Component {
  state = {
    schema: {},
    uiSchema: {},
    formData: {},
    isOpen: this.props.isOpen,
    isValid: false
  }
  form

  async componentWillMount () {
    await this.init(this.props)
  }

  async componentWillReceiveProps (newProps) {
    this.setState({ isOpen: newProps.isOpen })
    await this.init(newProps)
  }

  init = async props => {
    const formData = WingsDynamicForm.toFormData({ data: props.formData }) || {} // API-data to formData (for Edit)
    await CompUtils.setComponentState(this, {
      schema: baseSchema,
      uiSchema: baseUiSchema,
      formData: formData,
      isValid: formData.name
    })
  }

  onInitializeForm = form => {
    const formData = form.getFormData()
    this.setState({ isValid: formData.name })
  }

  onClickNext = () => {
    const formData = this.form.getFormData()
    console.log('onClickNext: ', formData)
    this.setState({ isOpen: false })
    this.props.onClickNext('overview', formData)
  }

  onChange = async ({ formData }) => {
    this.setState({ isValid: formData.name })
    await this.form.updateChanges({ formData })
    this.props.onChange({ formData })
  }

  renderSummary = () => {
    const formData = this.props.formData
    const arr = [{ name: 'Name', value: formData.name }, { name: 'Description', value: formData.description }]
    return <NameValueList customWidths={['18%', '82%']} data={arr} />
  }

  render () {
    const { onToggle, className } = this.props
    const { isOpen } = this.state

    return (
      <CollapsiblePanel
        className={css.main + ' ' + className + ' ' + css.overview}
        name="overview"
        title="Overview"
        isOpen={isOpen}
        onToggle={onToggle}
        summary={this.renderSummary()}
      >
        <WingsDynamicForm
          ref={f => (this.form = f)}
          onInitializeForm={this.onInitializeForm}
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          formData={this.state.formData}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          widgets={widgets}
        >
          <UIButton className={css.submit} type="button" accent onClick={this.onClickNext}>
            Next
          </UIButton>
        </WingsDynamicForm>
      </CollapsiblePanel>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/TriggerPage/TriggerStepOverview.js