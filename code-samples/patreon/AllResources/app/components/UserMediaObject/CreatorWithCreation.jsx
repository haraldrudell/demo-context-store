/**
 * Convenience for rendering a UserMediaObject from a pledge.
 */
import t from 'prop-types'

import React from 'react'

import UserMediaObject from './'
import { DEFAULT_CREATION_NAME } from 'constants/creators'

const CreatorWithCreation = ({ imageUrl, url, fullName, campaign }) => {
    const { creationName } = campaign

    const primary = fullName
    const secondary = `creating ${creationName}`

    return (
        <div className="p-sm pos-relative" title={`${primary} ${secondary}`}>
            <UserMediaObject
                avatar={imageUrl}
                primaryText={primary}
                secondaryText={secondary}
            />
            {url &&
                <a href={url} className="pos-absolute-fluid hide-text-visually">
                    <span className="hide-visually">
                        Go to {fullName}'s page
                    </span>
                </a>}
        </div>
    )
}

CreatorWithCreation.propTypes = {
    url: t.string,
    fullName: t.string.isRequired,
    imageUrl: t.string.isRequired,
    campaign: t.shape({
        creationName: t.string,
    }),
}

CreatorWithCreation.defaultProps = {
    campaign: {
        creationName: DEFAULT_CREATION_NAME,
    },
}

export default CreatorWithCreation



// WEBPACK FOOTER //
// ./app/components/UserMediaObject/CreatorWithCreation.jsx