import { logEvent } from './logger'

export const MEMBER_LIST_EVENTS = {
    DOMAIN: 'Member List',

    LANDED: 'Landed',
    CLICKED_FILTER: 'Clicked Filter',
    CLICKED_EXPORT_CSV: 'Clicked Export CSV',
    CLICKED_NEXT_PAGE: 'Clicked Next Page',
    SORTED_COLUMN: 'Sorted Column',

    CLICKED_MESSAGE: 'User Detail : Clicked Message',
    CLICKED_BLOCK: 'User Detail : Clicked Block',
    COPIED_EMAIL: 'User Detail : Copied Email',
    COPIED_ADDRESS: 'User Detail : Copied Address',

    CLICKED_UPDATE_NOTE: 'User Detail : Clicked Update Note',
    UPDATED_NOTE: 'User Detail : Updated Note',

    CLICKED_REFUND: 'User Detail : Clicked Refund',
    REFUND_SUCCEEDED: 'User Detail : Refund Modal : Refund : Success',
    REFUND_FAILED: 'User Detail : Refund Modal : Refund : Error',
}

export function logMemberListEvent(eventTitle, eventInfo) {
    if (process.env.NODE_ENV === 'development') {
        function string(val) {
            return typeof val === 'string'
        }
        function array(val) {
            return Array.isArray(val)
        }
        function number(val) {
            return Number(val) === val
        }
        function date(val) {
            return (val || '').match(/\d{4}-\d{2}/.length)
        }
        const eventInfoTypes = {
            LANDED: { user_id: string },
            CLICKED_FILTER: {
                user_id: string,
                reward_id: string,
                pledge_min: number,
                pledge_max: number,
                membership_type: array,
                last_charge_status: string,
                sort: string,
            },
            CLICKED_EXPORT_CSV: { user_id: string },
            CLICKED_NEXT_PAGE: { user_id: string, next_page: number },
            SORTED_COLUMN: {
                user_id: string,
                column_name: string,
            },
            CLICKED_MESSAGE: {
                user_id: string,
                patron_id: string,
            },
            CLICKED_BLOCK: {
                user_id: string,
                patron_id: string,
            },
            COPIED_EMAIL: {
                user_id: string,
                patron_id: string,
            },
            COPIED_ADDRESS: {
                user_id: string,
                patron_id: string,
            },
            CLICKED_UPDATE_NOTE: {
                user_id: string,
                patron_id: string,
            },
            UPDATED_NOTE: {
                user_id: string,
                patron_id: string,
            },
            CLICKED_REFUND: {
                user_id: string,
                patron_id: string,
                charge_date: date,
                amount_cents: number,
            },
            REFUND_SUCCEEDED: {
                user_id: string,
                patron_id: string,
                charge_date: date,
                amount_cents: number,
            },
            REFUND_FAILED: {
                user_id: string,
                patron_id: string,
                charge_date: date,
                amount_cents: number,
                error_text: string,
            },
        }

        const eventInfoTypesMapped = {}
        const keys = Object.keys(eventInfoTypes)
        for (let i = 0; i < keys.length; i++) {
            const eventKey = keys[i]
            eventInfoTypesMapped[MEMBER_LIST_EVENTS[eventKey]] =
                eventInfoTypes[eventKey]
        }

        if (!eventTitle) {
            console.error('An analytics event was fired without an event name!')
        }
        const failingKeys = []
        const ei = eventInfo || {}
        const paramsForThisEvent = Object.keys(eventInfoTypesMapped[eventTitle])
        for (let i = 0; i < paramsForThisEvent.length; i++) {
            const currentParam = paramsForThisEvent[i]
            if (
                !eventInfoTypesMapped[eventTitle][currentParam](
                    ei[currentParam],
                )
            ) {
                failingKeys.push({
                    paramName: currentParam,
                    actual: ei[currentParam],
                    type: eventInfoTypesMapped[eventTitle][currentParam],
                })
            }
        }
        if (failingKeys.length) {
            console.error(
                'An analytics event "' +
                    eventTitle +
                    '" was fired without its required properties:',
                failingKeys,
            )
        }
    }

    logEvent({
        domain: MEMBER_LIST_EVENTS.DOMAIN,
        title: eventTitle,
        info: eventInfo,
    })
}



// WEBPACK FOOTER //
// ./app/analytics/member-list.js