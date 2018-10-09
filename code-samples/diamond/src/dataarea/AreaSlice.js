/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import StoreSlice from 'loadindicator/StoreSlice'

export let instance

export default class AreaSlice extends StoreSlice {
  static SET_AREA = 'AreaSlice_set' // action type
  static SHOW_FORM = 'AreaSlice_showForm' // class-local value

  constructor(o) {
    super(o)
    instance = this
  }

  showDataAreaForm = () => this.setArea(AreaSlice.SHOW_FORM)

  getActions() {
    return {
      showDataAreaForm: this.showDataAreaForm,
      setDataAreaDisplay: this.setArea.bind(this),
    }
  }

  isShowForm(value) {
    return value === AreaSlice.SHOW_FORM
  }

  setArea(display) {
    const {SET_AREA} = AreaSlice
    console.log('setDataAreaDisplay:', display)
    if (display !== null &&
      !display && typeof display !== 'string') {
        const e = new Error('bad setArea')
        console.error(e)
        return this.dispatch({payload: e})
    }
    this.dispatch({type: SET_AREA, display})
  }

  areaDisplaysResult(v) {
    return v && typeof v === 'string'
  }

  reducer(state = null, action) { // jobs store-slice reducer
    const {SET_AREA} = AreaSlice
    // eslint-disable-next-line
    switch(action.type) {
    case SET_AREA:
      return action.display
    }
    return state
  }
}
