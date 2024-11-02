import { Action, ActionHandler } from '../state';

export const MoveNorth: Action = {
  type: 'move-north',
  payload: {
    direction: 'north',
    distance: 1
  },
  label: 'Move North',
  version: '1.0'
}

export const MoveNorthHandler: ActionHandler = (state, action) => {
  // take a copy of the state object
  const newState = JSON.parse(JSON.stringify(state));

  // iterate through all goemetries in the the newState object
  newState.features.forEach((feature: any) => {
    // if the feature is a point
    if (feature.geometry.type === 'Point') {
      // update the point's coordinates
      feature.geometry.coordinates[1] += action.payload.distance;
    }
  });
  return newState;

}