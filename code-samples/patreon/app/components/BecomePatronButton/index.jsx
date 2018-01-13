import React, { Component } from 'react'
import url from 'url'
import PropTypes from 'prop-types'
import querystring from 'querystring'
import get from 'lodash/get'

import Button, { BUTTON_SIZES, BUTTON_COLORS } from 'components/Button'

export default class BecomePatronButton extends Component {
    static propTypes = {
        /**
         * Query parameters are merged from pledgeURL, creatorID, pledgeAmountCents, and redirectURI, with pledgeURL query parameters taking precedence.
         * At least one of pledgeURL or creatorID must be provided.
         */
        pledgeURL: PropTypes.string,
        creatorID: PropTypes.string,
        pledgeAmountCents: PropTypes.number,
        redirectURI: PropTypes.string,
        onBePatronClick: PropTypes.func,
        becomeAPatronText: PropTypes.string,
        button: PropTypes.shape({
            size: PropTypes.oneOf(BUTTON_SIZES),
            color: PropTypes.oneOf(BUTTON_COLORS),
            fluid: PropTypes.bool,
        }),
        isPreview: PropTypes.bool,
    }

    static defaultProps = {
        becomeAPatronText: 'Become a patron',
    }

    render() {
        let queryParams = {}
        let pledgeURLPath = '/bePatron'
        if (this.props.pledgeAmountCents) {
            queryParams['patAmt'] = this.props.pledgeAmountCents / 100
        }
        if (this.props.creatorID) {
            queryParams['u'] = this.props.creatorID
        }
        if (this.props.redirectURI) {
            queryParams['redirect_uri'] = this.props.redirectURI
        }
        if (this.props.pledgeURL) {
            const parsedPledgeURL = url.parse(this.props.pledgeURL, true)
            pledgeURLPath = parsedPledgeURL.pathname
            const providedQueryParams = parsedPledgeURL.query
            queryParams = {
                ...queryParams,
                ...providedQueryParams,
            }
        }
        const pledgeUrl = `${pledgeURLPath}?${querystring.stringify(
            queryParams,
        )}`

        let onBePatronClick = this.props.onBePatronClick
            ? this.props.onBePatronClick.bind(null)
            : undefined

        const buttonProp = this.props.button
        const buttonSize = get(buttonProp, 'size', 'lg')
        const activeButtonColor = get(buttonProp, 'color', 'primary')
        const isFluidButton = get(buttonProp, 'fluid', true)
        const disabled = this.props.isPreview

        return (
            <Button
                name="become-a-patron"
                href={pledgeUrl}
                color={disabled ? 'subduedGray' : activeButtonColor}
                size={buttonSize}
                onClick={onBePatronClick}
                fluid={isFluidButton}
                disabled={disabled}
                data-test-tag="become-patron-button"
            >
                <span>
                    {this.props.becomeAPatronText}
                </span>
                {this.props.isPreview &&
                    <div
                    // TODO: className={ styles.bePatronPreviewDisclaimer }
                    >
                        You can pledge when this page launches
                    </div>}
            </Button>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/BecomePatronButton/index.jsx