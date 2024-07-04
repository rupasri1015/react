import React, { useState } from 'react'
import Filters from './components/Filters'
import Table from './components/Table'
import ExportFile from './components/ExportFile'
import { getStoreTransactionsDetails } from '../../redux/actions/storeTransactionListAction'
import { useDispatch } from 'react-redux';
import { getUserID } from '../../core/services/rbacServices';
import { hideLoader, showLoader } from '../../redux/actions/loaderAction'
import { exportWalletDetails } from '../../core/services/shdServices'
import { setNotification } from '../../redux/actions/notificationAction'
// import { getUserID, getCityID } from '../../core/services/authenticationServices'

const WalletBalanceApproval = ({ }) => {

    const [leadStatus, setLeadStatus] = useState('Pending')
    const [filters, setFilters] = useState({})
    const [pageNumber, setPageNum] = useState(1)

    const dispatch = useDispatch();

    const applyFilter = (request) => {
        setFilters(request)
        let payload = {
            ...request,
            pageNum: pageNumber
        }
        dispatch(getStoreTransactionsDetails(payload))
    }

    const clearFilter = () => {
        let payload = {
            pageNum: 1
        }
        dispatch(getStoreTransactionsDetails(payload))
    }

    const headerStatusChange = (status) => {
        let payload = {}
        setLeadStatus(status)
        if (Object(filters).length) payload = { ...filters, paymentStatus: status, pageNum: pageNumber }
        else payload = { finUserId: getUserID(), paymentStatus: status, pageNum: pageNumber }
        dispatch(getStoreTransactionsDetails(payload))
    }

    const pageChange = (pageNum) => {
        setPageNum(pageNum)
        let payload = {}
        if (Object(filters).length) payload = { ...filters, pageNum: pageNum }
        else payload = { finUserId: getUserID(), pageNum: pageNum }
        dispatch(getStoreTransactionsDetails(payload))
    }

    const exportFile = type => {
        console.log('filters export', filters)

        const payload = {
            basedOn: type
        }

        if (filters && filters.cityId) payload.cityId = filters.cityId;
        if (filters && filters.search) payload.search = filters.search;


        console.log("payload", payload)
        dispatch(showLoader())
        exportWalletDetails(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    dispatch(hideLoader())
                    window.location.href = apiResponse.data
                }
                else {
                    dispatch(hideLoader())
                    dispatch(setNotification('danger', 'Error', apiResponse.message))
                }
            })
    }

    return (
        <>
            <div className="cpp-header">
                <h3> CP Wallet Balance </h3>
            </div>
            <Filters
                onApplyFilter={applyFilter}
                onClearFilter={clearFilter}
            />
              <ExportFile
                exportFile={exportFile}
                leadStatus={leadStatus}
            />
            <Table
                leadStatus={"leadStatus"}
                onPageChange={"pageChange"}
            /> 
        </>
    )
}

export default WalletBalanceApproval