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
    Sephora.Util.InflatorComps.Comps['BIPointsWarnings'] = function BIPointsWarnings(){
        return BIPointsWarningsClass;
    }
}
const { space } = require('style');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const Text = require('components/Text/Text');

const BIPointsWarnings = function () { };

BIPointsWarnings.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    return (
        <div>
            <Text
                is='p'
                marginBottom={!isMobile ? space[5] : null}>
                See how what you spend translate into points,
                view your reward redemptions, and more.
            </Text>
            {isMobile &&
                <Divider marginY={space[4]} />
            }
            {this.props.noPoints &&
                <Text
                    is='p'
                    textAlign={isMobile ? 'center' : null}
                    marginBottom={space[5]}
                    fontWeight={700}>
                    You do not have any Beauty Insider activity to display.
                </Text>
            }
            {this.props.expired &&
                <Text
                    is='p'
                    textAlign={isMobile ? 'center' : null}
                    marginBottom={space[5]}>
                    <b>Your points have expired.</b>
                    {' '}
                    <Link
                        block={isMobile}
                        marginTop={isMobile ? space[2] : null}
                        marginX='auto'
                        primary={true}>
                        Shop now to earn points
                    </Link>
                </Text>
            }
            {isMobile ||
                <Divider />
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
BIPointsWarnings.prototype.path = 'RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank';
// Added by sephora-jsx-loader.js
BIPointsWarnings.prototype.class = 'BIPointsWarnings';
// Added by sephora-jsx-loader.js
BIPointsWarnings.prototype.getInitialState = function() {
    BIPointsWarnings.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BIPointsWarnings.prototype.render = wrapComponentRender(BIPointsWarnings.prototype.render);
// Added by sephora-jsx-loader.js
var BIPointsWarningsClass = React.createClass(BIPointsWarnings.prototype);
// Added by sephora-jsx-loader.js
BIPointsWarningsClass.prototype.classRef = BIPointsWarningsClass;
// Added by sephora-jsx-loader.js
Object.assign(BIPointsWarningsClass, BIPointsWarnings);
// Added by sephora-jsx-loader.js
module.exports = BIPointsWarningsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/BIPointsWarnings.jsx