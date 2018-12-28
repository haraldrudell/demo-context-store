/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {memo} from 'react'
import styled from 'styled-components'

const Styling = styled.div`
display: grid;
font: bolder 18pt sans-serif;
> div:first-child {
  grid-row: 1;
  grid-column: 1;
  margin-bottom: 24pt;
}
> div:nth-child(2) {
  grid-row: 1;
  grid-column: 2 / 4;
  text-align: center;
}
> div:nth-child(3) {
  grid-row: 1;
  grid-column: 4;
}
> div:nth-child(4) {
  grid-row: 2;
  grid-column: 1;
}
> div:nth-child(5) {
  grid-row: 2;
  grid-column: 2;
  text-align: center;
}
> div:nth-child(6) {
  grid-row: 2;
  grid-column: 3;
  text-align: center;
}
> div:nth-child(7) {
  grid-row: 2;
  grid-column: 4;
}
> div:nth-child(8) {
  grid-row: 3;
  grid-column: 2;
  text-align: center;
}
> div:nth-child(9) {
  grid-row: 3;
  grid-column: 3;
  text-align: center;
}
> div:nth-child(10) {
  grid-row: 4;
  grid-column: 2;
  text-align: center;
}
> div:nth-child(11) {
  grid-row: 4;
  grid-column: 3;
  text-align: center;
}
> div:nth-child(12) {
  grid-row: 5;
  grid-column: 2;
  text-align: center;
}
> div:nth-child(13) {
  grid-row: 5;
  grid-column: 3;
  text-align: center;
}
> div:nth-child(14) {
  grid-row: 6;
  grid-column: 2;
  text-align: center;
}
> div:nth-child(15) {
  grid-row: 6;
  grid-column: 3;
  text-align: center;
}
> div:nth-child(16) {
  grid-row: 6;
  grid-column: 4;
}
`
export default memo(() =>
  <Styling>
    {/* 1 */}<div>yarn start</div><div>Development Server &emsp; ⇒</div><div>Hot Update</div>
    {/* 4 */}<div>yarn ssr</div><div>Builder &emsp; ⇒</div><div>Production-Pipe &emsp; ⇒</div><div>Assets</div>
    {/* 8 */}<div>⇓</div><div>⇓</div>
    {/* 10 */}<div>Server-Side Pipe</div><div>⇓</div>
    {/* 12 */}<div>⇓</div><div>⇓</div>
    {/* 14 */}<div>Component-Markup &emsp; ⇒</div><div>index.html &emsp; ⇒</div><div>http/2</div>
  </Styling>)
