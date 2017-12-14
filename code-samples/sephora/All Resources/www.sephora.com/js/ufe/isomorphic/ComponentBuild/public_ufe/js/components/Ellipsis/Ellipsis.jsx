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
    Sephora.Util.InflatorComps.Comps['Ellipsis'] = function Ellipsis(){
        return EllipsisClass;
    }
}
const { Box } = require('components/display');
const Link = require('components/Link/Link');

const Ellipsis = function () {
    this.setState({
        showEllipsis: false,
        height: null
    });
};

Ellipsis.prototype.render = function () {
    const {
        numberOfLines,
        text = '',
        isLink,
        isToggle,
        isFixedHeight,
        children,
        htmlContent,
        ...props
    } = this.props;

    const dotText = '…' + text;
    const containerHeight = this.state.height;

    return (
        <Box
            {...props}
            position='relative'
            overflow='hidden'
            baseStyle={{
                wordWrap: 'break-word'
            }}
            style={isFixedHeight ? {
                height: containerHeight
            } : {
                maxHeight: containerHeight
            }}>
            {htmlContent ?
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                : children
            }
            {this.state.showEllipsis &&
                <Box
                    position='absolute'
                    right={0} bottom={0}
                    backgroundColor='white'
                    _css={{
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: '100%',
                            bottom: 0,
                            width: '1em',
                            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0), #FFFFFF)'
                        }
                    }}>
                    {isLink || isToggle ?
                        <Link
                            primary={true}
                            onClick={isToggle ? this.toggle : null}>
                            {dotText}
                        </Link>
                    : dotText}
                </Box>
            }
        </Box>
    );
};

Ellipsis.prototype.propTypes = {
    /** Max number of lines to show */
    numberOfLines: React.PropTypes.number.isRequired,
    /** Optional text after ellipsis */
    text: React.PropTypes.string,
    /** Optional display as primary link */
    isLink: React.PropTypes.bool,
    /** Optional: toggle truncation */
    isToggle: React.PropTypes.bool,
    /** Optional; set `height` instead of `maxHeight` */
    isFixedHeight: React.PropTypes.string
};


// Added by sephora-jsx-loader.js
Ellipsis.prototype.path = 'Ellipsis';
// Added by sephora-jsx-loader.js
Object.assign(Ellipsis.prototype, require('./Ellipsis.c.js'));
var originalDidMount = Ellipsis.prototype.componentDidMount;
Ellipsis.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Ellipsis');
if (originalDidMount) originalDidMount.apply(this);
if (Ellipsis.prototype.ctrlr) Ellipsis.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Ellipsis');
// Added by sephora-jsx-loader.js
Ellipsis.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Ellipsis.prototype.class = 'Ellipsis';
// Added by sephora-jsx-loader.js
Ellipsis.prototype.getInitialState = function() {
    Ellipsis.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Ellipsis.prototype.render = wrapComponentRender(Ellipsis.prototype.render);
// Added by sephora-jsx-loader.js
var EllipsisClass = React.createClass(Ellipsis.prototype);
// Added by sephora-jsx-loader.js
EllipsisClass.prototype.classRef = EllipsisClass;
// Added by sephora-jsx-loader.js
Object.assign(EllipsisClass, Ellipsis);
// Added by sephora-jsx-loader.js
module.exports = EllipsisClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Ellipsis/Ellipsis.jsx