import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import access from 'safe-access'
import { FOOTER_EVENTS, logEvent } from 'analytics'

import Block from 'components/Layout/Block'
import Col from 'components/Layout/Col'
import Grid from 'components/Layout/Grid'
import Icon from 'components/Icon'
import Logo from 'components/Logo'
import PseudoEffects from 'components/PseudoEffects'
import Row from 'components/Layout/Row'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import {
    getDefaultLinks,
    SOCIAL_LINKS,
    MOBILE_DOWNLOAD_BUTTONS,
} from './constants/links'
import { FooterWrapper } from './styled-components'

const COPYWRITE_DATE = new Date().getFullYear()

class Footer extends Component {
    static propTypes = {
        /**
         * Color theme for the footer
         * In the America theme, `light` is a light background with navy links,
         * `dark` is a navy background with light links
         * The Default theme only has one color (`default`, `light`, and `dark` all render the same)
         **/
        colorTheme: PropTypes.oneOf(['light', 'dark']),
        currentUser: PropTypes.object,
        /**
         * If the default links in the footer need to be overriden
         * e.g. certain static error or marketing pages might need this
         **/
        linkColumnsOverride: PropTypes.arrayOf(
            PropTypes.shape({
                links: PropTypes.arrayOf(
                    PropTypes.shape({
                        label: PropTypes.string.isRequired,
                        href: PropTypes.string.isRequired,
                    }),
                ),
            }),
        ),
        // Whether to use the logo (instead of wordmark)
        useLogo: PropTypes.bool,
    }

    static defaultProps = {
        colorTheme: 'dark',
        currentUser: {},
    }

    getTextColor = () => (this.props.colorTheme === 'light' ? 'dark' : 'light')

    trackMobileAppClick = analyticsEventTitle => {
        if (analyticsEventTitle) {
            logEvent({
                domain: FOOTER_EVENTS.DOMAIN,
                title: analyticsEventTitle,
            })
        }
    }

    renderLink = (link, i) => {
        return (
            link.label &&
            link.href && (
                <li key={link.label}>
                    <Block mb={2}>
                        <TextButton
                            href={link.href}
                            color={this.getTextColor()}
                        >
                            {link.label}
                        </TextButton>
                    </Block>
                </li>
            )
        )
    }

    renderLinkColumns = () => {
        const { linkColumnsOverride } = this.props
        const isCreator = !!access(
            this.props.currentUser,
            'campaign.publishedAt',
        )
        const columns = linkColumnsOverride
            ? linkColumnsOverride
            : getDefaultLinks(isCreator)
        const xsSize = Math.round(12 / columns.length)
        const mdSize = Math.round(6 / columns.length)

        return columns.map((column, columnIndex) => {
            return (
                <Col
                    key={column.links[0].label}
                    xs={xsSize}
                    md={mdSize}
                    order={{ xs: columnIndex + 1, md: columnIndex + 2 }}
                >
                    <Block mb={4}>
                        <ul>
                            {column.links.map((link, i) =>
                                this.renderLink(link, i),
                            )}
                        </ul>
                    </Block>
                </Col>
            )
        })
    }

    renderMobileButton = (button, i) => {
        return (
            <Block mv={1} key={button.href}>
                <MobileDownloadButton
                    key={button.href}
                    data-tag={button.dataTag}
                    href={button.href}
                    target={button.hrefTarget}
                    style={{
                        backgroundImage: `url(${button.backgroundImage})`,
                    }}
                    onClick={() =>
                        this.trackMobileAppClick(button.analyticsEventTitle)}
                />
            </Block>
        )
    }

    renderSocialMobileColumn = () => {
        const { colorTheme } = this.props
        return (
            <Col key="social-mobile" xs={6} md={3} order={{ xs: 4 }}>
                {SOCIAL_LINKS.map((link, i) => (
                    <Block mr={1} key={link.href} display="inline-block">
                        <a href={link.href}>
                            <PseudoEffects
                                hoverProps={{
                                    color:
                                        colorTheme === 'light'
                                            ? 'gray2'
                                            : 'gray6',
                                }}
                            >
                                <Icon
                                    color={
                                        colorTheme === 'light'
                                            ? 'dark'
                                            : 'light'
                                    }
                                    size="sm"
                                    type={link.icon}
                                />
                            </PseudoEffects>
                        </a>
                    </Block>
                ))}
                <Block mv={3}>
                    {MOBILE_DOWNLOAD_BUTTONS.map((button, i) =>
                        this.renderMobileButton(button, i),
                    )}
                </Block>
                <Text color={colorTheme === 'light' ? 'dark' : 'light'}>
                    © {COPYWRITE_DATE} Patreon, Inc.
                </Text>
            </Col>
        )
    }

    renderLogoColumn = () => {
        const { colorTheme, useLogo } = this.props
        let logoProps = {
            width: 20,
            type: 'wordmarkNegative',
            colors: ['white', 'highlightPrimary'],
        }
        if (useLogo) {
            logoProps = {
                width: 5,
                height: 5,
                type: 'logo',
                colors: [
                    'highlightPrimary',
                    colorTheme === 'light' ? 'gray1' : 'light',
                ],
            }
        }

        return (
            <Col xs={6} md={3} order={{ xs: 3, md: 1 }}>
                <a href="/" title="Home page">
                    <Logo {...logoProps} />
                </a>
            </Col>
        )
    }

    render() {
        const { colorTheme } = this.props
        return (
            <FooterWrapper colorTheme={colorTheme}>
                <Grid maxWidth="lg" p={{ xs: 4, sm: 8 }}>
                    <Row>
                        {this.renderLogoColumn()}
                        {this.renderLinkColumns()}
                        {this.renderSocialMobileColumn()}
                    </Row>
                </Grid>
            </FooterWrapper>
        )
    }
}

const MobileDownloadButton = styled.a`
    background-color: transparent !important;
    background-repeat: no-repeat;
    background-size: contain;
    border: none !important;
    display: inline-block;
    height: 45px;
    max-width: 100%;
    width: 152px;
`

export default Footer



// WEBPACK FOOTER //
// ./app/modules/Footer/index.jsx