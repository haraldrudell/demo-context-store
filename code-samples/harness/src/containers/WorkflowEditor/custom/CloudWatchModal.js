import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { WingsForm, Utils, WingsModal } from 'components'
import css2 from './CloudWatchModal.css'
import apis from 'apis/apis'
import { MentionUtils } from 'utils'

const log = type => {} // console.log.bind(console, type)

export default class CloudWatchModal extends React.Component {
  state = { formData: {}, schema: null, uiSchema: null }
  isEditing = false

  componentWillMount () {
    this.init(this.props)
  }

  componentWillReceiveProps (newProps) {
    this.init(newProps)
  }

  init (props) {
    const formData = Utils.clone(props.formData)
    if (props.show) {
      if (props.formData.awsCredentialsConfigId) {
        this.isEditing = true
      } else {
        this.isEditing = false
        formData.awsCredentialsConfigId = props.schema.properties.awsCredentialsConfigId.enum[0]
        formData.region = props.schema.properties.region.default
      }
      const uiSchema = Utils.clone(props.uiSchema)
      this.setState({ formData: formData, schema: Utils.clone(props.schema), uiSchema })
      this.fetchNameSpaces(formData.awsCredentialsConfigId, formData.region)
    }
  }

  componentDidMount () {
    this.setupMentions()
  }

  componentDidUpdate () {
    this.setupMentions()
  }

  setupMentions () {
    const { mentionsType, show } = this.props

    if (show) {
      MentionUtils.enableMentionsForFields(
        ['namespace', 'metricName', 'percentile', 'assertion', 'timeDuration'],
        mentionsType
      )
    }
  }

  updateFormData (formData, propName, propValue) {
    if (this.isEditing && formData[propName]) {
      formData.key = propName
    } else {
      formData[propName] === propValue
    }
  }

  fetchNameSpaces = (settingId, region) => {
    apis
      .fetchCloudwatchNamespaces(settingId, region)
      .then(resp => this.updateNameSpaces(resp.resource))
      .catch(err => {
        throw err
      })
  }

  updateNameSpaces = data => {
    const schema = this.state.schema
    schema.properties.namespace['enum'] = data
    schema.properties.namespace['enumNames'] = data
    const formData = this.state.formData
    this.updateFormData(formData, 'namespace', data[0] || null)
    this.setState({ formData, schema })
    this.fetchMetrics(formData.awsCredentialsConfigId, formData.region, formData.namespace)
  }

  fetchMetrics = (settingId, region, namespace) => {
    apis
      .fetchCloudwatchMetrics(settingId, region, namespace)
      .then(resp => this.updateMetricNames(resp.resource))
      .catch(error => {
        throw error
      })
  }

  updateMetricNames = data => {
    const schema = this.state.schema
    schema.properties.metricName['enum'] = data
    schema.properties.metricName['enumNames'] = data
    const formData = this.state.formData
    this.updateFormData(formData, 'metricName', data[0] || null)
    this.setState({ formData, schema })
    this.fetchDimensions(formData.awsCredentialsConfigId, formData.region, formData.namespace, formData.metricName)
  }

  fetchDimensions = (settingId, region, namespace, metric) => {
    apis
      .fetchCloudwatchMetricDimensions(settingId, region, namespace, metric)
      .then(resp => this.updateDimensions(resp.resource))
      .catch(error => {
        throw error
      })
  }

  updateDimensions = data => {
    const schema = this.state.schema
    schema.properties.dimensions.items.properties.name['enum'] = data
    schema.properties.dimensions.items.properties.name['enumNames'] = data
    const formData = this.state.formData
    this.updateFormData(formData, 'dimensions', null)
    this.setState({ formData, schema })
  }

  onSubmit = ({ formData }) => {
    delete formData.key
    this.props.onSubmit({ formData })
  }

  onChange = ({ formData }) => {
    if (
      formData.awsCredentialsConfigId !== this.state.formData.awsCredentialsConfigId ||
      formData.region !== this.state.formData.region
    ) {
      delete formData.dimensions
      delete formData.metricName
      delete formData.namespace
      this.setState({ formData })
      this.fetchNameSpaces(formData.awsCredentialsConfigId, formData.region)
    } else if (formData.namespace !== this.state.formData.namespace) {
      delete formData.dimensions
      delete formData.metricName
      this.setState({ formData })
      this.fetchMetrics(formData.awsCredentialsConfigId, formData.region, formData.namespace)
    } else if (formData.metricName !== this.state.formData.metricName) {
      delete formData.dimensions
      this.setState({ formData })
      this.fetchDimensions(formData.awsCredentialsConfigId, formData.region, formData.namespace, formData.metricName)
    }
  }

  onHide = () => {
    this.setState({ schema: null, uiSchema: null })
    this.props.onHide()
  }

  render () {
    if (!this.state.schema) {
      return null
    }

    return (
      <WingsModal className={css2.main} show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="CloudWatchModal"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
          >
            <Button bsStyle="default" type="submit" className="submit-button">
              SUBMIT
            </Button>
          </WingsForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/custom/CloudWatchModal.js