import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import { renderString, getFmEditPrice, renderCommaSeparated, getAmount } from '../../../core/utility'
import edit from '../../../shared/img/icons/edit-icon.svg'
import { setNotification } from '../../../redux/actions/notificationAction'

class BufferDataTable extends Component {

  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  state = {
    newFmPrice: null,
    enableTextbox: false,
    fmPriceError: false
  }

  componentDidMount() {
    if(this.state.enableTextbox === true) {
      this.input.current.focus()
    }
  }

  setPrice = (e)  => {
    // const regexp = /^[0-9\b]+$/
    // if (e.target.value === '' || regexp.test(e.target.value)) {
      if(e.target.value.length !== 8)
      this.setState({ newFmPrice: e.target.value })
   // }
  } 

  setNewFmPrice = () => {
    this.setState({ enableTextbox: true })
    this.input.current.focus()
  }

  submitNewPrice = () => {
    const { priceData, onSubmitForm, dispatch } = this.props
    const { newFmPrice  } = this.state
    const payload = {
      fmPrice: newFmPrice,
      leadId: priceData.leadId,
      cvUserId: priceData.cvUserId
    }
    if (payload.fmPrice === null || payload.fmPrice === ''){
      this.setState({fmPriceError : true})
    }
    else
    onSubmitForm(payload)
  }

  render() {
    const { isOpen, onClose, title, columns, data, priceData } = this.props
    const { newFmPrice, enableTextbox , fmPriceError} = this.state
    return (
      <Dialog
    open={isOpen}
    onClose={onClose}
    maxWidth="md"
  >
    <DialogTitle>
      {title} <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
    </DialogTitle>
    <DialogContent>
      <div className="table-wraper">
        <Table size="small">
          <TableHead style={{ backgroundColor: "#F4F7FD" }}>
            <TableRow>
              {
                columns.map(column => (
                  <TableCell
                    key={column.id}
                  >
                    {column.label}
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
                <TableRow tabIndex={-1}>
                  {
                    columns.map(column => (
                      <TableCell
                        key={column.id}
                      >
                        {
                          data[column.id] === 0 ? '0' : (column.id === 'fmPrice') && (priceData.leadStatus === "REQUEST_NEW_PRICE") ? 
                          (<div className="row"> <input type="number" ref={this.input} disabled={!enableTextbox} value={newFmPrice === null ? priceData.fmPrice : newFmPrice} onChange={(e) => this.setPrice(e)} style={{maxWidth: 80, padding: 3}}></input> <img src={edit} alt="Edit FM Price" id={column.id} role="button" className="action-icon ml-3"  align="right"  onClick={() => this.setNewFmPrice()}/> </div>)
                          : (column.id === 'refurbDeductions') ? '' : renderString(data[column.id])
                        }
                        {
                            data[column.id] === 0 ? '0' : (column.id === 'refurbDeductions') && 
                            (data[column.id] !== null) &&
                            data[column.id].split(',').map(place => <p> {place}; </p>)
                        }
                        {
                          data[column.id] === 0 ? '0' : (column.id === 'refurbDeductions') && 
                          (data[column.id] === null) && '-'
                        }
                        {
                          (column.id === "fmPrice") ?
                          fmPriceError && <p style={{color: 'red', marginLeft: -19}}> *Please Enter FM Price </p> :
                          <></>
                        }
                      </TableCell>
                    ))
                  }
                </TableRow>
            }
          </TableBody>
        </Table>
      </div>
    </DialogContent>
    <DialogActions>
      <button className="icon-btn" onClick={() => onClose()}>Close</button>
      {
        priceData.leadStatus === "REQUEST_NEW_PRICE" &&
        <button className="icon-btn" onClick={this.submitNewPrice} style={{backgroundColor: '#4caf50'}}>Submit</button>
      }
    </DialogActions>
  </Dialog>
    )
  }

}
export default BufferDataTable