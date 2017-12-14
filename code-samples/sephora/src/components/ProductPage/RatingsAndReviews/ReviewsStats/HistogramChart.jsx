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
    Sephora.Util.InflatorComps.Comps['HistogramChart'] = function HistogramChart(){
        return HistogramChartClass;
    }
}
const { lineHeights } = require('style');
const css = require('glamor').css;
const { Box } = require('components/display');

const barsStructure = {
    '1': {
        RatingValue: 1,
        Count: 0
    },
    '2': {
        RatingValue: 2,
        Count: 0
    },
    '3': {
        RatingValue: 3,
        Count: 0
    },
    '4': {
        RatingValue: 4,
        Count: 0
    },
    '5': {
        RatingValue: 5,
        Count: 0
    }
};

let HistogramChart = function () {};

HistogramChart.prototype.render = function () {
    const {
        ratingDistribution,
        totalReviewCount,
        percentage
     } = this.props;
    ratingDistribution.forEach(function (element) {
        barsStructure[element.RatingValue.toString()].Count = element.Count;
    });

    return (
        <table
            className={css({
                width: '100%',
                borderCollapse: 'collapse',
                whiteSpace: 'nowrap',
                '& td': {
                    paddingTop: 6,
                    paddingBottom: 6,
                    lineHeight: lineHeights[2],
                    verticalAlign: 'middle'
                },
                '& td:first-child': {
                    textAlign: 'right',
                    paddingRight: 12
                },
                '& td:last-child': {
                    textAlign: 'left',
                    paddingLeft: 12
                },
                '& td:not(:first-child):not(:last-child)': {
                    width: '99%'
                }
            })}>
            {Object.values(barsStructure).reverse().map(item =>
                 <tr key={item.RatingValue}>
                    <td>
                        {item.RatingValue} star{item.RatingValue > 1 && 's'}
                    </td>
                    <td>
                        <Box
                            border={1}
                            borderColor='moonGray'>
                            <Box
                                height={14}
                                backgroundColor='black'
                                style={{
                                    width: percentage(totalReviewCount, item.Count) + '%'
                                }}>
                            </Box>
                        </Box>
                    </td>
                    <td>
                        {item.Count}
                    </td>
                </tr>
            )}
        </table>
    );
};


// Added by sephora-jsx-loader.js
HistogramChart.prototype.path = 'ProductPage/RatingsAndReviews/ReviewsStats';
// Added by sephora-jsx-loader.js
HistogramChart.prototype.class = 'HistogramChart';
// Added by sephora-jsx-loader.js
HistogramChart.prototype.getInitialState = function() {
    HistogramChart.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
HistogramChart.prototype.render = wrapComponentRender(HistogramChart.prototype.render);
// Added by sephora-jsx-loader.js
var HistogramChartClass = React.createClass(HistogramChart.prototype);
// Added by sephora-jsx-loader.js
HistogramChartClass.prototype.classRef = HistogramChartClass;
// Added by sephora-jsx-loader.js
Object.assign(HistogramChartClass, HistogramChart);
// Added by sephora-jsx-loader.js
module.exports = HistogramChartClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/ReviewsStats/HistogramChart.jsx