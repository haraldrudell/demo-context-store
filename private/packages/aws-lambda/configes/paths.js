/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import fs from 'fs-extra'
import path from 'path'

const configDir = path.resolve('config')
const projectIdFile = path.join(configDir, 'project.json')

export default async function paths(id) {
  if (!id) id = (await getProjectId()) || ''
  const o = {
    functionName: `Micro${id}`,
    configDir,
    srcDir: path.resolve('src'),
    buildDir: path.resolve('build'),
    privateS3BucketName: 'creator-private-bucket',
    stackName: `micro-${id}`,
  }

  return Object.assign(o, {
    zipFile: path.join(o.buildDir, `${o.functionName}.zip`),
    s3Stack: {
      stackName: `creator-private-bucket`,
      templateFile: path.join(o.configDir, `CreatorPrivateBucketStack.yaml`),
      parameters: [{
        ParameterKey: 'S3BucketName',
        ParameterValue: o.privateS3BucketName,
      }],
    },
    stack: {
      stackName: o.stackName,
      templateFile: path.join(configDir, `stack-${o.functionName}.yaml`),
      parameters: [{
        ParameterKey: 'S3BucketName',
        ParameterValue: o.privateS3BucketName,
      }],
    },
    stackTemplate: {
      templateFile: path.join(configDir, 'CreatorMicroTemplate.yaml'),
      templateMarker: 'THELAMBDA',
    },
  })
}

/*
undefined: non-destructive get: may return null
false: get, initiate if missing
id, falsey: get, set to id if missing
id, true: set to id
true: clear id
*/
export async function getProjectId(id, force) {
  const tryReading = !force && id !== true
  const mayWrite = id !== undefined
  let forceWrite = force || id === true

  if (tryReading) {
    if (await fs.pathExists(projectIdFile)) {
      const data = await fs.readFile(projectIdFile, 'utf8')
      const o = JSON.parse(data)
      const readId = Object(o).projectId
      if (!readId || typeof readId !== 'string') throw new Error(`Corrupt data in file: ${projectIdFile}`)
      id = readId
    } else if (id) forceWrite = true
  }

  if (forceWrite || (!id && mayWrite)) {
    if (id !== true) {
      if (!id) {
        // 2017-12-25T04:09:55.901Z
        // 20171225_04091234
        id = new Date().toISOString().substring(0, 16).replace(/[-:]/g, '').replace('T', 'x')
          + (String(Math.random()) + '0000').substring(2, 6)
      }
      await fs.writeFile(projectIdFile, JSON.stringify({projectId: id}))
    } else await fs.remove(projectIdFile)
  }
  return id
}
