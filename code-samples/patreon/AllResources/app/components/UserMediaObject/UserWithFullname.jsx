import t from 'prop-types'
import React from 'react'

import UserMediaObject from './'

const UserWithFullname = ({ imageUrl, fullName, url }) => {
    return (
        <div className="p-sm pos-relative" title={fullName}>
            <UserMediaObject avatar={imageUrl} primaryText={fullName} />
            {url &&
                <a href={url} className="pos-absolute-fluid hide-text-visually">
                    <span className="hide-visually">
                        Go to {fullName}'s page
                    </span>
                </a>}
        </div>
    )
}

UserWithFullname.propTypes = {
    url: t.string,
    fullName: t.string.isRequired,
    imageUrl: t.string.isRequired,
}

export default UserWithFullname



// WEBPACK FOOTER //
// ./app/components/UserMediaObject/UserWithFullname.jsx