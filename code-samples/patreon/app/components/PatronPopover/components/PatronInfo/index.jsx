/* eslint-disable react/no-multi-comp */
import t from 'prop-types'

import React from 'react'
import formatCurrencyFromCents from 'utilities/format-currency-from-cents'
import Flexy from 'components/Layout/Flexy'
import Block from 'components/Layout/Block'
import Text from 'components/Text'

const PatronInfo = ({
    rewardTier,
    pledgeAmountCents,
    lifetimeSupportCents,
}) => {
    const makeItem = (label, value, size, fullWidth) =>
        <Flexy direction="column">
            <Text size={-1} uppercase weight="bold">
                {label}
            </Text>
            <Text size={size} data-tag="patron-popover-value">
                {value}
            </Text>
        </Flexy>

    const pledgeAmountDollars = formatCurrencyFromCents(pledgeAmountCents)
    return (
        <Block pt={3}>
            <Block pb={2}>
                {makeItem('Reward', rewardTier, 1, true)}
            </Block>
            <Block>
                <Flexy direction="row" justifyContent="space-between">
                    {makeItem('Current pledge', pledgeAmountDollars, 2)}
                    {makeItem(
                        'Lifetime support',
                        formatCurrencyFromCents(lifetimeSupportCents),
                        2,
                    )}
                </Flexy>
            </Block>
        </Block>
    )
}
PatronInfo.propTypes = {
    rewardTier: t.string,
    pledgeAmountCents: t.number,
    lifetimeSupportCents: t.number,
}

export default PatronInfo



// WEBPACK FOOTER //
// ./app/components/PatronPopover/components/PatronInfo/index.jsx