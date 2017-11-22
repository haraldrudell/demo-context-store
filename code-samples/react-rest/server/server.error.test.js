/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Api from './RESTServer'

import request from 'supertest'

const users = {get}
async function get(id) {} // no users

const api = new Api({users}).server
api.use('/error', (req, res) => {
  throw new Error('bad')
})

describe('error states', () => {
  it('Unknown uri', async () => request(api)
    .get('/api/v1')
    .expect(404)
  )
  it('Unavailable method', async () => request(api)
    .put('/api/v1/users')
    .expect(404)
  )
  it('Server error', async () => request(api)
    .get('/error')
    .expect(500)
  )
})
