// @flow
import * as React from 'react';

import { Text, TextSpan, Flex, Box } from 'widgets';
import colors from 'styles/colors';
import HelpLink from './HelpLink';

type Props = {
  image: any,
  title: string,
  to: string,
  subtitle?: string,
  size?: 'regular' | 'large'
};

const regularStyles = {
  width: '160px',
  titleFont: 'header4',
  subtitleFont: 'bodyMedium',
  boxShadow: 'none'
};

const largeStyles = {
  width: '340px',
  titleFont: 'header2',
  subtitleFont: 'bodyLarge',
  boxShadow: `0 2px 4px 0 ${colors.darkBlue4}`
};

export default class ResourceBox extends React.Component<Props, void> {
  render() {
    const { image, title, to, subtitle, size } = this.props;

    const styles = size === 'large' ? largeStyles : regularStyles;

    return (
      <Box m={2}>
        <HelpLink to={to}>
          <Flex
            column
            align="center"
            color={colors.darkBlue2}
            bg="white"
            borderColor={colors.darkBlue4}
            b={1}
            py={3}
            borderRadius="4px"
            width={styles.width}
            css={`box-shadow: ${styles.boxShadow};`}
          >
            <img alt="" src={image} />
            <Text pb={2} pt={3} font={styles.titleFont}>
              {title}
            </Text>
            <Text font={styles.subtitleFont}>
              {subtitle ? (
                subtitle
              ) : (
                <TextSpan color="blue">Learn More</TextSpan>
              )}
            </Text>
          </Flex>
        </HelpLink>
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/Help/ResourceBox.js