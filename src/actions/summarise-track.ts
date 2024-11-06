import L from "leaflet";
import { Action, ActionHandler } from "../Pipeline";

export const TypeSummarise = 'summarise'

export const SummariseTrack: Action = {
  id: 'pending',
  type: TypeSummarise,
  payload: {
    operation: 'center'
  },
  label: 'Centre Point',
  version: '1.0',
  active: true // Added active property
}


export const SummariseTrackHandler: ActionHandler = {
  type: TypeSummarise,
  handle: (acc, action) => {
    // take a copy of the state object
    const newState = JSON.parse(JSON.stringify(acc.state));
    if (newState.features.length > 0) {
      const bounds = new L.GeoJSON(newState).getBounds();
      const centre = bounds.getCenter();
      acc.outcomes[action.id] = {
        actionId: action.id,
        description: `Centre Point: [${centre.lat.toFixed(3)}, ${centre.lng.toFixed(3)}]`
      };
      return {
        state: newState,
        outcomes: acc.outcomes
      }
    } else {
      return acc;
    }
  }
}