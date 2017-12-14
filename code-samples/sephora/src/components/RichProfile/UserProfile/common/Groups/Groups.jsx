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
    Sephora.Util.InflatorComps.Comps['Groups'] = function Groups(){
        return GroupsClass;
    }
}
/* eslint-disable max-len */
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');
const Link = require('components/Link/Link');
const Ellipsis = require('components/Ellipsis/Ellipsis');
const Group = require('components/RichProfile/UserProfile/common/Groups/Group/Group');
const SectionContainer = require('../SectionContainer/SectionContainer');
const { COMMUNITY_URLS } = require('utils/Community');

const Groups = function () {};

Groups.prototype.render = function () {
    const {
        groups,
        isFeaturedGroups,
        isPublic,
        nickname
    } = this.props;

    const viewAllPath = () => {
        if (isFeaturedGroups || (isPublic && !groups.length)) {
            return '';
        } else if (isPublic) {
            return `?username=${nickname}`;
        } else {
            return '?pageType=my-group';
        }
    };
    const viewAllUrl = `${COMMUNITY_URLS.GROUPS}${viewAllPath()}`;
    const groupHeader = isFeaturedGroups ? 'Featured Groups' : isPublic ? 'Groups' :
        'My Groups';

    return (
        <SectionContainer
            title={groupHeader}
            link={isPublic && !groups.length ? null : viewAllUrl}
            intro={isFeaturedGroups ?
                `You’re in good company. Join groups to discover inspiring content
                and meet like-minded Beauty Insider members.`
            : null}>
            {isPublic && !groups.length ?
                <Box
                    fontSize={Sephora.isMobile() ? 'h4' : 'h3'}
                    textAlign={Sephora.isMobile() ? 'left' : 'center'}>
                    <Text
                        is='p'
                        color='gray'
                        marginBottom='1em'>
                        {nickname} hasn’t joined any groups yet.
                    </Text>
                    <Link
                        padding={space[3]}
                        margin={-space[3]}
                        arrowDirection='right'
                        href={viewAllUrl}>
                        Explore all groups
                    </Link>
                </Box>
                :
                <Grid
                    gutter={Sephora.isMobile() ? space[3] : space[4]}>
                    {groups.map(group => {
                        let isSuscribed = false;

                        if (group.user_context) {
                            isSuscribed = group.user_context.isSubscribed;
                        }
                        return <Grid.Cell
                            textAlign='center'
                            display='flex'
                            fontSize={Sephora.isMobile() ? 'h5' : 'h4'}
                            width={Sephora.isMobile() ? 1 / 2 : 1 / 4}>
                            <Group
                                group={group}
                                isGroupMember={isPublic && groups.length &&
                                    group.user_context &&
                                    group.user_context.isSubscribed || null}
                                isFeaturedGroups={isFeaturedGroups}
                                isPublic={isPublic}
                                nickname={nickname} />
                        </Grid.Cell>;
                    }
                    )}
                </Grid>
            }
        </SectionContainer>
    );
};


// Added by sephora-jsx-loader.js
Groups.prototype.path = 'RichProfile/UserProfile/common/Groups';
// Added by sephora-jsx-loader.js
Object.assign(Groups.prototype, require('./Groups.c.js'));
var originalDidMount = Groups.prototype.componentDidMount;
Groups.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Groups');
if (originalDidMount) originalDidMount.apply(this);
if (Groups.prototype.ctrlr) Groups.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Groups');
// Added by sephora-jsx-loader.js
Groups.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Groups.prototype.class = 'Groups';
// Added by sephora-jsx-loader.js
Groups.prototype.getInitialState = function() {
    Groups.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Groups.prototype.render = wrapComponentRender(Groups.prototype.render);
// Added by sephora-jsx-loader.js
var GroupsClass = React.createClass(Groups.prototype);
// Added by sephora-jsx-loader.js
GroupsClass.prototype.classRef = GroupsClass;
// Added by sephora-jsx-loader.js
Object.assign(GroupsClass, Groups);
// Added by sephora-jsx-loader.js
module.exports = GroupsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/Groups/Groups.jsx