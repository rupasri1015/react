import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

class ViewUTRReceipt extends Component {

  state = {
    selectedItem: 0
  }

  openImageByCount = (index, list) => {
    window.open(list[index].images)
  }

  setCurrentImage = index => {
    this.setState({ selectedItem: index })
  }

  render() {

    const { open, getBikeDocs, onClose } = this.props
    const { selectedItem } = this.state

    return (
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        onClose={onClose}
      >
        <DialogTitle ><CloseIcon className="modalclosebutton" onClick={onClose} />UTR Receipt</DialogTitle>
        <DialogContent>
          <Carousel selectedItem={this.state.selectedItem} onChange={this.setCurrentImage}>
            {
              Boolean(getBikeDocs.length) && getBikeDocs.map(val =>
                <div className="inner" key={val.images}  >
                  <img src={val.images} alt="Utr Receipt" />
                  <div className="legend">
                    <div>UTR Number - {val.utrNum}</div>
                    <div>Amount  - {val.amountPaid}</div>
                  </div>
                </div>
              )
            }
          </Carousel>
          <div className="text-center">
            <button type="button" className="btn-primary btn" onClick={() => this.openImageByCount(selectedItem, getBikeDocs)} >{`View Image - ${selectedItem + 1}`}</button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

export default ViewUTRReceipt