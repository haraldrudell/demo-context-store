import React from 'react'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

const RemovePledgePage = () => (
    <Text>
        To fix this issue, please contact the creator directly. If that doesn{`'`}t
        work and you want to change or delete your pledge, you can learn how to
        do that{' '}
        <TextButton
            href="https://patreon.zendesk.com/hc/en-us/articles/115002867663-How-Do-I-Delete-My-Pledge-"
            target="_blank"
        >
            here
        </TextButton>
        .
    </Text>
)

export default RemovePledgePage



// WEBPACK FOOTER //
// ./app/components/ContentReport/components/RemovePledgePage/index.jsx