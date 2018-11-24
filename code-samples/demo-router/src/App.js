/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, NavLink, Redirect } from 'react-router-dom'

const routeHome='/'
const routeAllUsers='/users'
const routeUserN = n => `/users/${n}`
const userMatcher='/users/:user?'
const elementList = (e, i, o) => i !== o.length ? <Fragment key={i}>{e}&emsp;</Fragment> : {e}
const navLink = {activeStyle: {background: 'yellow'}, exact: true}

export default () =>
  <><Router><>{[
    <NavLink to={routeHome} {...navLink}>Home</NavLink>,
    <NavLink to={routeAllUsers} {...navLink}>All Users</NavLink>,
    <NavLink to={routeUserN(1)} {...navLink}>User 1</NavLink>,
    <NavLink to={'/x'} {...navLink}>Broken link</NavLink>,
    ].map(elementList)}
    <Switch><>
      <Route exact path={routeHome} component={Home} />
      <Route path={userMatcher} component={Users} />
      <Route component={NotFound} />
    </></Switch>
  </></Router></>

const Home = ({match}) => // because exact match and no paranmeters, match is always empty
  <>{console.log('Home.render')}
    <h1>Home</h1>
    <div>prop match: {JSON.stringify(match)}</div>
    {[
    <Link to={routeAllUsers}>Browse all users</Link>,
    <Link to={routeUserN(1)}>Browse to About uri</Link>,
    ].map(elementList)}
  </>

const Users = ({match}) =>
  <>
    <h1>Users</h1>
    <div>{JSON.stringify(match)}</div>
    <div>Browse to <a href="/">Home</a> uri</div>
  </>

const NotFound = ({match}) => <div>Status code 404</div>
