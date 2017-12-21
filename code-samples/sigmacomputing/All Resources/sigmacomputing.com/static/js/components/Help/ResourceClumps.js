// @flow
import * as React from 'react';
import { Flex } from 'widgets';

import ResourceBox from './ResourceBox';
import { ClumpedResources } from './resources';

export default function ResourceClumps() {
  return (
    <Flex align="center" wrap>
      {ClumpedResources.map(resource => {
        return (
          <ResourceBox
            key={resource.title}
            to={resource.to}
            image={resource.image}
            title={resource.title}
            subtitle={resource.subtitle}
            size="large"
          />
        );
      })}
    </Flex>
  );
}



// WEBPACK FOOTER //
// ./src/components/Help/ResourceClumps.js