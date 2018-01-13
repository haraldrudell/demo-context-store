import React, { Component } from 'react'

import UserMediaObject from 'components/UserMediaObject'

export default class UserMediaItem extends Component {
    render() {
        return (
            <UserMediaObject
                {...this.props}
                primaryTextColor="light"
                subduedNonPrimaryText
            />
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/AdminPanel/components/UserMediaItem/index.jsx