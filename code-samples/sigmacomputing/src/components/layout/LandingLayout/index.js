// @flow
import * as React from 'react';
import Link from 'react-router-dom/Link';
import { css } from 'emotion';
import facepaint from 'facepaint';

import menuImg from './menu.png';
import Logo from 'icons/logo_dark.svg';
import { Box, Flex, Button, TextSpan, Menu, Popup } from 'widgets';
import Footer from 'components/footer/Footer';
import ContactUs from 'components/Help/ContactUs';

const { MenuItem, MenuDivider } = Menu;

const mq = facepaint(['@media(min-width: 800px)']);

const menu = css(
  mq({
    display: ['none', 'block']
  })
);

const mobileMenu = css(
  mq({
    display: ['block', 'none']
  })
);

type Props = {
  children?: React.Node,
  help?: boolean
};

export default class Layout extends React.PureComponent<Props> {
  renderLinks() {
    return (
      <div className={menu}>
        <Link to="/about">
          <TextSpan mr={4} font="web4" color="darkBlue2">
            About Us
          </TextSpan>
        </Link>

        <Link to="/careers">
          <TextSpan mr={4} font="web4" color="darkBlue2">
            Careers
          </TextSpan>
        </Link>

        <Link to="login">
          <TextSpan font="web4" mr={4} color="darkBlue2">
            Sign In
          </TextSpan>
        </Link>

        <Link to="/signup">
          <Button>Try it Now</Button>
        </Link>
      </div>
    );
  }

  renderMobile() {
    return (
      <div className={mobileMenu}>
        <Popup
          doNotLayer
          popupPlacement="bottom-end"
          target={<img alt="" src={menuImg} />}
        >
          <Menu>
            <MenuItem id="about" redirectTo="/about" name="About Us" />
            <MenuItem id="career" redirectTo="/careers" name="Careers" />
            <MenuItem id="signin" redirectTo="/login" name="Sign In" />
            <MenuDivider />
            <MenuItem id="signup" redirectTo="/signup" name="Try it now" />
          </Menu>
        </Popup>
      </div>
    );
  }

  renderHelp() {
    return (
      <div className={menu}>
        <ContactUs button />
      </div>
    );
  }

  render() {
    const { children, help } = this.props;
    return (
      <div>
        <Flex align="center" mx={4} mt={3} mb={help ? 3 : 6}>
          <Box flexGrow>
            <Link to="/">
              <img
                width="40px"
                alt="Logo"
                src={Logo}
                css={`vertical-align: middle;`}
              />
              <TextSpan
                ml={3}
                font="header1"
                color="darkBlue2"
                css={`vertical-align: middle; font-weight: 600;`}
              >
                Sigma
                {help && (
                  <TextSpan ml={2} font="header2" color="blue">
                    Help
                  </TextSpan>
                )}
              </TextSpan>
            </Link>
          </Box>
          {help ? (
            this.renderHelp()
          ) : (
            <div>
              {this.renderLinks()}
              {this.renderMobile()}
            </div>
          )}
        </Flex>
        {children}
        <Box mt={help ? 5 : 6}>
          <Footer />
        </Box>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/layout/LandingLayout/index.js