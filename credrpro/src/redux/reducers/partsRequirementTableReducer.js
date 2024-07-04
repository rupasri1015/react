const initialState = {}

export default function partsRequirementTableReducer(state = initialState, action) {
  let newState = JSON.parse(JSON.stringify(state));
	switch (action.type) {
    case 'SAVE_CHECKED_ROW':
      Object.keys(newState).includes(action.payload.pageNumber.toString())
      ?
        newState[action.payload.pageNumber] 
        = [...newState[action.payload.pageNumber], ...action.payload.partRequestId]
      :
        newState[action.payload.pageNumber] = [...action.payload.partRequestId]
      newState[action.payload.pageNumber] = [...new Set(newState[action.payload.pageNumber])];
      return newState

    case 'REMOVE_UNCHECKED_ROW':      
      newState[action.payload.pageNumber] = newState[action.payload.pageNumber]
      .filter(val => val !== action.payload.partRequestId[0])
      return newState

    case 'UNSELECT_ALL':
      if(action.payload.pageNumber === 0) {
        return {};
      }
      else {
        newState[action.payload.pageNumber] = [];
        return newState
      }
    
    case  'SET_AGGREGATE_DATA':
      newState.aggregateData = action.payload.aggregateData;
      return newState;

    default:
      return state
  }
}
