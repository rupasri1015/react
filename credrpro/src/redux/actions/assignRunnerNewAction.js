import qs from 'qs';

import { ASSIGN_RUNNER_NEW } from '../../core/constants/actions';
import { getAllVehicles, newAssignRunner } from '../../core/services/logisticsServicesNew';
import { showLoader, hideLoader } from './loaderAction';
import { setNotification } from './notificationAction';

export function getAllVehiclesList(payload = { pageNo: 1 }) {
  // const queryParamsStr = qs.stringify(
	// 	{
	// 		// storeId: storeDetails().storeId,
	// 		...payload,
	// 	},
	// 	{ encode: false }
	// );
 console.log('check','payload')


  return dispatch => {
    dispatch(getAllVehiclesRequest())
    dispatch(showLoader())
    return getAllVehicles(payload)
      .then(apiResponse => {
        if (apiResponse.valid) {
          console.log(apiResponse,"apiResponse")
          dispatch(getAllVehiclesSuccess(apiResponse))
        } else {
          dispatch(getAllVehiclesFailure({ error: apiResponse.message }))
          dispatch(setNotification('danger', 'ERROR', apiResponse.message))
        }
        dispatch(hideLoader())
      });
  }

function getAllVehiclesRequest() { return { type: ASSIGN_RUNNER_NEW.GET_ALL_VEHICLES_REQUEST } }
function getAllVehiclesSuccess(apiResponse) { return { type: ASSIGN_RUNNER_NEW.GET_ALL_VEHICLES_SUCCESS, payload: { ...apiResponse } } }
function getAllVehiclesFailure(error) { return { type: ASSIGN_RUNNER_NEW.GET_ALL_VEHICLES_FAILURE, payload: { ...error } } }
}

export function assignRunner(payload) {
  return (dispatch, getState) => {
    dispatch(showLoader())
    newAssignRunner(payload.assignRunnerPayload)
    .then(apiResponse => {
      if (apiResponse.valid) {
        dispatch(setNotification('success', 'Success', apiResponse.message));
        dispatch(getAllVehiclesList(payload.initialPayload));
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message))
      }
      dispatch(hideLoader())
    })
  }
}
