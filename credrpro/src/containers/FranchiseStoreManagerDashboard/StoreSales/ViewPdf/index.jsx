import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import './popUp.scss'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Card, CardBody } from 'reactstrap'

class ViewPDFFiles extends Component {

    showPdf = (pdf) => {
        window.open(pdf)
    }

    render() {
        const { viewPdfs, onClose, splittedPdfs } = this.props
        return (
            <Dialog
                open={viewPdfs}
                maxWidth="xs"
                fullWidth
                onClose={onClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle style={{ textAlign: 'center' }}>
                    View Token PDFs <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
                </DialogTitle>
                <Divider style={{ height: '1px' }} />
                <DialogContent>
                    <div>
                        <Card className="mt-2" style={{ marginLeft: '50px' }}>
                            <CardBody>
                                <table>
                                    {
                                        splittedPdfs.map((pdf, index) => (
                                            <tr style={{ marginTop: '15px' }}>
                                                <td style={{ width: '30%' }}> <p className="labelstyle">Receipt - {index + 1}</p></td>
                                                <td> <p className="labelstyle" style={{ marginLeft: '50px', marginRight: '50px' }}>:</p> </td>
                                                <td> <a href="# "onClick={() => this.showPdf(pdf)}> View </a> </td>
                                            </tr>
                                        ))
                                    }
                                </table>
                            </CardBody>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}

export default withRouter(connect()(ViewPDFFiles))