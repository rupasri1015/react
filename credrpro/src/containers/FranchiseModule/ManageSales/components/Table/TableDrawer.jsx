import React, { Component } from 'react'
import Drawer from '@material-ui/core/Drawer'
import pdf from '../../../../../shared/img/icons/PDFIcon.svg'
import './table_drawer.scss'

class TableDrawer extends Component {

    downloadReceipt = (pdf) => {
        window.open(pdf)
    }

    render() {
        const { drawer, rowInfo, splittedUrls, status, saleData } = this.props
        return (
            <Drawer
                className={drawer}
                variant="permanent"
                transitionDuration={{ enter: 500, exit: 1000 }}
                anchor="right"
            >
                <div className="row">
                    {
                        status === 'TOKEN' ?
                            <div className="col-md-12">
                                <h5 className='call-header'> Pay Remaining: {rowInfo.registrationNumber} </h5>
                            </div> :
                            <div className="col-md-12">
                                <h5 className='call-header'> Documents </h5>
                            </div>
                    }
                    {
                        splittedUrls && Boolean(splittedUrls.length) &&
                        <div className="col-md-12" style={{ marginLeft: '10px' }}>
                            <h5 style={{ fontFamily: 'ProximaNovaSemibold' }}> Transaction Reciepts </h5>
                        </div>
                    }
                    <br />
                    <br />
                    {
                        splittedUrls && Boolean(splittedUrls.length) &&
                        splittedUrls.map((url, index) => (
                            <div className='row' style={{ marginLeft: '10px', marginTop: '8px' }}>
                                <div className="col-sm-12">
                                    <button className='pdfBtn' onClick={() => this.downloadReceipt(url)}>
                                        <img src={pdf} alt='pdf' style={{ width: '17px', marginRight: '7px' }} />
                                        Reciept - {index + 1}
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                    {
                        saleData && saleData[0] &&
                        <div className="col-md-12" style={{ marginLeft: '10px', marginTop: '20px', marginBottom: '8px' }}>
                            <h5 style={{ fontFamily: 'ProximaNovaSemibold' }}> Sale Documents </h5>
                        </div>
                    }
                    {
                        saleData && saleData[0] && saleData[0].invoiceUrl &&
                        <div className="col-sm-6" style={{ marginTop: '10px', textAlign: 'center' }}>
                            <button className='pdfBtn' onClick={() => this.downloadReceipt(saleData && saleData[0] && saleData[0].invoiceUrl)}>
                                <img src={pdf} alt='pdf' style={{ width: '17px', marginRight: '7px' }} />
                                Invoice
                            </button>
                        </div>
                    }
                    {
                        saleData && saleData[0] && saleData[0].prodWarrUrl &&
                        <div className="col-sm-6" style={{ marginTop: '10px', textAlign: 'center' }}>
                            <button className='pdfBtn' onClick={() => this.downloadReceipt(saleData && saleData[0] && saleData[0].prodWarrUrl)}>
                                <img src={pdf} alt='pdf' style={{ width: '17px', marginRight: '7px' }} />
                                Warranty
                            </button>
                        </div>
                    }
                    {
                        saleData && saleData[0] && saleData[0].salesRecUrl &&
                        <div className="col-sm-6" style={{ marginTop: '10px', textAlign: 'center' }}>
                            <button className='pdfBtn' onClick={() => this.downloadReceipt(saleData && saleData[0] && saleData[0].salesRecUrl)}>
                                <img src={pdf} alt='pdf' style={{ width: '17px', marginRight: '7px' }} />
                                Sale Receipt
                            </button>
                        </div>
                    }
                    {
                        saleData && saleData[0] && saleData[0].selfDecUrl &&
                        <div className="col-sm-6" style={{ marginTop: '10px', textAlign: 'center' }}>
                            <button className='pdfBtn' onClick={() => this.downloadReceipt(saleData && saleData[0] && saleData[0].selfDecUrl)}>
                                <img src={pdf} alt='pdf' style={{ width: '17px', marginRight: '7px' }} />
                                Self Declaration
                            </button>
                        </div>
                    }

                </div>
            </Drawer>
        )
    }
}

export default TableDrawer