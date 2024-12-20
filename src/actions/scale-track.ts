import { Action, ActionHandler } from "../classes/Pipeline";
import * as turf from '@turf/turf';
import { TypeSpatialOutcome } from "../classes/Store";

export const TypeScale = 'scale'

export const ScaleUp: Action = {
  id: 'pending',
  type: TypeScale,
  payload: {
    factor: 1.6
  },
  label: 'Scale Up',
  version: '1.0',
  active: true // Added active property
}

export const ScaleDown: Action = {
  id: 'pending',
  type: TypeScale,
  payload: {
    factor: 0.625
  },
  label: 'Scale Down',
  version: '1.0',
  active: true // Added active property
}

export const ScaleUpHandler: ActionHandler = {
  type: TypeScale,
  handle: (acc, action) => {
    // take a copy of the state object
    const newState = JSON.parse(JSON.stringify(acc.state));
    if (newState.features.length > 0) {
      const origin = newState.features[0].geometry.coordinates;
      // iterate through all geometries in the newState object
      newState.features.forEach((feature: any) => {
        // if the feature is a point
        if (feature.geometry.type === 'Point') {
          const bearing = turf.bearing(origin, feature.geometry.coordinates);
          const distance = turf.distance(origin, feature.geometry.coordinates);
          const newDist = distance * (action as Action).payload.factor;
          const newCoords = turf.destination(origin, newDist, bearing);
          feature.geometry.coordinates = newCoords.geometry.coordinates;
        }
      });
    }
    
    acc.outcomes[action.id] = {
      type: TypeSpatialOutcome, // P33b7
      after: newState // P33b7
    };
    

    return { 
      state: newState,
      outcomes: acc.outcomes
    };
  }
}
