import React from 'react'
import { Utils } from 'components'
import PipelineWorkflowView from '../WorkflowView/PipelineWorkflowView'
import apis from 'apis/apis'
import css from './ServicesCommands.css'

export default class ServicesCommands extends React.Component {
  static propTypes = {
    commandName: React.PropTypes.string.isRequired
  }
  appIdFromUrl = Utils.appIdFromUrl()

  componentWillMount () {
    this.fetchData()
  }

  componentWillReceiveProps (newProps) {
    this.fetchData()
  }

  fetchData = () => {
    apis.fetchServices(this.appIdFromUrl).then(res => {
      this.setState({ services: res.resource.response })
    })
  }

  gotoCommandEditor = (service, command) => {
    Utils.redirect({ appId: Utils.appIdFromUrl(), serviceId: service.uuid, page: `command/${command.name}/editor` })
  }

  render () {
    const filterByService = this.props.service // optional

    const services = Utils.getJsonValue(this, 'state.services') || []
    return (
      <section className={css.main}>
        <h3>Command Details:</h3>
        {services.map(service => {
          if (filterByService && service.uuid !== filterByService.uuid) {
            return // if filterByService was set, only show for filterByService.
          }
          const matchedCommand = service.serviceCommands.find(cmd => cmd.name === this.props.commandName)
          if (!matchedCommand) {
            return (
              <div key={service.uuid}>
                <div className="__serviceName">
                  {service.name}
                </div>
                <div className="__notFound error-text">
                  "{this.props.commandName}" Command Not Found
                </div>
              </div>
            )
          }
          return (
            <div key={service.uuid} onClick={this.gotoCommandEditor.bind(this, service, matchedCommand)}>
              <div className="__serviceName">
                {service.name}
              </div>
              <div className="__graph">
                <dl key={matchedCommand.name} className="dl-horizontal wings-dl __dl">
                  <dt className="wings-text-link">
                    {matchedCommand.name}
                  </dt>
                  <dd>
                    <PipelineWorkflowView
                      data={matchedCommand.command}
                      pipeline={matchedCommand.command}
                      jsplumbLoaded={true}
                    />
                  </dd>
                </dl>
              </div>
            </div>
          )
        })}
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/ServicesCommands.js