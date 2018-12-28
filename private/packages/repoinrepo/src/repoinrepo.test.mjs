/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import {spawnAsync} from 'allspawn'
import fs from 'fs-extra'

import path from 'path'

const projectDir = path.resolve()
const executable = path.join(projectDir, 'bin/repoinrepo')

it('Can launch repoinrepo', async () => {
  if (!await fs.pathExists(executable)) throw new Error(`Does not exist - was yarn build executed? ${executable}`)
  await spawnAsync({args: executable, echo: true})
})
