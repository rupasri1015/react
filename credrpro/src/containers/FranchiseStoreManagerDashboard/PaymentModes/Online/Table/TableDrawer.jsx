import React, { Component } from 'react'
import { getAmount } from '../../../../../core/utility'
import Drawer from '@material-ui/core/Drawer'
import './table_drawer.scss'

class TableDrawer extends Component {

    state = {
        checkBoxStatus: true
    }

    managePaymentOption = (e) => {
        const { checkBoxStatus } = this.state
        this.setState({ checkBoxStatus: !checkBoxStatus })
    }

    initiateRazorPayPayment = () => {
        const { OnInitiateRazorPayPayment } = this.props
        OnInitiateRazorPayPayment()
    }

    payUsingWalletAndRazor = () => {
        const { onPayUsingWalletAndRazor } = this.props
        onPayUsingWalletAndRazor()
    }

    reedemFromWallet = () => {
        const { onRedeemFromWallet } = this.props
        onRedeemFromWallet()
    }

    render() {
        const { drawer, pendingAmount, pendingPaymentAmount, walletBallance, cfp } = this.props
        const { checkBoxStatus } = this.state
        return (
            <Drawer
                className={drawer}
                variant="permanent"
                transitionDuration={{ enter: 500, exit: 1000 }}
                anchor="right"
            >
                <div className="row">
                    <div className="col-md-12">
                        <h5 className='call-header'>Make online payment</h5>
                    </div>
                    <div className="col-12" style={{ padding: '10px', paddingLeft: '30px' }}>
                        <p> Total Amount :{getAmount(pendingAmount)} </p>
                    </div>
                    <div className="col-12" style={{ padding: '10px', paddingLeft: '30px' }}>
                        <input type="checkbox" id="amount" name="amount" value='' checked={checkBoxStatus} className='checkBoxWallet' onChange={(e) => this.managePaymentOption(e)} />
                        <label htmlFor="existingBalance" className='spaceBetween' style={{ marginLeft: '3px' }}> Existing Balance: {getAmount(walletBallance)} </label><br></br>
                    </div>
                    <div className="col-12" style={{ padding: '10px', paddingLeft: '30px' }}>
                        {
                            !checkBoxStatus ?
                                < button type="button" className={cfp === '0' ? "disableColor" : "enableColor"} onClick={this.initiateRazorPayPayment} disabled={cfp === '0' ? true : false}> Make Payment </button>
                                :
                                checkBoxStatus && pendingAmount <= walletBallance ?
                                    < button type="button" className={cfp === '0' ? "disableColor" : "enableColor"} onClick={this.reedemFromWallet} disabled={cfp === '0' ? true : false}>Confirm Payment </button>
                                    :
                                    < button type="button" className={cfp === '0' ? "disableColor" : "enableColor"} onClick={this.payUsingWalletAndRazor} disabled={cfp === '0' ? true : false}> Make Payment</button>
                        }
                    </div>
                </div>
            </Drawer>
        )
    }
}

export default TableDrawer