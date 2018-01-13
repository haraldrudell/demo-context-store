import t from 'prop-types'
import React, { Component } from 'react'
import get from 'lodash/get'
import nion from 'nion'
import { withProps } from 'recompose'

import getDataOrNot from 'utilities/get-data-or-not'
import { withPreset } from 'libs/with-preset'

import navStyles from 'styles/themes/america/components/navigation'

import styled from 'styled-components'

@nion('currentUser')
@withPreset('navigation')
@withProps(props => ({
    isActiveCreator: !!get(
        getDataOrNot(props.nion.currentUser),
        'campaign.publishedAt',
        !!get(props.navigation, 'simulatedBootstrap.isActiveCreator'),
    ),
    subNavigation: !!props.subNavigation, // Cast to a bool regardless
}))
export default class NavigationOffsetLeft extends Component {
    static propTypes = {
        children: t.node,
        disableOffset: t.bool,
        hasNavigation: t.bool,
        hasSubNavigation: t.bool,
        isActiveCreator: t.bool,
        subNavigationWidth: t.number,
        isLegacyPage: t.bool,
    }

    static defaultProps = {
        disableOffset: false,
    }

    render() {
        const {
            children,
            disableOffset,
            hasNavigation,
            hasSubNavigation,
            isActiveCreator,
            subNavigationWidth,
            isLegacyPage,
        } = this.props

        let offsetWidth = 0

        if (!disableOffset) {
            if (isActiveCreator && hasNavigation) {
                offsetWidth += navStyles.creatorMenuOffsetWidthNumber
            }

            if (hasSubNavigation) {
                offsetWidth += subNavigationWidth
                    ? subNavigationWidth
                    : navStyles.subMenuWidthNumber
            }
        }

        return (
            <Offset offsetWidth={offsetWidth} isLegacyPage={isLegacyPage}>
                {children}
            </Offset>
        )
    }
}

const Offset = styled.div`
    ${props => (props.isLegacyPage ? '' : 'overflow-x: hidden;')} ${props =>
            props.offsetWidth > 0
                ? props.theme.responsive.cssPropsForBreakpointValues(
                      { md: `${props.offsetWidth}px` },
                      'margin-left',
                  )
                : ''} ${props =>
            props.offsetWidth > 0
                ? props.theme.responsive.cssPropsForBreakpointValues(
                      { md: '100%' },
                      'height',
                  )
                : ''};
`



// WEBPACK FOOTER //
// ./app/shared/render-page/components/NavigationOffsetLeft/index.jsx