//import fetch from 'node-fetch'
import Api from './RESTServer'

import request from 'supertest'

const api = new Api().server

describe('Api base path', () => {

  describe('/api/v1', () => {
    it('GET /', async () => {
      const res = await request(api).get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({message: 'Hello world!'})
      //const {message} = res.body
      //console.log('test body.message:', typeof message, message)
    })
  })
})
