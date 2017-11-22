/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Api from './RESTServer'

import request from 'supertest'

const api = new Api().server

describe('Api version 1', () => {

  describe('users', () => {
    it('GET /users', async () => {
      const r = await request(app)
        .get('/api/v1/users')
        .expect(200)
        .expect('Content-Type', /^application\/json/)
    })
  })
})
