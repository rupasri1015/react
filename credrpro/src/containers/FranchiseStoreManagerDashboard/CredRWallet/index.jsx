import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CredrWalletFilter from '../components/CredRWalletFilter'
import CredRWalletMoney from '../components/CredRWalletMoney'
import Table from '../../../shared/components/Table';
import { getShowroomPaymentsHistory } from '../../../redux/actions/showroomPaymentsHistoryAction';
import { userTypeDetails } from '../../../core/services/authenticationServices';
import { getWalletBalance } from '../../../core/services/franchiseServices'
import { createOrder, verifyPayment, validateRazorPayLoad } from '../../../core/services/paymentServices'
import AddMoney from '../components/CredRWalletMoney/AddMoneyForm';
import { getUserID, getUserName } from '../../../core/services/rbacServices';
import { RAZORPAY_ID } from '../../../core/constants/apiConstant'
import { setNotification } from '../../../redux/actions/notificationAction'

const CredRWallet = () => {
	const [filters, setFilters] = useState({});
	const storeID = userTypeDetails().userType.storeId;
	const [wallet, setWallet] = useState('')
	const [pendingAmount, setPendingAmount] = useState('')
	const [pageNumber, setPageNumber] = useState('')
	const [open, setOpen] = useState(false)

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getShowroomPaymentsHistory({ pageNum: 1, storeId: [`${storeID}`] }));
		const payload = {
			storeId: storeID
		}
		getWalletBalance(payload)
			.then(apiResponse => {
				if (apiResponse.isValid) {
					setPendingAmount(apiResponse.fsmpendingAmount)
					setWallet(apiResponse.walletAmount)
				}
			})
	}, []);

	const list = useSelector((state) => state.walletHistory.transactionHistory);
	const count = useSelector((state) => state.walletHistory.count);
	const pageNum = useSelector((state) => state.walletHistory.pageNum);

	const pageChange = (page) => {
		window.scrollTo(0, 0);
		dispatch(getShowroomPaymentsHistory({ pageNum: page, storeId: [`${storeID}`], ...filters }));
	};

	const onApplyFilter = (filterObj) => {
		let payload = {};
		if (filterObj) {
			payload = {
				...payload,
				fromDate: filterObj.fromDate,
				toDate: filterObj.toDate,
				regNum: filterObj.regnum,
				searchByParameter: filterObj.dateType,
				registrationNumber: filterObj.searchRegText,
				storeId: [`${storeID}`],
				paymentAgainst: filterObj.paymentAgainst,
				regNumber: filterObj.regNumber,
				searchKeyWord: filterObj.searchKeyWord
			}
		}
		setFilters(payload);
		return dispatch(getShowroomPaymentsHistory({...payload, pageNum: 1}));
	};

	const handleClearFilter = () => {
		if (Object.keys(filters).length) {
			setFilters({})
			dispatch(getShowroomPaymentsHistory({ pageNum: 1, storeId: [`${storeID}`] }));
		}
	}

	const OnSearchReg = (searchObj) => {
		if (searchObj) {
			return dispatch(getShowroomPaymentsHistory(searchObj));
		}
		else {
			dispatch(setNotification('danger', 'Error', 'No Records found'))
		}
	}

	const openAddMoneyPopUp = () => {
		setOpen(true)
	}

	const closeAddForm = () => {
		setOpen(false)
	}

	const addMoney = async (amount) => {
		const payload = {
			storeId: storeID,
			amount: amount,
			paymentAmount: amount,
			userID: getUserID(),
			paymentSubtype: 'C2B_WALLET',
			paymentMode: 'ONLINE',
			paymentStatus: 'INITIATED'
		}
		const apiResponse = await createOrder(payload)
		let orderId = ''
		if (apiResponse.isValid) {
			orderId = apiResponse.rzOrderId
		}
		openPaymentGateway(orderId, amount)
	}

	const openPaymentGateway = (razorPayOrderId, amount) => {
		let options = {
			key: RAZORPAY_ID,
			name: getUserName(),
			amount: amount,
			description: 'Incredible Technologies Pvt. Ltd.',
			order_id: razorPayOrderId,
			prefill: {
				name: userTypeDetails().userType.storeName,
				email: userTypeDetails().userType.email,
				contact: userTypeDetails().userType.mobile
			},
			handler: function (response) {
				if (response) {
					const paymentData = {
						orderId: response.razorpay_order_id,
						paymentId: response.razorpay_payment_id,
						razorPaySignature: response.razorpay_signature,
						userId: getUserID(),
						storeId: storeID
					}
					verifyPaymentFromServer(paymentData, razorPayOrderId)
				}
			}
		}
		let razorpay = new window.Razorpay(options)
		razorpay.open()
		razorpay.on('payment.failed', (res) => {
			alert(res.error.description)
		})
	}

	const verifyPaymentFromServer = (razorPayData, razorPayOrderId) => {
		verifyPayment(razorPayData)
			.then(verifyResponse => {
				if (verifyResponse.isValid) {
					loadToWallet(razorPayOrderId)
				}
			})
	}

	const loadToWallet = (orderId) => {
		const payload = {
			paymentValidated: true,
			razorpayPaymentId: orderId,
			storeId: storeID
		}
		validateRazorPayLoad(payload)
			.then(loadResponse => {
				if (loadResponse.isValid) {
					setOpen(false)
					window.location.reload()
				}
			})
	}

	const tableHeadCellConfig = [
		{
			label: 'Payment Date',
			key: 'paymentDate',
			type: 'date'
		},
		{
			label: 'TXN ID',
			key: 'txnId',
			type: 'string'
		},
		{
			label: 'Payment Amount',
			key: 'paymentAmount',
			type: 'amount'
		},
		{
			label: 'Payment Against',
			key: 'paymentAgainst',
			type: 'string'
		},
		{
			label: 'Order Id',
			key: 'orderId',
			type: 'string'
		},
		{
			label: 'Registration Number',
			key: 'regNumber',
			type: 'string'
		},
		{
			label: 'Closing Balance',
			key: 'closingBal',
			type: 'amount'
		},
		{
			label: 'Payment Type',
			key: 'paymentType',
			type: 'string'
		}
	];


	return (
		<div>
			<CredRWalletMoney
				wallet={wallet}
				pendingAmount={pendingAmount}
				addMoney={openAddMoneyPopUp}
			/>
			<CredrWalletFilter
				onApplyFilter={onApplyFilter}
				searchPlaceHolder="Search by MMV"
				showDateTypeDropdown={false}
				showSearchByRegistration={true}
				OnSearchReg={OnSearchReg}
				onclearFilter={handleClearFilter}
			/>
			<Table
				tableHeadCellConfig={tableHeadCellConfig}
				items={list}
				rowsPerPage={15}
				totalItemsCount={count}
				pageNum={pageNum}
				onPageChange={pageChange}
				classNames={{ tableActionHeadCellClassName: 'text-center' }}
			/>
			{
				open &&
				<AddMoney
					open={open}
					onClose={closeAddForm}
					onInitiatePayment={addMoney}
				/>
			}
		</div>
	)
};

export default CredRWallet
