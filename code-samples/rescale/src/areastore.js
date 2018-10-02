/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export const SET_AREA = 'SET_AREA'
export const SHOW_FORM = 1

export function setArea(display) {
  console.log('action:', SET_AREA, display)
  if (display !== null &&
    !display && typeof display !== 'string') {
      const e = new Error('bad setArea')
      console.error(e)
      return {payload: e}
  }
  return {
    type: SET_AREA,
    display,
  }
}

export function areaDisplaysResult(v) {
  return v && typeof v === 'string'
}

export function area(state = null, action) { // jobs store-slice reducer
  // eslint-disable-next-line
  switch(action.type) {
  case SET_AREA:
    return action.display
  }
  return state
}
