'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _kefir = require('kefir');

var _kefir2 = _interopRequireDefault(_kefir);

var _kefirBus = require('kefir-bus');

var _kefirBus2 = _interopRequireDefault(_kefirBus);

var _getTransitionTimeMs = require('./getTransitionTimeMs');

var _getTransitionTimeMs2 = _interopRequireDefault(_getTransitionTimeMs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SmoothCollapse = function (_React$Component) {
  (0, _inherits3.default)(SmoothCollapse, _React$Component);

  function SmoothCollapse(props) {
    (0, _classCallCheck3.default)(this, SmoothCollapse);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SmoothCollapse.__proto__ || (0, _getPrototypeOf2.default)(SmoothCollapse)).call(this, props));

    _this._resetter = (0, _kefirBus2.default)();

    _this.state = {
      hasBeenVisibleBefore: props.expanded || _this._visibleWhenClosed(),
      fullyClosed: !props.expanded,
      height: props.expanded ? 'auto' : props.collapsedHeight
    };
    return _this;
  }

  (0, _createClass3.default)(SmoothCollapse, [{
    key: '_visibleWhenClosed',
    value: function _visibleWhenClosed(props) {
      if (!props) props = this.props;
      return parseFloat(props.collapsedHeight) !== 0;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._resetter.emit(null);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (!this.props.expanded && nextProps.expanded) {
        this._resetter.emit(null);

        // In order to expand, we need to know the height of the children, so we
        // need to setState first so they get rendered before we continue.

        this.setState({
          fullyClosed: false,
          hasBeenVisibleBefore: true
        }, function () {
          // Set the collapser to the target height instead of auto so that it
          // animates correctly. Then switch it to 'auto' after the animation so
          // that it flows correctly if the page is resized.
          var targetHeight = _this2.refs.inner.clientHeight + 'px';
          _this2.setState({
            height: targetHeight
          });

          // Wait until the transitionend event, or until a timer goes off in
          // case the event doesn't fire because the browser doesn't support it
          // or the element is hidden before it happens. The timer is a little
          // longer than the transition is supposed to take to make sure we don't
          // cut the animation early while it's still going if the browser is
          // running it just a little slow.
          _kefir2.default.fromEvents(_this2.refs.main, 'transitionend').merge(_kefir2.default.later((0, _getTransitionTimeMs2.default)(nextProps.heightTransition) * 1.1 + 500)).takeUntilBy(_this2._resetter).take(1).onValue(function () {
            _this2.setState({
              height: 'auto'
            }, function () {
              if (_this2.props.onChangeEnd) {
                _this2.props.onChangeEnd();
              }
            });
          });
        });
      } else if (this.props.expanded && !nextProps.expanded) {
        this._resetter.emit(null);

        this.setState({
          height: this.refs.inner.clientHeight + 'px'
        }, function () {
          _this2.refs.main.clientHeight; // force the page layout
          _this2.setState({
            height: nextProps.collapsedHeight
          });

          // See comment above about previous use of transitionend event.
          _kefir2.default.fromEvents(_this2.refs.main, 'transitionend').merge(_kefir2.default.later((0, _getTransitionTimeMs2.default)(nextProps.heightTransition) * 1.1 + 500)).takeUntilBy(_this2._resetter).take(1).onValue(function () {
            _this2.setState({
              fullyClosed: true
            });
            if (_this2.props.onChangeEnd) {
              _this2.props.onChangeEnd();
            }
          });
        });
      } else if (!nextProps.expanded && this.props.collapsedHeight !== nextProps.collapsedHeight) {
        this.setState({
          hasBeenVisibleBefore: this.state.hasBeenVisibleBefore || this._visibleWhenClosed(nextProps),
          height: nextProps.collapsedHeight
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var visibleWhenClosed = this._visibleWhenClosed();
      var _state = this.state,
          height = _state.height,
          fullyClosed = _state.fullyClosed,
          hasBeenVisibleBefore = _state.hasBeenVisibleBefore;

      var innerEl = hasBeenVisibleBefore ? _react2.default.createElement(
        'div',
        { ref: 'inner', style: { overflow: 'hidden' } },
        this.props.children
      ) : null;

      return _react2.default.createElement(
        'div',
        {
          ref: 'main',
          style: {
            height: height, overflow: 'hidden',
            display: fullyClosed && !visibleWhenClosed ? 'none' : null,
            transition: 'height ' + this.props.heightTransition
          }
        },
        innerEl
      );
    }
  }]);
  return SmoothCollapse;
}(_react2.default.Component);

SmoothCollapse.propTypes = {
  expanded: _propTypes2.default.bool.isRequired,
  onChangeEnd: _propTypes2.default.func,
  collapsedHeight: _propTypes2.default.string,
  heightTransition: _propTypes2.default.string
};
SmoothCollapse.defaultProps = {
  collapsedHeight: '0',
  heightTransition: '.25s ease'
};
exports.default = SmoothCollapse;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJTbW9vdGhDb2xsYXBzZSIsInByb3BzIiwiX3Jlc2V0dGVyIiwic3RhdGUiLCJoYXNCZWVuVmlzaWJsZUJlZm9yZSIsImV4cGFuZGVkIiwiX3Zpc2libGVXaGVuQ2xvc2VkIiwiZnVsbHlDbG9zZWQiLCJoZWlnaHQiLCJjb2xsYXBzZWRIZWlnaHQiLCJwYXJzZUZsb2F0IiwiZW1pdCIsIm5leHRQcm9wcyIsInNldFN0YXRlIiwidGFyZ2V0SGVpZ2h0IiwicmVmcyIsImlubmVyIiwiY2xpZW50SGVpZ2h0IiwiZnJvbUV2ZW50cyIsIm1haW4iLCJtZXJnZSIsImxhdGVyIiwiaGVpZ2h0VHJhbnNpdGlvbiIsInRha2VVbnRpbEJ5IiwidGFrZSIsIm9uVmFsdWUiLCJvbkNoYW5nZUVuZCIsInZpc2libGVXaGVuQ2xvc2VkIiwiaW5uZXJFbCIsIm92ZXJmbG93IiwiY2hpbGRyZW4iLCJkaXNwbGF5IiwidHJhbnNpdGlvbiIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsImJvb2wiLCJpc1JlcXVpcmVkIiwiZnVuYyIsInN0cmluZyIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7SUFrQnFCQSxjOzs7QUFlbkIsMEJBQVlDLEtBQVosRUFBMEI7QUFBQTs7QUFBQSxzSkFDbEJBLEtBRGtCOztBQUFBLFVBZDFCQyxTQWMwQixHQWRkLHlCQWNjOztBQUV4QixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsNEJBQXNCSCxNQUFNSSxRQUFOLElBQWtCLE1BQUtDLGtCQUFMLEVBRDdCO0FBRVhDLG1CQUFhLENBQUNOLE1BQU1JLFFBRlQ7QUFHWEcsY0FBUVAsTUFBTUksUUFBTixHQUFpQixNQUFqQixHQUEwQkosTUFBTVE7QUFIN0IsS0FBYjtBQUZ3QjtBQU96Qjs7Ozt1Q0FFa0JSLEssRUFBZTtBQUNoQyxV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TCxFQUExQjtBQURPLG1CQUU2QyxLQUFLSCxLQUZsRDtBQUFBLFVBRUFLLE1BRkEsVUFFQUEsTUFGQTtBQUFBLFVBRVFELFdBRlIsVUFFUUEsV0FGUjtBQUFBLFVBRXFCSCxvQkFGckIsVUFFcUJBLG9CQUZyQjs7QUFHUCxVQUFNd0IsVUFBVXhCLHVCQUNkO0FBQUE7QUFBQSxVQUFLLEtBQUksT0FBVCxFQUFpQixPQUFPLEVBQUN5QixVQUFVLFFBQVgsRUFBeEI7QUFDSyxhQUFLNUIsS0FBTixDQUFpQjZCO0FBRHJCLE9BRGMsR0FJWixJQUpKOztBQU1BLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsZUFBSSxNQUROO0FBRUUsaUJBQU87QUFDTHRCLDBCQURLLEVBQ0dxQixVQUFVLFFBRGI7QUFFTEUscUJBQVV4QixlQUFlLENBQUNvQixpQkFBakIsR0FBc0MsTUFBdEMsR0FBOEMsSUFGbEQ7QUFHTEssb0NBQXNCLEtBQUsvQixLQUFMLENBQVdxQjtBQUg1QjtBQUZUO0FBUUdNO0FBUkgsT0FERjtBQVlEOzs7RUFoSXlDLGdCQUFNSyxTOztBQUE3QmpDLGMsQ0FJWmtDLFMsR0FBWTtBQUNqQjdCLFlBQVUsb0JBQVU4QixJQUFWLENBQWVDLFVBRFI7QUFFakJWLGVBQWEsb0JBQVVXLElBRk47QUFHakI1QixtQkFBaUIsb0JBQVU2QixNQUhWO0FBSWpCaEIsb0JBQWtCLG9CQUFVZ0I7QUFKWCxDO0FBSkF0QyxjLENBVVp1QyxZLEdBQTZCO0FBQ2xDOUIsbUJBQWlCLEdBRGlCO0FBRWxDYSxvQkFBa0I7QUFGZ0IsQztrQkFWakJ0QixjIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgS2VmaXIgZnJvbSAna2VmaXInO1xuaW1wb3J0IGtlZmlyQnVzIGZyb20gJ2tlZmlyLWJ1cyc7XG5cbmltcG9ydCBnZXRUcmFuc2l0aW9uVGltZU1zIGZyb20gJy4vZ2V0VHJhbnNpdGlvblRpbWVNcyc7XG5cbmV4cG9ydCB0eXBlIFByb3BzID0ge1xuICBleHBhbmRlZDogYm9vbGVhbjtcbiAgb25DaGFuZ2VFbmQ/OiA/KCkgPT4gdm9pZDtcbiAgY29sbGFwc2VkSGVpZ2h0OiBzdHJpbmc7XG4gIGhlaWdodFRyYW5zaXRpb246IHN0cmluZztcbn07XG50eXBlIFN0YXRlID0ge1xuICBoYXNCZWVuVmlzaWJsZUJlZm9yZTogYm9vbGVhbjtcbiAgZnVsbHlDbG9zZWQ6IGJvb2xlYW47XG4gIGhlaWdodDogc3RyaW5nO1xufTtcbnR5cGUgRGVmYXVsdFByb3BzID0ge1xuICBjb2xsYXBzZWRIZWlnaHQ6IHN0cmluZztcbiAgaGVpZ2h0VHJhbnNpdGlvbjogc3RyaW5nO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU21vb3RoQ29sbGFwc2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBfcmVzZXR0ZXIgPSBrZWZpckJ1cygpO1xuICBwcm9wczogUHJvcHM7XG4gIHN0YXRlOiBTdGF0ZTtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBleHBhbmRlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBvbkNoYW5nZUVuZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgY29sbGFwc2VkSGVpZ2h0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGhlaWdodFRyYW5zaXRpb246IFByb3BUeXBlcy5zdHJpbmdcbiAgfTtcbiAgc3RhdGljIGRlZmF1bHRQcm9wczogRGVmYXVsdFByb3BzID0ge1xuICAgIGNvbGxhcHNlZEhlaWdodDogJzAnLFxuICAgIGhlaWdodFRyYW5zaXRpb246ICcuMjVzIGVhc2UnXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBoYXNCZWVuVmlzaWJsZUJlZm9yZTogcHJvcHMuZXhwYW5kZWQgfHwgdGhpcy5fdmlzaWJsZVdoZW5DbG9zZWQoKSxcbiAgICAgIGZ1bGx5Q2xvc2VkOiAhcHJvcHMuZXhwYW5kZWQsXG4gICAgICBoZWlnaHQ6IHByb3BzLmV4cGFuZGVkID8gJ2F1dG8nIDogcHJvcHMuY29sbGFwc2VkSGVpZ2h0XG4gICAgfTtcbiAgfVxuXG4gIF92aXNpYmxlV2hlbkNsb3NlZChwcm9wczogP1Byb3BzKSB7XG4gICAgaWYgKCFwcm9wcykgcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHByb3BzLmNvbGxhcHNlZEhlaWdodCkgIT09IDA7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLl9yZXNldHRlci5lbWl0KG51bGwpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IFByb3BzKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmV4cGFuZGVkICYmIG5leHRQcm9wcy5leHBhbmRlZCkge1xuICAgICAgdGhpcy5fcmVzZXR0ZXIuZW1pdChudWxsKTtcblxuICAgICAgLy8gSW4gb3JkZXIgdG8gZXhwYW5kLCB3ZSBuZWVkIHRvIGtub3cgdGhlIGhlaWdodCBvZiB0aGUgY2hpbGRyZW4sIHNvIHdlXG4gICAgICAvLyBuZWVkIHRvIHNldFN0YXRlIGZpcnN0IHNvIHRoZXkgZ2V0IHJlbmRlcmVkIGJlZm9yZSB3ZSBjb250aW51ZS5cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZ1bGx5Q2xvc2VkOiBmYWxzZSxcbiAgICAgICAgaGFzQmVlblZpc2libGVCZWZvcmU6IHRydWVcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgLy8gU2V0IHRoZSBjb2xsYXBzZXIgdG8gdGhlIHRhcmdldCBoZWlnaHQgaW5zdGVhZCBvZiBhdXRvIHNvIHRoYXQgaXRcbiAgICAgICAgLy8gYW5pbWF0ZXMgY29ycmVjdGx5LiBUaGVuIHN3aXRjaCBpdCB0byAnYXV0bycgYWZ0ZXIgdGhlIGFuaW1hdGlvbiBzb1xuICAgICAgICAvLyB0aGF0IGl0IGZsb3dzIGNvcnJlY3RseSBpZiB0aGUgcGFnZSBpcyByZXNpemVkLlxuICAgICAgICBjb25zdCB0YXJnZXRIZWlnaHQgPSBgJHt0aGlzLnJlZnMuaW5uZXIuY2xpZW50SGVpZ2h0fXB4YDtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgaGVpZ2h0OiB0YXJnZXRIZWlnaHRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV2FpdCB1bnRpbCB0aGUgdHJhbnNpdGlvbmVuZCBldmVudCwgb3IgdW50aWwgYSB0aW1lciBnb2VzIG9mZiBpblxuICAgICAgICAvLyBjYXNlIHRoZSBldmVudCBkb2Vzbid0IGZpcmUgYmVjYXVzZSB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgaXRcbiAgICAgICAgLy8gb3IgdGhlIGVsZW1lbnQgaXMgaGlkZGVuIGJlZm9yZSBpdCBoYXBwZW5zLiBUaGUgdGltZXIgaXMgYSBsaXR0bGVcbiAgICAgICAgLy8gbG9uZ2VyIHRoYW4gdGhlIHRyYW5zaXRpb24gaXMgc3VwcG9zZWQgdG8gdGFrZSB0byBtYWtlIHN1cmUgd2UgZG9uJ3RcbiAgICAgICAgLy8gY3V0IHRoZSBhbmltYXRpb24gZWFybHkgd2hpbGUgaXQncyBzdGlsbCBnb2luZyBpZiB0aGUgYnJvd3NlciBpc1xuICAgICAgICAvLyBydW5uaW5nIGl0IGp1c3QgYSBsaXR0bGUgc2xvdy5cbiAgICAgICAgS2VmaXIuZnJvbUV2ZW50cyh0aGlzLnJlZnMubWFpbiwgJ3RyYW5zaXRpb25lbmQnKVxuICAgICAgICAgIC5tZXJnZShLZWZpci5sYXRlcihnZXRUcmFuc2l0aW9uVGltZU1zKG5leHRQcm9wcy5oZWlnaHRUcmFuc2l0aW9uKSoxLjEgKyA1MDApKVxuICAgICAgICAgIC50YWtlVW50aWxCeSh0aGlzLl9yZXNldHRlcilcbiAgICAgICAgICAudGFrZSgxKVxuICAgICAgICAgIC5vblZhbHVlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBoZWlnaHQ6ICdhdXRvJ1xuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkNoYW5nZUVuZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2VFbmQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5leHBhbmRlZCAmJiAhbmV4dFByb3BzLmV4cGFuZGVkKSB7XG4gICAgICB0aGlzLl9yZXNldHRlci5lbWl0KG51bGwpO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaGVpZ2h0OiBgJHt0aGlzLnJlZnMuaW5uZXIuY2xpZW50SGVpZ2h0fXB4YFxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZnMubWFpbi5jbGllbnRIZWlnaHQ7IC8vIGZvcmNlIHRoZSBwYWdlIGxheW91dFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBoZWlnaHQ6IG5leHRQcm9wcy5jb2xsYXBzZWRIZWlnaHRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2VlIGNvbW1lbnQgYWJvdmUgYWJvdXQgcHJldmlvdXMgdXNlIG9mIHRyYW5zaXRpb25lbmQgZXZlbnQuXG4gICAgICAgIEtlZmlyLmZyb21FdmVudHModGhpcy5yZWZzLm1haW4sICd0cmFuc2l0aW9uZW5kJylcbiAgICAgICAgICAubWVyZ2UoS2VmaXIubGF0ZXIoZ2V0VHJhbnNpdGlvblRpbWVNcyhuZXh0UHJvcHMuaGVpZ2h0VHJhbnNpdGlvbikqMS4xICsgNTAwKSlcbiAgICAgICAgICAudGFrZVVudGlsQnkodGhpcy5fcmVzZXR0ZXIpXG4gICAgICAgICAgLnRha2UoMSlcbiAgICAgICAgICAub25WYWx1ZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgZnVsbHlDbG9zZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMub25DaGFuZ2VFbmQpIHtcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZUVuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICghbmV4dFByb3BzLmV4cGFuZGVkICYmIHRoaXMucHJvcHMuY29sbGFwc2VkSGVpZ2h0ICE9PSBuZXh0UHJvcHMuY29sbGFwc2VkSGVpZ2h0KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaGFzQmVlblZpc2libGVCZWZvcmU6XG4gICAgICAgICAgdGhpcy5zdGF0ZS5oYXNCZWVuVmlzaWJsZUJlZm9yZSB8fCB0aGlzLl92aXNpYmxlV2hlbkNsb3NlZChuZXh0UHJvcHMpLFxuICAgICAgICBoZWlnaHQ6IG5leHRQcm9wcy5jb2xsYXBzZWRIZWlnaHRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB2aXNpYmxlV2hlbkNsb3NlZCA9IHRoaXMuX3Zpc2libGVXaGVuQ2xvc2VkKCk7XG4gICAgY29uc3Qge2hlaWdodCwgZnVsbHlDbG9zZWQsIGhhc0JlZW5WaXNpYmxlQmVmb3JlfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgaW5uZXJFbCA9IGhhc0JlZW5WaXNpYmxlQmVmb3JlID9cbiAgICAgIDxkaXYgcmVmPVwiaW5uZXJcIiBzdHlsZT17e292ZXJmbG93OiAnaGlkZGVuJ319PlxuICAgICAgICB7ICh0aGlzLnByb3BzOmFueSkuY2hpbGRyZW4gfVxuICAgICAgPC9kaXY+XG4gICAgICA6IG51bGw7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9XCJtYWluXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICBkaXNwbGF5OiAoZnVsbHlDbG9zZWQgJiYgIXZpc2libGVXaGVuQ2xvc2VkKSA/ICdub25lJzogbnVsbCxcbiAgICAgICAgICB0cmFuc2l0aW9uOiBgaGVpZ2h0ICR7dGhpcy5wcm9wcy5oZWlnaHRUcmFuc2l0aW9ufWBcbiAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICB7aW5uZXJFbH1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==


//////////////////
// WEBPACK FOOTER
// ./~/react-smooth-collapse/js/index.js
// module id = 828
// module chunks = 1