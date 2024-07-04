import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CustomizedSteppers from '../Stepper/stepper';

class ModalBox extends Component {
  render() {
    const { data } = this.props
    return (
      <div>
        <Dialog open={this.props.open} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            Life Cycle
            <span className="custom_close" onClick={this.props.onClose}>X</span>
          </DialogTitle>
          <DialogContent>
            <CustomizedSteppers data={data}></CustomizedSteppers>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}



export default ModalBox