// @flow
import * as React from 'react';
import zIndex from 'styles/zindex.js';
import colors from 'styles/colors.js';
import Color from 'color';

export default class Layer extends React.Component<{
  children?: React.Node,
  show: boolean,
  darkenLayer?: boolean
}> {
  layerElement: ?HTMLElement;

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    if (this.props.show) {
      const parent = document.getElementById('root');
      if (parent && this.layerElement) {
        parent.appendChild(this.layerElement);
      }
    } else {
      this.removeFromDOM();
    }
  }

  componentWillUnmount() {
    this.removeFromDOM();
  }

  removeFromDOM = () => {
    if (this.layerElement) {
      const parentNode = this.layerElement.parentNode;
      if (parentNode) {
        parentNode.removeChild(this.layerElement);
      }
      this.layerElement = null;
    }
  };

  setLayerElement = (r: ?HTMLElement) => {
    this.layerElement = r;
  };

  render() {
    const { darkenLayer } = this.props;

    return (
      <div
        ref={this.setLayerElement}
        css={`
          width: 100vw;
          height: 100vh;
          position: absolute;
          z-index: ${zIndex.zindexModalMask};
          top: 0;
          left: 0;
          background: ${darkenLayer
            ? Color(colors.darkBlue1)
                .alpha(0.6)
                .string()
            : 'transparent'};
        `}
      >
        {this.props.children}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Popups/Layer/index.js