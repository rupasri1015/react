import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReturnsFilter from '../components/ReturnsFilter';
import Table from '../../../shared/components/Table';
import { getPendingAssignList } from '../../../redux/actions/pendingAssignListAction';
import { userTypeDetails } from '../../../core/services/authenticationServices';
import LiveInventoryFilter from '../components/LiveInventoryFilter'

const LiveInventory = () => {
    const [filters, setFilters] = useState({});
    const storeID = userTypeDetails().userType.storeId;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPendingAssignList({ page: 1, deliveryStatus: "DELIVERED", storeID }));
    }, []);


    const list = useSelector((state) => state.pending.pendingList);
    const count = useSelector((state) => state.pending.count);
    const pageNumber = useSelector((state) => state.pending.page);

    const pageChange = (page) => {
        window.scrollTo(0, 0);
        dispatch(getPendingAssignList({ page, deliveryStatus: "DELIVERED", storeID, ...filters }));
    };

    const onApplyFilter = (filterObj) => {
        let payload = {  deliveryStatus: "DELIVERED" };
        if (filterObj) {
            payload = {
                ...payload,
                startDate: filterObj.fromDate,
                endDate: filterObj.toDate,
                mmv: filterObj.searchTerm,
                registrationNumber: filterObj.searchRegText,
                storeID
            }
        }
        setFilters(payload);
        return dispatch(getPendingAssignList({...payload, page: 1}));
    };

    const renderMargin = (item) => {
        console.log('item', item);
        return <span>₹{item.displayPrice - item.assignedCfp}</span>
    }

    const handleClearFilter = () => {
		if (Object.keys(filters).length) {
			setFilters({})
			dispatch(getPendingAssignList({ page: 1, deliveryStatus: "DELIVERED", storeID }));
		}
	}

    const tableHeadCellConfig = [
        {
            label: 'Vehicle Onboard Date',
            key: 'actualDeliveryDate',
            type: 'date'
        },
        {
            label: 'Registration number',
            key: 'registrationNumber',
            type: 'string'
        },
        {
            label: 'MMV',
            key: 'mmv',
            type: 'string'
        },
        {
            label: 'Year',
            key: 'year',
            type: 'year'
        },
        {
            label: 'CFP',
            key: 'assignedCfp',
            type: 'amount'
        },
        {
            label: 'CSP',
            key: 'displayPrice',
            type: 'amount'
        },
        {
            label: 'Margin',
            key: 'amount',
            type: 'custom',
            renderItem: renderMargin
        },
    ];

    return (
        <div>
            <LiveInventoryFilter 
                onApplyFilter={onApplyFilter}
                searchPlaceHolder="Search by MMV"
                showDateTypeDropdown={false}
                showSearchByRegistration={true}
                onClearFilter={handleClearFilter}
            />
            <Table
                tableHeadCellConfig={tableHeadCellConfig}
                items={list}
                rowsPerPage={15}
                totalItemsCount={count}
                pageNum={pageNumber}
                onPageChange={pageChange}
                classNames={{ tableActionHeadCellClassName: 'text-center' }}
            />
        </div>
    )
};

export default LiveInventory;
