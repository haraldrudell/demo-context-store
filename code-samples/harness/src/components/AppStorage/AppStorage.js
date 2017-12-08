// const store = window.sessionStorage || {}
const store = window.localStorage || {}

export default class AppStorage {
  static set (name, value) {
    store.setItem(name, value)
  }

  static get (name) {
    // AppStorage.get('acctId') is deprecated => don't use it.
    // => This is a patch to get accountId from URL & return it:
    if (name === 'acctId') {
      const arr = window.location.href.split('/account/')
      if (arr.length >= 2) {
        const accountId = arr[1].split('/')[0]
        return accountId
      }
    }
    return store.getItem(name)
  }

  static getAll () {
    const _obj = {}

    for (let i = 0, len = store.length; i < len; ++i) {
      const key = store.key(i)
      _obj.key = AppStorage.get(key)
    }

    return _obj
  }

  static has (name) {
    return AppStorage.get(name) ? true : false
  }

  static remove (name) {
    store.removeItem(name)
  }

  static clear () {
    store.clear()
  }

  static printAll () {
    console.log(AppStorage.getAll())
  }
}



// WEBPACK FOOTER //
// ../src/components/AppStorage/AppStorage.js