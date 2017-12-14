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
    Sephora.Util.InflatorComps.Comps['Group'] = function Group(){
        return GroupClass;
    }
}
const { lineHeights, space } = require('style');
const { Box, Flex, Image, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const Embed = require('components/Embed/Embed');
const Ellipsis = require('components/Ellipsis/Ellipsis');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const IconChat = require('components/Icon/IconChat');
const communityUtils = require('utils/Community');
const communitySiteHost = Sephora.configurationSettings.communitySiteHost;


const Group = function () {
    this.state = { isGroupMember: null };
};

Group.prototype.render = function () {
    const {
        group,
        isFeaturedGroups,
        isPublic,
        nickname
    } = this.props;

    const imageSource = 'https://' + communitySiteHost + group.image;
    const groupUrl = 'https://' + communitySiteHost + group.group_url;

    let isGroupMember = this.state.isGroupMember !== null ?
        this.state.isGroupMember : this.props.isGroupMember;

    let groupFollowers = this.state.groupFollowers ? this.state.groupFollowers :
        group.followers;

    const pad = Sephora.isMobile() ? space[3] : space[4];
    const lineHeight = lineHeights[2];

    return (
        <Flex
            lineHeight={lineHeight}
            flexDirection='column'
            width={1}
            padding={pad}
            boxShadow='0 0 5px 0 rgba(0,0,0,0.15)'
            rounded={2}>
            <Box
                href={groupUrl}>
                <Box
                    maxWidth={Sephora.isMobile() ? 140 : null}
                    marginX='auto'
                    marginBottom='1em'>
                    <Embed>
                        <Image
                            src={imageSource}
                            circle={true} />
                    </Embed>
                </Box>
                <Text
                    is='h3'
                    fontSize={Sephora.isMobile() ? 'h3' : 'h2'}
                    fontWeight={700}
                    truncate={true}
                    marginBottom='.25em'>
                    {group.name}
                </Text>
                <Flex
                    lineHeight={1}
                    alignItems='center'
                    justifyContent='center'>
                    <Image
                        src='/img/ufe/rich-profile/icon-members.svg'
                        width='1.25em'
                        height='1.25em' />
                    <Text
                        marginLeft='.25em'
                        marginRight='1em'>
                        {groupFollowers}
                    </Text>
                    <IconChat
                        fontSize='1.125em' />
                    <Text
                        marginLeft='.25em'>
                        {group.recentconvs} new
                    </Text>
                </Flex>
                {(isFeaturedGroups || isPublic) &&
                    <Divider
                        marginY={space[3]}
                        marginX={-(pad / 2)} />
                }
            </Box>
            {(isFeaturedGroups || isPublic) &&
                <Ellipsis
                    marginY='auto'
                    lineHeight={lineHeight}
                    numberOfLines={3}
                    htmlContent={group.description} />
            }
            {(isFeaturedGroups || isPublic) &&
                <Box paddingTop={space[3]}>
                    <ButtonPrimary
                        size={Sephora.isMobile() ? 'sm' : null}
                        onClick={() =>
                        communityUtils.ensureUserIsReadyForSocialAction(
                                communityUtils.PROVIDER_TYPES.lithium).
                            then(() => {
                                this.joinGroupHandler();
                            })
                        }
                        block={true}>
                        {isGroupMember ? 'Member' : 'Join'}
                    </ButtonPrimary>
                </Box>
            }
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
Group.prototype.path = 'RichProfile/UserProfile/common/Groups/Group';
// Added by sephora-jsx-loader.js
Object.assign(Group.prototype, require('./Group.c.js'));
var originalDidMount = Group.prototype.componentDidMount;
Group.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Group');
if (originalDidMount) originalDidMount.apply(this);
if (Group.prototype.ctrlr) Group.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Group');
// Added by sephora-jsx-loader.js
Group.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Group.prototype.class = 'Group';
// Added by sephora-jsx-loader.js
Group.prototype.getInitialState = function() {
    Group.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Group.prototype.render = wrapComponentRender(Group.prototype.render);
// Added by sephora-jsx-loader.js
var GroupClass = React.createClass(Group.prototype);
// Added by sephora-jsx-loader.js
GroupClass.prototype.classRef = GroupClass;
// Added by sephora-jsx-loader.js
Object.assign(GroupClass, Group);
// Added by sephora-jsx-loader.js
module.exports = GroupClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/Groups/Group/Group.jsx