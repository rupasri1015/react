import React from 'react';
import { Card, CardBody } from 'reactstrap';
import styles from '../CredRWalletMoney/styles.module.scss';
import PlusIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button'

const OfflineLeadCard = (props) => {

    const { onOpenLeadForm } = props

    return (
        <Card className="pending-inventory-header">
            <CardBody className="card-shadow square-border">
               <p style={{ fontWeight: 'bolder' }}> Create Walk-in Lead Here  <Button startIcon={<PlusIcon style={{ width: '25px', height: '25px' }} />} className={styles.makePayment} style={{ marginLeft: '8px' }} onClick={onOpenLeadForm}>Add Lead</Button></p>
            </CardBody>
        </Card>
    );
};

export default OfflineLeadCard
