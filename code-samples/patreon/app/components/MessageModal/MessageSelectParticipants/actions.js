import { filteredUsers } from 'actions/users'

export const SELECTED_PARTICIPANTS = 'SELECTED_PARTICIPANTS'
export const SUGGESTED_PARTICIPANTS_QUERY = 'SUGGESTED_PARTICIPANTS_QUERY'

export const setParticipants = (userIds = []) => {
    return {
        type: SELECTED_PARTICIPANTS,
        payload: userIds,
    }
}

export const suggestedParticipantsQuery = query => {
    return {
        type: SUGGESTED_PARTICIPANTS_QUERY,
        payload: query,
    }
}

const messageableIncludes = [
    'pledge_to_current_user.null',
    'campaign.current_user_pledge.null',
]

export const fetchMessageableUsers = (query = '') => {
    return filteredUsers(
        { messageable: true },
        { name: query },
        messageableIncludes,
    )
}



// WEBPACK FOOTER //
// ./app/components/MessageModal/MessageSelectParticipants/actions.js