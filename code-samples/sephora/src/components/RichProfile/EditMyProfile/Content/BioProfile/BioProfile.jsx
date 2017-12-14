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
    Sephora.Util.InflatorComps.Comps['BioProfile'] = function BioProfile(){
        return BioProfileClass;
    }
}
const { colors, modal, shade, space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Textarea = require('components/Inputs/Textarea/Textarea');
const TextInput = require('components/Inputs/TextInput/TextInput');
const IconInstagram = require('components/Icon/IconInstagram');
const IconYoutube = require('components/Icon/IconYoutube');
const IconCamera = require('components/Icon/IconCamera');
const ContentDivider = require('../ContentDivider');

const BioProfile = function () {
    this.state = {
        avatar: this.props.socialProfile.avatar,
        avatarFile: null,
        background: this.props.socialProfile.background,
        backgroundFile: null
    };
};

const styles = {
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: shade[3],
        color: colors.white,
        fontSize: 20,
        lineHeight: 0
    },
    fileInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer',
        '&::-webkit-file-upload-button': {
            cursor: 'pointer'
        }
    },
    centerObject: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    socialIcon: {
        padding: space[1],
        marginRight: space[2],
        borderRadius: 99999,
        lineHeight: 0,
        color: colors.white,
        backgroundColor: colors.black
    }
};

BioProfile.prototype.render = function () {

    const {
        socialProfile
    } = this.props;

    const instagramLabel = (
        <Flex alignItems='center'>
            <Box _css={styles.socialIcon}>
                <IconInstagram />
            </Box>
            <Text>Instagram</Text>
        </Flex>
    );

    const youTubeLabel = (
        <Flex alignItems='center'>
            <Box _css={styles.socialIcon}>
                <IconYoutube />
            </Box>
            <Text>YouTube</Text>
        </Flex>
    );

    return (
        <div>
            <Box
                overflow='hidden'
                position='relative'
                height={142}
                margin={Sephora.isMobile() ? -modal.PADDING_MW : null}
                data-at={Sephora.debug.dataAt(`background_picture_${this.state.background}`)}
                backgroundPosition='center'
                backgroundSize='cover'
                style={{
                    backgroundImage: `url(${this.state.background})`
                }}>
                <Box _css={styles.overlay}>
                    <Box
                        position='absolute'
                        right={0} bottom={0}
                        marginRight={space[4]}
                        marginBottom={space[4]}>
                        <IconCamera />
                    </Box>
                    <Box
                        onChange={e => this.handleBackgroundUpload(e)}
                        is='input'
                        type='file'
                        _css={styles.fileInput} />
                </Box>
                <Box
                    circle={true}
                    overflow='hidden'
                    border={space[1]}
                    borderColor='white'
                    _css={styles.centerObject}>
                    <Box
                        circle={true}
                        data-at={Sephora.debug.dataAt(`user_avatar_${this.state.avatar}`)}
                        boxShadow='0 0 12px 0 rgba(150,150,150,0.25)'
                        width={90}
                        height={90}
                        backgroundPosition='center'
                        backgroundSize='cover'
                        style={{
                            backgroundImage: `url(${this.state.avatar})`
                        }} />
                    <Box
                        circle={true}
                        _css={styles.overlay}>
                        <Box
                            _css={styles.centerObject}>
                            <IconCamera />
                        </Box>
                        <Box
                            onChange={e => this.handleAvatarUpload(e)}
                            is='input'
                            type='file'
                            _css={styles.fileInput} />
                    </Box>
                </Box>
            </Box>

            <ContentDivider />

            <Textarea
                label='Biography'
                placeholder='Add a short bio'
                rows={3}
                maxLength={170}
                value={socialProfile.aboutMe}
                ref={
                    (c) => {
                        if (c !== null) {
                            this.aboutMe = c;
                        }
                    }
                } />

            <ContentDivider />

            <TextInput
                label={instagramLabel}
                placeholder='Instagram Link'
                value={socialProfile.instagram}
                ref={
                    (c) => {
                        if (c !== null) {
                            this.instagramLink = c;
                        }
                    }
                }>
            </TextInput>

            <TextInput
                label={youTubeLabel}
                placeholder='Youtube Link'
                value={socialProfile.youtube}
                ref={
                    (c) => {
                        if (c !== null) {
                            this.youtubeLink = c;
                        }
                    }
                }>
            </TextInput>
        </div>
    );
};


// Added by sephora-jsx-loader.js
BioProfile.prototype.path = 'RichProfile/EditMyProfile/Content/BioProfile';
// Added by sephora-jsx-loader.js
Object.assign(BioProfile.prototype, require('./BioProfile.c.js'));
var originalDidMount = BioProfile.prototype.componentDidMount;
BioProfile.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BioProfile');
if (originalDidMount) originalDidMount.apply(this);
if (BioProfile.prototype.ctrlr) BioProfile.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BioProfile');
// Added by sephora-jsx-loader.js
BioProfile.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BioProfile.prototype.class = 'BioProfile';
// Added by sephora-jsx-loader.js
BioProfile.prototype.getInitialState = function() {
    BioProfile.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BioProfile.prototype.render = wrapComponentRender(BioProfile.prototype.render);
// Added by sephora-jsx-loader.js
var BioProfileClass = React.createClass(BioProfile.prototype);
// Added by sephora-jsx-loader.js
BioProfileClass.prototype.classRef = BioProfileClass;
// Added by sephora-jsx-loader.js
Object.assign(BioProfileClass, BioProfile);
// Added by sephora-jsx-loader.js
module.exports = BioProfileClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/BioProfile/BioProfile.jsx