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
    Sephora.Util.InflatorComps.Comps['Birthday'] = function Birthday(){
        return BirthdayClass;
    }
}
const space = require('style').space;
const { Text } = require('components/display');
const Link = require('components/Link/Link');

const ContentHeading = require('../ContentHeading');
const ContentDivider = require('../ContentDivider');

const dateUtils = require('utils/Date');

const Birthday = function () { };

Birthday.prototype.render = function () {
    const bi = this.props.biAccount;

    const PHONE_NUMBER = '18777374072';

    const birthday =
        bi.birthYear === '1800' ?
            `${dateUtils.getLongMonth(bi.birthMonth)} ${bi.birthDay}`
        :
            `${dateUtils.getLongMonth(bi.birthMonth)} ${bi.birthDay} ${bi.birthYear}`;

    const phoneLink = Sephora.isMobile()
        ?
        <Link
            primary={true}
            href={`tel:${PHONE_NUMBER}`}>
            1-877-SEPHORA
        </Link>
        :
        <Text
            display='inline-block'>
            1-877-SEPHORA
        </Text>;

    return (
        <div>
            <ContentHeading>
                Your birthday
            </ContentHeading>
            <Text
                is='p'
                marginTop={space[4]}>
                {birthday}
            </Text>
            <ContentDivider />
            <Text is='p'>
                If you need to change your birth date, please call Sephora at {phoneLink}
            </Text>
        </div>
    );
};


// Added by sephora-jsx-loader.js
Birthday.prototype.path = 'RichProfile/EditMyProfile/Content/Birthday';
// Added by sephora-jsx-loader.js
Birthday.prototype.class = 'Birthday';
// Added by sephora-jsx-loader.js
Birthday.prototype.getInitialState = function() {
    Birthday.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Birthday.prototype.render = wrapComponentRender(Birthday.prototype.render);
// Added by sephora-jsx-loader.js
var BirthdayClass = React.createClass(Birthday.prototype);
// Added by sephora-jsx-loader.js
BirthdayClass.prototype.classRef = BirthdayClass;
// Added by sephora-jsx-loader.js
Object.assign(BirthdayClass, Birthday);
// Added by sephora-jsx-loader.js
module.exports = BirthdayClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/Content/Birthday/Birthday.jsx