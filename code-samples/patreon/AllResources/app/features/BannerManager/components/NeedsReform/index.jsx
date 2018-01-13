import React from 'react'

import Alert from 'components/Alert'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

const LEARN_MORE_LINK =
    'https://patreon.zendesk.com/knowledge/articles/115005078886/en-us?brand_id=1192766'

const NeedsReform = () => (
    <Alert>
        <Text el="h3" color="error" size={2} weight="bold" noMargin>
            Your account has been temporarily suspended.
        </Text>
        <Text el="p">
            Please get in contact with our Trust &amp; Safety team to review
            your page at{' '}
            <TextButton href="mailto:guidelines@patreon.com" target="_top">
                guidelines@patreon.com
            </TextButton>.
            <br />
            You can learn more{' '}
            <TextButton href={LEARN_MORE_LINK}>here</TextButton>.
        </Text>
    </Alert>
)

export default NeedsReform



// WEBPACK FOOTER //
// ./app/features/BannerManager/components/NeedsReform/index.jsx