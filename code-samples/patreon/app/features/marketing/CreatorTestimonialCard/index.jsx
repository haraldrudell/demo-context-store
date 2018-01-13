import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withState } from 'recompose'
import get from 'lodash/get'
import styled from 'styled-components'
import formatCurrencyFromCents from 'utilities/format-currency-from-cents'
import formatPluralCount from 'utilities/format-plural-count'

import Block from 'components/Layout/Block'
import Card from 'components/Card'
import Col from 'components/Layout/Col'
import Flexy from 'components/Layout/Flexy'
import Grid from 'components/Layout/Grid'
import Icon from 'components/Icon'
import Image from 'components/Image'
import LoadingSpinner from 'components/LoadingSpinner'
import Row from 'components/Layout/Row'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import VideoModal from 'features/marketing/VideoModal'

import { categoriesById } from 'constants/categories'

@withState('videoModalIsOpen', 'setVideoModalOpen', false)
class CreatorTestimonialCard extends Component {
    static propTypes = {
        creator: PropTypes.object,
        imageSource: PropTypes.string,
        isLoading: PropTypes.bool,
        quote: PropTypes.string,
        retinaAvailable: PropTypes.bool,
        showCategory: PropTypes.bool,
        userId: PropTypes.number,
        youtubeVideoId: PropTypes.string,
        // Provided by @withState
        videoModalIsOpen: PropTypes.bool,
        setVideoModalOpen: PropTypes.func,
    }

    renderVideoSource = source => (
        <source key={source.type} src={source.url} type={source.type} />
    )

    playVideo = () => {
        this.props.setVideoModalOpen(true)
    }

    renderPlayButton = () => {
        return (
            <PlayButtonWrapper>
                <PlayButton onClick={this.playVideo}>
                    <Icon type="play" color="white" size="sm" />
                </PlayButton>
            </PlayButtonWrapper>
        )
    }

    renderVideoModal = () => {
        const {
            setVideoModalOpen,
            videoModalIsOpen,
            youtubeVideoId,
        } = this.props
        return (
            <VideoModal
                isOpen={videoModalIsOpen}
                onClose={() => setVideoModalOpen(false)}
                youtubeVideoId={youtubeVideoId}
            />
        )
    }

    renderMedia = () => {
        const { imageSource, retinaAvailable, youtubeVideoId } = this.props

        return (
            <Block position="relative">
                <Image src={imageSource} retinaAvailable={retinaAvailable} />
                {youtubeVideoId && this.renderVideoModal()}
                {youtubeVideoId && this.renderPlayButton()}
            </Block>
        )
    }

    renderQuote = quote => {
        const { userId } = this.props
        const splitQuote = quote.split('**')
        return (
            <span>
                “{splitQuote.map((segment, i) => {
                    if (i % 2 === 0) {
                        return (
                            <Text
                                key={`quote-${userId}-${segment.substring(
                                    0,
                                    9,
                                )}`}
                            >
                                {segment}
                            </Text>
                        )
                    } else {
                        return (
                            <Text
                                weight="bold"
                                key={`quote-${userId}-${segment.substring(
                                    0,
                                    9,
                                )}`}
                            >
                                {segment}
                            </Text>
                        )
                    }
                })}”
            </span>
        )
    }

    renderBody = () => {
        const { creator, quote, showCategory, userId } = this.props

        const isOrOur = get(creator, 'campaign.isPlural') ? 'our' : 'is'

        const formattedPatronCount = formatPluralCount(
            get(creator, 'campaign.patronCount', 0),
            'patron',
        )

        const formatted = (
            <span>
                {formatCurrencyFromCents(
                    get(creator, 'campaign.pledgeSum', 0),
                )}{' '}
                per {get(creator, 'campaign.payPerName')}
            </span>
        )

        const formattedPledgeSum =
            get(creator, 'campaign.earningsVisibility') !== 'private'
                ? formatted
                : null

        const vanity = get(creator, 'vanity')
        const creatorPageHref = vanity ? `/${vanity}` : `user?u=${userId}`

        const categoryId = get(creator, 'campaign.categories[0].id')
        const categoryName = get(creator, 'campaign.categories[0].name')
        const categoryHref = `${get(categoriesById, `${categoryId}.href`)}`
        const categoryIcon = `${get(categoriesById, `${categoryId}.icon`)}Md`

        return (
            <Flexy direction="column" justifyContent="space-between">
                <Block pl={3}>
                    <Text el="h4" size={2} weight="normal" noMargin>
                        <TextButton
                            size={2}
                            href={creatorPageHref}
                            target="_blank"
                        >
                            {get(creator, 'fullName', '')}
                        </TextButton>{' '}
                        {`${isOrOur} `}
                        creating {get(creator, 'campaign.creationName')}
                    </Text>
                    <Block mt={3}>
                        <Flexy alignItems="center">
                            <Block mr={1} mb={-0.5}>
                                <Icon type="patronsSm" />
                            </Block>
                            <Text>{formattedPatronCount}</Text>
                        </Flexy>
                        {formattedPledgeSum && (
                            <Flexy alignItems="center">
                                <Block mr={1} mb={-0.5}>
                                    <Icon type="moneySm" />
                                </Block>
                                <Text>{formattedPledgeSum}</Text>
                            </Flexy>
                        )}
                    </Block>
                    <Block mt={3}>
                        <Text el="p">{this.renderQuote(quote)}</Text>
                    </Block>
                    {showCategory &&
                        categoryId && (
                            <Block mt={3}>
                                <Flexy alignItems="center">
                                    {categoryIcon && (
                                        <Block mr={1} mb={-0.5}>
                                            <Icon
                                                size="xs"
                                                type={categoryIcon}
                                            />
                                        </Block>
                                    )}
                                    <TextButton
                                        href={categoryHref}
                                        color="dark"
                                        target="_blank"
                                    >
                                        {categoryName}
                                    </TextButton>
                                </Flexy>
                            </Block>
                        )}
                </Block>
            </Flexy>
        )
    }

    renderLoadingSpinner = () => (
        <Block mv={20}>
            <Flexy justifyContent="center">
                <LoadingSpinner />
            </Flexy>
        </Block>
    )

    render() {
        const notLoading = (
            <Row>
                <Col xs={12} sm={6}>
                    {this.renderMedia()}
                </Col>
                <Col xs={12} sm={6}>
                    {this.renderBody()}
                </Col>
            </Row>
        )

        const content = this.props.isLoading
            ? this.renderLoadingSpinner()
            : notLoading

        return (
            <Card>
                <Grid ph={{ xs: 0 }}>{content}</Grid>
            </Card>
        )
    }
}

const PlayButtonWrapper = styled.div`
    align-items: center;
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
`

const PlayButton = styled.button`
    align-items: center;
    background-color: ${props => props.theme.colors.highlightPrimary};
    border: none;
    border-radius: ${props => props.theme.cornerRadii.circle};
    display: flex;
    height: ${props => props.theme.units.getValue(7)};
    justify-content: center;
    padding: 0;
    width: ${props => props.theme.units.getValue(7)};

    &:hover {
        ${props => props.theme.buttons.getHoverStyles('primary')};
    }

    > * {
        margin: 0 auto;
    }
`

export default CreatorTestimonialCard



// WEBPACK FOOTER //
// ./app/features/marketing/CreatorTestimonialCard/index.jsx