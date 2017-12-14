// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['ReviewerInfo'] = function ReviewerInfo(){
        return ReviewerInfoClass;
    }
}
const { space } = require('style');
const { Box, Flex, Grid, Image, Text } = require('components/display');
const biUtils = require('utils/BiProfile');
const Filters = require('utils/Filters');
const Divider = require('components/Divider/Divider');
const BeautyMatchBadge = require('components/BeautyMatchBadge/BeautyMatchBadge');
const lithiumApi = require('services/api/thirdparty/Lithium');
const js = require('utils/javascript');

const ALLOWED_TRAITS = [
    biUtils.TYPES.SKIN_TONE,
    biUtils.TYPES.SKIN_TYPE,
    biUtils.TYPES.HAIR_COLOR,
    biUtils.TYPES.EYE_COLOR,
    biUtils.TYPES.AGE_RANGE,
    biUtils.TYPES.SKIN_CONCERNS,
    biUtils.TYPES.HAIR_CONCERNS,
    biUtils.TYPES.HAIR_DESCRIBE
];

let ReviewerInfo = function () {};

ReviewerInfo.prototype.render = function () {
    const isMobile = Sephora.isMobile();

    let {
        userNickname,
        biTraits,
        biTraitsOrder,
        badges,
        additionalFields,
        isCondensedView
    } = this.props;

    let sortedBiTraits;
    let biTraitsArray = biTraits && js.filterObjectValuesByKey(
        biTraits,
        key => ALLOWED_TRAITS.indexOf(key) >= 0
    );
    if (biTraitsArray && (biTraitsArray.length > 0) && (biTraitsOrder.length > 0)) {
        sortedBiTraits = biUtils.sortBiTraits(biTraitsArray, biTraitsOrder);
    } else {
        sortedBiTraits = biTraitsArray;
    }

    let socialInfo = { };

    let socialField = additionalFields.socialLockUp && additionalFields.socialLockUp.value ?
        additionalFields.socialLockUp.value.split('|') : '';

    // We are creating an object of social info from the string delimited by pipe character from BV.
    for (var prop in socialField) {
        if (hasOwnProperty.call(socialField, prop)) {
            let socialprop = socialField[prop];
            let key = socialprop.substring(0, socialprop.indexOf('='));
            let value = socialprop.substring(socialprop.indexOf('=') + 1);
            socialInfo[key] = value;
        }
    }

    if (!socialInfo.avatar) {
        socialInfo.avatar = lithiumApi.AVATAR_PHOTO_DEFAULT;
    }

    let beautyMatchBadge = sortedBiTraits &&
        this.showBeautyMatchesIcon() ?
            <BeautyMatchBadge
                marginBottom={space[1]} /> : null;

    return (
        <Box
            fontSize='h5'
            lineHeight={2}
            onClick={() => this.redirectToUserProfile(userNickname)}
            width='100%'
            marginBottom={isMobile ? space[4] : null}>
            <Grid
                gutter={space[2]}
                alignItems='center'>
                {isCondensedView ||
                <Grid.Cell
                    width='fit'>
                    <Box
                        circle={true}
                        backgroundPosition='center'
                        backgroundSize='cover'
                        border={1}
                        width={32}
                        height={32}
                        style={{
                            backgroundImage: `url(${socialInfo.avatar})`
                        }} />
                </Grid.Cell>
                }
                <Grid.Cell
                    width='fill'>
                    <Flex
                        alignItems='center'
                        fontWeight={700}>
                        <Text
                            fontSize='h4'
                            marginRight={space[2]}>
                            {userNickname}
                        </Text>
                        {isCondensedView && beautyMatchBadge}
                    </Flex>
                    {isCondensedView ||
                    <Flex
                        marginTop={space[1]}>
                        {socialInfo.biBadgeUrl && <Image
                            src={`https://${Sephora.configurationSettings.communitySiteHost}` +
                            `${socialInfo.biBadgeUrl}`}
                            height={16} />
                        }
                        {socialInfo.engagementBadgeUrl && <Image
                            src={`https://${Sephora.configurationSettings.communitySiteHost}` +
                            `${socialInfo.engagementBadgeUrl}`}
                            height={16}
                            marginLeft={space[2]} />
                        }
                    </Flex>
                    }
                </Grid.Cell>
            </Grid>

            {isCondensedView || <div>

                {(badges.StaffContextBadge || badges.IncentivizedReviewBadge) &&
                    <Box
                        marginTop={space[2]}
                        color='silver'>
                        {badges.StaffContextBadge && 'Sephora staff'}
                        {badges.StaffContextBadge && badges.IncentivizedReviewBadge &&
                            <Text marginX={space[2]}>|</Text>
                        }
                        {badges.IncentivizedReviewBadge && 'Received free sample'}
                    </Box>
                }

                {(sortedBiTraits && sortedBiTraits.length > 0) &&
                    <Box
                        marginTop={!isMobile ? space[3] : null}>

                        {isMobile &&
                            <Divider marginY={space[4]} />
                        }

                        {beautyMatchBadge}

                        {isMobile ?
                            <Grid
                                marginTop={space[1]}
                                gutter={space[4]}>
                                {sortedBiTraits.map((item, index) =>
                                    <Grid.Cell
                                        width={1 / 2}
                                        marginTop={index > 1 ? space[1] : null}>
                                        <b>{item.DimensionLabel}</b> {item.ValueLabel}
                                    </Grid.Cell>
                                )}
                            </Grid>
                        :
                            sortedBiTraits.map(item =>
                                <Box
                                    marginTop={space[1]}>
                                    <b>{item.DimensionLabel}</b> {item.ValueLabel}
                                </Box>
                            )
                        }
                        {isMobile &&
                            <Divider marginTop={space[4]} />
                        }
                    </Box>

                } </div>
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ReviewerInfo.prototype.path = 'ProductPage/RatingsAndReviews/Review';
// Added by sephora-jsx-loader.js
Object.assign(ReviewerInfo.prototype, require('./ReviewerInfo.c.js'));
var originalDidMount = ReviewerInfo.prototype.componentDidMount;
ReviewerInfo.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ReviewerInfo');
if (originalDidMount) originalDidMount.apply(this);
if (ReviewerInfo.prototype.ctrlr) ReviewerInfo.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ReviewerInfo');
// Added by sephora-jsx-loader.js
ReviewerInfo.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ReviewerInfo.prototype.class = 'ReviewerInfo';
// Added by sephora-jsx-loader.js
ReviewerInfo.prototype.getInitialState = function() {
    ReviewerInfo.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ReviewerInfo.prototype.render = wrapComponentRender(ReviewerInfo.prototype.render);
// Added by sephora-jsx-loader.js
var ReviewerInfoClass = React.createClass(ReviewerInfo.prototype);
// Added by sephora-jsx-loader.js
ReviewerInfoClass.prototype.classRef = ReviewerInfoClass;
// Added by sephora-jsx-loader.js
Object.assign(ReviewerInfoClass, ReviewerInfo);
// Added by sephora-jsx-loader.js
module.exports = ReviewerInfoClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/Review/ReviewerInfo.jsx