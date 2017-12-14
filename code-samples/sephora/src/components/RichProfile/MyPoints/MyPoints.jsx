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
    Sephora.Util.InflatorComps.Comps['MyPoints'] = function MyPoints(){
        return MyPointsClass;
    }
}
const ProfileTopNav = require('components/RichProfile/ProfileTopNav/ProfileTopNav');
const BiTopBar = require('components/BiTopBar/BiTopBar');
const BiFullSection = require('components/BiTopBar/BiFullSection/BiFullSection');
const AllBankActivity = require('components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/AllBankActivity/AllBankActivity');

const MyPoints = function () {
    this.state = {
        isUserBi: false,
        user: null,
        isAnonymous: true
    };
};

MyPoints.prototype.render = function () {
    return (
        <div>
            <ProfileTopNav section='bi' />
            {
                (this.state.user && this.state.isUserBi) &&
                <div>
                    <BiTopBar>
                        <BiFullSection
                            user={this.state.user}
                            isShowViewActivity={false} />
                    </BiTopBar>
                    <AllBankActivity user={this.state.user} />
                </div>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
MyPoints.prototype.path = 'RichProfile/MyPoints';
// Added by sephora-jsx-loader.js
Object.assign(MyPoints.prototype, require('./MyPoints.c.js'));
var originalDidMount = MyPoints.prototype.componentDidMount;
MyPoints.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: MyPoints');
if (originalDidMount) originalDidMount.apply(this);
if (MyPoints.prototype.ctrlr) MyPoints.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: MyPoints');
// Added by sephora-jsx-loader.js
MyPoints.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
MyPoints.prototype.class = 'MyPoints';
// Added by sephora-jsx-loader.js
MyPoints.prototype.getInitialState = function() {
    MyPoints.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
MyPoints.prototype.render = wrapComponentRender(MyPoints.prototype.render);
// Added by sephora-jsx-loader.js
var MyPointsClass = React.createClass(MyPoints.prototype);
// Added by sephora-jsx-loader.js
MyPointsClass.prototype.classRef = MyPointsClass;
// Added by sephora-jsx-loader.js
Object.assign(MyPointsClass, MyPoints);
// Added by sephora-jsx-loader.js
module.exports = MyPointsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyPoints/MyPoints.jsx