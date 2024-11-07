import L from "leaflet";
import { Action, ActionHandler } from "../Pipeline";
import { TypeSimpleOutcome } from "../Store";

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
    if (acc.state.features.length > 0) {
      const bounds = new L.GeoJSON(acc.state).getBounds();
      const centre = bounds.getCenter();
      acc.outcomes[action.id] = {
        type: TypeSimpleOutcome,
        description: `Centre Point: [${centre.lat.toFixed(3)}, ${centre.lng.toFixed(3)}]`
      };
      return {
        state: acc.state,
        outcomes: acc.outcomes
      }
    } else {
      return acc;
    }
  }
}