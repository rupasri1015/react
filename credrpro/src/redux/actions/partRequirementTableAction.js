export const SAVE_CHECKED_ROW = 'SAVE_CHECKED_ROW';
export const REMOVE_UNCHECKED_ROW = 'REMOVE_UNCHECKED_ROW';
export const UNSELECT_ALL = 'UNSELECT_ALL';
export const SET_AGGREGATE_DATA = 'SET_AGGREGATE_DATA';

export const saveCheckedRow = (payload = {
	pageNumber: 1,
	partRequestId: []
}) => {
  return {
		type: SAVE_CHECKED_ROW,
		payload
  }
}

export const removeUncheckedRow = (payload = {
	pageNumber: 1,
	partRequestId: []
}) => {
  return {
		type: REMOVE_UNCHECKED_ROW,
		payload
  }
}

export const unselectAll = (payload = {
	pageNumber: 1,
	partRequestId: []
}) => {
  return {
		type: UNSELECT_ALL,
		payload
  }
}

export const setAggregateData = (payload = {
	aggregateData: []
}) => {
  return {
		type: SET_AGGREGATE_DATA,
		payload
  }
}
