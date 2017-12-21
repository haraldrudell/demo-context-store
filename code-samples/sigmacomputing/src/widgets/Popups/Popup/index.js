// @flow
import * as React from 'react';
import { Manager, Target, Popper } from 'react-popper';

import PopupContent from './PopupContent';
import PopupTarget from './PopupTarget';

type PlacementOption =
  | 'auto'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'bottom-start'
  | 'left-start'
  | 'right-start'
  | 'top-end'
  | 'bottom-end'
  | 'left-end'
  | 'right-end';

type Props = {
  children?: React.Node,
  target?: any,
  popupPlacement?: PlacementOption,
  closeOnClick?: boolean,
  closeOnResize?: boolean,
  onClickTarget?: (SyntheticInputEvent<>) => void,
  onBlur?: () => void,
  inline?: boolean,
  width?: string,
  doNotLayer?: boolean,
  darkenLayer?: boolean,
  allowTyping?: boolean
};

type State = {
  popupOpen: boolean,
  left: ?string,
  top: ?string
};

export default class Popup extends React.Component<Props, State> {
  targetElement: any;
  contentContainer: ?HTMLElement;
  isItMounted: boolean;

  static defaultProps = {
    popupPlacement: 'auto',
    closeOnClick: true,
    closeOnResize: true,
    doNotLayer: false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      popupOpen: false,
      left: null,
      top: null
    };
  }

  componentWillMount() {
    if (this.props.target) {
      this.setTarget(this.props.target);
    }
  }

  componentDidMount() {
    this.isItMounted = true;
  }

  componentWillUnmount() {
    this.isItMounted = false;
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.target && this.props.target !== nextProps.target) {
      this.setTarget(nextProps.target);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.popupOpen !== this.state.popupOpen && this.state.popupOpen) {
      this.addEventListeners();
    } else if (
      prevState.popupOpen !== this.state.popupOpen &&
      !this.state.popupOpen
    ) {
      this.removeEventListeners();
    }
  }

  addEventListeners() {
    const body = document.body;
    if (!body) return;

    body.addEventListener('mousedown', this.onDocumentBodyUseMouse, true);
    body.addEventListener('keydown', this.onDocumentBodyKeyDown, false);
    body.addEventListener('wheel', this.onDocumentBodyUseMouse, true);
    window.addEventListener('resize', this.onWindowResize, true);
  }

  removeEventListeners() {
    const body = document.body;
    if (!body) return;

    body.removeEventListener('mousedown', this.onDocumentBodyUseMouse, true);
    body.removeEventListener('keydown', this.onDocumentBodyKeyDown, false);
    body.removeEventListener('wheel', this.onDocumentBodyUseMouse, true);
    window.removeEventListener('resize', this.onWindowResize, true);
  }

  onDocumentBodyUseMouse = (e: Event) => {
    const el = e.target;
    if (
      this.contentContainer &&
      el instanceof Node &&
      this.contentContainer.contains(el)
    )
      return;

    this.onClose();
  };

  onDocumentBodyKeyDown = (e: Event) => {
    if (e.keyCode === 27) {
      // Escape
      const { activeElement } = document;

      if (
        !activeElement ||
        !activeElement.tagName ||
        !/^INPUT|SELECT|TEXTAREA$/.test(activeElement.tagName)
      ) {
        this.onClose();
      }
    }
  };

  onWindowResize = () => {
    if (this.props.closeOnResize) this.onClose();
  };

  onClose = () => {
    if (this.isItMounted) this.setState({ popupOpen: false });
    if (this.props.onBlur) this.props.onBlur();
  };

  open = () => {
    if (this.targetElement) this.setState({ popupOpen: true });
  };

  setTarget = (target: any) => {
    if (React.isValidElement(target)) {
      this.targetElement = target;
    } else if (target.clientX && target.clientY) {
      this.targetElement = <div />;
      this.setState({
        popupOpen: true,
        left: target.clientX,
        top: target.clientY
      });
    }
  };

  onClickTarget = (evt: SyntheticInputEvent<>) => {
    if (this.targetElement) this.setState({ popupOpen: !this.state.popupOpen });
    if (this.props.onClickTarget) this.props.onClickTarget(evt);
  };

  onClickContent = (evt: SyntheticInputEvent<>) => {
    if (this.props.closeOnClick) this.onClose();
    evt.stopPropagation();
  };

  setContentContainer = (r: ?HTMLElement) => {
    this.contentContainer = r;
  };

  render() {
    const {
      children,
      popupPlacement,
      width,
      inline,
      doNotLayer,
      darkenLayer
    } = this.props;
    const { popupOpen, left, top } = this.state;

    return (
      <Manager>
        <Target>
          {({ targetProps }) => (
            <PopupTarget
              targetProps={targetProps}
              targetElement={this.targetElement}
              top={top}
              left={left}
              onClickTarget={this.onClickTarget}
              inline={inline}
            />
          )}
        </Target>
        {popupOpen && (
          <Popper placement={popupPlacement}>
            {({ popperProps }) => (
              <div>
                <PopupContent
                  popperProps={popperProps}
                  popupChildren={children}
                  popupOpen={popupOpen}
                  width={width}
                  doNotLayer={doNotLayer}
                  darkenLayer={darkenLayer}
                  onClickContent={this.onClickContent}
                  setContentContainer={this.setContentContainer}
                />
              </div>
            )}
          </Popper>
        )}
      </Manager>
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Popups/Popup/index.js