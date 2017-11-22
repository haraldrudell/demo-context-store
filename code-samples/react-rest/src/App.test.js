import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

describe('App component', () => {
  it('renders without crashing', async () => {
    // jest jsdom has global.fetch
    const globalFetch = fetch
    const mockFetch = global.fetch = jest.fn().mockImplementation(async () => ({
      ok: true,
      headers: {get: headerName => 'application/json'},
      json: () => ({message: 'mockResponse'}),
    }))

    const div = document.createElement('div');
    await new Promise((resolve, reject) => ReactDOM.render(<App />, div, resolve))

    global.fetch = globalFetch
    const invocations = mockFetch.mock.calls.length
    expect(invocations).toBe(1)
  })
})