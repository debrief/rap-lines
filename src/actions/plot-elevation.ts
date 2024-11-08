import L from "leaflet";
import { Action, ActionHandler } from "../Pipeline";
import { TypeArray2dOutcome } from "../Store";

export const PropertyPlot = 'property-plot'

export const ElevationPlot: Action = {
  id: 'pending',
  type: PropertyPlot,
  payload: {
    field: 'ele'
  },
  label: 'Elevation Plot',
  version: '1.0',
  active: true // Added active property
}

export const ElevationPlotHandler: ActionHandler = {
  type: PropertyPlot,
  handle: (acc, action) => {
    // take a copy of the state object
    const propAction = action as unknown as typeof ElevationPlot;
    if (acc.state.features.length > 0) {
      const res = acc.state.features.map(f => {
        if (f.properties) {
          const time = f.properties['time']
          const value = f.properties[propAction.payload.field]
          return [time, value]  
        } else {
          return [0, 0]
        }
      })
    
      acc.outcomes[action.id] = {
        type: TypeArray2dOutcome, 
        data: res 
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
