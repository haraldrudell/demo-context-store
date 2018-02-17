/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {AwsSdk, Stacks} from 'es2049lib'
const sdk = new AwsSdk()

export default class Deployer {
  constructor(o) {
    const {stackName} = this
    this.sm = new Stacks({stackName})
  }

  async listStacks() {
    const {sm} = this
    return (await sm.getStacks()).map(summary => summary.StackName)
  }

  async deployStack() {
    const parameters = [{
      ParameterKey: 'AvailabilityZone',
      ParameterValue: sm.getRegion(),
    }]
    await sm.create({templateFile, parameters})
  }

  async getImageId({owner}) {
    const ec2 = sdk.getService('EC2')
    const params = {
      Owners: [String(owner)],
      Filters: [{
        Name: 'virtualization-type',
        Values: ['hvm'],
       }, {
        Name: 'architecture',
        Values: ['x86_64'],
       }, {
        Name: 'root-device-type',
        Values: ['ebs'],
       }],
       //--query 'reverse(Images.sort_by([], &CreationDate))[?contains(Name,`test`)==`false`]|[?contains(Name,`artful`)==`true`]|[0:20].[ImageId, Name]
    }
    const result = await ec2.describeImages(params).promise()
    const images = Object(result).Images
    if (!Array.isArray(images)) throw new Error(`${this.m} unexpected result from AWS describeImages: Images not array`)
    /*
    { Architecture: 'x86_64',
       CreationDate: '2017-09-01T12:41:36.000Z',
       ImageId: 'ami-09a85d71',
       ImageLocation: '099720109477/ubuntu/images-testing/hvm-ssd/ubuntu-xenial-daily-amd64-server-20170830.1',           ImageType: 'machine',
       Public: true,
       OwnerId: '099720109477',
       ProductCodes: [],
       State: 'available',
       BlockDeviceMappings: [Array],
       Description: 'Canonical, Ubuntu, None LTS, UNSUPPORTED daily amd64 xenial image build on 2017-08-30',              EnaSupport: true,
       Hypervisor: 'xen',
       Name: 'ubuntu/images-testing/hvm-ssd/ubuntu-xenial-daily-amd64-server-20170830.1',
       RootDeviceName: '/dev/sda1',
       RootDeviceType: 'ebs',
       SriovNetSupport: 'simple',
       Tags: [],
       VirtualizationType: 'hvm' },
    }*/
    const image = images.filter(sum => {
      const desc = String(Object(sum).Description)
      return desc.match('artful') && !desc.match('test') && !desc.match('UNSUPPORTED')
    }).sort((a, b) => a.CreationDate > b.CreationDate ? -1 : 1)[0]
    if (image) {
      const {ImageId: id, Description: desc} = image
      return {id, desc}
    }
    return {}
  }
}
