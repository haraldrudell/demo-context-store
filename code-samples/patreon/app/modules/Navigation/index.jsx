import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import { withPreset } from 'libs/with-preset'

import { withProps } from 'recompose'

import NavigationOffsetLeft from 'shared/render-page/components/NavigationOffsetLeft'

import Navbar from './components/Navbar'
import MobileNavbar from './components/MobileNavbar'
import ImpersonationWarning from './components/ImpersonationWarning'
import { setTrackingMetaData } from 'shared/events/tracking-meta-data'

@withPreset('navigation')
@withProps(props => ({
    isImpersonating: props.navigation.isImpersonating,
    impersonationWriteAccess: props.navigation.impersonationWriteAccess,
    refererUrl: props.navigation.refererUrl,
    utmParams: props.navigation.utmParams,
}))
export default class NavigationContainer extends Component {
    static propTypes = {
        isImpersonating: t.bool,
        impersonationWriteAccess: t.bool,
        // See Navbar props for more details
        navbarProps: t.shape({
            hideSearch: t.bool,
            hideNavItems: t.bool,
        }),
        refererUrl: t.string, // eslint-disable-line
        subNavigationLinks: t.array,
        subNavigationWidth: t.number,
        utmParams: t.object // eslint-disable-line
    }

    componentDidMount() {
        setTrackingMetaData(this.props)
    }

    render() {
        const {
            isImpersonating,
            impersonationWriteAccess,
            navbarProps,
            subNavigationLinks,
            subNavigationWidth,
        } = this.props

        return (
            <NavigationContentContainer>
                {isImpersonating &&
                    !(navbarProps && navbarProps.hideNavItems) &&
                    impersonationWriteAccess && (
                        <NavigationOffsetLeft
                            hasSubNavigation={!!subNavigationWidth}
                            subNavigationWidth={subNavigationWidth}
                        >
                            <ImpersonationWarning />
                        </NavigationOffsetLeft>
                    )}
                {/* uses screen size media queries internally for `display: (none|block)` */}
                <MobileNavbar {...navbarProps} />
                {/* uses screen size media queries internally for `display: (none|block)` */}
                <Navbar
                    {...navbarProps}
                    subNavigationLinks={subNavigationLinks}
                />
            </NavigationContentContainer>
        )
    }
}

const NavigationContentContainer = styled.div`
    width: 100%;
    position: fixed;
    z-index: ${props => props.theme.zIndex.Z_INDEX_12};
    top: 0;
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/index.jsx