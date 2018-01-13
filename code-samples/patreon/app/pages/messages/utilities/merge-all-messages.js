import sortBy from 'lodash/sortBy'

export default conversation => {
    const allChildMessages = (conversation.children || [])
        .reduce((memo, child) => {
            return memo.concat(child.messages)
        }, [])
    const parentMessages = conversation.messages || []
    return sortBy(parentMessages.concat(allChildMessages), message => {
        return message.sentAt
    })
}



// WEBPACK FOOTER //
// ./app/pages/messages/utilities/merge-all-messages.js