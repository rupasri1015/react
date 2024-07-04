import React, { useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import styles from './styles.module.scss';
import { getAmount } from '../../../../core/utility/stringUtility'

const CredRWalletMoney = (props) => {
    const { wallet, pendingAmount, addMoney } = props;

    return (
        <Card className="pending-inventory-header">
            <CardBody className="card-shadow square-border">
                <button className={styles.makePayment} onClick={addMoney}>+ Add Money</button>
                <div className="row">
                    <div style={{ marginLeft: '15px' }}>
                        <Card className={styles.netBalance}>
                            <p className={styles.netBalanceText}>My Wallet</p>
                            <p className={styles.netBalanceAmount}>{`${wallet ? getAmount(wallet) : getAmount(0)}`}</p>
                        </Card>
                    </div>
                    <div style={{ marginLeft: '15px' }}>
                        <Card className={styles.pendingPayments} >
                            <p className={styles.pendingBalanceText}>Pending Payments</p>
                            <p className={styles.pendingBalanceAmount}>{`${pendingAmount ? getAmount(pendingAmount) : getAmount(0)}`}</p>
                        </Card>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default CredRWalletMoney;
