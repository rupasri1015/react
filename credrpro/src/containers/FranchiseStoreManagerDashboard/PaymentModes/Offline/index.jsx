import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PendingAssignmentFilter from '../../components/PendingAssignmentFilter';
import Table from '../../../../shared/components/Table';
import edit from '../../../../shared/img/icons/edit-icon.svg'
import { uploadPaymentProof } from '../../../../core/services/franchiseServices'
import PaymentForm from './PaymentForm';

import { getPendingAssignList } from '../../../../redux/actions/pendingAssignListAction';
import { userTypeDetails } from '../../../../core/services/authenticationServices';
import { setNotification } from '../../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction'
import { updatePaymentDetails } from '../../../../core/services/franchiseServices'
import { getUserID } from '../../../../core/services/rbacServices';

const LiveInventory = () => {
    const [filters, setFilters] = useState({});
    const storeID = userTypeDetails().userType.storeId;
    const [open, setOpen] = useState(false)
    const [urls, setUrls] = useState([])
    const [rowData, setRowData] = useState({})

    const dispatch = useDispatch();

    useEffect(() => {
        // This Actions fetches the live inventory, acceptedStatus key will decide which data to return
        dispatch(getPendingAssignList({ page: 1, paymentstatus: "PENDING", storeID }));
    }, []);

    const list = useSelector((state) => state.pending.pendingList);
    const count = useSelector((state) => state.pending.count);
    const pageNumber = useSelector((state) => state.pending.page);

    const pageChange = (page) => {
        window.scrollTo(0, 0);
        dispatch(getPendingAssignList({ page, paymentstatus: "PENDING", storeID, ...filters }));
    };

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
                return dispatch(getPendingAssignList({...payload, page: 1}));
            }
        }
    };

    const handleClearFilter = () => {
        if (Object.keys(filters).length) {
            setFilters({})
            dispatch(getPendingAssignList({ page: 1, paymentstatus: "PENDING", storeID }));
        }
    }

    const openOfflineUpdate = (item) => {
        setOpen(true)
    }

    const renderEdit = (item, index) => {
        setRowData(item)
        return (
            <img src={edit} alt="Edit Valuator" role="button" className="action-icon" onClick={() => openOfflineUpdate(item)} />
        );
    };

    const closePopUp = () => {
        setUrls([])
        setOpen(false)
    }

    const handelFiles = files => {
        dispatch(showLoader())
        const formData = new FormData()
        files.forEach(file => {
            formData.append('file', file)
        })
        uploadPaymentProof(formData)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    setUrls([apiResponse.url])
                } else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message))
                }
                dispatch(hideLoader())
            })
    }

    const handleRemoveImage = index => {
        setUrls([])

    }

    const tableHeadCellConfig = [
        {
            label: 'Order ID',
            key: 'orderID',
            type: 'string'
        },
        {
            label: 'Vehicle Assigned Date',
            key: 'assigneDate',
            type: 'date'
        },
        {
            label: 'Registration Number',
            key: 'registrationNumber',
            type: 'string'
        },
        {
            label: 'MMV',
            key: 'mmv',
            type: 'string'
        },
        {
            label: 'CFP',
            key: 'assignedCfp',
            type: 'amount'
        },
        {
            label: 'Payment Made',
            key: 'amount',
            type: 'amount'
        },
        {
            label: 'Pending Amount',
            key: 'remainingAmount',
            type: 'amount'
        },
        {
            label: 'Payment Status',
            key: 'paymentModeStaus',
            type: 'string',
        },
        {
            label: 'View Reciept',
            key: 'documentStatus',
            type: 'string',
        },
        {
            label: 'Action',
            key: 'openPopUp',
            type: 'custom',
            renderItem: renderEdit
        }
    ];

    const payOfflinePayment = (formdata, paymentData) => {
        dispatch(showLoader())
        const payload = {
            orderId: paymentData.orderID,
            utnNumber: formdata.updateUTR,
            paymentAmount: Number(paymentData.remainingAmount),
            remainingAmount: Number(paymentData.remainingAmount),
            paymentStatus: 'PAYMENT_APPROVAL',
            updatedBy: getUserID(),
            orderPrice: Number(paymentData.remainingAmount),
            imageUrl: urls
        }
        updatePaymentDetails(payload)
            .then(paymentResponse => {
                if (paymentResponse.isValid) {
                    dispatch(hideLoader())
                    setOpen(false)
                    dispatch(setNotification('success', 'SUCCESS', paymentResponse.message))
                    dispatch(getPendingAssignList({ page: 1, paymentstatus: "PENDING", storeID }));    
                }
                else {
                    dispatch(hideLoader())
                    setOpen(false)
                    dispatch(setNotification('danger', 'Error', paymentResponse.message))
                    dispatch(getPendingAssignList({ page: 1, paymentstatus: "PENDING", storeID }));
                }
            })
    }

    return (
        <div>
            <PendingAssignmentFilter
                onApplyFilter={onApplyFilter}
                searchPlaceHolder="Search by MMV"
                showSearchByRegistration={true}
                onClearFilter={handleClearFilter}
                paymentstatus="PENDING"
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
                <PaymentForm
                    open={open}
                    onClose={closePopUp}
                    uploadFiles={handelFiles}
                    imageUrl={urls}
                    rowData={rowData}
                    removeImage={handleRemoveImage}
                    onPaymentMade={payOfflinePayment}
                />
            }
        </div>
    )
};

export default LiveInventory;
