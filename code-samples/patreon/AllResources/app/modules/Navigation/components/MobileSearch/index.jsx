import React, { Component } from 'react'

import Input from 'components/Form/Input'

import { MobileSearchForm } from './styled-components'

import { logSearchEvent } from '../../events'

import { SEARCH_EVENTS } from 'analytics/search'

export default class MobileSearch extends Component {
    render() {
        const url = `https://${window.patreon.webServer}/search`

        return (
            <MobileSearchForm
                method="GET"
                action={url}
                onSubmit={() => logSearchEvent(SEARCH_EVENTS.VIEW_ALL)}
            >
                <Input
                    name="q"
                    icon={{
                        type: 'search',
                        size: 'sm',
                        color: 'gray5',
                    }}
                    type="text"
                    label="Search"
                    ref={ref => (this._searchInput = ref)}
                    onFocus={() => logSearchEvent(SEARCH_EVENTS.FOCUS)}
                    onBlur={() => logSearchEvent(SEARCH_EVENTS.BLUR)}
                />
            </MobileSearchForm>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/MobileSearch/index.jsx