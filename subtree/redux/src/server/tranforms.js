/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import shortid from 'shortid'

export function createJob({name, softwareId, applicationId, hardwareId, cores}) {
  const software0 = data.software.filter(({id}) => id === softwareId)[0]
  const application = software0 && software0.applications.filter(({id}) => id === applicationId)[0]
  const hardware = data.hardware.filter(({id}) => id === hardwareId)[0]
  if (!name || !software0 || !application || !hardware || cores > hardware.max) ctx.throw(400)
  const {label, id: i} = software0
  const software = {type: {label, id: i}, application}
  const id = shortid.generate()
  const duration = this.duration(cores)
  const {images} = data.results[softwareId][applicationId]
  const status = 'finished'
  const results = {duration, images, status}
  return {name, id, software, hardware, cores, results}
}

