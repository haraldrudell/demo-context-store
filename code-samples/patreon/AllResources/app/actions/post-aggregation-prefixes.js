import randomItemFromArray from 'utilities/random-item-from-array'
import { PROMOTION_HOOK_PREFIXES } from 'constants/promotions'

export const POST_AGGREGATION_PREFIXES = 'POST_AGGREGATION_PREFIXES'

export const generatePostAggregationPrefixes = (streamPosts, postAggregationConfig) => {
    let iterationDisplayCount = postAggregationConfig.startIndex
    const postAggregationPrefixes = streamPosts.reduce((memo, post, i) => {
        if (i === iterationDisplayCount) {
            memo.push(randomItemFromArray(PROMOTION_HOOK_PREFIXES))
            iterationDisplayCount += postAggregationConfig.displayEveryNthPost
        }
        return memo
    }, [])
    return {
        type: POST_AGGREGATION_PREFIXES,
        payload: {
            postAggregationPrefixes: postAggregationPrefixes
        }
    }
}



// WEBPACK FOOTER //
// ./app/actions/post-aggregation-prefixes.js