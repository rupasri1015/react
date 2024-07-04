import React from 'react'
import BackDrop from '@material-ui/core/Backdrop'
import Spinner from '@material-ui/core/CircularProgress'

const SuspenseLoader = () => (
  <BackDrop open={true} classes={{ root: 'always-top' }}>
    <Spinner size={50} />
  </BackDrop>
)

export default SuspenseLoader