import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody } from 'reactstrap';
import { RefreshIconLocal } from '../../../core/utility/iconHelper';
import { useSelector } from 'react-redux';
import RefreshIcon from '@material-ui/icons/Refresh';
import { getRole } from '../../../core/services/rbacServices'


const BiddingHeader = ({ onExportFile, status, onChangeStatus, onRefreshData }) => {

	const [isButtonDisabled, setIsButtonDisabled] = useState(false)
	const [isTabDisabled, setIsDisabled] = useState(false)
	const onGoingCount = useSelector((state) => state.biddingList.onGoing);
	const followUpCount = useSelector((state) => state.biddingList.followUp);
	const exchangeCount = useSelector((state) => state.biddingList.exchange);
	const dropCount = useSelector((state) => state.biddingList.drop);
	const AucCompleted = useSelector((state) => state.biddingList.auctionCompletedCount);
	const ctInspectedCount = useSelector((state) => state.biddingList.centralTagInspectedCount);

	const usePrevious = (value) => {
		const ref = useRef()
		useEffect(() => {
			ref.current = value;
		});
		return ref.current
	};

	const prevStatus = usePrevious(status)
	useEffect(() => {
		if (prevStatus !== status) {
			setIsDisabled(true)
			setIsButtonDisabled(false)
		}
	}, [status, isTabDisabled])

	const count = useSelector((state) => state.biddingList.count);

	const getClassName = (currentStatus) => {
		return status.toLowerCase() === currentStatus.toLowerCase() ? 'btn-outline blue selected' : 'btn-outline blue';
	};

	const disableButtonFor60Sec = (event) => {
		onRefreshData()
		event.preventDefault();
		setIsButtonDisabled(true)
		setTimeout(() => setIsButtonDisabled(false), 60000);
		return disableButtonFor60Sec
	}

	const onTabStatusChange = (event, currentStatus) => {
		if (status !== currentStatus)
			onChangeStatus(currentStatus)
	}

	return (
		<Card className="pending-inventory-header">
			<CardBody className="card-shadow square-border">
				{
					getRole() === 'SHD_COMMISSION' ?
						<button
							className={getClassName('ONGOING')}
							onClick={(event) => onTabStatusChange(event, 'ONGOING')}

						>{`Ongoing (${onGoingCount})`}
						</button> :
						<>
							<div>
								<button
									className={getClassName('ONGOING')}
									onClick={(event) => onTabStatusChange(event, 'ONGOING')}

								>{`Ongoing (${onGoingCount})`}
								</button>
								<button
									className={getClassName('followup')}
									onClick={(event) => onTabStatusChange(event, 'FOLLOWUP')}

								>{`Follow Up (${followUpCount})`}</button>
								<button
									className={getClassName('exchange')}
									onClick={(event) => onTabStatusChange(event, 'EXCHANGE')}

								>{`Sell / Exchanged (${exchangeCount})`}</button>
								<button
									className={getClassName('dropped')}
									onClick={(event) => onTabStatusChange(event, 'DROPPED')}

								>{`Dropped (${dropCount})`}</button>
								<button
									className={getClassName('AUCTION_COMPLETED')}
									onClick={(event) => onTabStatusChange(event, 'AUCTION_COMPLETED')}

								>{`Auction Completed (${AucCompleted})`}</button>
								{/* <div className='mt-3'> */}
								<button
									className={getClassName('CENTRAL_TAGGING_INSPECTED')}
									onClick={(event) => onTabStatusChange(event, 'CENTRAL_TAGGING_INSPECTED')}

								>{`CT Inspected (${ctInspectedCount})`}</button>
								<button className={getClassName('ALL')}
									onClick={(event) => onTabStatusChange(event, 'ALL')}

								>{`All (${count})`}</button>
							</div>
						</>
				}
				{
					!isButtonDisabled ?
						<RefreshIcon className="btn-icon" alt="Download" style={{ maxWidth: '70px', height: '30px', cursor: 'pointer' }} onClick={disableButtonFor60Sec} /> :
						<RefreshIcon className="btn-icon" alt="Download" style={{ maxWidth: '70px', height: '30px' }} disabled={isButtonDisabled} color='disabled' />
				}
			</CardBody>
		</Card>
	);
};

export default BiddingHeader;
