import React from 'react'
import Radio from '@material-ui/core/Radio'
import { withStyles } from '@material-ui/core/styles'

const GreenRadio = withStyles({
  root: {
    color: "#009688",
    '&$checked': {
      color: "#009688",
    }
  },
  checked: {
    color: "red"
  }
})(props => <Radio color="default" {...props} />)

export default GreenRadio