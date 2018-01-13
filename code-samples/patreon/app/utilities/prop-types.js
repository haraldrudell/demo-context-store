import t from 'prop-types'

export const Id = t.oneOfType([t.number, t.string])

export const User = t.shape({
    id: Id.isRequired,
    fullName: t.string.isRequired,
    imageUrl: t.string.isRequired,
})

export const Campaign = t.shape({
    id: Id.isRequired,
    creationName: t.string.isRequired,
    payPerName: t.string.isRequired,
    publishedAt: t.string,
    isPlural: t.bool,
    pledgeSum: t.number.isRequired,
    patronCount: t.number.isRequired,
})

export const Creator = t.shape({
    id: Id.isRequired,
    fullName: t.string.isRequired,
    imageUrl: t.string.isRequired,
    campaign: Campaign,
})

export const Message = t.shape({
    sentAt: t.string.isRequired,
    content: t.string.isRequired,
    sender: User,
})

export const Conversation = t.shape({
    id: Id.isRequired,
    isReplied: t.bool,
    read: t.bool,
    messages: t.arrayOf(Message),
    participants: t.arrayOf(User),
})

export const Comment = t.shape({
    id: Id.isRequired,
    body: t.string.isRequired,
    created: t.string.isRequired,
    deletedAt: t.string,
    isByPatron: t.bool,
    isByCreator: t.bool,
    voteSum: t.number,
    currentUserVote: t.number,
    replyCount: t.number,
    commenter: User,
    isUnread: t.bool,
    parent: t.shape({
        id: t.string.isRequired,
    }),
})

export const Goal = t.shape({
    id: Id.isRequired,
    amountCents: t.number.isRequired,
    title: t.string.isRequired,
    description: t.string.isRequired,
    createdAt: t.string.isRequired,
    reachedAt: t.string,
})

export const PatronGoal = t.shape({
    id: Id.isRequired,
    numberPatrons: t.number.isRequired,
    goalText: t.string.isRequired,
    createdAt: t.string.isRequired,
    reachedAt: t.string,
})

export const Reward = t.shape({
    id: Id.isRequired,
    amountCents: t.oneOfType([t.string, t.number]),
    title: t.string,
    imageUrl: t.string,
    description: t.string,
    createdAt: t.string,
    patronCount: t.number,
    userLimit: t.number,
    remaining: t.number,
    requiresShipping: t.bool,
    url: t.string,
    publishedAt: t.string,
    unpublishedAt: t.string,
    editedAt: t.string,
})

export const Category = t.shape({
    id: Id.isRequired,
    name: t.string.isRequired,
})

export const Browser = t.shape({
    greaterThan: t.shape({
        small: t.bool,
        medium: t.bool,
    }),
})

export const Post = t.shape({
    campaign: Campaign.isRequired,
    user: User.isRequired,
    id: Id.isRequired,
})

export const Pledge = t.shape({
    id: Id.isRequired,
    amount_cents: t.number.isRequired,
    created_at: t.string.isRequired,
    creator: User,
    patron: User,
    declined_since: t.string,
    patron_pays_fees: t.bool,
    pledge_cap_cents: t.number,
})

export const Follow = t.shape({
    id: Id.isRequired,
    follower: User.isRequired,
    followed: User.isRequired,
    created_at: t.string.isRequired,
})

export const Responsive = t.shape({
    isMobile: t.bool,
})

export const Event = t.shape({
    began_at: t.string.isRequired,
    created_at: t.string.isRequired,
    expires_at: t.string,
    obj: t.object,
    type: t.string.isRequired,
})



// WEBPACK FOOTER //
// ./app/utilities/prop-types.js