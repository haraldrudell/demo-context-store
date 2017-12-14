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
    Sephora.Util.InflatorComps.Comps['PointsNSpendGrid'] = function PointsNSpendGrid(){
        return PointsNSpendGridClass;
    }
}
const {
    colors, fontSizes, lineHeights, space, tracking
} = require('style');
const css = require('glamor').css;
const Link = require('components/Link/Link');
const dateUtils = require('utils/Date');
const getOrderDetailsUrl = require('utils/Order').getOrderDetailsUrl;

const TABLE_PADDING = space[4];

const PointsNSpendGrid = function () { };

PointsNSpendGrid.prototype.render = function () {
    const {
        activities,
        type
    } = this.props;

    const TRANSACTION_TYPES = {
        EARNED: 'Earned',
        SPEND: 'Spend'
    };

    const style = {
        width: '100%',
        borderCollapse: 'collapse',
        lineHeight: lineHeights[2],
        textAlign: 'left',
        '& th, & td': {
            paddingTop: TABLE_PADDING,
            paddingBottom: TABLE_PADDING,
            verticalAlign: 'top',
            '&:not(:first-child)': {
                backgroundColor: colors.nearWhite,
                width: '20%',
                paddingLeft: TABLE_PADDING / 2,
                paddingRight: TABLE_PADDING / 2,
                textAlign: 'center'
            },
            '&:last-child': {
                borderLeftWidth: 2,
                borderLeftStyle: 'solid',
                borderLeftColor: colors.white,
                fontWeight: 700
            }
        },
        '& th': {
            fontSize: fontSizes.h5,
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: tracking[1],
            borderBottom: `2px solid ${colors.white}`,
            paddingTop: TABLE_PADDING + 2,
            '&:first-child': {
                borderBottomColor: colors.nearWhite
            }
        },
        '& td': {
            borderBottom: `1px solid ${colors.nearWhite}`,
            '&:first-child': {
                borderBottomColor: colors.lightGray
            }
        }
    };

    const rows = activities.map(
        activity => {
            let update = activity.pointsUpdate;
            let balance = `${activity.pointsBalance} pts`;
            let symbol = '';

            if (type === TRANSACTION_TYPES.SPEND) {
                update = activity.spendUpdate;
                balance = activity.ytdSpend;
                symbol = '$';
            }

            let earnedSpendValue = () => {
                if (update === 0) {
                    return '—';
                }

                if (type === TRANSACTION_TYPES.EARNED) {
                    return `${update > 0 ? '+' : ''}${update} pts`;
                } else {
                    return update < 0 ?
                        `-${symbol}${Math.abs(update)}` :
                        `${symbol}${update}`;
                }
            };

            return (
                <tr>
                    <td>
                        <div>{dateUtils.formatDateMDY(activity.activityDate, true)}</div>
                        <div>{activity.location}</div>
                        <div>
                            {activity.activityType}
                        </div>
                        {activity.description &&
                            <div>{activity.description}</div>
                        }
                        {activity.orderID &&
                            <div>
                                Order #:
                            {' '}
                                <Link
                                    primary={true}
                                    href={getOrderDetailsUrl(activity.orderID)}>
                                    {activity.orderID}
                                </Link>
                            </div>
                        }
                    </td>
                    <td>
                        {earnedSpendValue()}
                    </td>
                    <td>
                        {update === 0 ? '—' : `${symbol}${balance}`}
                    </td>
                </tr>
            );
        }
    );

    return (
        <table
            className={css(style)}>
            <thead>
                <tr>
                    <th>Date & Location</th>
                    <th>{type}</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
};


// Added by sephora-jsx-loader.js
PointsNSpendGrid.prototype.path = 'RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/PointsNSpendGrid';
// Added by sephora-jsx-loader.js
PointsNSpendGrid.prototype.class = 'PointsNSpendGrid';
// Added by sephora-jsx-loader.js
PointsNSpendGrid.prototype.getInitialState = function() {
    PointsNSpendGrid.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PointsNSpendGrid.prototype.render = wrapComponentRender(PointsNSpendGrid.prototype.render);
// Added by sephora-jsx-loader.js
var PointsNSpendGridClass = React.createClass(PointsNSpendGrid.prototype);
// Added by sephora-jsx-loader.js
PointsNSpendGridClass.prototype.classRef = PointsNSpendGridClass;
// Added by sephora-jsx-loader.js
Object.assign(PointsNSpendGridClass, PointsNSpendGrid);
// Added by sephora-jsx-loader.js
module.exports = PointsNSpendGridClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/BeautyInsider/MyBeautyInsider/PointsNSpendBank/PointsNSpendGrid/PointsNSpendGrid.jsx