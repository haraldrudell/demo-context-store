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
    Sephora.Util.InflatorComps.Comps['UploadMedia'] = function UploadMedia(){
        return UploadMediaClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const IconCross = require('components/Icon/IconCross');
const uIUtils = require('utils/UI');

/*eslint quotes: 0*/
const backgroundImageUrl =
    `url('data:image/svg+xml,%3Csvg ` +
    `viewBox="0 0 20 20" ` +
    `xmlns="http://www.w3.org/2000/svg"%3E%3Cpath ` +
    `d="M17 7.5H9.5V0h-2v7.5H0v2h7.5V17h2V9.5H17"/%3E%3C/svg%3E')`;

let UploadMedia = function () {
    this.state = {
        maxPhotos: 2,
        media: {},
        errors: []
    };
};

UploadMedia.prototype.getFilePicker = function (key) {
    let thumbnailUrl = this.state.media[key];

    return (
        <Box
            key={key}
            position='relative'
            backgroundColor='nearWhite'
            rounded={true}
            width={102}
            height={102}
            marginRight={space[4]}>
            {thumbnailUrl ?
                <Box
                    position='absolute'
                    top={0} right={0} bottom={0} left={0}
                    rounded={true}
                    backgroundPosition='center'
                    backgroundSize='cover'
                    style={{
                        backgroundImage: `url(${thumbnailUrl})`
                    }}>
                    <Box
                        is='button'
                        position='absolute'
                        top='-.5em' right='-.5em'
                        width='2em' height='2em'
                        textAlign='center'
                        lineHeight={0}
                        circle={true}
                        color='black'
                        border={2}
                        borderColor='black'
                        backgroundColor='white'
                        onClick={e => this.removeMedia(e, key)}>
                        <IconCross x={true}/>
                    </Box>
                </Box>
                :
                <Box
                    position='absolute'
                    top={0} right={0} bottom={0} left={0}
                    border={1}
                    borderColor='moonGray'
                    rounded={true}
                    color='gray'
                    hoverColor='black'
                    backgroundImage={backgroundImageUrl}
                    backgroundPosition='center'
                    backgroundRepeat='no-repeat'
                    backgroundSize={40}
                    cursor='pointer'>
                    <Box
                        onChange={e => this.handleUpload(e, key)}
                        is='input'
                        type='file'
                        position='absolute'
                        top={0} left={0}
                        width='100%' height='100%'
                        opacity={0}
                        cursor='pointer'
                        _css={{ '&::-webkit-file-upload-button': { cursor: 'pointer' } }} />
                </Box>
            }
        </Box>
    );
};

UploadMedia.prototype.render = function () {
    let { maxPhotos } = this.state;

    let currentKeys = Object.keys(this.state.media).length;
    let photoSlots = [];
    let end = currentKeys + 1 > maxPhotos ? maxPhotos : currentKeys + 1;
    for (let i = 1; i <= end; i++) {
        let elementKey = 'photourl_' + i;
        photoSlots.push(this.getFilePicker(elementKey));
    }

    return (
        <div>
            <Flex>
                {photoSlots}
            </Flex>
            <Flex>
            {this.state.errors[0] && <Text
                is='p'
                color='error'
                fontSize='h5'
                marginBottom={space[3]}>
                {this.state.errors[0].Message}
                </Text>}
            </Flex>
        </div>
    );
};


// Added by sephora-jsx-loader.js
UploadMedia.prototype.path = 'AddReview/UploadMedia';
// Added by sephora-jsx-loader.js
Object.assign(UploadMedia.prototype, require('./UploadMedia.c.js'));
var originalDidMount = UploadMedia.prototype.componentDidMount;
UploadMedia.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: UploadMedia');
if (originalDidMount) originalDidMount.apply(this);
if (UploadMedia.prototype.ctrlr) UploadMedia.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: UploadMedia');
// Added by sephora-jsx-loader.js
UploadMedia.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
UploadMedia.prototype.class = 'UploadMedia';
// Added by sephora-jsx-loader.js
UploadMedia.prototype.getInitialState = function() {
    UploadMedia.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
UploadMedia.prototype.render = wrapComponentRender(UploadMedia.prototype.render);
// Added by sephora-jsx-loader.js
var UploadMediaClass = React.createClass(UploadMedia.prototype);
// Added by sephora-jsx-loader.js
UploadMediaClass.prototype.classRef = UploadMediaClass;
// Added by sephora-jsx-loader.js
Object.assign(UploadMediaClass, UploadMedia);
// Added by sephora-jsx-loader.js
module.exports = UploadMediaClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/UploadMedia/UploadMedia.jsx