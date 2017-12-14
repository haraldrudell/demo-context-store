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
    Sephora.Util.InflatorComps.Comps['RateAndReview'] = function RateAndReview(){
        return RateAndReviewClass;
    }
}
const { colors, forms, space } = require('style');
const { Box, Grid, Text } = require('components/display');
const Link = require('components/Link/Link');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const UploadMedia = require('components/AddReview/UploadMedia/UploadMedia');
const Container = require('components/Container/Container');
const AddReviewTitle = require('components/AddReview/AddReviewTitle/AddReviewTitle');
const AddReviewNote = require('components/AddReview/AddReviewNote/AddReviewNote');
const FormValidator = require('utils/FormValidator');
const StarRating = require('components/StarRating/StarRating');
const Textarea = require('components/Inputs/Textarea/Textarea');
const TextInput = require('components/Inputs/TextInput/TextInput');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const Divider = require('components/Divider/Divider');

const ERROR_MESSAGES = {
    TEXT: 'Review must be at least 20 characters',
    RATING: 'Please select a start rating',
    RECOMMEND: 'Please select one'
};

const RateAndReview = function () {
    this.state = {
        isRecommended: null,
        isFreeSample: false,
        isSephoraEmployee: false,
        photos: null
    };
};

RateAndReview.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const isDesktop = Sephora.isDesktop();

    let { product } = this.props;

    let {
        isRecommended,
        isFreeSample,
        isSephoraEmployee
    } = this.state;

    const skuImage = (
        <ProductImage
            skuImages={product.currentSku.skuImages}
            size={isMobile ? IMAGE_SIZES[62] : IMAGE_SIZES[300]}
            disableLazyLoad={true} />
    );

    const skuInfo = (
        <div>
            <Box
                lineHeight={2}
                fontSize={isDesktop ? 'h3' : null}
                marginBottom={isMobile ? space[2] : space[5]}>
                {product.brand &&
                    <Text
                        fontWeight={700}
                        textTransform='uppercase'
                        dangerouslySetInnerHTML={{
                            __html: product.brand.displayName
                        }} />
                }
                <Text
                    display='block'
                    dangerouslySetInnerHTML={{
                        __html: product.displayName
                    }} />
            </Box>
            <ProductVariation
                fontSize={isMobile ? 'h5' : 'h4'}
                product={product}
                sku={product.currentSku} />
        </div>
    );

    return (
        <Container>
            <AddReviewTitle
                children='Rate & Review' />
            {this.state.errorMessages && this.state.errorMessages.length ?
                this.state.errorMessages.map(errorMessage =>
                    <Text
                        is='p'
                        color='error'
                        fontSize='h5'
                        marginBottom={space[3]}>
                        {errorMessage}
                    </Text>
                )
                : null
            }
            <Grid
                marginX={isDesktop ? space[6] : null}
                gutter={isMobile ? space[3] : space[7]}
                justifyContent='center'>
                <Grid.Cell
                    width={isDesktop ? 'fit' : null}>
                    {isDesktop ? skuImage :
                        <Grid
                            gutter={space[2]}>
                            <Grid.Cell
                                width='fit'>
                                {skuImage}
                            </Grid.Cell>
                            <Grid.Cell
                                width='fill'>
                                {skuInfo}
                            </Grid.Cell>
                        </Grid>
                    }
                </Grid.Cell>
                <Grid.Cell
                    width={isDesktop ? 468 : null}>
                    {isDesktop && skuInfo}
                    <Divider
                        marginY={space[5]} />
                    <Text
                        is='h3'
                        fontWeight={700}
                        marginBottom={space[4]}>
                        Rate this product
                    </Text>
                    <StarRating
                        name='starRating'
                        fontSize={32}
                        rating={0}
                        isEditable={true}
                        starClick={() => this.state.starRatingError && this.validateStarRating()}
                        validate={() => this.validateStarRating()}
                        ref={rating => this.starRating = rating} />
                    {this.state.starRatingError &&
                        <Text
                            is='p'
                            _css={[
                                forms.MSG_STYLE,
                                { color: colors.error }
                            ]}
                            children={ERROR_MESSAGES.RATING} />
                    }
                    <Text
                        is='h3'
                        fontWeight={700}
                        marginY={space[4]}>
                        Review
                    </Text>
                    <Textarea
                        placeholder='Write your review'
                        rows={3}
                        name='reviewBody'
                        minLength={20}
                        maxLength={2000}
                        value=''
                        handleChange={() =>
                            this.state.reviewTextError && this.reviewText.validateError()
                        }
                        invalid={this.state.reviewTextError}
                        validate={text => this.validateReviewText() ? null : ERROR_MESSAGES.TEXT}
                        ref={comp => this.reviewText = comp} />

                    <Text
                        is='h3'
                        fontWeight={700}
                        marginBottom={space[4]}>
                        Headline
                        {' '}
                        <Text
                            fontWeight={400}
                            color='gray'>
                            (optional)
                        </Text>
                    </Text>
                    <TextInput
                        noMargin={true}
                        type='text'
                        name='title'
                        placeholder='Add a headline'
                        maxLength={50}
                        ref={comp => this.titleInput = comp}/>
                    <Text
                        is='p'
                        textAlign='right'
                        style={forms.MSG_STYLE}>
                        Max. 50 characters
                    </Text>
                    <Text
                        is='p'
                        fontSize='h5'
                        marginTop={space[4]}>
                        See full
                        {' '}
                        <Link
                            onClick={this.openGuideLinesModal}
                            primary={true}>
                            Ratings & Reviews guidelines
                        </Link>
                    </Text>
                    <Divider
                        marginY={space[5]} />
                    <Text
                        is='h3'
                        fontWeight={700}
                        marginBottom={space[4]}>
                        Add photo
                        {' '}
                        <Text
                            fontWeight={400}
                            color='gray'>
                            (up to two images)
                    </Text>
                    </Text>
                    <UploadMedia
                        onChange={this.updatePhotos}/>
                    <Divider
                        marginY={space[5]} />
                    <Text
                        is='h3'
                        fontWeight={700}
                        marginBottom={space[4]}>
                        Would you recommend this product?
                    </Text>
                    <Grid
                        fit={true}
                        gutter={space[4]}
                        maxWidth={isDesktop ? 362 : null}>
                        <Grid.Cell>
                            <Box
                                border={2}
                                margin={-2}
                                borderColor={isRecommended === true ?
                                    colors.black : 'transparent'}
                                rounded={6}>
                                <ButtonOutline
                                    block={true}
                                    fontWeight={400}
                                    fontSize='h4'
                                    onClick={() => {
                                        this.handleRecommendClick(true);
                                    }}
                                    disabled={isRecommended === true}
                                    _css={{ ':disabled': { opacity: 1 } }}>
                                    Yes
                                </ButtonOutline>
                            </Box>
                        </Grid.Cell>
                        <Grid.Cell>
                            <Box
                                border={2}
                                margin={-2}
                                borderColor={isRecommended === false ?
                                    colors.black: 'transparent'}
                                rounded={6}>
                                <ButtonOutline
                                    block={true}
                                    fontWeight={400}
                                    fontSize='h4'
                                    onClick={() => {
                                        this.handleRecommendClick(false);
                                    }}
                                    disabled={isRecommended === false}
                                    _css={{ ':disabled': { opacity: 1 } }}>
                                    No
                                </ButtonOutline>
                            </Box>
                        </Grid.Cell>
                    </Grid>
                    {this.state.recommendedError &&
                        <Text
                            is='p'
                            _css={[
                                forms.MSG_STYLE,
                                { color: colors.error }
                            ]}
                            children={ERROR_MESSAGES.RECOMMEND} />
                    }
                    <Divider
                        marginY={space[5]} />
                    <Checkbox
                        checked={isFreeSample}
                        onChange={e => this.setState({ isFreeSample: e.target.checked })}>
                        I received this product as a free sample
                    </Checkbox>
                    <Checkbox
                        checked={isSephoraEmployee}
                        onChange={e => this.setState({ isSephoraEmployee: e.target.checked })}>
                        I am a Sephora employee
                    </Checkbox>
                    <AddReviewNote />
                    <ButtonPrimary
                        block={true}
                        onClick={this.onNext}
                        width={isMobile ? '100%' : 165}>
                        Next
                    </ButtonPrimary>

                </Grid.Cell>
            </Grid>
        </Container>
    );
};

RateAndReview.prototype.getGuidelines = function () {
    return ['Review Guidelines',
        `
            We want to know what you think of the products you've tried, bought,
            know, and love. When writing your review, please consider the following
            guidelines:
        `,
        `
            Focus on the product and your individual experience using it
            Provide details about why you like or dislike a product
            All submitted reviews are read by our moderators and are subject to the
            terms set forth in our Terms of Use
            We reserve the right not to post your review or to withdraw any posted
            review for any reason. Your review will be excluded if it violates
            review guidelines or contains any of the following types of content:
            Obscenities, discriminatory language, or other language not suitable
            for a public forum
            Advertisements, “spam” content, or references to other products,
            offers, or websites
            Any content or materials that you do not own, or for which you have not
            secured all necessary rights
            Email addresses, URLs (Sephora.com is acceptable), phone numbers,
            physical addresses, or other forms of contact information
            Critical comments about other reviews posted on the page or their
            authors
            Discussion of medical conditions or claims of medical effectiveness
            In addition, if you wish to share feedback with us about product
            selection, pricing, ordering, delivery, or other customer service
            issues, please contact us directly. Do not submit this feedback through
            a product review.
            Otherwise, feel free to review as many products as you wish!
        `
    ];
};


// Added by sephora-jsx-loader.js
RateAndReview.prototype.path = 'AddReview/RateAndReview';
// Added by sephora-jsx-loader.js
Object.assign(RateAndReview.prototype, require('./RateAndReview.c.js'));
var originalDidMount = RateAndReview.prototype.componentDidMount;
RateAndReview.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RateAndReview');
if (originalDidMount) originalDidMount.apply(this);
if (RateAndReview.prototype.ctrlr) RateAndReview.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RateAndReview');
// Added by sephora-jsx-loader.js
RateAndReview.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RateAndReview.prototype.class = 'RateAndReview';
// Added by sephora-jsx-loader.js
RateAndReview.prototype.getInitialState = function() {
    RateAndReview.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RateAndReview.prototype.render = wrapComponentRender(RateAndReview.prototype.render);
// Added by sephora-jsx-loader.js
var RateAndReviewClass = React.createClass(RateAndReview.prototype);
// Added by sephora-jsx-loader.js
RateAndReviewClass.prototype.classRef = RateAndReviewClass;
// Added by sephora-jsx-loader.js
Object.assign(RateAndReviewClass, RateAndReview);
// Added by sephora-jsx-loader.js
module.exports = RateAndReviewClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddReview/RateAndReview/RateAndReview.jsx