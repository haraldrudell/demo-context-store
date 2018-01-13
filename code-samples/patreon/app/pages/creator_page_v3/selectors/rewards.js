import { createSelector } from 'reselect'

import get from 'lodash/get'
import pick from 'lodash/pick'

export default createSelector(
    [
        state => state.creator,
        state => state.entities['reward-item'],
        state => state.entities.reward,
    ],
    (creator, itemEntities, rewardEntities) => {
        return creator.rewards.reduce((memo, rewardRef) => {
            if (rewardRef.id < 1) {
                return memo
            }
            let reward = rewardEntities[rewardRef.id]
            let items = get(
                reward.relationships,
                'items.data',
                [],
            ).map(item => {
                return pick(
                    get(itemEntities[item.id], 'attributes'),
                    'imageUrl',
                    'title',
                )
            })
            const remaining = get(reward.attributes, 'remaining')

            reward = {
                id: reward.id,
                isSoldOut: typeof remaining === 'number' && remaining <= 0,
                items,
                ...pick(
                    reward.attributes,
                    'amountCents',
                    'patronCount',
                    'userLimit',
                    'title',
                    'description',
                    'url',
                    'discordRoleIds',
                    'isTwitchReward',
                    'published',
                    'imageUrl',
                ),
            }
            memo.push(reward)
            return memo
        }, [])
    },
)



// WEBPACK FOOTER //
// ./app/pages/creator_page_v3/selectors/rewards.js