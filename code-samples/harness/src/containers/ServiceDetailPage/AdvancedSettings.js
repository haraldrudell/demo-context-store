import React from 'react'
import { Button, FormControl } from 'react-bootstrap'
import { Confirm } from 'components'
import { ServicesService } from 'services'
import css from './AdvancedSettings.css'

export default class AdvancedSettings extends React.Component {
  state = {
    data: null,
    showConfirm: false
  }

  componentWillMount () {
    const { containerTaskData } = this.props // containerTaskData is the Modal's formData
    this.setState({ data: containerTaskData })
  }

  onSubmit = async ({ reset = false }) => {
    const { accountId, appId } = this.props.urlParams
    const { serviceId, uuid: taskId, advancedType, advancedConfig } = this.state.data
    const { error } = await ServicesService.updateContainerTaskAdvanced({
      accountId,
      appId,
      serviceId,
      taskId,
      advancedType,
      advancedConfig,
      reset
    })
    if (reset === false) {
      // Submit & no error:
      if (!error) {
        this.props.onHide()
      }
    }
  }

  onReset = () => {
    this.setState({ showConfirm: true })
  }

  onResetConfirmed = async () => {
    await this.onSubmit({ reset: true })
    await this.props.onReset()
  }

  onTextChange = ev => {
    const { data } = this.state
    data.advancedConfig = ev.target.value
    this.setState({ data })
  }

  onTypeChange = ev => {
    const { data } = this.state
    data.advancedType = ev.target.value
    this.setState({ data })
  }

  render () {
    const isKubernetes = this.props.containerTaskData.deploymentType === 'KUBERNETES'

    return (
      <section className={css.main}>
        {isKubernetes && (
          <FormControl
            componentClass="select"
            placeholder="select"
            defaultValue={this.state.data.advancedType}
            onChange={ev => this.onTypeChange(ev)}
          >
            <option value="JSON">JSON</option>
            <option value="YAML">YAML</option>
          </FormControl>
        )}
        <textarea defaultValue={this.state.data.advancedConfig} onChange={ev => this.onTextChange(ev)} />

        <div className={css.footer}>
          <Button bsStyle="primary" className={''} onClick={this.onSubmit}>
            Submit
          </Button>

          <Button className={css.reset} onClick={this.onReset}>
            Reset to Defaults
          </Button>
        </div>

        <Confirm
          visible={this.state.showConfirm}
          onConfirm={async () => await this.onResetConfirmed()}
          onClose={() => this.setState({ showConfirm: false })}
          body="Are you sure you want to reset to default values?"
          confirmText="Confirm Reset"
          title="Resetting"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceDetailPage/AdvancedSettings.js