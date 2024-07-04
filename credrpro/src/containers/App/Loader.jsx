import React, { Component } from 'react'
import { connect } from 'react-redux'
import BackDrop from '@material-ui/core/Backdrop'
import Spinner from '@material-ui/core/CircularProgress'

class Loader extends Component {
  render() {
    const { isLoading } = this.props
    return (
      <BackDrop open={isLoading} classes={{ root: 'always-top' }}>
        <Spinner size={50} />
      </BackDrop>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.loader.isLoading
})

export default connect(mapStateToProps)(Loader)