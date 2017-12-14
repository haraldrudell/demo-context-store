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
    Sephora.Util.InflatorComps.Comps['Chevron'] = function Chevron(){
        return ChevronClass;
    }
}
const Base = require('components/Base/Base');

/** Chevron arrow for links/link groups + other navs */
const Chevron = function () {};

Chevron.prototype.render = function () {
    const {
        direction,
        ...props
    } = this.props;

    const up = direction === 'up';
    const down = direction === 'down';
    const left = direction === 'left';
    const right = direction === 'right';

    return (
        <Base
            {...props}
            is='svg'
            viewBox={up || down ? '0 0 95 57' : '0 95 57 95'}
            baseStyle={{
                width: up || down ? '1em' : '.5em',
                height: up || down ? '.5em' : '1em',
                verticalAlign: 'middle',
                fill: 'currentColor',
                transition: 'transform .2s',
                transform: up || left ?
                    'rotate(180deg)' : null
            }}>
            {up || down ?
                <path d='M47.5 57L95 9.5 85.5 0l-38 38-38-38L0 9.5 47.5 57z'/>
                : <path d='M57 142.5L9.5 95 0 104.5l38 38-38 38 9.5 9.5L57 142.5z'/>
            }
        </Base>
    );
};

Chevron.prototype.propTypes = {
    /** Direction of arrow */
    direction: React.PropTypes.oneOf(['up', 'down', 'left', 'right'])
};


// Added by sephora-jsx-loader.js
Chevron.prototype.path = 'Chevron';
// Added by sephora-jsx-loader.js
Chevron.prototype.class = 'Chevron';
// Added by sephora-jsx-loader.js
Chevron.prototype.getInitialState = function() {
    Chevron.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Chevron.prototype.render = wrapComponentRender(Chevron.prototype.render);
// Added by sephora-jsx-loader.js
var ChevronClass = React.createClass(Chevron.prototype);
// Added by sephora-jsx-loader.js
ChevronClass.prototype.classRef = ChevronClass;
// Added by sephora-jsx-loader.js
Object.assign(ChevronClass, Chevron);
// Added by sephora-jsx-loader.js
module.exports = ChevronClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Chevron/Chevron.jsx