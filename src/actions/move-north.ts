import { Action, ActionHandler } from '../state';

const myType = 'move-north';
const myTypeEast = 'move-east';
const myTypeWest = 'move-west';
const myTypeSouth = 'move-south';

export const MoveNorth: Action = {
  type: myType,
  payload: {
    direction: 'north',
    distance: 0.1
  },
  label: 'Move North',
  version: '1.0',
  active: true // Added active property
}

export const MoveEast: Action = {
  type: myTypeEast,
  payload: {
    direction: 'east',
    distance: 0.1
  },
  label: 'Move East',
  version: '1.0',
  active: true // Added active property
}

export const MoveWest: Action = {
  type: myTypeWest,
  payload: {
    direction: 'west',
    distance: 0.1
  },
  label: 'Move West',
  version: '1.0',
  active: true // Added active property
}

export const MoveSouth: Action = {
  type: myTypeSouth,
  payload: {
    direction: 'south',
    distance: 0.1
  },
  label: 'Move South',
  version: '1.0',
  active: true // Added active property
}

export const MoveNorthHandler: ActionHandler = {
  type: myType,
  handle: (state, action) => {
    // take a copy of the state object
    const newState = JSON.parse(JSON.stringify(state));

    // iterate through all geometries in the newState object
    newState.features.forEach((feature: any) => {
      // if the feature is a point
      if (feature.geometry.type === 'Point') {
        // update the point's coordinates
        feature.geometry.coordinates[1] += action.payload.distance;
      }
    });
    return newState;
  }
}

export const MoveEastHandler: ActionHandler = {
  type: myTypeEast,
  handle: (state, action) => {
    // take a copy of the state object
    const newState = JSON.parse(JSON.stringify(state));

    // iterate through all geometries in the newState object
    newState.features.forEach((feature: any) => {
      // if the feature is a point
      if (feature.geometry.type === 'Point') {
        // update the point's coordinates
        feature.geometry.coordinates[0] += action.payload.distance;
      }
    });
    return newState;
  }
}

export const MoveWestHandler: ActionHandler = {
  type: myTypeWest,
  handle: (state, action) => {
    // take a copy of the state object
    const newState = JSON.parse(JSON.stringify(state));

    // iterate through all geometries in the newState object
    newState.features.forEach((feature: any) => {
      // if the feature is a point
      if (feature.geometry.type === 'Point') {
        // update the point's coordinates
        feature.geometry.coordinates[0] -= action.payload.distance;
      }
    });
    return newState;
  }
}

export const MoveSouthHandler: ActionHandler = {
  type: myTypeSouth,
  handle: (state, action) => {
    // take a copy of the state object
    const newState = JSON.parse(JSON.stringify(state));

    // iterate through all geometries in the newState object
    newState.features.forEach((feature: any) => {
      // if the feature is a point
      if (feature.geometry.type === 'Point') {
        // update the point's coordinates
        feature.geometry.coordinates[1] -= action.payload.distance;
      }
    });
    return newState;
  }
}