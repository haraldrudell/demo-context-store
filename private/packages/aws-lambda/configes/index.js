/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import StackCreator from './StackCreator'
import classRunner from 'classrunner'

classRunner({construct: StackCreator, options: loadAllOptions})

async function loadAllOptions() {
  const options = {}
  const lastword = process.argv[process.argv.length - 1]
  const otherword = process.argv[process.argv.length - 2]
  if (lastword === 'd') options.doDelete = true
  if (lastword === 'b' || otherword ==='b') {
    Object.assign(options,  {
      stackName: 'aws-lambda-starter-bucket',
      filename: path.join(__dirname, 's3bucket.yaml')
    })
  }
  return options
}
