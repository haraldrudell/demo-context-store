import React from 'react'
import { WingsForm, FormUtils, SearchableSelect } from 'components'
import css from './KeyValueModal.css'
import { MentionsType } from '../../utils/Constants'
import { MentionUtils } from 'utils'

const schema = {
  type: 'object',
  properties: {
    key: { type: 'string', title: 'Key' },
    value: { type: 'string', title: 'Value' }
  }
}
const uiSchema = {
  'ui:order': ['*']
}
const defaultFormData = {
  key: '',
  value: ''
}

const widgets = {
  SearchableSelect
}

export default class LogOptionsModal extends React.Component {
  state = {
    errorMessage: '',
    showErrors: '__hide',
    schema,
    uiSchema,
    formData: this.props.logData,
    widgets
  }

  componentDidMount () {
    this.initForm(this.props)
    this.setupMentions()
  }

  componentWillReceiveProps (newProps) {
    this.initForm(newProps)
  }

  initForm = props => {
    const { awsRegionTags, logData } = props
    const schema = FormUtils.clone(this.state.schema)
    const uiSchema = FormUtils.clone(this.state.schema)

    if (awsRegionTags) {
      this.modifyKeyAsDropDown(awsRegionTags, schema, uiSchema)
    }

    this.setState({ formData: logData, schema, uiSchema })
  }

  componentDidUpdate () {
    this.setupMentions()
  }

  setupMentions () {
    const { appId, entityId, show } = this.props

    if (show) {
      MentionUtils.registerForField({
        field: 'value',
        type: MentionsType.SERVICES,
        args: {
          appId,
          entityType: 'SERVICE',
          entityId
        }
      })
    }
  }

  modifyKeyAsDropDown = (awsRegionTags, schema, uiSchema) => {
    if (awsRegionTags) {
      const keyProperty = schema.properties.key

      keyProperty['enum'] = [...awsRegionTags]
      keyProperty['enumNames'] = [...awsRegionTags]
      uiSchema['key'] = { 'ui:widget': 'SearchableSelect', 'ui:placeholder': 'Select a Tag' }
    }
  }

  handleSubmit = () => {
    const formData = this.state.formData
    const tags = this.props.tags

    if (formData.key !== '' && formData.value !== '') {
      const result = formData.key + ':' + formData.value

      if (this.props.savedtagIndex < 0) {
        const obj = { key: formData.key, value: formData.value }
        tags.push(result)

        this.setState({ errorMessage: '', formData: defaultFormData })
        this.props.setTags(tags, obj)
      } else if (this.props.savedtagIndex >= 0) {
        this.props.editTag(this.props.savedtagIndex, result, { key: formData.key, value: formData.value })
      }

      this.props.hideLogOptions()
    } else {
      this.showErrorMessage(formData)
    }

    return false
  }

  onChange = ({ formData }) => {
    this.setState({ formData })
  }

  showErrorMessage = data => {
    let errorMessage

    if (data.key === '' && data.value === '') {
      errorMessage = 'key and value cannot be empty'
    } else if (data.key === '' && data.value !== '') {
      errorMessage = 'key cannot be empty'
    } else if (data.key !== '' && data.value === '') {
      errorMessage = 'value cannot be empty'
    }

    this.setState({ showErrors: css.error, errorMessage: errorMessage })
  }

  render () {
    return (
      <div className={css.main}>
        <WingsForm
          name="LogOptions"
          ref="logform"
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          formData={this.state.formData}
          onChange={this.onChange}
          widgets={this.state.widgets}
        >
          <input type="button" value="Submit" className="btn btn-primary" onClick={this.handleSubmit} />
        </WingsForm>

        <button className={`${css.closeLogOptnBtn} btn btn-info`} type="button" onClick={this.props.hideLogOptions} />

        <span className={this.state.showErrors}>
          {this.state.errorMessage}
        </span>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceDetailPage/LogOptionsModal.js