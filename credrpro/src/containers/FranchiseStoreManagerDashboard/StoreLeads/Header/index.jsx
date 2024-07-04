import React from 'react';
import { Card, CardBody } from 'reactstrap';

const SalesHeader = ({ status, onChangeStatus }) => {

	const getClassName = (currentStatus) => {
		return status.toLowerCase() === currentStatus.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue';
	};

	return (
		<Card className="pending-inventory-header">
			<CardBody className="card-shadow square-border">
				<button className={getClassName('TOKEN')} onClick={() => onChangeStatus('TOKEN')}>{`Token`}</button>
				<button className={getClassName('FULL')} onClick={() => onChangeStatus('FULL')}>{`Full`}</button>
                <button className={getClassName('REFUND')} onClick={() => onChangeStatus('REFUND')}>{`Refund`}</button>
			</CardBody>
		</Card>
	);
};

export default SalesHeader;
