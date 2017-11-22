/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Api from './RESTServer'

import request from 'supertest'

const userList = [{type: 'user', id: 1}, {type: 'user', id: 2}]

const users = {get}
export async function get(id) {
  if (id === undefined) return userList
  const index = Number(id) - 1
  if (index >= 0 && index < userList.length) return userList[index]
}

const api = new Api({users}).server

describe('users', () => {
  it('GET /users', async () => request(api)
    .get('/api/v1/users')
    .expect(200)
    .expect('Content-Type', /^application\/json/)
    .expect(userList)
  )
  it('GET /users/1', async () => request(api)
    .get('/api/v1/users/1')
    .expect(200)
    .expect('Content-Type', /^application\/json/)
    .expect(userList[0])
  )
  it('GET /users/-1', async () => request(api)
    .get('/api/v1/users/-1')
    .expect(404)
  )
})
