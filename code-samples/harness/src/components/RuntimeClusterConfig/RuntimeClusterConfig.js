import React from 'react'
import { WingsForm, Utils } from 'components'
// import apis from 'apis/apis'
import css from './RuntimeClusterConfig.css'

const schema = {
  type: 'object',
  properties: {
    // name: { type: 'string', title: 'Name' },
    region: { type: 'string', title: 'Region', enum: ['us-east-1', 'us-west-1'], enumNames: ['East-1', 'West-1'] },
    vpc: { type: 'string', title: 'VPC', enum: [] },
    subnet: { type: 'string', title: 'Subnet', enum: [] },
    image: { type: 'string', title: 'Image', enum: [] },
    securityGroups: { type: 'string', title: 'Security Groups', enum: [] },
    typeSize: { type: 'string', title: 'Type/Size', enum: [] },
    role: { type: 'string', title: 'Role', enum: [] },
    diskSize: { type: 'string', title: 'Disk Size' },
    nodes: { type: 'string', title: 'Number of Nodes' }
  }
}
const uiSchema = {
  image: { classNames: css.col50pct },
  securityGroups: { classNames: css.col50pct },
  typeSize: { classNames: css.col50pct },
  role: { classNames: css.col50pct },
  diskSize: { classNames: css.col50pct },
  nodes: { classNames: css.col50pct }
}

export default class RuntimeClusterConfig extends React.Component {
  // static propTypes = {} // React.PropTypes
  state = {
    schema: schema,
    uiSchema: uiSchema,
    formData: {}
  }

  updateSchema = (params, formData) => {
    const schema = this.state.schema
    if (params.vpc) {
      formData.vpc = ''
      schema.properties.vpc.enum = ['', 'vpc-1']
      schema.properties.vpc.enumNames = ['', 'VPC 1']
    }
    if (params.subnet) {
      formData.subnet = ''
      schema.properties.subnet.enum = ['', 'subnet-1']
      schema.properties.subnet.enumNames = ['', 'Subnet 1']
    }

    this.setState({ schema, formData })
  }

  onChange = ({ formData }) => {
    const prevRegion = Utils.getJsonValue(this, 'state.formData.region') || ''
    if (formData.region && formData.region !== prevRegion) {
      this.updateSchema({ vpc: [] }, formData)
    }

    const prevVPC = Utils.getJsonValue(this, 'state.formData.vpc') || ''
    if (formData.vpc && formData.vpc !== prevVPC) {
      this.updateSchema({ subnet: [] }, formData)
    }

    this.setState({ formData })
  }

  render () {
    return (
      <section className={css.main}>
        <WingsForm name="Runtime Cluster Config" ref="form" schema={this.state.schema} uiSchema={this.state.uiSchema}
          showErrorList={false}
          formData={this.state.formData}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          onError={err => console.log(err)}
        />
      </section>
    )
  }
}





// WEBPACK FOOTER //
// ../src/components/RuntimeClusterConfig/RuntimeClusterConfig.js