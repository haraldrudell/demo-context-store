/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import AwsSdk from './AwsSdk'

import util from 'util'

export default class ImageManager extends AwsSdk {
  static canonicalEc2Owner = '099720109477'
  static arch0 = 'x86_64'
  static codename0 = 'xenial' // current LTS as of 180221
  static root0 = 'ebs'
  static virt0 = 'hvm'
  static test = 'test' // in Canonical image description
  static unsupported = 'UNSUPPORTED' // in Canonical image description

  constructor(o) {
    super({name: 'ImageManager', ...o})
    this.ec2 = this.getService('EC2')
    this.debug && this.constructor === ImageManager && console.log(`${this.m} constructor: ${util.inspect(this, {colors: true, depth: null})}`)
  }

  async getUbuntuImageId(o) { // {imageId, desc}
    const {arch0, canonicalEc2Owner, root0, virt0, codename0, test, unsupported} = ImageManager
    const {arch = arch0, owner = canonicalEc2Owner, root = root0, virt = virt0, codename = codename0} = o || false
    const {ec2, debug} = this
    const params = {
      Owners: [String(owner)],
      Filters: [
        {Name: 'virtualization-type', Values: [virt]},
        {Name: 'architecture', Values: [arch]},
        {Name: 'root-device-type', Values: [root]},
      ], //--query 'reverse(Images.sort_by([], &CreationDate))[?contains(Name,`test`)==`false`]|[?contains(Name,`artful`)==`true`]|[0:20].[ImageId, Name]
    }
    debug && console.log(`${this.m} describeImages: ${util.inspect(params, {colors: true, depth: null})}`)
    const t = Date.now()
    const result = await ec2.describeImages(params).promise()
    const images = Object(result).Images
    if (!Array.isArray(images)) throw new Error(`${this.m} unexpected result from AWS describeImages: Images not array`)
    debug && console.log(`${this.m} ${images.length} ${((Date.now() - t) / 1e3).toFixed(3)}`)
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
      return desc.match(codename) && !desc.match(test) && !desc.match(unsupported)
    }).sort((a, b) => a.CreationDate > b.CreationDate ? -1 : 1)[0]
    if (image) {
      const {ImageId: imageId, Description: desc} = image
      return {imageId, desc}
    }
    return {}
  }
}
