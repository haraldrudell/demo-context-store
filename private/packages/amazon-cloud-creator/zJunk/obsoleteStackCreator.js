  async run2() {
    console.log(`${m}: Starting stack creation on Amazon…`)
    await spawn({cmd: 'aws', args: [
      'cloudformation',
      'create-stack', `--stack-name=${this.stackName}`,
      '--template-body=file://configes/cloudformation.yaml',
      '--capabilities', 'CAPABILITY_IAM',
      '--parameters',
      `ParameterKey=S3BucketName,ParameterValue=${this.s3BucketName}`,
    ]})

    console.log(`${m}: waiting for completion… ${new Date().toISOString()}`)
    await this.runCommand('aws', [
      'cloudformation', 'wait',
      'stack-create-complete',
      `--stack-name=${this.stackName}`,
    ])
  }

  async runCommand(cmd, args, options) {
    const argsPrint = Array.isArray(args) && args.length
      ? `${args.join(' ')}`
      : ''
    console.log(`${cmd} ${argsPrint}`)
    return spawn({cmd, args, options})
  }
