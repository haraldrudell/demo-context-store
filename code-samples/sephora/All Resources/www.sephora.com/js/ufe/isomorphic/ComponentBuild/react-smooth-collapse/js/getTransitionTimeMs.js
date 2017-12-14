'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTransitionTimeMs;
function getTransitionTimeMs(heightTransition) {
  var m = /(\d+(?:\.\d+)?|\.\d+)(m?s)\b/i.exec(heightTransition);
  if (!m) throw new Error('Could not parse time from transition value');
  return Number(m[1]) * (m[2].length === 1 ? 1000 : 1);
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9nZXRUcmFuc2l0aW9uVGltZU1zLmpzIl0sIm5hbWVzIjpbImdldFRyYW5zaXRpb25UaW1lTXMiLCJoZWlnaHRUcmFuc2l0aW9uIiwibSIsImV4ZWMiLCJFcnJvciIsIk51bWJlciIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBRXdCQSxtQjtBQUFULFNBQVNBLG1CQUFULENBQTZCQyxnQkFBN0IsRUFBK0Q7QUFDNUUsTUFBTUMsSUFBSSxnQ0FBZ0NDLElBQWhDLENBQXFDRixnQkFBckMsQ0FBVjtBQUNBLE1BQUksQ0FBQ0MsQ0FBTCxFQUFRLE1BQU0sSUFBSUUsS0FBSixDQUFVLDRDQUFWLENBQU47QUFDUixTQUFPQyxPQUFPSCxFQUFFLENBQUYsQ0FBUCxLQUFnQkEsRUFBRSxDQUFGLEVBQUtJLE1BQUwsS0FBZ0IsQ0FBaEIsR0FBb0IsSUFBcEIsR0FBMkIsQ0FBM0MsQ0FBUDtBQUNEIiwiZmlsZSI6ImdldFRyYW5zaXRpb25UaW1lTXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRUcmFuc2l0aW9uVGltZU1zKGhlaWdodFRyYW5zaXRpb246IHN0cmluZyk6IG51bWJlciB7XG4gIGNvbnN0IG0gPSAvKFxcZCsoPzpcXC5cXGQrKT98XFwuXFxkKykobT9zKVxcYi9pLmV4ZWMoaGVpZ2h0VHJhbnNpdGlvbik7XG4gIGlmICghbSkgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgcGFyc2UgdGltZSBmcm9tIHRyYW5zaXRpb24gdmFsdWUnKTtcbiAgcmV0dXJuIE51bWJlcihtWzFdKSAqIChtWzJdLmxlbmd0aCA9PT0gMSA/IDEwMDAgOiAxKTtcbn1cbiJdfQ==


//////////////////
// WEBPACK FOOTER
// ./~/react-smooth-collapse/js/getTransitionTimeMs.js
// module id = 920
// module chunks = 1