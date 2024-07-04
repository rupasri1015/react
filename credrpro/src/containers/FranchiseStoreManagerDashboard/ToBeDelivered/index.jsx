import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ToBeDeliveredFilter from '../components/ToBeDeliveredFilter'
import Table from '../../../shared/components/Table';
import { getPendingAssignList } from '../../../redux/actions/pendingAssignListAction';
import { userTypeDetails } from '../../../core/services/authenticationServices';
import edit from '../../../shared/img/icons/edit-icon.svg'
import DeliveryConfirmPopup from './Modal';
import { franchiseDeliveryStatus } from '../../../core/services/franchiseServices';
import { setNotification } from '../../../redux/actions/notificationAction';

const ToBeDelivered = () => {
    const [filters, setFilters] = useState({});
    const storeID = userTypeDetails().userType.storeId;
    const [open, setOpen] = useState(false)
    const [rowData, setRowData] = useState({})

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPendingAssignList({ page: 1, deliveryStatus: "PENDING", storeID, orderType: 'desc' }));
    }, []);


    const list = useSelector((state) => state.pending.pendingList);
    const count = useSelector((state) => state.pending.count);
    const pageNumber = useSelector((state) => state.pending.page);

    const pageChange = (page) => {
        window.scrollTo(0, 0);
        dispatch(getPendingAssignList({ page, deliveryStatus: "PENDING", storeID, ...filters, orderType: 'desc' }));
    };

    const onApplyFilter = (filterObj) => {
        let payload = { deliveryStatus: "PENDING" };
        if (filterObj) {
            payload = {
                ...payload,
                dateType: filterObj.dateType,
                startDate: filterObj.fromDate,
                endDate: filterObj.toDate,
                registrationNumber: filterObj.registrationNumber,
                mmv: filterObj.mmv,
                storeID
            }
        }
        setFilters(payload);
        return dispatch(getPendingAssignList({ ...payload, page: 1 }));
    };

    const openDeliveryConfirm = (item) => {
        setRowData(item)
        setOpen(true)
    }

    const renderEdit = (item, index) => {
        return (
            <div>
                <p>{item.deliveryStatus}
                    <img src={edit} alt="Edit Valuator" role="button" className="action-icon" style={{ marginLeft: '5px' }} onClick={() => openDeliveryConfirm(item)} />
                </p>
            </div>
        );
    };

    const tableHeadCellConfig = [
        {
            label: 'Payment Date',
            key: 'paymentDate',
            type: 'date'
        },
        {
            label: 'Expected Delivery Date',
            key: 'expectedDeliveryDate',
            type: 'dateTime'
        },
        {
            label: 'Registration Number',
            key: 'registrationNumber',
            type: 'string'
        },
        {
            label: 'Delivery Status',
            key: 'deliveryStatus',
            type: 'custom',
            renderItem: renderEdit
        },
        {
            label: 'MMV',
            key: 'mmv',
            type: 'string'
        },
        {
            label: 'CFP',
            key: 'cfp',
            type: 'amount'
        },
    ];

    const confirmDelivery = (payload) => {
        franchiseDeliveryStatus(payload).
            then(deliveryStatusResponse => {
                if (deliveryStatusResponse.isValid) {
                    setOpen(false)
                    dispatch(setNotification('success', 'SUCCESS', deliveryStatusResponse.message))
                    dispatch(getPendingAssignList({ page: 1, deliveryStatus: "PENDING", storeID, orderType: 'desc' }));
                }
                else {
                    setOpen(false)
                    dispatch(setNotification('danger', 'ERROR', deliveryStatusResponse.message))
                }
            })
    }

    const handleClearFilter = () => {
        if (Object.keys(filters).length) {
            setFilters({})
            dispatch(getPendingAssignList({ page: 1, deliveryStatus: "PENDING", storeID, orderType: 'desc' }));
        }
    }


    return (
        <div>
            <ToBeDeliveredFilter
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
            {
                open &&
                <DeliveryConfirmPopup
                    open={open}
                    onClose={() => setOpen(false)}
                    onConfirmDelivery={confirmDelivery}
                    rowData={rowData}
                />
            }
        </div>
    )
};

export default ToBeDelivered;
