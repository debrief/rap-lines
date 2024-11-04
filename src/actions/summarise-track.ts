import L from "leaflet";
import { Action, ActionHandler } from "../state";

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
  handle: (state, action) => {
    // take a copy of the state object
    const newState = JSON.parse(JSON.stringify(state));
    if (newState.features.length > 0) {
      const bounds = new L.GeoJSON(newState).getBounds();
      const centre = bounds.getCenter();
      action.results = `Centre Point: [${centre.lat.toFixed(3)}, ${centre.lng.toFixed(3)}]`;
    }

    return newState;
  }
}