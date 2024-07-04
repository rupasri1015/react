import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CMSFilter from './components/Filters';
import Table from '../../../shared/components/Table';
import { getStoreData } from '../../../redux/actions/primarySalesActionStore';

const Store = () => {
    const [filters, setFilters] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getStoreData({ pageNum: 1 }));
    }, []);


    const data = useSelector((state) => state.primarySalesStore.saleDocumentResponse);
    const count = useSelector((state) => state.primarySalesStore.count);
    const pageNumber = useSelector((state) => state.primarySalesStore.pageNum);

    const pageChange = (page) => {
        window.scrollTo(0, 0);
        dispatch(getStoreData({ pageNum:page, ...filters }));
    };

    const onApplyFilter = (filterObj) => {
        let payload = {}
        if (filterObj) {
            payload = {
                ...filterObj
            }
        }
        setFilters(payload);
        return dispatch(getStoreData({...payload, pageNum: 1}));
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
            key: 'storeId',
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
            dispatch(getStoreData({ pageNum: 1 }));
        }
    }

    return (
        <div>
            <CMSFilter
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

export default Store;
