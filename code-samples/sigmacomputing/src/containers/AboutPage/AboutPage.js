// @flow
import * as React from 'react';
import { css } from 'emotion';
import facepaint from 'facepaint';

import { Box, Flex, Text } from 'widgets';
import Layout from 'components/layout/LandingLayout';
import Pic1 from './assets/Pic1.png';
import Pic2 from './assets/Pic2.png';
import Pic3 from './assets/Pic3.png';
import Mike from './assets/Mike.png';
import Sam from './assets/Sam.png';
import Jason from './assets/jfranty.png';
import Sutter from './assets/Sutter.png';
import Rob from './assets/rwoollen.png';

const mq = facepaint([
  '@media(min-width: 420px)',
  '@media(min-width: 920px)',
  '@media(min-width: 1120px)'
]);

const SutterInfo = css(
  mq({
    display: 'inline-block',
    verticalAlign: 'top',
    marginRight: ['0', '0', '32px', '32px'],
    width: ['100%', '50%', '50%', '50%']
  })
);

export default class AboutPage extends React.PureComponent<void> {
  renderHeader() {
    return (
      <div>
        <Text align="center" font="web1" mb={2}>
          We are Sigma
        </Text>
        <Text my={5} px={4} font="header2">
          For 40 years, the dream has been for databases and data warehouses to
          be usable by non-programmers. That&#39;s been the aspiration of every
          BI tool and every CIO. It hasn&#39;t been possible until now with
          Sigma.
        </Text>
        <Text align="center">
          <Box inline mb={3}>
            <img alt="" src={Pic1} />
          </Box>
          <Box inline mx={4} mb={3}>
            <img alt="" src={Pic2} />
          </Box>
          <Box inline>
            <img css={`max-width: 100%;`} alt="" src={Pic3} />
          </Box>
        </Text>
      </div>
    );
  }

  renderLeadership() {
    return (
      <Box my={5}>
        <Text mb={5} align="center" font="web1">
          Leadership Team
        </Text>
        {this.renderRob()}
        {this.renderJason()}
      </Box>
    );
  }

  renderPerson({
    name,
    title,
    img,
    desc,
    school
  }: {
    name: string,
    title: string,
    img: string,
    desc: string,
    school: string
  }) {
    return (
      <Flex mb={5}>
        <Flex align="flex-start" mr={4} mt={2}>
          <img alt={name} src={img} />
        </Flex>
        <Box flexGrow>
          <Text font="header2" semiBold>
            {name}
          </Text>
          <Text font="header3" mb={2}>
            {title}
          </Text>
          <Text font="header3" mb={2}>
            {desc}
          </Text>
          <Text font="header3">{school}</Text>
        </Box>
      </Flex>
    );
  }

  renderRob() {
    return this.renderPerson({
      name: 'Rob Woollen',
      title: 'CEO / Co-Founder',
      img: Rob,
      desc: `Rob Woollen is co-founder and CEO of Sigma Computing.  Rob has over 20 years of experience building distributed and cloud systems.  He spent 6 years at Salesforce.com serving as the CTO for the Salesforce Platform and Work.com and Sr Vice President, Platform Product Management.`,
      school: `Rob holds a Bachelor of Science degree in Computer Science from
          Princeton University.`
    });
  }

  renderJason() {
    return this.renderPerson({
      name: 'Jason Frantz',
      title: 'CTO / Co-Founder',
      img: Jason,
      desc: `Jason is co-founder and CTO of Sigma Computing.   Prior to founding Sigma, Jason was at MapR as the architect for
        their distributed database, MapR-DB. He was responsible for the overall
        system design and delivered the GA release.`,
      school: `Jason earned a Bachelor of Science degree in Engineering &
        Applied Science from the California Institute of Technology.`
    });
  }

  renderTeam() {
    return (
      <Text align="center" font="header1">
        Our Team
      </Text>
    );
  }

  renderInvestors() {
    return (
      <div>
        <Text align="center" font="web1" mb={5}>
          Our Investors
        </Text>
        <Text align="center">
          <Box inline>
            <Box inline mr={4} mb={4}>
              <img alt="" src={Mike} />
              <Text font="header2" semiBold>
                Mike Speiser
              </Text>
              <Text font="header3">Managing Director</Text>
            </Box>
            <Box inline mr={4}>
              <img alt="" src={Sam} />
              <Text font="header2" semiBold>
                Sam Pullara
              </Text>
              <Text font="header3">Managing Director</Text>
            </Box>
          </Box>
          <Text align="left" className={SutterInfo}>
            <img alt="Sutter Hill Ventures" src={Sutter} />
            <Text mt={3} font="header3">
              We&apos;re successful today in part due to our financial partners,
              Sutter Hill Ventures. SHV has financed technology-based startups
              and assisted entrepeneurs in building market-leading companies
              since 1962. They strongly support our company&apos;s culture and
              believe in our commmitment to great product.
            </Text>
          </Text>
        </Text>
      </div>
    );
  }

  render() {
    return (
      <Layout>
        <div className="g_container">
          {this.renderHeader()}
          {this.renderLeadership()}
          {this.renderInvestors()}
        </div>
      </Layout>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/AboutPage/AboutPage.js