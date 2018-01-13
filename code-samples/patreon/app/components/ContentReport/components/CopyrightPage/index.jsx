import React from 'react'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

const CopyrightPage = () => (
    <div>
        <Text>
            To report copyright infringement, learn how you can submit a DMCA
            request{' '}
        </Text>
        <TextButton
            href="https://patreon.zendesk.com/hc/en-us/articles/208377833-How-do-I-send-a-DMCA-takedown-notice-"
            target="_blank"
        >
            here
        </TextButton>
        <Text>.</Text>
    </div>
)

export default CopyrightPage



// WEBPACK FOOTER //
// ./app/components/ContentReport/components/CopyrightPage/index.jsx