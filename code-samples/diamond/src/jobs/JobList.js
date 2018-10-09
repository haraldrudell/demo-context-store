/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment, PureComponent} from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Job from './Job'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import styled from 'styled-components'

const JobsContainer = styled.div`
display: flex
flex-wrap: wrap
margin-bottom: 20px
`
const ButtonWrapper = styled.span`
margin-left: 1em
`

export default class JobList extends PureComponent {
  addJobHandler = this.addJobHandler.bind(this)

  addJobHandler(e) {
    const {action} = this.props
    e.preventDefault()
    action()
  }

  render () {
    const {jobs, classes = {}} = this.props // jobs is immutable OrderedMap
    console.log('JobList.render:', jobs)
    return <Fragment>
        <Typography variant='display1' gutterBottom>
          jobs
          <ButtonWrapper>
            <Button onClick={this.addJobHandler} variant="fab" color="primary" aria-label="Add" className={classes.button}>
              <AddIcon />
            </Button>
          </ButtonWrapper>
        </Typography>
        <JobsContainer>
          {jobs.keySeq().map(id => <Job id={id} action={this.jobAction} key={id} />)}
        </JobsContainer>
        <Paper>
          End of job list
        </Paper>
      </Fragment>
  }
}
