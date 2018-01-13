import { makeLogger } from './logger'

export const WIDGETS = {
    DOMAIN: 'Widgets',

    RENDERED: 'Rendered',
    CLICKED: 'Clicked'
}

export const WIDGET_TYPES = {
    BECOME_PATRON_BUTTON: 'become-patron-button'
}

const logWidgetEvent = makeLogger(WIDGETS.DOMAIN)

export function logWidgetRenderEvent(widgetType, additionalInfo = {}) {
    logWidgetEvent(WIDGETS.RENDERED, {
        ...additionalInfo,
        widget_type: widgetType,
    })
}

export function logWidgetClickEvent(widgetType, additionalInfo = {}) {
    logWidgetEvent(WIDGETS.CLICKED, {
        ...additionalInfo,
        widget_type: widgetType,
    })
}



// WEBPACK FOOTER //
// ./app/analytics/widgets.js