// @flow
import React, { Component } from 'react';

type Props = {
  show: boolean,
  width: string,
  background: string,
  zIndex: string,
  noShadow: boolean,
  ccStyle: 'dash' | 'spread',
  addon: string
};

type State = {
  style: Object,
  addonStyle: Object
};

export default class LaserBeam extends Component<Props, State> {
  static defaultProps = {
    show: false,
    width: '2px',
    background: '#77b6ff',
    zIndex: '1200',
    noShadow: false,
    ccStyle: 'dash',
    addon: 'transparent'
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      style: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        margin: props.ccStyle === 'dash' ? '' : '0 auto',
        zIndex: props.zIndex,
        width: '0',
        height: props.width,
        background: props.background,
        transition: 'all 0ms',
        boxShadow: props.noShadow ? 'none' : props.background + ' 0px 0px 10px'
      },
      addonStyle: {
        content: '',
        display: 'none',
        position: 'absolute',
        right: -parseInt(props.width, 10) / 2 + 'px',
        width: props.width,
        height: props.width,
        background: props.addon,
        boxShadow:
          props.addon +
          ' 0 0 10px ' +
          (2 / parseInt(props.width, 10) + 1) +
          'px',
        borderRadius: '50%'
      }
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      this.props.show !== nextProps.show || this.state.style !== nextState.style
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    const { style, addonStyle } = this.state;
    const { show } = this.props;
    const nextShow = nextProps.show;
    let changedStyle, changedAddonStyle;

    if (show === nextShow) {
      return;
    }
    if (nextShow) {
      changedStyle = {
        ...style,
        width: '70%',
        transition: 'width 10s cubic-bezier(0, 1, 0.3, 1)'
      };
    } else {
      changedStyle = {
        ...style,
        width: '100%',
        transition: 'width 400ms ease'
      };
    }
    changedAddonStyle = {
      ...addonStyle,
      display: 'block'
    };
    this.setState({
      style: changedStyle,
      addonStyle: changedAddonStyle
    });
  }

  handleTransitionEnd() {
    const { style, addonStyle } = this.state;
    const { show } = this.props;
    let changedStyle, changedAddonStyle;

    if (!show) {
      changedStyle = {
        ...style,
        width: '0',
        transition: 'width 0ms'
      };
      changedAddonStyle = {
        ...addonStyle,
        display: 'none'
      };

      this.setState({
        style: changedStyle,
        addonStyle: changedAddonStyle
      });
    }
  }

  _renderAddon() {
    const { addonStyle } = this.state;
    const { ccStyle, width } = this.props;

    if (ccStyle === 'spread') {
      let rets = [];
      let changedAddonStyle;

      changedAddonStyle = {
        ...addonStyle,
        left: -parseInt(width, 10) / 2 + 'px',
        right: 0
      };
      rets.push(<div key="after" style={addonStyle} />);
      rets.push(<div key="before" style={changedAddonStyle} />);

      return rets;
    } else {
      return <div style={addonStyle} />;
    }
  }

  render() {
    const { style } = this.state;

    return (
      <div style={style} onTransitionEnd={this.handleTransitionEnd.bind(this)}>
        {this._renderAddon()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/LaserBeam/index.js