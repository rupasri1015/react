import { getValuatorDashBoardList } from '../../core/services/valuatorServices'
import { VALUATOR_DASHBOARD } from '../../core/constants/actions'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function valuatorDashbaordList(payload = { pageNumber: 1 }) {
    return dispatch => {
        dispatch(request())
        dispatch(showLoader())
        return getValuatorDashBoardList(payload)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    const valuatorList = apiResponse.valuatorList
                    const count = apiResponse.count
                    const { pendingCount, preDropCount, inspectedCount, docDisputeCount, nocallCount,rescheduleCount,adiyCompletedCount } = apiResponse
                    const { pageNum } = payload
                    dispatch(success({
                        valuatorList,
                        count, pageNum,
                        pendingCount, preDropCount, inspectedCount, docDisputeCount, nocallCount,rescheduleCount,adiyCompletedCount
                    }))
                }
                else {
                    dispatch(failure({ error: apiResponse.message }))
                    dispatch(setNotification('danger', 'ERROR', apiResponse.message))
                }
                dispatch(hideLoader())
            })
    }
    function request() { return { type: VALUATOR_DASHBOARD.REQUEST } }
    function success(valuatorList) { return { type: VALUATOR_DASHBOARD.SUCCESS, payload: { ...valuatorList } } }
    function failure(error) { return { type: VALUATOR_DASHBOARD.FAILURE, payload: { ...error } } }
}
