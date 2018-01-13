import t from 'prop-types'
import React, { Component } from 'react'

import Footer from 'modules/Footer'
import NavigationOffsetLeft from '../NavigationOffsetLeft'

export default class FooterWrapper extends Component {
    static propTypes = {
        hasNavigation: t.bool,
        hasSubNavigation: t.bool,
        subNavigationWidth: t.number,
        // See Footer props for more details
        footerProps: t.shape({
            linkColumnsOverride: t.arrayOf(
                t.shape({
                    links: t.arrayOf(
                        t.shape({
                            label: t.string.isRequired,
                            href: t.string.isRequired,
                        }),
                    ),
                }),
            ),
        }),
    }

    render() {
        const {
            footerProps,
            hasNavigation,
            hasSubNavigation,
            subNavigationWidth,
        } = this.props

        return (
            <NavigationOffsetLeft
                hasNavigation={hasNavigation}
                hasSubNavigation={hasSubNavigation}
                subNavigationWidth={subNavigationWidth}
            >
                <Footer colorTheme="light" useLogo {...footerProps} />
            </NavigationOffsetLeft>
        )
    }
}



// WEBPACK FOOTER //
// ./app/shared/render-page/components/FooterWrapper/index.jsx