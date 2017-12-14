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
    Sephora.Util.InflatorComps.Comps['PostingConfirmation'] = function PostingConfirmation(){
        return PostingConfirmationClass;
    }
}
const { space } = require('style');
const { Box, Text } = require('components/display');
const ButtonOutline = require('components/Button/ButtonOutline');
const Divider = require('components/Divider/Divider');
const UrlUtils = require('utils/Url');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');
const Container = require('components/Container/Container');
const AddReviewTitle = require('components/AddReview/AddReviewTitle/AddReviewTitle');

let PostingConfirmation = function () {
    this.state = {
        contentData: null,
        submissionErrors: null
    };
};

PostingConfirmation.prototype.render = function () {
    const isDesktop = Sephora.isDesktop();
    let { productURL } = this.props;
    let hasErrors = this.state.submissionErrors && (this.state.submissionErrors instanceof Array);
    return (
        <Container>
            <AddReviewTitle
                children={hasErrors ? 'Submission Error' : 'Thank You' }/>
            {hasErrors ?
                <div>
                    <div>Something went wrong, please try again later</div>
                    {this.state.submissionErrors.map(errorMessage =>
                        <Text
                            is='p'
                            color='error'
                            fontSize='h5'
                            marginBottom={space[3]}>
                            {errorMessage}
                        </Text>
                    )
                    }
                </div>
            : null}
            <Box
                maxWidth={isDesktop ? 528 : null}
                marginX='auto'>
                {!hasErrors && <Text
                    is='p'
                    textAlign='center'>
                    Reviews are typically posted within 72 hours
                    of the time you submit them, so stay tuned.
                    Thank you for helping to make the Sephora
                    community better!
                </Text>}
                {this.state.contentData &&
                    <div>
                        <Divider
                            marginY={space[5]} />
                        <BccComponentList
                            items={this.state.contentData} />
                    </div>
                }
                <Divider
                    marginY={space[5]} />
                <ButtonOutline
                    onClick={ () => UrlUtils.redirectTo(productURL) }
                    block={true}
                    maxWidth={isDesktop ? '65%' : null}
                    marginX='auto'
                    children='Continue Shopping' />
            </Box>
        </Container>
    );
};


// Added by sephora-jsx-loader.js
PostingConfirmation.prototype.path = 'AddReview/PostingConfirmation';
// Added by sephora-jsx-loader.js
Object.assign(PostingConfirmation.prototype, require('./PostingConfirmation.c.js'));
var originalDidMount = PostingConfirmation.prototype.componentDidMount;
PostingConfirmation.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PostingConfirmation');
if (originalDidMount) originalDidMount.apply(this);
if (PostingConfirmation.prototype.ctrlr) PostingConfirmation.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PostingConfirmation');
// Added by sephora-jsx-loader.js
PostingConfirmation.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PostingConfirmation.prototype.class = 'PostingConfirmation';
// Added by sephora-jsx-loader.js
PostingConfirmation.prototype.getInitialState = function() {
    PostingConfirmation.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PostingConfirmation.prototype.render = wrapComponentRender(PostingConfirmation.prototype.render);
// Added by sephora-jsx-loader.js
var PostingConfirmationClass = React.createClass(PostingConfirmation.prototype);
// Added by sephora-jsx-loader.js
PostingConfirmationClass.prototype.classRef = PostingConfirmationClass;
// Added by sephora-jsx-loader.js
Object.assign(PostingConfirmationClass, PostingConfirmation);
// Added by sephora-jsx-loader.js
module.exports = PostingConfirmationClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/PostingConfirmation/PostingConfirmation.jsx