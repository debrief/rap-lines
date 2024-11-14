import { Action, ActionHandler } from "../classes/Pipeline";
import { TypeSpatialOutcome } from "../classes/Store";

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
  handle: (acc, action) => {
    // take a copy of the state object
    const newState = JSON.parse(JSON.stringify(acc.state));

    // iterate through all geometries in the newState object
    newState.features.forEach((feature: any) => {
      // if the feature is a point
      if (feature.geometry.type === 'Point') {
        // update the point's coordinates
        feature.geometry.coordinates[1] += (action as Action).payload.distance;
      }
    });
    acc.outcomes[action.id] = {
      type: TypeSpatialOutcome, // Pc424
      after: newState // Pc424
    };
    return {
      state: newState,
      outcomes: acc.outcomes
    };
  }
}
export const MoveSouthHandler: ActionHandler = {
  type: TypeSouth,
  handle: (acc, action) => {
    // take a copy of the state object
    const newState = JSON.parse(JSON.stringify(acc.state));

    // iterate through all geometries in the newState object
    newState.features.forEach((feature: any) => {
      // if the feature is a point
      if (feature.geometry.type === 'Point') {
        // update the point's coordinates
        feature.geometry.coordinates[1] -= (action as Action).payload.distance;
      }
    });
    acc.outcomes[action.id] = {
      type: TypeSpatialOutcome, // P6865
      after: newState // P6865
    };
    return {
      state: newState,
      outcomes: acc.outcomes
    };
  }
}
export const MoveEastHandler: ActionHandler = {
  type: TypeEast,
  handle: (acc, action) => {
    // take a copy of the state object
    const newState = JSON.parse(JSON.stringify(acc.state));

    // iterate through all geometries in the newState object
    newState.features.forEach((feature: any) => {
      // if the feature is a point
      if (feature.geometry.type === 'Point') {
        // update the point's coordinates
        feature.geometry.coordinates[0] += (action as Action).payload.distance;
      }
    });
    acc.outcomes[action.id] = {
      type: TypeSpatialOutcome, // P77f8
      after: newState // P77f8
    };
    return {
      state: newState,
      outcomes: acc.outcomes
    };
  }
}
export const MoveWestHandler: ActionHandler = {
  type: TypeWest,
  handle: (acc, action) => {
    // take a copy of the state object
    const newState = JSON.parse(JSON.stringify(acc.state));

    // iterate through all geometries in the newState object
    newState.features.forEach((feature: any) => {
      // if the feature is a point
      if (feature.geometry.type === 'Point') {
        // update the point's coordinates
        feature.geometry.coordinates[0] -= (action as Action).payload.distance;
      }
    });
    acc.outcomes[action.id] = {
      type: TypeSpatialOutcome, // P8a44
      after: newState // P8a44
    };
    return {
      state: newState,
      outcomes: acc.outcomes
    };
  }
}
