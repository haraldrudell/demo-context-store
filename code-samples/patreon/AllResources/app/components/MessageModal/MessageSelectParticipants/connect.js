import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import access from 'safe-access'

import { getCurrentUser } from 'getters/current-user'
import { createParticipantsFilterFn } from 'getters/conversations'
import formatCurrency from 'utilities/format-currency'

import {
    fetchMessageableUsers,
    suggestedParticipantsQuery,
    setParticipants,
} from './actions'

const makeMapUserWithCurrentUser = currentUser => {
    return userRef => {
        let secondaryText = ''
        if (userRef.pledgeToCurrentUser) {
            const amount = formatCurrency(
                userRef.pledgeToCurrentUser.amountCents / 100,
            )
            secondaryText = `Pledging ${amount} per ${currentUser.campaign
                .payPerName}`
        } else if (userRef.campaign && userRef.campaign.currentUserPledge) {
            secondaryText = `Creating ${userRef.campaign.creationName}`
        }
        return {
            avatar: userRef.imageUrl,
            primaryText: userRef.fullName,
            secondaryText: secondaryText,
            id: userRef.id,
        }
    }
}

const getSuggestedParticipants = state => {
    const stateSuggestions = access(state, 'refs.suggestedMessageableUsers')

    if (typeof stateSuggestions === 'undefined') {
        return console.error(
            `Couldn't find messageableUserSuggestions in state.refs. `,
            `Make sure your store includes the MessageSelectParticipants/reducers on the refs object.`,
        )
    }

    const currentUser = access(state, 'refs.currentUser')
    const mapUserRef = makeMapUserWithCurrentUser(currentUser)
    const suggestions = stateSuggestions.map(mapUserRef)
    const query = access(state, 'ui.suggestedParticipantsQuery')
    const queryLabel = `Results for "${query}"`
    const recent = createParticipantsFilterFn(query)(state).map(mapUserRef)

    let suggestedParticipants = []
    let suggestedLabel = ''

    if (query.length < 3) {
        suggestedParticipants = recent
        suggestedLabel = 'Recent'
    } else if (suggestions.length === 0) {
        suggestedParticipants = recent
        suggestedLabel = queryLabel // @TODO: maybe use a "No results label"?
    } else {
        suggestedParticipants = suggestions
        suggestedLabel = queryLabel
    }

    return {
        suggestedParticipants,
        suggestedLabel,
    }
}

const mapStateToProps = createSelector(
    getCurrentUser,
    getSuggestedParticipants,
    (currentUser, suggestedParticipants) => {
        return {
            ...suggestedParticipants,
        }
    },
)

const mapDispatchToProps = dispatch => {
    return {
        onChange: query => {
            if (typeof query !== 'string') return

            dispatch(suggestedParticipantsQuery(query))

            if (query.length === 0) return dispatch(setParticipants([]))
            if (query.length < 3) return

            dispatch(fetchMessageableUsers(query))
        },
        onParticipantsSelected: userIds => dispatch(setParticipants(userIds)),
    }
}

export default component => {
    return connect(mapStateToProps, mapDispatchToProps)(component)
}



// WEBPACK FOOTER //
// ./app/components/MessageModal/MessageSelectParticipants/connect.js