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
    Sephora.Util.InflatorComps.Comps['EditMyProfileFS'] = function EditMyProfileFS(){
        return EditMyProfileFSClass;
    }
}
const { modal, space } = require('style');
const { Box, Flex, Grid } = require('components/display');
const Link = require('components/Link/Link');
const CustomScroll = require('components/CustomScroll/CustomScroll');
const userUtils = require('utils/User');

const EditMyProfileFS = function () {
    this.state = {
        active: 0,
        biDataToSave: { biAccount: { personalizedInformation: { } } },
        lithiumDataToSave: this.props.socialProfile
    };
};

EditMyProfileFS.prototype.render = function () {
    const {
        linksList,
        getCategoryContent,
        biAccount,
        socialProfile,
        saveProfileCallback,
        isLithiumSuccessful
    } = this.props;

    const Content = getCategoryContent(this.state.active);

    return (
        <Grid>
            <Grid.Cell
                padding={modal.PADDING_FS}
                width={196}
                backgroundColor='nearWhite'
                borderRight={1}
                borderColor='lightGray'>
                <Box
                    marginY={-space[3]}>
                    {
                        linksList.map((link, index) => {
                            // Remove first tab if lithium is down
                            if (!isLithiumSuccessful && index === 0) {
                                return null;
                            }

                            return <Link
                                display='block'
                                width={1}
                                lineHeight={1}
                                paddingY={space[3]}
                                isActive={index === this.state.active}
                                fontWeight={index === this.state.active ? 700 : null}
                                onClick={(evt) => this.clickHandler(evt, index)}>
                                {link}
                            </Link>;
                        }
                        )
                    }
                </Box>
            </Grid.Cell>
            <Grid.Cell
                width='fill'
                display='flex'
                flexDirection='column'
                height={552}
                overflow='hidden'>
                <CustomScroll
                    ref={comp => this.scrollContainer = comp}
                    paddingY={space[6]}
                    paddingX={space[7]}
                    marginRight={space[2]}
                    flex={1}>
                    {
                        this.state.active === 0 ?
                            socialProfile && Content && <Content
                                socialProfile={this.state.lithiumDataToSave}
                                ref={comp => this.tabContent = comp} />
                            :
                            biAccount && Content && <Content
                                biAccount={biAccount}
                                biDataToSave={this.state.biDataToSave}
                                ref={comp => this.tabContent = comp} />
                    }
                </CustomScroll>
                <Flex
                    position='relative'
                    height={60}
                    alignItems='center'
                    justifyContent='flex-end'
                    backgroundColor='white'
                    boxShadow='0 -5px 10px 0 rgba(0,0,0,.10)'>
                    <Link
                        onClick={this.saveData}
                        marginY={-space[4]}
                        paddingY={space[4]}
                        paddingX={modal.PADDING_FS}
                        fontSize='h3'
                        primary={true}>
                        Save
                    </Link>
                </Flex>
            </Grid.Cell>
        </Grid>
    );
};


// Added by sephora-jsx-loader.js
EditMyProfileFS.prototype.path = 'RichProfile/EditMyProfile/EditMyProfileFS';
// Added by sephora-jsx-loader.js
Object.assign(EditMyProfileFS.prototype, require('./EditMyProfileFS.c.js'));
var originalDidMount = EditMyProfileFS.prototype.componentDidMount;
EditMyProfileFS.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: EditMyProfileFS');
if (originalDidMount) originalDidMount.apply(this);
if (EditMyProfileFS.prototype.ctrlr) EditMyProfileFS.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: EditMyProfileFS');
// Added by sephora-jsx-loader.js
EditMyProfileFS.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
EditMyProfileFS.prototype.class = 'EditMyProfileFS';
// Added by sephora-jsx-loader.js
EditMyProfileFS.prototype.getInitialState = function() {
    EditMyProfileFS.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
EditMyProfileFS.prototype.render = wrapComponentRender(EditMyProfileFS.prototype.render);
// Added by sephora-jsx-loader.js
var EditMyProfileFSClass = React.createClass(EditMyProfileFS.prototype);
// Added by sephora-jsx-loader.js
EditMyProfileFSClass.prototype.classRef = EditMyProfileFSClass;
// Added by sephora-jsx-loader.js
Object.assign(EditMyProfileFSClass, EditMyProfileFS);
// Added by sephora-jsx-loader.js
module.exports = EditMyProfileFSClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/EditMyProfileFS/EditMyProfileFS.jsx