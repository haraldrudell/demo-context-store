// @flow
import * as React from 'react';
import { Flex } from 'widgets';

import ResourceBox from './ResourceBox';
import { GettingStartedResources } from './resources';

export default function GettingStarted() {
  return (
    <Flex justify="space-between" align="center" wrap>
      {GettingStartedResources.map(resource => {
        return (
          <ResourceBox
            key={resource.title}
            to={resource.to}
            image={resource.image}
            title={resource.title}
          />
        );
      })}
    </Flex>
  );
}



// WEBPACK FOOTER //
// ./src/components/Help/GettingStarted.js