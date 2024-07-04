import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PaymentsHistoryFilter from '../components/PaymentsHistoryFilter';
import Table from '../../../shared/components/Table';
import { getPaymentsHistoryByShowroom } from '../../../redux/actions/paymentsHistoryAction';
import { userTypeDetails } from '../../../core/services/authenticationServices';

const PaymentsHistory = () => {
    const [filters, setFilters] = useState({});
    const storeID = userTypeDetails().userType.storeId;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPaymentsHistoryByShowroom({ pageNum: 1, storeId: [storeID] }));
    }, []);


    const paymentsHistory = useSelector((state) => state.paymentsHistory.transactionHistory);
    const count = useSelector((state) => state.paymentsHistory.count);
    const pageNumber = useSelector((state) => state.paymentsHistory.pageNum);

    const pageChange = (page) => {
        window.scrollTo(0, 0);
        dispatch(getPaymentsHistoryByShowroom({ pageNum:page, storeId: [storeID], ...filters }));
    };

    const onApplyFilter = (filterObj) => {
        let payload = { storeId: [storeID] };
        if (filterObj) {
            payload = {
                ...payload,
                fromDate: filterObj.fromDate,
                toDate: filterObj.toDate,
                searchKeyWord: filterObj.searchTerm,
                regNumber: filterObj.searchRegText,
                // storeID,
                paymentAgainst: filterObj.paymentAgainst
            }
        }
        setFilters(payload);
        return dispatch(getPaymentsHistoryByShowroom({...payload, pageNum: 1}));
    };

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
            type: 'string'
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
        },
    ];

    const handleClearFilter = () => {
        if(Object.keys(filters).length) {
            setFilters({})
            dispatch(getPaymentsHistoryByShowroom({ pageNum: 1, storeId: [storeID] }));
        }
    }

    return (
        <div>
            <PaymentsHistoryFilter
                onApplyFilter={onApplyFilter}
                searchPlaceHolder="Search by MMV"
                showDateTypeDropdown={false}
                showSearchByRegistration={true}
                onClearFilter={handleClearFilter}
            />
            <Table
                tableHeadCellConfig={tableHeadCellConfig}
                items={paymentsHistory}
                rowsPerPage={15}
                totalItemsCount={count}
                pageNum={pageNumber}
                onPageChange={pageChange}
                classNames={{ tableActionHeadCellClassName: 'text-center' }}
            />
        </div>
    )
};

export default PaymentsHistory;
