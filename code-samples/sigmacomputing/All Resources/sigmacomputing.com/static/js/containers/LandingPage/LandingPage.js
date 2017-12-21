// @flow
import * as React from 'react';
import Link from 'react-router-dom/Link';
import { css } from 'emotion';
import Helmet from 'react-helmet';
import facepaint from 'facepaint';

import Layout from 'components/layout/LandingLayout';
import Intro from './assets/Intro.png';
import Snowflake from './assets/Snowflake.png';
import BigQuery from './assets/BigQuery.png';
import Redshift from './assets/Redshift.png';
import Azure from './assets/Azure.png';
import Simple from './assets/Simple.png';
import Analyst from './assets/Analyst.png';
import Data from './assets/Data.png';
import Share from './assets/Share.png';
import Visualization from './assets/Visualization.png';
import { Box, Button, Text, TextSpan } from 'widgets';

const mq = facepaint([
  '@media(min-width: 420px)',
  '@media(min-width: 920px)',
  '@media(min-width: 1120px)'
]);

const introText = css(
  mq({
    display: 'inline-block',
    verticalAlign: 'top',
    width: ['100%', '100%', '60%', '60%']
  })
);

const introImg = css(
  mq({
    display: 'inline-block',
    width: ['0%', '0%', '40%', '40%']
  })
);

const simpleText = css(
  mq({
    paddingLeft: ['0', '24px', '32px', '32px']
  })
);
const infoText = css(
  mq({
    display: 'inline-block',
    verticalAlign: 'middle',
    width: ['100%', '50%', '50%', '50%']
  })
);
const infoImg = css(
  mq({
    verticalAlign: 'middle',
    width: ['100%', '50%', '40%', '40%']
  })
);
const simpleCss = css(
  mq({
    float: ['none', 'right', 'right', 'right']
  })
);

const infoTitle = css(
  mq({
    fontSize: ['30px', '30px', '60px', '60px']
  })
);

const shareText = css(
  mq({
    paddingLeft: ['0', '80px', '80px', '80px'],
    display: 'inline-block',
    verticalAlign: 'middle',
    width: ['100%', '60%', '60%', '60%']
  })
);
const shareImg = css(
  mq({
    verticalAlign: 'middle',
    width: ['100%', '40%', '30%', '30%']
  })
);

const whoText = css(
  mq({
    display: 'inline-block',
    width: ['100%', '100%', '40%', '40%'],
    minWidth: ['0', '0', '480px', '480px'],
    textAlign: ['center', 'left', 'left', 'left']
  })
);

const whoDesc = css(
  mq({
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: ['0', '32px', '32px', '32px']
  })
);

export default class LandingPage extends React.PureComponent<{}> {
  renderIntro() {
    return (
      <Box mb={-4} pb={4} className="g_container">
        <Box mb={4} className={introText}>
          <Text font="web1">
            The visual interface<br />for your data<br />warehouse
          </Text>
          <Text
            mt={3}
            css={`font-size: 28px; font-weight: 600; line-height: 1;`}
            color="blueAccent"
          >
            No layers, No languages, No limits
          </Text>
          <Text font="header3" mt={5} mb={2}>
            Get started in 2 minutes
          </Text>
          <TextSpan mr={3}>
            <Link to="/signup">
              <Button>Try it now</Button>
            </Link>
          </TextSpan>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://youtu.be/DKOj7VsONWU"
          >
            <Button type="secondary">Watch Video</Button>
          </a>
        </Box>
        <TextSpan mb={3}>
          <img alt="" src={Intro} className={introImg} />
        </TextSpan>
      </Box>
    );
  }

  renderConnections() {
    return (
      <div className="g_container">
        <Box bg="#ebf8ff" p={4} mt={5} mb={6}>
          <Text font="header2" align="center" semiBold>
            Analytics designed for your cloud data warehouse
          </Text>
          <Text align="center" mt={3}>
            <TextSpan mb={3} px={3}>
              <img alt="" src={Snowflake} />
            </TextSpan>
            <TextSpan mb={3} px={3}>
              <img alt="" src={BigQuery} />
            </TextSpan>
            <TextSpan mb={3} px={3}>
              <img alt="" src={Azure} />
            </TextSpan>
            <TextSpan px={3}>
              <img alt="" src={Redshift} />
            </TextSpan>
          </Text>
        </Box>
      </div>
    );
  }

  renderInfoSection() {
    return (
      <div className="g_container">
        <Box>
          <Box mb={3} className={`${simpleText} ${infoText} ${simpleCss}`}>
            <Text font="header2" mb={3} color="#4bb9f4" semiBold>
              Why use Sigma
            </Text>
            <Text font="web1" mb={2} className={infoTitle}>
              Simple Interface
            </Text>
            <Text font="header2">Drag and drop and simple formulas</Text>
          </Box>
          <img alt="" className={infoImg} src={Simple} />
        </Box>
        <Box mt={6}>
          <Box mb={3} pr={5} className={infoText}>
            <Text font="web1" mb={2} className={infoTitle}>
              Create stunning visualizations
            </Text>
            <Text font="header2">
              Charts and dashboards to explore and present
            </Text>
          </Box>
          <img alt="" className={infoImg} src={Visualization} />
        </Box>
        <Box my={6}>
          <Box mb={3} className={`${shareText} ${simpleCss}`}>
            <Text font="web1" mb={2} className={infoTitle}>
              Share with your team
            </Text>
            <Text font="header2">Collaborate over email and Slack</Text>
          </Box>
          <img alt="" className={shareImg} src={Share} />
        </Box>
      </div>
    );
  }

  renderWho() {
    return (
      <Box bg="#ebf8ff" py={5} mb={4}>
        <div className="g_container">
          <Text mb={4} font="web1">
            Who is this for?
          </Text>
          <Text align="center">
            <Box mb={4} className={whoText}>
              <img alt="" css={`vertical-align: middle;`} src={Data} />
              <Box className={whoDesc}>
                <Text font="header1" color="blueAccent" semiBold>
                  Data Team
                </Text>
                <div>
                  <Text font="header3">Single source of truth</Text>
                  <Text font="header3">No model language programming</Text>
                  <Text font="header3">Remove ad hoc requests</Text>
                </div>
              </Box>
            </Box>
            <Box mb={4} className={whoText}>
              <img alt="" css={`vertical-align: middle;`} src={Analyst} />
              <Box className={whoDesc}>
                <Text font="header1" color="blueAccent" semiBold>
                  Analyst
                </Text>
                <div>
                  <Text font="header3">
                    Do it yourself without learning SQL
                  </Text>
                  <Text font="header3">Run it against full live data</Text>
                  <Text font="header3">
                    Share and build off other people&apos;s work
                  </Text>
                </div>
              </Box>
            </Box>
          </Text>
        </div>
      </Box>
    );
  }

  renderTrial() {
    return (
      <Box pt={5} className="g_container">
        <Box
          css={`
            min-width: 300px;
            text-align: left;
          `}
          inline
          mb={3}
          width="50%"
        >
          <Text font="web1">Try it for free</Text>
          <Text font="header3" mt={2}>
            Already using Sigma? <Link to="/login">Sign in</Link>
          </Text>
        </Box>
        <TextSpan className={simpleCss}>
          <TextSpan mr={3}>
            <Link to="/signup">
              <Button>Try it Now</Button>
            </Link>
          </TextSpan>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://youtu.be/DKOj7VsONWU"
          >
            <Button type="secondary">Watch Video</Button>
          </a>
        </TextSpan>
      </Box>
    );
  }

  render() {
    return (
      <Layout>
        <Helmet title="Sigma" />
        {this.renderIntro()}
        {this.renderConnections()}
        {this.renderInfoSection()}
        {this.renderWho()}
        {this.renderTrial()}
      </Layout>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/LandingPage/LandingPage.js