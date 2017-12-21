// @flow
import * as React from 'react';
import * as vega from 'vega';
import * as vl from 'vega-lite';
import { css } from 'react-emotion';
import type { InlineData } from 'vega-lite/build/src/data';
import type { TopLevelExtendedSpec } from 'vega-lite/build/src/spec';
import * as vegaTooltip from 'vega-tooltip';

import colors from 'styles/colors';
import fonts, { families } from 'styles/typography';

const RENDERER = 'canvas';

// https://vega.github.io/vega/docs/config/
const VEGA_CONFIG = {
  axis: {
    domainColor: colors.darkBlue2,
    labelColor: colors.darkBlue2,
    labelFont: families.table,
    tickColor: colors.darkBlue2,
    titleColor: colors.darkBlue2,
    titleFont: families.primary
  },
  legend: {
    labelColor: colors.darkBlue2,
    labelFont: families.table,
    titleColor: colors.darkBlue2,
    titleFont: families.primary
  },
  title: {
    color: colors.darkBlue2
  }
};

export const DEFAULT_VEGA_CONFIG = {
  axis: {
    titleFontSize: 14
  },
  legend: {
    labelFontSize: 10,
    titleFontSize: 14,
    orient: 'right'
  },
  axisX: {
    labelFontSize: 10,
    labelAngle: -90 // default time labels to be vertical
  },
  axisY: {
    labelFontSize: 10,
    labelAngle: 0
  },
  title: {
    fontSize: 16
  }
};

type Props = {
  data: InlineData,
  height: number,
  spec: TopLevelExtendedSpec,
  tooltipOptions?: Object,
  width: number,
  thumbnail: boolean
};

type State = {
  isLoading: boolean
};

// XXX: Need designs for our tooltips.  These were borrowed from voyager
const tooltip = css`
  visibility: hidden;
  position: fixed;
  z-index: 2000;
  padding: 6px;
  border: 1px solid ${colors.darkBlue4};
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.9);
  color: ${colors.darkBlue2};

  & .key {
    ${fonts.header6};
  }

  & .value {
    ${fonts.table};
  }
`;

export default class VegaLite extends React.PureComponent<Props, State> {
  view: vega.View;
  chartRef: ?HTMLElement;

  updateTimeout: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentWillMount() {
    const node = document.getElementById('vis-tooltip');
    if (!node) {
      var p = document.createElement('div');
      p.id = 'vis-tooltip';
      p.className = tooltip;
      if (document.body) {
        document.body.appendChild(p);
      }
    }
  }

  setChartRef = (r: ?HTMLElement) => {
    this.chartRef = r;
  };

  updateSpec() {
    const { data, height, tooltipOptions, width, thumbnail } = this.props;
    const vlSpec = {
      ...this.props.spec,
      data,
      autosize: {
        type: 'fit',
        contains: 'padding'
      },
      height,
      width
    };

    // Prevent labels from dominating the chart.
    vlSpec.config.axisY.labelLimit = Math.max(40, height / 3);
    vlSpec.config.axisX.labelLimit = Math.max(40, width / 3);

    if (thumbnail) {
      vlSpec.config.padding = 0;
      vlSpec.config.view = {
        stroke: 'transparent'
      };
      vlSpec.title = null;
    }
    const spec = vl.compile(vlSpec, { config: DEFAULT_VEGA_CONFIG }).spec;
    const runtime = vega.parse(spec, VEGA_CONFIG);
    this.view = new vega.View(runtime)
      .logLevel(vega.Warn)
      .initialize(this.chartRef)
      .renderer(RENDERER)
      .hover();

    if (!thumbnail && tooltipOptions) {
      vegaTooltip.vega(this.view, tooltipOptions);
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.updateTimeout = window.setTimeout(() => {
      this.updateSpec();
      this.runView();
      this.setState({ isLoading: false });
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.spec !== this.props.spec) {
      this.setState({ isLoading: true });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    const { spec, data, height, width } = this.props;
    this.updateTimeout = window.setTimeout(() => {
      if (
        prevProps.spec !== spec ||
        prevProps.data !== data ||
        prevProps.height !== height ||
        prevProps.width !== width
      ) {
        this.updateSpec();
      }
      this.runView();
      this.setState({ isLoading: false });
    }, 0);
  }

  componentWillUnmount() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    if (this.view) {
      this.view.finalize();
    }
  }

  runView() {
    this.view.run();
  }

  render() {
    return (
      <div>
        <div ref={this.setChartRef} />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/chart/VegaLite.js