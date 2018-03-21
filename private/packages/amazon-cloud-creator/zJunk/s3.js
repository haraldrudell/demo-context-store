/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import StackCreator from './StackCreator'
import classRunner from 'classrunner'
import path from 'path'

classRunner({construct: StackCreator, options: loadAllOptions})

async function loadAllOptions() {
  const options = {stackName: 'aws-lambda-starter-bucket', filename: path.join(__dirname, 's3bucket.yaml')}
  return options
}
