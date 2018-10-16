/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Error from 'errorx/Error'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card0 from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import sizeMe from 'react-sizeme'

const Card = withStyles({
  root: {
    height: 220,
  }
})(Card0)

class Data extends Component {
  render() {
    return <Query query={gql`{
        notes {
          id
          title
          text
        }
      }`}>{({ loading, error, data }) => {
        if (loading) return <CircularProgress />
        if (error) {
          const ge = error.graphQLErrors
          const get = 'GraphQL Error'
          const ne = error.networkError
          const net = 'Network Error'
          return <div>
            {ge && ge.length ? ge.map((e, i) => <Error title={get} e={e} key={i} />) : `no ${get}`}<br/>
            {ne ? <Error title={net} e={ne} /> : `no ${net}`}<br/>
            <Error title='Data retrieval failed' e={error} />
          </div>
        }
        const {notes} = data

        return <div style={{backgroundColor: 'yellow'}}>{this.props.size.height}<br/>{notes.map(({title, text}, i) =>
          <Card key={i}><CardContent>
              <Typography gutterBottom variant="headline" component="h2">
                {title}
              </Typography>
              <Typography component="p">
                {text}
              </Typography>
          </CardContent></Card>
        )}</div>
      }}</Query>
  }
}

export default sizeMe({ monitorHeight: true })(Data)
