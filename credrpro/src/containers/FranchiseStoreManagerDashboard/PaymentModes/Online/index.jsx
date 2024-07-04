import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PendingAssignmentFilter from '../../components/PendingAssignmentFilter';
import Table from './Table';

import { getPendingAssignList } from '../../../../redux/actions/pendingAssignListAction';
import { userTypeDetails } from '../../../../core/services/authenticationServices';

const OnlinePayments = () => {
    const [filters, setFilters] = useState({});
    const storeID = userTypeDetails().userType.storeId;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPendingAssignList({ page: 1, paymentstatus: "PENDING", storeID }));
    }, [])

    const pageChange = (page) => {
        window.scrollTo(0, 0);
        dispatch(getPendingAssignList({ page, paymentstatus: "PENDING", storeID, ...filters }));
    }

    const onApplyFilter = (filterObj) => {
        let payload = { paymentstatus: "PENDING", storeID };
        if (filterObj === 'clear') {
            return dispatch(getPendingAssignList({...payload, page: 1}));
        }
        else {
            if (filterObj) {
                payload = {
                    ...payload,
                    startDate: filterObj.fromDate,
                    endDate: filterObj.toDate,
                    mmv: filterObj.searchTerm,
                    registrationNumber: filterObj.searchRegText,
                    orderID: filterObj.orderID,
                    storeID
                }
                setFilters(payload);
                return dispatch(getPendingAssignList({payload, page: 1}));
            }
        }
    }

    const handleClearFilter = () => {
        if (Object.keys(filters).length) {
            setFilters({})
            dispatch(getPendingAssignList({ page: 1, paymentstatus: "PENDING", storeID }));
        }
    }

    return (
        <div>
            <PendingAssignmentFilter
                onApplyFilter={onApplyFilter}
                searchPlaceHolder="Search by MMV"
                showSearchByRegistration={true}
                paymentstatus="PENDINGS"
                onClearFilters={handleClearFilter}
            />
            <Table
                storeID={storeID}
                onPageChange={pageChange}
            />
        </div>
    )
};

export default OnlinePayments;
