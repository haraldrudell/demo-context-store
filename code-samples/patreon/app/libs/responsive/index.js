import t from 'prop-types'
import React from 'react'
import omit from 'lodash/omit'
import get from 'lodash/get'
import responsiveHelper from 'styles/shared/responsive'
import { createResponsiveConnect } from 'libs/react-match-media'
import getWindow from 'utilities/get-window'
import getComponentName from 'utilities/get-component-name'
import { isDevelopment, isClient } from 'shared/environment'

const breakpointProps = [
    'isMaxLg',
    'isMaxMd',
    'isMaxSm',
    'isMaxXs',
    'isMinXl',
    'isMinLg',
    'isMinMd',
    'isMinSm',
]

const responsiveConnect = createResponsiveConnect(
    responsiveHelper.getBreakpointsInPixels(),
    {
        matchMediaFn: get(getWindow(), 'matchMedia', null),
    },
)()

const responsive = Component => {
    if (isDevelopment() && !isClient()) {
        console.warn(
            `Component ${getComponentName(
                Component,
            )} is using the @responsive decorator in a server-side environment`,
        )
    }

    const output = props => {
        const { isMaxLg, isMaxMd, isMaxSm, isMaxXs, isMinXl, isMinLg } = props

        const nextProps = omit(props, breakpointProps)

        let size

        if (isMaxLg && isMaxMd && isMaxSm && isMaxXs) {
            size = 'xs'
        } else if (isMaxLg && isMaxMd && isMaxSm) {
            size = 'sm'
        } else if (isMaxLg && isMaxMd) {
            size = 'md'
        } else if (isMinLg && isMaxLg) {
            size = 'lg'
        } else if (isMinXl && isMinLg) {
            size = 'xl'
        }

        const sizes = [...responsiveHelper.BREAKPOINT_NAMES]

        const indexOfSize = sizes.indexOf(size)

        const lte = test => {
            if (typeof size === 'undefined') {
                return false
            }
            const indexOfTest = sizes.indexOf(test)
            return indexOfSize <= indexOfTest
        }

        const lt = test => {
            if (typeof size === 'undefined') {
                return false
            }
            const indexOfTest = sizes.indexOf(test)
            return indexOfSize < indexOfTest
        }

        const gte = test => {
            if (typeof size === 'undefined') {
                return false
            }
            const indexOfTest = sizes.indexOf(test)
            return indexOfSize >= indexOfTest
        }

        const gt = test => {
            if (typeof size === 'undefined') {
                return false
            }
            const indexOfTest = sizes.indexOf(test)
            return indexOfSize > indexOfTest
        }

        nextProps.responsive = {
            size,
            lt,
            lte,
            gt,
            gte,
            isMobile: lt('sm'),
            isTablet: lt('md') && gte('sm'),
            isDesktop: gte('md'),
        }

        return <Component {...nextProps} />
    }

    output.propTypes = {
        isMaxLg: t.bool,
        isMaxMd: t.bool,
        isMaxSm: t.bool,
        isMaxXs: t.bool,
        isMinXl: t.bool,
        isMinLg: t.bool,
    }

    return responsiveConnect(output)
}

export default responsive



// WEBPACK FOOTER //
// ./app/libs/responsive/index.js