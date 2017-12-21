// @flow
import * as React from 'react';

import Coffee from './assets/Coffee.png';
import Squirrel from './assets/Squirrel.png';
import Toy from './assets/Toy.png';
import Marathon from './assets/Marathon.png';
import Picnic from './assets/Picnic.png';
import Commuter from './assets/Commuter.png';
import Family from './assets/Family.png';
import Health from './assets/Health.png';
import Meal from './assets/Meal.png';
import Salary from './assets/Salary.png';
import Vacation from './assets/Vacation.png';
import Layout from 'components/layout/LandingLayout';
import { Box, Flex, Icon, Text } from 'widgets';

const Pic = ({ img }: { img: string }) => (
  <Box inline mr={3} mb={3}>
    <img alt="" src={img} css={`max-width: 100%;`} />
  </Box>
);

const Perk = ({ img, txt }: { img: string, txt: string }) => (
  <Box
    css={`
      text-align: center;
      width: 295px;
      height: 175px;
      display: inline-block;
      vertical-align: top;
      margin-bottom: 32px;
    `}
  >
    <Box mb={2}>
      <img alt="" src={img} />
    </Box>
    <Text font="header2">{txt}</Text>
  </Box>
);

export default class CareerPage extends React.PureComponent<void> {
  renderHeader() {
    return (
      <div>
        <Text align="center" font="web1" mb={2}>
          Changing the way people use data
        </Text>
        <Text my={5} px={4} font="header2">
          Sigma helps every team inside a company play with and understand their
          data. We&apos;re built on the latest and greatest technology.
          You&apos;ll love working on it and be challenged every day.
        </Text>
      </div>
    );
  }

  renderPics() {
    return (
      <Text align="center" mb={5}>
        <Pic img={Picnic} />
        <Pic img={Coffee} />
        <Pic img={Squirrel} />
        <Pic img={Toy} />
        <Pic img={Marathon} />
      </Text>
    );
  }

  renderPerks() {
    return (
      <div>
        <Text font="web1" align="center" mb={5}>
          Company Perks
        </Text>
        <Text align="center">
          <Perk img={Salary} txt="Competitive salary" />
          <Perk
            img={Health}
            txt="Premium medical, dental, and vision insurance"
          />
          <Perk img={Vacation} txt="Flexible vacation" />
          <Perk img={Commuter} txt="Pre-tax commuter benefits" />
          <Perk img={Meal} txt="Weekly catered meals, fully stocked kitchen" />
          <Perk img={Family} txt="Family support" />
        </Text>
      </div>
    );
  }

  renderAddress() {
    return (
      <Text align="center" mb={4}>
        <Text font="web1" mb={4}>
          Open positions
        </Text>
        <Text font="header2">
          405 Howard Street<br />San Francisco, CA 94105
        </Text>
      </Text>
    );
  }

  renderJobs() {
    return (
      <div>
        <Flex width="100%" justify="center" mb={2}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://angel.co/sigma-computing/jobs/284080-product-designer"
            css={`display: inline-block; width: 900px; max-width: 100%;`}
          >
            <Flex
              bg="darkBlue6"
              align="center"
              py={4}
              px={5}
              width="100%"
              color="darkBlue2"
            >
              <Box flexGrow>
                <Text font="header2">Design & User Experience</Text>
              </Box>
              <Icon type="caret-right" />
            </Flex>
          </a>
        </Flex>
        <Flex width="100%" justify="center">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://angel.co/sigma-computing/jobs/281436-software-engineer-frontend"
            css={`display: inline-block; width: 900px; max-width: 100%;`}
          >
            <Flex
              bg="darkBlue6"
              align="center"
              py={4}
              px={5}
              width="100%"
              color="darkBlue2"
            >
              <Box flexGrow>
                <Text font="header2">Front-End Engineering</Text>
              </Box>
              <Icon type="caret-right" />
            </Flex>
          </a>
        </Flex>
      </div>
    );
  }

  render() {
    return (
      <Layout>
        <div className="g_container">
          {this.renderHeader()}
          {this.renderPics()}
          {this.renderPerks()}
          {this.renderAddress()}
          {this.renderJobs()}
        </div>
      </Layout>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/CareerPage/CareerPage.js