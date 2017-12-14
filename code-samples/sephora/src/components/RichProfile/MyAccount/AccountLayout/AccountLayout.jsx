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
    Sephora.Util.InflatorComps.Comps['AccountLayout'] = function AccountLayout(){
        return AccountLayoutClass;
    }
}
const { space } = require('style');
const Container = require('components/Container/Container');
const Grid = require('components/Grid/Grid');
const Flex = require('components/Flex/Flex');
const Text = require('components/Text/Text');
const Divider = require('components/Divider/Divider');
const ProfileTopNav = require('components/RichProfile/ProfileTopNav/ProfileTopNav');
const AccountNav = require('./AccountNav');

const AccountLayout = function () { };

AccountLayout.prototype.render = function () {
    const {
        section,
        page,
        title,
        children
    } = this.props;

    return (
        <div>
            <ProfileTopNav section={section} />
            <Container
                paddingY={Sephora.isMobile() ? space[5] : space[7]}>
                <Grid
                    gutter={Sephora.isDesktop() ? space[7] : null}>
                    <Grid.Cell
                        display='flex'
                        width={Sephora.isDesktop() ? 1 / 4 : null}
                        order={Sephora.isMobile() ? 'last' : null}>
                        <Flex
                            flexDirection='column'
                            width={1}
                            borderRight={Sephora.isDesktop()}
                            borderColor='moonGray'>
                            <AccountNav page={page} />
                        </Flex>
                    </Grid.Cell>
                    <Grid.Cell
                        width={Sephora.isDesktop() ? 3 / 4 : null}>
                        {title &&
                            <div>
                                <Text
                                    is='h1' fontSize='h1'
                                    serif={true}>
                                    {title}
                                </Text>
                                <Divider
                                    marginTop={space[3]}
                                    height={2}
                                    color='black' />
                            </div>
                        }
                        {children}
                    </Grid.Cell>
                </Grid>
            </Container>
        </div>
    );
};


// Added by sephora-jsx-loader.js
AccountLayout.prototype.path = 'RichProfile/MyAccount/AccountLayout';
// Added by sephora-jsx-loader.js
AccountLayout.prototype.class = 'AccountLayout';
// Added by sephora-jsx-loader.js
AccountLayout.prototype.getInitialState = function() {
    AccountLayout.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AccountLayout.prototype.render = wrapComponentRender(AccountLayout.prototype.render);
// Added by sephora-jsx-loader.js
var AccountLayoutClass = React.createClass(AccountLayout.prototype);
// Added by sephora-jsx-loader.js
AccountLayoutClass.prototype.classRef = AccountLayoutClass;
// Added by sephora-jsx-loader.js
Object.assign(AccountLayoutClass, AccountLayout);
// Added by sephora-jsx-loader.js
module.exports = AccountLayoutClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/AccountLayout/AccountLayout.jsx