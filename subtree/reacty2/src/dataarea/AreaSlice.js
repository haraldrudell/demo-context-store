/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/

let sliceName

// action types
let SET_AREA

const SHOW_FORM = {AreaSlice_showForm: true} // class-local value: non-string

setSliceName('area')

export function setSliceName(sn) {
  sliceName = sn = String(sn || '')
  SET_AREA = `${sn}_SET_AREA`
}

export function isShowForm(value) {
  return value === SHOW_FORM
}

export function isBlank(value) {
  return value == null
}

// action values

export const showDataAreaForm = {type: SET_AREA, display: SHOW_FORM} // an action object

export function setDataAreaContent(display) { // action creator
  console.log('setDataAreaDisplay:', display)
  if (display !== null &&
    !display && typeof display !== 'string') {
      const e = new Error('bad setArea')
      console.error(e)
      return {type: SET_AREA, payload: e}
  }
  return {type: SET_AREA, display}
}

export function reducer(state = null, action) {
  switch(action.type) {
  case SET_AREA: return action.display
  default: return state
  }
}

export function stateToSlice(state) { // selector
  return Object(state)[sliceName]
}
