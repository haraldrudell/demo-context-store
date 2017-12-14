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
    Sephora.Util.InflatorComps.Comps['StarRating'] = function StarRating(){
        return StarRatingClass;
    }
}
const { colors } = require('style');
const { Box } = require('components/display');
const IconStar = require('components/Icon/IconStar');

const INACTIVE_COLOR = colors.moonGray;
const ACTIVE_COLOR = colors.black;

var StarRating = function () {
    this.state = {
        rating: this.props.rating !== undefined ? this.props.rating : 0
    };
};

StarRating.prototype.render = function () {
    let {
        rating,
        isEditable = false,
        ...props
    } = this.props;

    rating = this.state.rating;
    const starWidth = rating > 5 ? 5 : rating < 0 ? 0 : rating;

    return (
        <Box
            {...props}
            position='relative'
            overflow='hidden'
            width='5em' height='1em'
            ref={inputElement => this.inputElement = inputElement}
            lineHeight={0}
            textAlign='left'
            cursor={isEditable ? 'pointer' : null}>
            <Box
                color={INACTIVE_COLOR}
                _css={[
                    { '& > *': { float: 'right' } },
                    (isEditable && !Sephora.isTouch) && {
                        '& > *': {
                            transition: 'color .2s'
                        },
                        '& > *:hover, & > *:hover ~ *': {
                            color: ACTIVE_COLOR
                        }
                    }
                ]}>
                <IconStar onClick={ isEditable && (() => this.starClick(5)) }/>
                <IconStar onClick={ isEditable && (() => this.starClick(4)) }/>
                <IconStar onClick={ isEditable && (() => this.starClick(3)) }/>
                <IconStar onClick={ isEditable && (() => this.starClick(2)) }/>
                <IconStar onClick={ isEditable && (() => this.starClick(1)) }/>
            </Box>
            <Box
                color={ACTIVE_COLOR}
                overflow='hidden'
                position='absolute'
                top={0} left={0}
                whiteSpace='nowrap'
                _css={(isEditable && !Sephora.isTouch) ? {
                    '& > *': {
                        transition: 'color .2s'
                    },
                    '& > *:hover ~ *': {
                        color: INACTIVE_COLOR
                    }
                } : null}
                style={{
                    width: (starWidth / 5 * 100) + '%'
                }}>
                <IconStar onClick={ isEditable && (() => this.starClick(1)) }/>
                <IconStar onClick={ isEditable && (() => this.starClick(2)) }/>
                <IconStar onClick={ isEditable && (() => this.starClick(3)) }/>
                <IconStar onClick={ isEditable && (() => this.starClick(4)) }/>
                <IconStar onClick={ isEditable && (() => this.starClick(5)) }/>
            </Box>
        </Box>
    );
};

StarRating.prototype.propTypes = {
    rating: React.PropTypes.number.isRequired,
    isEditable: React.PropTypes.bool
};


// Added by sephora-jsx-loader.js
StarRating.prototype.path = 'StarRating';
// Added by sephora-jsx-loader.js
Object.assign(StarRating.prototype, require('./StarRating.c.js'));
var originalDidMount = StarRating.prototype.componentDidMount;
StarRating.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: StarRating');
if (originalDidMount) originalDidMount.apply(this);
if (StarRating.prototype.ctrlr) StarRating.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: StarRating');
// Added by sephora-jsx-loader.js
StarRating.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
StarRating.prototype.class = 'StarRating';
// Added by sephora-jsx-loader.js
StarRating.prototype.getInitialState = function() {
    StarRating.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
StarRating.prototype.render = wrapComponentRender(StarRating.prototype.render);
// Added by sephora-jsx-loader.js
var StarRatingClass = React.createClass(StarRating.prototype);
// Added by sephora-jsx-loader.js
StarRatingClass.prototype.classRef = StarRatingClass;
// Added by sephora-jsx-loader.js
Object.assign(StarRatingClass, StarRating);
// Added by sephora-jsx-loader.js
module.exports = StarRatingClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/StarRating/StarRating.jsx