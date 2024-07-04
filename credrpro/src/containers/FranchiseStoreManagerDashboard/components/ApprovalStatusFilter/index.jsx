import React from 'react';
import { Card, CardBody } from 'reactstrap';

const ApprovalStatusFilter = (props) => {
	const { statusFilters, activeStatus, onStatusFilterClick } = props;

	const getClassName = (status) => {
		return activeStatus.toLowerCase() === status.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue';
	};

	const renderOptions = () => {
		return statusFilters.map((item, index) => {
			return (
				<button
					key={index}
					className={getClassName(item.slug)}
					style={{ marginTop: '10px' }}
					onClick={() => onStatusFilterClick(item)}
				>
					{item.label}
				</button>
			);
		});
	};

	return (
		<Card className="pending-inventory-header">
			<CardBody className="card-shadow square-border">{renderOptions()}</CardBody>
		</Card>
	);
};

export default ApprovalStatusFilter;
