import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FranchiseFilter from './components/Filters';
import Table from '../../../shared/components/Table';
import { getSecondarySalesData } from '../../../redux/actions/secondaryFranchiseSales';

const CMS = () => {
    const [filters, setFilters] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSecondarySalesData({ pageNum: 1 }));
    }, []);


    const data = useSelector((state) => state.secondary.salesDocumentForSecondaryFranchiseSales);
    const count = useSelector((state) => state.secondary.count);
    const pageNumber = useSelector((state) => state.secondary.pageNum);

    const pageChange = (page) => {
        window.scrollTo(0, 0);
        dispatch(getSecondarySalesData({ pageNum:page, ...filters }));
    };

    const onApplyFilter = (filterObj) => {
        let payload = {}
        if (filterObj) {
            payload = {
                ...filterObj
            }
        }
        setFilters(payload);
        return dispatch(getSecondarySalesData({...payload, pageNum: 1}));
    };

    const tableHeadCellConfig = [
        {
            label: 'Date',
            key: 'createdDate',
            type: 'date'
        },
        {
            label: 'Registration Number',
            key: 'regNumber',
            type: 'string'
        },
        {
            label: 'MMV',
            key: 'mmv',
            type: 'string'
        },
        {
            label: 'Sold Price',
            key: 'price',
            type: 'amount'
        },
        {
            label: 'Refurb Cost',
            key: 'refubCost',
            type: 'amount'
        },
        {
            label: 'SQI',
            key: 'sqi',
            type: 'string'
        },
        {
            label: 'Source',
            key: 'source',
            type: 'string'
        },
        {
            label: 'Showroom',
            key: 'showroomName',
            type: 'string'
        },
        {
            label: 'City',
            key: 'city',
            type: 'string'
        }
    ];
    const handleClearFilter = () => {
        if(Object.keys(filters).length) {
            setFilters({})
            dispatch(getSecondarySalesData({ pageNum: 1 }));
        }
    }

    return (
        <div>
            <FranchiseFilter
                onApplyFilter={onApplyFilter}
                searchPlaceHolder="Search by MMV"
                showDateTypeDropdown={false}
                showSearchByRegistration={true}
                onClearFilter={handleClearFilter}
            />
            <Table
                tableHeadCellConfig={tableHeadCellConfig}
                items={data}
                rowsPerPage={15}
                totalItemsCount={count}
                pageNum={pageNumber}
                onPageChange={pageChange}
                classNames={{ tableActionHeadCellClassName: 'text-center' }}
            />
        </div>
    )
};

export default CMS;
