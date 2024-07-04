export function getNewState(previousState, currentState) {
  return Object.assign({}, previousState, currentState);
};