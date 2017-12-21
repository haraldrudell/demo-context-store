// @flow
import * as React from 'react';
import { Flex, Box } from 'widgets';

import HelpLink from './HelpLink';
import { TopResources } from './resources';

type resourceSize = 'regular' | 'large';

export default function PopularResources({
  size,
  ...rest
}: {
  size?: resourceSize
}) {
  const resources = TopResources.map(resource => {
    return (
      <Box key={resource.title} px={size === 'large' ? 6 : 2} py={1}>
        <HelpLink to={resource.to}>{resource.title}</HelpLink>
      </Box>
    );
  });

  // DBJ: split the resources in half to structure in two columns - per the designs
  const leftSide = resources.splice(0, Math.ceil(resources.length / 2));

  return (
    <Flex
      wrap
      justify="space-between"
      font={size === 'large' ? 'header3' : 'header5'}
      {...rest}
    >
      <Box>{leftSide}</Box>
      <Box>{resources}</Box>
    </Flex>
  );
}



// WEBPACK FOOTER //
// ./src/components/Help/PopularResources.js