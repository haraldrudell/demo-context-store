import t from 'prop-types'
import React, { Component } from 'react'
import nion from 'nion'
import { withState } from 'recompose'
import debounce from 'lodash/debounce'
import getWindow from 'utilities/get-window'
import getDataOrNot from 'utilities/get-data-or-not'

const windowOrFixture = getWindow()

import Block from 'components/Layout/Block'
import LoadingSpinner from 'components/LoadingSpinner'

import NavbarIcon from '../Icon'
import SearchResults from '../SearchResults'

import { logSearchEvent, logSelectSearchNavEvent } from '../../events'
import {
    fixUrl,
    makeSearchPayload,
    config as searchConfig,
    MAX_CAMPAIGNS,
    MAX_POSTS,
} from 'utilities/search'

import { Form } from './styled-components'

import { SEARCH_EVENTS } from 'analytics/search'

@nion(() => ({
    navigationSearch: {
        endpoint: searchConfig.endpoint,
        headers: {
            'X-Algolia-API-Key': searchConfig.apiKey,
            'X-Algolia-Application-Id': searchConfig.appId,
        },
        apiType: 'api',
    },
}))
@withState('searchResultsOpen', 'setSearchResultsOpen', false)
@withState('searchText', 'setSearchText', '')
@withState('hasStartedSearch', 'setHasStartedSearch', false)
@withState('resultIndex', 'setResultIndex', -1)
export default class Search extends Component {
    static propTypes = {
        hasStartedSearch: t.bool,
        isLoggedIn: t.bool,
        resultIndex: t.number,
        searchResultsOpen: t.bool,
        searchText: t.string,
        setHasStartedSearch: t.func,
        setResultIndex: t.func,
        setSearchResultsOpen: t.func,
        setSearchText: t.func,
    }

    _selectResult = e => {
        const {
            searchResultsOpen,
            searchText,
            resultIndex,
            setResultIndex,
        } = this.props
        const { results } = getDataOrNot(this.props.nion.navigationSearch)
        if (!searchResultsOpen || !results) {
            return
        }

        const numResults = results[0].hits.length + results[1].hits.length
        const showMoreResults = numResults > MAX_CAMPAIGNS + MAX_POSTS
        const renderedResults = results[0].hits
            .slice(0, MAX_CAMPAIGNS)
            .concat(results[1].hits.slice(0, MAX_POSTS))
        const maxIndex = renderedResults.length + (showMoreResults ? 0 : -1)

        switch (e.keyCode) {
            case 38: // Up-arrow
                setResultIndex(resultIndex <= 0 ? maxIndex : resultIndex - 1)
                break
            case 40: // Down-arrow
                setResultIndex(resultIndex === maxIndex ? 0 : resultIndex + 1)
                break
            case 13: // Enter
                e.preventDefault()
                const selectedResult = renderedResults[resultIndex]
                if (selectedResult) {
                    logSelectSearchNavEvent(selectedResult, resultIndex)
                    window.location = fixUrl(
                        selectedResult.url || selectedResult.patreonUrl,
                    )
                } else {
                    window.location = `/search?q=${searchText}`
                }
                break
            case 27: // Escape
                e.preventDefault()
                this.blurSearch()
        }
    }

    debouncedHandleSearchChange = debounce(() => {
        const {
            setHasStartedSearch,
            setSearchText,
            setResultIndex,
        } = this.props
        const { navigationSearch } = this.props.nion
        const searchText = this._searchInput.value
        setSearchText(searchText)
        setResultIndex(-1)

        // We don't want to search for an empty string, but we want to display no results
        if (searchText === '') {
            return navigationSearch.actions.updateRef({})
        }

        const searchPayload = makeSearchPayload(searchText)

        navigationSearch.actions
            .post(searchPayload)
            .then(() => {
                setHasStartedSearch(false)
            })
            .catch(() => {
                setHasStartedSearch(false)
            })
    }, 200)

    // We want "instant feedback" for the loading icon to start spinning, but we still want to
    // debounce the actual API requests
    handleSearchChange = e => {
        const { setHasStartedSearch } = this.props
        if (e.target.value) {
            // Only start the search spinner when the input has text
            // But you want a "little bit" of a delay to make it feel natural
            setTimeout(() => setHasStartedSearch(true), 50)
        } else {
            // Make sure we turn search indicator off when text has been deleted
            setTimeout(() => setHasStartedSearch(false), 50)
        }
        this.debouncedHandleSearchChange(e)
    }

    focusSearch = () => {
        this._searchInput.focus()
        this.props.setSearchResultsOpen(true)
        logSearchEvent(SEARCH_EVENTS.FOCUS)
    }

    blurSearch = () => {
        this._searchInput.blur()
        setTimeout(() => this.props.setSearchResultsOpen(false), 50)
        this.props.setResultIndex(-1)
        logSearchEvent(SEARCH_EVENTS.BLUR)
    }

    // We need to make sure that clicking on a result in the results menu doesn't close the search
    // menu / shrink the search box.
    debouncedSetSearchFocus = debounce((toFocus, from) => {
        const { searchResultsOpen } = this.props

        if (toFocus && !searchResultsOpen) {
            this.focusSearch()
        } else if (!toFocus) {
            this.blurSearch()
        }
    }, 200)

    render() {
        const url = `https://${windowOrFixture.patreon.webServer}/search`
        const {
            hasStartedSearch,
            isLoggedIn,
            searchResultsOpen,
            resultIndex,
            searchText,
            setResultIndex,
        } = this.props
        const { navigationSearch } = this.props.nion

        const isLoading = navigationSearch.request.isLoading || hasStartedSearch

        return (
            <Form
                method="GET"
                action={url}
                isLoggedIn={isLoggedIn}
                isOpen={searchResultsOpen}
            >
                <Block
                    onClick={() => this.debouncedSetSearchFocus(true, 'icon')}
                >
                    {isLoading ? (
                        <LoadingSpinner size="sm" />
                    ) : (
                        <NavbarIcon type="search" color="gray1" width={2} />
                    )}
                </Block>
                <SearchResults
                    onClick={() =>
                        this.debouncedSetSearchFocus(true, 'results')}
                    isOpen={searchResultsOpen}
                    searchText={searchText}
                    resultIndex={resultIndex}
                    setResultIndex={setResultIndex}
                />
                <input
                    autoComplete="off"
                    name="q"
                    type="search"
                    placeholder="Search"
                    onChange={this.handleSearchChange}
                    ref={ref => (this._searchInput = ref)}
                    onFocus={() => this.debouncedSetSearchFocus(true, 'input')}
                    onBlur={() => this.debouncedSetSearchFocus(false, 'input')}
                    onKeyDown={this._selectResult}
                />
            </Form>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/Search/index.jsx