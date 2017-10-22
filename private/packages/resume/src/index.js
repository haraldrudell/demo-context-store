/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import EntryCreator from './EntryCreator'
import getDateStrings from './getDateStrings'

import classRunner from 'classrunner'

import path from 'path'

const defaultOptions = {
  resumeDirectory: '/opt/foxyboy/ownCloud/Resume',
  defaultResumeText: 'reddit',
}
const m = 'resume'

classRunner({construct: EntryCreator, options: getOptions})

async function getOptions() {
  const o = {...defaultOptions}
  const {argv} = process
  for (let index = 2, indexMax = argv.length, param; index < indexMax; index++) switch (param = argv[index]) {
    case '-company':
      if (index + 1 === indexMax) throw new Error(`${m} -company: missing company name`)
      o.company = argv[++index]
      break
    case '-resume':
      if (index + 1 === indexMax) throw new Error(`${m} -resume: missing resume filename`)
      o.resume = argv[++index]
      break
    case '-cover':
      if (index + 1 === indexMax) throw new Error(`${m} -cover: missing cover filename`)
      o.cover = argv[++index]
      break
    case '-h':
    case '-help':
    case '--help':
      console.error('resume [-company c] [-resume file] [-cover file] [-h -help --help]')
      process.exit(0)
      break
    default: throw new Error(`${m}: unknown options: ${param}`)
  }
  o.directory = getDirectoryName(o)
  return o
}

function getDirectoryName({resumeDirectory, company = 'generic'}) {
  const dateStrings = getDateStrings()
  return path.join(resumeDirectory, dateStrings.month6, `${dateStrings.day6} ${company}`)
}
