import localStorage from 'local-storage'

export const LOCAL_STORAGE_SUCCESS = 'LOCAL_STORAGE_SUCCESS'

export const getStorageKey = (key) => {
    return {
        type: LOCAL_STORAGE_SUCCESS,
        key,
        payload: localStorage(key)
    }
}

export const getStorageKeys = (keys) => {
    return (dispatch, getState) => {
        keys.map((k) => {
            dispatch(getStorageKey(k))
        })
    }
}

export const setStorageKey = (key, data) => {
    localStorage(key, data)
    return {
        type: LOCAL_STORAGE_SUCCESS,
        key,
        payload: data
    }
}



// WEBPACK FOOTER //
// ./app/actions/local-storage.js