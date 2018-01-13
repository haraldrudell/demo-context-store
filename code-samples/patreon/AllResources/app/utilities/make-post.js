// Moved serializePollChoices and serializeTagValues from actions/make-post
// so that these can be reusable. Once we get to 100% nion for making posts,
// we can consider a better location for these methods.
const USER_DEFINED_TAGS_PREFIX = 'user_defined;'

export const serializePollChoices = pollAttributes => {
    const { pollChoices, multipleChoice, pollEndDate, pollId } = pollAttributes

    let includedPollChoices = []
    if (pollChoices) {
        includedPollChoices = pollChoices
            .filter(c => c.length > 0)
            .map((choice, i) => {
                return {
                    attributes: {
                        choice_type: 'toggle',
                        position: i + 1,
                        text_content: choice,
                    },
                    id: i,
                    type: 'poll_choice',
                }
            })
    }
    // If the poll has ended and we send a poll, backend gets upset :(
    let shouldIncludePoll = false
    let includedPoll = {
        type: 'poll',
        id: pollId ? pollId : 1,
        attributes: {},
    }
    // NOTE: for now, backend will simply default minCentsPledgedToRespond to the post's minCentsPledgedToView
    // if (minCentsPledgedToRespond === 0 || minCentsPledgedToRespond) {
    //     includedPoll.attributes.min_cents_pledged_to_respond = minCentsPledgedToRespond
    // }
    if (multipleChoice === true) {
        includedPoll.attributes.question_type = 'multiple_choice'
        shouldIncludePoll = true
    } else if (multipleChoice === false) {
        includedPoll.attributes.question_type = 'single_choice'
        shouldIncludePoll = true
    }
    if (pollEndDate || pollEndDate === null) {
        includedPoll.attributes.closes_at = pollEndDate
        shouldIncludePoll = true
    }

    const included = [includedPoll, ...includedPollChoices]
    const relationships = {
        poll: {
            data: {
                type: 'poll',
                id: pollId ? pollId : 1,
            },
        },
    }
    if (shouldIncludePoll) {
        return {
            includedPollInfo: included,
            pollRelationshipInfo: relationships,
        }
    } else {
        return {
            includedPollInfo: [],
            pollRelatonshipInfo: {},
        }
    }
}

export const serializeTagValues = tagValues => {
    const included = tagValues.map(item => {
        return {
            attributes: {
                value: item,
                cardinality: 1,
            },
            id: `${USER_DEFINED_TAGS_PREFIX}${item}`,
            type: 'post_tag',
        }
    })
    const relationships = {
        user_defined_tags: {
            data: included.map(item => {
                return { id: item.id, type: item.type }
            }),
        },
    }
    return {
        included,
        relationships,
    }
}



// WEBPACK FOOTER //
// ./app/utilities/make-post.js