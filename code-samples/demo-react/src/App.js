/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment, memo } from 'react'
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import Hooks from './Hooks'
import ChildRender from './ChildRender'
import HookUseState from './HookUseState'
import HookBind from './HookBind'
import ReRender from './ReRender'

let routes = [
  Hooks, ChildRender, HookUseState, HookBind, ReRender,
]

const componentNames = {
  0: 'Home',
  1: 'Hooks',
  3: 'HookUseState',
  4: 'HookBind',
  5: 'ReRender',
}
const routeMap = {}
const homeRoute = '/'

const getRoutes = () =>
  [Home].concat(routes)
  .map((component, i) => {
    const name = String(component.name || componentNames[i] || '')
    if (!name) throw new Error(`No name for component #${i}`)
    const route = (i && `/${name}`) || homeRoute
    if (routeMap[route]) throw new Error(`Duplicate route: #${route}`)
    return routeMap[route] = {name, component, route}})

const navLink = {activeStyle: {background: 'yellow'}, exact: true}

const Margin = styled.div`
max-width: 8.5in;
padding: 3em;
`
const LinkBox = styled.div`
display: flex;
flex-flow: row wrap;
`
export default () =>
  <Margin><Router><>
    <LinkBox>
      Links:
      <Route><>{routes.map(({route, name}, i) =>
        <Fragment key={i} >&emsp;<NavLink to={route} {...navLink}>{name}</NavLink></Fragment>)}
      </></Route>
    </LinkBox>

    <Route component={RouteName} /> {/* render={({location}) => console.log(location) || routeMap[location.pathname].name} />*/}

    <Switch>{/* render one of the destiations */}{routes.map(({route, component}, i) =>
      <Route key={i} exact path={route} component={component} />)}
      <Route exact path={homeRoute} component={Home} />)}
      <Route component={NotFound} />
    </Switch>
  </></Router></Margin>

const Home = memo(() => 'Please click a link above')

const RouteName = memo(({location}) => <h1>{Object(routeMap[location.pathname]).name || 'Unknown'}</h1>)

const NotFound = memo(({match}) => <div>Status code 404</div>)

routes = getRoutes() // once all constants present
