import qs from 'qs';
import { PENDING_RETURN_INVENTORY } from '../../core/constants/actions'
import { pendingReturnAssignList, createReturnLogistic } from '../../core/services/franchiseServices'
import { showLoader, hideLoader } from './loaderAction'
import { setNotification } from './notificationAction'

export function pendingReturnInventoryAction(payload) {
  const queryParamsStr = qs.stringify({ ...payload }, { encode: true });

  return dispatch => {
    dispatch(request())
    dispatch(showLoader())
    return pendingReturnAssignList(queryParamsStr)
      .then(apiResponse => {
        if (apiResponse.valid) {
          const { resultSet: pendingReturnInventory, resultCount: count, pageNumber, pageSize, pagesCount } = apiResponse
          dispatch(success({ pendingReturnInventory, count, pageNumber, pageSize, pagesCount }))
        } else {
          dispatch(failure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  function request() { return { type: PENDING_RETURN_INVENTORY.REQUEST } }
  function success(pendingReturnsInventory) { return { type: PENDING_RETURN_INVENTORY.SUCCESS, payload: { ...pendingReturnsInventory } } }
  function failure(error) { return { type: PENDING_RETURN_INVENTORY.FAILURE, payload: { ...error } } }
}

export function createReturnLogisticAction(payload) {
  const assignedBikeIds = payload.map(item => { return item.brrId });
  return (dispatch, getState) => {
    dispatch(request());
    dispatch(showLoader());
    return createReturnLogistic(payload)
      .then(apiResponse => {
        if (apiResponse.valid) {
          const { pendingReturnInventory } = getState().pendingReturnInventory;
          const newPendingReturnInventoryList = pendingReturnInventory.filter(item => !assignedBikeIds.includes(item.id));

          dispatch(success({ pendingReturnInventory: newPendingReturnInventoryList, count: newPendingReturnInventoryList.length }));
        } else {
          dispatch(setNotification('danger', 'ERROR', apiResponse.message));
        }
        dispatch(hideLoader());
      })
  }

  function request() { return { type: PENDING_RETURN_INVENTORY.REQUEST } }
  function success(pendingReturnsInventory) { return { type: PENDING_RETURN_INVENTORY.SUCCESS, payload: { ...pendingReturnsInventory } } }
}

export function resetInventoryList() {
  return { type: PENDING_RETURN_INVENTORY.RESET }
}
