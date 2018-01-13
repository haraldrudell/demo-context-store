import t from 'prop-types'
import React from 'react'
import truncate from 'trunc-html'

import Avatar from 'components/Avatar'
import Text from 'components/Text'
import Flexy from 'components/Layout/Flexy'

// @TODO: Refactor all of UserMediaObject, maybe to be more like content in components/CreatorCardFeed
const UserMediaObject = ({
    avatar,
    primaryText,
    secondaryText,
    tertiaryText,
    primaryTextColor,
    subduedNonPrimaryText,
}) => {
    /**
     * Trunace primary text to roughly one line (based on col-3 width)
     * Truncate secondary text to roughly two lines (based on col-3 width)
     * @NOTE: this could use some fine tuning and possibly allowing client to determine truncating rules.
     */
    return (
        <Flexy flexDirection="row" alignItems="center" fluidWidth>
            <div className="mr-md">
                <Avatar src={avatar} size="sm" />
            </div>
            <div>
                {primaryText
                    ? <Text
                          el="div"
                          size={0}
                          weight="bold"
                          color={primaryTextColor}
                          lineHeight={1.25}
                      >
                          {truncate(primaryText, 25).html}
                      </Text>
                    : ''}
                {secondaryText
                    ? <Text
                          el="div"
                          size={0}
                          weight={subduedNonPrimaryText ? 'normal' : 'bold'}
                          color={subduedNonPrimaryText ? 'gray3' : 'gray4'}
                          lineHeight={1.25}
                      >
                          {truncate(secondaryText, 40).html}
                      </Text>
                    : ''}
                {tertiaryText
                    ? <Text
                          el="div"
                          size={0}
                          weight={subduedNonPrimaryText ? 'normal' : 'bold'}
                          color={subduedNonPrimaryText ? 'gray3' : 'gray4'}
                          lineHeight={1.25}
                      >
                          {truncate(tertiaryText, 40).html}
                      </Text>
                    : ''}
            </div>
        </Flexy>
    )
}

UserMediaObject.propTypes = {
    avatar: t.string.isRequired,
    primaryText: t.string,
    secondaryText: t.string,
    tertiaryText: t.string,
    primaryTextColor: t.string,
    subduedNonPrimaryText: t.bool,
}

export default UserMediaObject



// WEBPACK FOOTER //
// ./app/components/UserMediaObject/index.jsx