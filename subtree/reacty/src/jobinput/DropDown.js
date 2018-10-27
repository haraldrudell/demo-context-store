/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, {PureComponent} from 'react'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'

export default class DropDown extends PureComponent {
  render() {
    const {label, name, defVal, handleChange, opts} = this.props
    return <FormControl component='fieldset'>
      <InputLabel shrink htmlFor="age-label-placeholder">
        {label}
      </InputLabel>
      <Select
        value={defVal}
        onChange={handleChange}
        inputProps={{name}}
        >{opts.valueSeq().map((opt, i) =>
          <MenuItem value={String(opt.get('id'))} key={i}>{String(opt.get('label'))}</MenuItem>)}
      </Select>
    </FormControl>
  }
}
