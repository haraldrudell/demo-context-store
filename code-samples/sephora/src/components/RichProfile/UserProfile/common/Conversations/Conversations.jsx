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
    Sephora.Util.InflatorComps.Comps['Conversations'] = function Conversations(){
        return ConversationsClass;
    }
}
/* eslint-disable max-len */
const { lineHeights, space } = require('style');
const { Box, Flex, Grid, Image, Text } = require('components/display');
const Link = require('components/Link/Link');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Divider = require('components/Divider/Divider');
const Ellipsis = require('components/Ellipsis/Ellipsis');
const IconWrite = require('components/Icon/IconWrite');
const dateUtils = require('utils/Date');
const SectionContainer = require('../SectionContainer/SectionContainer');
const communityUtils = require('utils/Community');
const communitySiteHost = Sephora.configurationSettings.communitySiteHost;
const SOCIAL_PROVIDERS = communityUtils.PROVIDER_TYPES;
const COMMUNITY_URLS = communityUtils.COMMUNITY_URLS;

const Conversations = function () {};

Conversations.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const isDesktop = Sephora.isDesktop();

    const {
        conversations,
        isFeatured,
        socialId,
        nickname,
        isPrivate
    } = this.props;

    let viewAllUrl = isFeatured || !conversations.length ? `//${communitySiteHost}` :
        `${COMMUNITY_URLS.CONVERSATIONS}${socialId}?isMyPost=true`;

    const lineHeight = lineHeights[2];

    return (
        <SectionContainer
            hasDivider={true}
            title={isPrivate ? isFeatured ? 'Featured Posts' : 'My Posts' : 'Posts'}
            link={!isPrivate && !conversations.length ? null : viewAllUrl}
            intro={isFeatured ?
                `Every beauty talks. Ask questions, post answers, and be part
                of conversations with real people like you.`
            : null}>
            {!isPrivate && !conversations.length ?
                <Box
                    fontSize={isMobile ? 'h4' : 'h3'}
                    textAlign={isMobile ? 'left' : 'center'}>
                    <Text
                        is='p'
                        color='gray'
                        marginBottom='1em'>
                        {nickname} hasn’t posted any conversations yet.
                    </Text>
                    <Link
                        padding={space[3]}
                        margin={-space[3]}
                        arrowDirection='right'
                        href={'https://' + communitySiteHost}>
                        Explore all conversations
                    </Link>
                </Box>
                :
                <div>
                    <Grid
                        gutter={isDesktop ? space[5] : null}>
                    { conversations.map(conversation => {
                        let isReply = conversation.topic && conversation.id !== conversation.topic.id;
                        const body = (
                            <div>
                                <Ellipsis
                                    text='read more'
                                    lineHeight={lineHeight}
                                    isLink={true}
                                    numberOfLines={conversation.images.length !== 0 &&
                                        isMobile ? 2 : 4}>
                                    {conversation.body}
                                </Ellipsis>
                                {conversation.images.length !== 0 &&
                                    <Box
                                        whiteSpace='nowrap'
                                        marginTop={space[4]}
                                        overflow='hidden'>
                                        {conversation.images.slice(0, 2).map(image =>
                                            <Image
                                                src={image.thumbnail.url}
                                                height={110}
                                                marginRight={space[4]} />
                                        )}
                                    </Box>
                                }
                            </div>
                        );
                        return (
                        <Grid.Cell
                            width={isDesktop ? '50%' : null}>
                            <Box
                                href={'https://' +
                                    communitySiteHost +
                                    (conversation.topic ? conversation.topic.topic_url : conversation.topic_url)}
                                lineHeight={lineHeight}
                                _css={isDesktop ? {
                                    boxShadow: '0 0 5px 0 rgba(0,0,0,0.15)',
                                    padding: space[4]
                                } : {}}>
                                <Flex
                                    fontSize='h5'
                                    justifyContent='space-between'
                                    marginBottom={space[1]}>
                                    <Text>
                                        {isReply ? 'Reply in ' : 'Post in '}
                                        <b>{conversation.board.title}</b>
                                    </Text>
                                    <Text color='silver'>
                                        {dateUtils.formatSocialDate(conversation.post_time)}
                                    </Text>
                                </Flex>
                                <Text
                                    is='h3'
                                    fontSize={isMobile ? 'h3' : 'h1'}
                                    fontWeight={700}
                                    marginBottom='.25em'>
                                    {isReply
                                        ? conversation.topic.subject
                                        : conversation.subject
                                    }
                                </Text>
                                {isReply ?
                                    <div>
                                        <Text
                                            is='p'
                                            truncate={true}
                                            color='silver'>
                                            {conversation.topic.body}
                                        </Text>
                                        <Box
                                            border={1}
                                            borderColor='lightGray'
                                            marginTop={space[4]}
                                            padding={space[4]}>
                                            {body}
                                        </Box>
                                    </div>
                                :
                                    body
                                }
                            </Box>
                        </Grid.Cell>);
                    }
                    )}
                    </Grid>
                    {isMobile &&
                        <Divider marginY={space[4]} />
                    }
                    <Box
                        textAlign='center'
                        marginTop={isDesktop ? space[6] : null}>
                        <ButtonPrimary
                            size={isDesktop ? 'lg' : null}
                            minWidth={isDesktop ? '20em' : null}
                            block={Sephora.isMobile()}
                            onClick={() =>
                                communityUtils.socialCheckLink(
                                    'https://'+ communitySiteHost,
                                    SOCIAL_PROVIDERS.bv)
                            }>
                            <IconWrite
                                fontSize='1.375em'
                                marginRight='.75em' />
                            Start a Conversation
                        </ButtonPrimary>
                    </Box>
                </div>
            }

        </SectionContainer>
    );
};


// Added by sephora-jsx-loader.js
Conversations.prototype.path = 'RichProfile/UserProfile/common/Conversations';
// Added by sephora-jsx-loader.js
Object.assign(Conversations.prototype, require('./Conversations.c.js'));
var originalDidMount = Conversations.prototype.componentDidMount;
Conversations.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Conversations');
if (originalDidMount) originalDidMount.apply(this);
if (Conversations.prototype.ctrlr) Conversations.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Conversations');
// Added by sephora-jsx-loader.js
Conversations.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Conversations.prototype.class = 'Conversations';
// Added by sephora-jsx-loader.js
Conversations.prototype.getInitialState = function() {
    Conversations.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Conversations.prototype.render = wrapComponentRender(Conversations.prototype.render);
// Added by sephora-jsx-loader.js
var ConversationsClass = React.createClass(Conversations.prototype);
// Added by sephora-jsx-loader.js
ConversationsClass.prototype.classRef = ConversationsClass;
// Added by sephora-jsx-loader.js
Object.assign(ConversationsClass, Conversations);
// Added by sephora-jsx-loader.js
module.exports = ConversationsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/common/Conversations/Conversations.jsx