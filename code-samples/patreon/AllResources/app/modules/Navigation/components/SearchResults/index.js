import t from 'prop-types'
import React, { Component } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import nion from 'nion'

import Avatar from 'components/Avatar'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import getDataOrNot from 'utilities/get-data-or-not'

require('./styles')
import { logSearchEvent, logSelectSearchNavEvent } from '../../events'
import { fixUrl, MAX_CAMPAIGNS, MAX_POSTS } from 'utilities/search'

import {
    CampaignAvatar,
    CampaignDetails,
    CampaignResultLink,
    EmptySearchResultsList,
    MoreResults,
    PostResultLink,
    SearchMenu,
} from './styled-components'

import { SEARCH_EVENTS } from 'analytics/search'

@nion('navigationSearch')
export default class SearchResults extends Component {
    static propTypes = {
        isOpen: t.bool,
        onClick: t.func,
        searchText: t.string,
        resultIndex: t.number,
        setResultIndex: t.func,
    }

    _renderCampaignResult = (campaignResult, i) => {
        const { resultIndex, setResultIndex } = this.props
        const { creationName, creatorName, image, url } = campaignResult
        const selected = i === resultIndex

        return (
            <CampaignResultLink
                href={fixUrl(url)}
                key={url}
                selected={selected}
                onClick={() => logSelectSearchNavEvent(campaignResult, i)}
                onMouseEnter={() => setResultIndex(i)}
            >
                <CampaignAvatar>
                    <Avatar src={image} size="xs" />
                </CampaignAvatar>
                <CampaignDetails>
                    <Text color="dark" weight="bold" size={0} el="div" ellipsis>
                        {creatorName}
                    </Text>
                    <Text color="subduedGray" size={0} el="div" ellipsis>
                        {creationName}
                    </Text>
                </CampaignDetails>
            </CampaignResultLink>
        )
    }

    _renderPostResult = (postResult, i) => {
        const { resultIndex, setResultIndex } = this.props
        const { campaign, title, patreonUrl } = postResult
        const selected = i === resultIndex

        return (
            <PostResultLink
                href={patreonUrl}
                key={patreonUrl}
                selected={selected}
                onClick={() => logSelectSearchNavEvent(postResult, i)}
                onMouseEnter={() => setResultIndex(i)}
            >
                <Text color="gray" size={0} el="div" ellipsis>
                    {title}
                </Text>
                <Text color="dark" size={0} el="div" ellipsis>
                    by <strong>{campaign.name}</strong>
                </Text>
            </PostResultLink>
        )
    }

    _renderMoreResults = (isSelected, nShownResults) => {
        const { setResultIndex } = this.props
        const searchUrl = `/search?q=${this.props.searchText}`

        return (
            <MoreResults
                onClick={() => (window.location.href = searchUrl)}
                selected={isSelected}
                key="moreResults"
                onMouseEnter={() => setResultIndex(nShownResults)}
            >
                <TextButton
                    size={0}
                    href={searchUrl}
                    onClick={() => logSearchEvent(SEARCH_EVENTS.VIEW_ALL)}
                >
                    See All Results
                </TextButton>
            </MoreResults>
        )
    }

    renderSearchMenuContent = () => {
        let content = []
        const { navigationSearch } = this.props.nion
        const { resultIndex, searchText } = this.props
        const { results } = getDataOrNot(navigationSearch)

        // Only display results when results have been fetched (algolia returns our results in
        // an object with two index keys, one for campaigns, one for posts)
        if (
            !searchText ||
            !(results && results[0] && results[1]) ||
            navigationSearch.isLoading
        ) {
            return null
        }

        const numResults = results[0].hits.length + results[1].hits.length
        if (numResults === 0) {
            content = (
                <EmptySearchResultsList>
                    <Text weight="normal" ellipsis>
                        No results for <strong>{searchText}</strong>
                    </Text>
                </EmptySearchResultsList>
            )
        } else {
            const showMoreResults = numResults > MAX_CAMPAIGNS + MAX_POSTS

            // Show the top MAX_CAMPAIGNS campaigns.
            // The remaining results are posts.
            const campaigns = results[0].hits.slice(0, MAX_CAMPAIGNS)
            const posts = results[1].hits.slice(0, MAX_POSTS)

            const campaignResults = campaigns.map((campaign, i) =>
                this._renderCampaignResult(campaign, i),
            )
            const postResults = posts.map((post, i) =>
                this._renderPostResult(post, campaigns.length + i),
            )

            content = content.concat(campaignResults).concat(postResults)

            if (showMoreResults) {
                const nShownResults = campaigns.length + posts.length
                const isSelected = nShownResults === resultIndex
                content.push(this._renderMoreResults(isSelected, nShownResults))
            }
        }

        // When you click on the search menu, it shouldn't close (ie the focus of the input should
        // be maintained) -> we pass in an onClick fn that maintains focus on the search input
        return (
            <SearchMenu key="menu" onClick={this.props.onClick}>
                {content}
            </SearchMenu>
        )
    }

    render() {
        const { isOpen } = this.props

        return (
            <TransitionGroup>
                <CSSTransition
                    key="search-menu-transition-group"
                    classNames="searchResults"
                    timeout={{ enter: 70, exit: 70 }}
                >
                    <div>{isOpen && this.renderSearchMenuContent()}</div>
                </CSSTransition>
            </TransitionGroup>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/SearchResults/index.js