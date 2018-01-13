import apiRequestAction from 'actions/api-request-action'
import jsonApiUrl from 'utilities/json-api-url'

export const GET_FILTERED_USERS = 'GET_FILTERED_USERS'

const fields = {
    'user': [
        'id',
        'first_name',
        'last_name',
        'full_name',
        'image_url',
        'url'
    ]
}

export const filteredUsers = (filter, query, include) => {
    const url = jsonApiUrl(`/users`, {
        include,
        fields,
        filter,
        query
    })

    return (dispatch) => {
        dispatch(apiRequestAction(GET_FILTERED_USERS, url))
    }
}

export const checkVanity = (vanity) => {
    const url = jsonApiUrl(`/users`, {
        fields,
        filter: { vanity }
    })

    return (dispatch) => {
        dispatch(apiRequestAction(`${GET_FILTERED_USERS}__${vanity}`, url))
    }
}



// WEBPACK FOOTER //
// ./app/actions/users.js