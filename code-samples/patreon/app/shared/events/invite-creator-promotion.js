import { logEvent, INVITE_CREATOR_PROMPT_EVENTS } from 'analytics'

const {
    DOMAIN,
    SOURCE_HOME,
    SOURCE_DASHBOARD,
    RENDERED,
    INVITE_CREATOR_CLICKED,
    REMIND_LATER_CLICKED,
    DISMISS_CLICKED
} = INVITE_CREATOR_PROMPT_EVENTS

const createEventLogger = (eventTitle, source) => {
    return (
        incentiveText,
        inviteButtonText,
        inviteButtonColor,
        referralAmount
    ) => {
        const payload = {
            domain: DOMAIN,
            title: eventTitle,
            info: {
                'source': source,
                'incentiveText': incentiveText,
                'inviteButtonText': inviteButtonText,
                'inviteButtonColor': inviteButtonColor,
                'referralAmount': referralAmount
            }
        }
        logEvent(payload)
    }
}

export const logEventWithInviteCreator = (fn, model) => {
    fn.call(
        fn,
        model.incentiveText,
        model.inviteButtonText,
        model.inviteButtonColor,
        model.referralAmount
    )
}

export const logInviteCreatorPromptHomeRenderEvent = createEventLogger(RENDERED, SOURCE_HOME)
export const logInviteCreatorPromptDashboardRenderEvent = createEventLogger(RENDERED, SOURCE_DASHBOARD)

export const logInviteCreatorPromptHomeInviteClickEvent =  createEventLogger(INVITE_CREATOR_CLICKED, SOURCE_HOME)
export const logInviteCreatorPromptDashboardInviteClickEvent =  createEventLogger(INVITE_CREATOR_CLICKED, SOURCE_DASHBOARD)

export const logInviteCreatorPromptHomeRemindLaterClickEvent =  createEventLogger(REMIND_LATER_CLICKED, SOURCE_HOME)
export const logInviteCreatorPromptDashboardRemindLaterClickEvent =  createEventLogger(REMIND_LATER_CLICKED, SOURCE_DASHBOARD)

export const logInviteCreatorPromptHomeDismissClickEvent =  createEventLogger(DISMISS_CLICKED, SOURCE_HOME)
export const logInviteCreatorPromptDashboardDismissClickEvent =  createEventLogger(DISMISS_CLICKED, SOURCE_DASHBOARD)



// WEBPACK FOOTER //
// ./app/shared/events/invite-creator-promotion.js