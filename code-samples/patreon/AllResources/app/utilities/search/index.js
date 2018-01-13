import { logSearchEvent, SEARCH_EVENTS } from 'analytics/search'

export const makeSearchPayload = (searchString, options = {}) => {
    const { page, perPage } = options
    const params =
        'query=' +
        encodeURI(searchString) +
        (page !== undefined ? '&page=' + (page - 1) : '') +
        (perPage !== undefined ? '&hitsPerPage=' + perPage : '')

    return {
        requests: [
            {
                indexName: 'campaigns',
                params,
            },
            {
                indexName: 'posts',
                params,
            },
        ],
    }
}

// We want to make sure that the url returned by Algolia is a link to the proper web domain, since
// it always returns .com
export const fixUrl = url => {
    // Match [(www. if exists)patreon.(chars up to first forward slash)
    // Replace with webserver
    return url.replace(/(www.)?patreon.[^\/]*/, window.patreon.webServer)
}

export const config = {
    apiKey: '83db986a08481e94088c75fd57d90118',
    appId: '27QC0IB0ER',
    endpoint: 'https://27QC0IB0ER.algolia.io/1/indexes/*/queries',
}

export const MAX_CAMPAIGNS = 2
export const MAX_POSTS = 3
export const MAX_RESULTS = MAX_CAMPAIGNS + MAX_POSTS

export const logSelectSearchEvent = (result, index, source) => {
    const type = result.objectID.indexOf('post') === 0 ? 'post' : 'campaign'

    let resultData = {}
    if (type === 'post') {
        resultData.post_id = result.objectID.replace('post_', '')
    } else if (type === 'campaign') {
        resultData.creator_id = result.objectID.replace('campaign_', '')
        resultData.creator_name = result.creatorName
        resultData.vanity = result.vanity
    }

    return logSearchEvent(SEARCH_EVENTS.SELECT, {
        rank: index,
        type,
        ...resultData,
        source,
        origin_pathname: window.location.pathname,
    })
}



// WEBPACK FOOTER //
// ./app/utilities/search/index.js