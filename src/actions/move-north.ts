import { Action, ActionHandler } from '../state';

export const TypeNorth = 'move-north';
export const TypeEast = 'move-east';
export const TypeWest = 'move-west';
export const TypeSouth = 'move-south';

export const MoveNorth: Action = {
  id: 'pending',
  type: TypeNorth,
  payload: {
    direction: 'north',
    distance: 0.1
  },
  label: 'Move North',
  version: '1.0',
  active: true // Added active property
}

export const MoveEast: Action = {
  id: 'pending',
  type: TypeEast,
  payload: {
    direction: 'east',
    distance: 0.1
  },
  label: 'Move East',
  version: '1.0',
  active: true // Added active property
}

export const MoveWest: Action = {
  id: 'pending',
  type: TypeWest,
  payload: {
    direction: 'west',
    distance: 0.1
  },
  label: 'Move West',
  version: '1.0',
  active: true // Added active property
}

export const MoveSouth: Action = {
  id: 'pending',
  type: TypeSouth,
  payload: {
    direction: 'south',
    distance: 0.1
  },
  label: 'Move South',
  version: '1.0',
  active: true // Added active property
}

export const MoveNorthHandler: ActionHandler = {
  type: TypeNorth,
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
  type: TypeEast,
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
  type: TypeWest,
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
  type: TypeSouth,
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