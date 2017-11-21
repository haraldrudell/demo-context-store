/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import RegionsService from './RegionsService'
import listen from 'test-listen'
import fetch from 'node-fetch'

let service, url

beforeAll(async () => {
  service = new RegionsService()
  url = await listen(service.server)
})

test('timezone regions', async () => {
  const uri = '/regions?count=3&days=20&region_type=timezone'
  const contentTypeJson = /^application\/json/
  const response = await fetch(`${url}${uri}`)
  const contentType = response.headers.get('content-type') // string
  expect(contentType).toMatch(contentTypeJson)
  console.log('response:', await response.json())
})

test('state regions', async () => {
  const uri = '/regions?count=3&days=20&region_type=state'
  const contentTypeJson = /^application\/json/
  const response = await fetch(`${url}${uri}`)
  const contentType = response.headers.get('content-type') // string
  expect(contentType).toMatch(contentTypeJson)
  console.log('response:', await response.json())
})

afterAll(async () => {
  return service.server.close()
})
