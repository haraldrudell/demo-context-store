/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

export default () =>
  <form>
    <TextField
      label='TopText'
      value='Value'
      name={'textfield'}
      />
    &emsp;
    <FormControl>
      <InputLabel>inputLabel</InputLabel>
      <Select
        value='id2'
        inputProps={{name: 'select'}}
        >
        <MenuItem value='id1'>Option 1</MenuItem>
        <MenuItem value='id2'>Option 2</MenuItem>
      </Select>
    </FormControl>
  </form>
