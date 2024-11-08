import L from "leaflet";
import { Action, ActionHandler } from "../Pipeline";
import { TypeArray2dOutcome } from "../Store";
import { Point, Position } from "geojson";

export const TypePropertyPlot = 'property-plot'
export const TypeSpeedPlot = 'speed-plot'

export const SpeedPlot: Action = {
  id: 'pending',
  type: TypeSpeedPlot,
  payload: undefined,
  label: 'Speed Plot',
  version: '1.0',
  active: true // Added active property
}

export const ElevationPlot: Action = {
  id: 'pending',
  type: TypePropertyPlot,
  payload: {
    field: 'ele'
  },
  label: 'Elevation Plot',
  version: '1.0',
  active: true // Added active property
}

export const SpeedPlotHandler: ActionHandler = {
  type: TypeSpeedPlot,
  handle: (acc, action) => {
    // take a copy of the state object
    const propAction = action as unknown as typeof ElevationPlot;
    if (acc.state.features.length > 0) {
      const res: number[][] = []
      let lastTime = 0
      let lastPoint: Position | null = null
      acc.state.features.forEach(f => {
        if (f.properties) {
          const thisTimeStr = f.properties['time']
          const thisTime = new Date(thisTimeStr).getTime()
          const thisPoint = (f.geometry as Point).coordinates
          if (lastPoint) {
            // calculate delta
            const timeDelta = (thisTime - lastTime)/1000
            const pointDelta = L.latLng(thisPoint[1], thisPoint[0]).distanceTo(L.latLng(lastPoint[1], lastPoint[0]))
            console.log('delta for', lastPoint, thisPoint, pointDelta, timeDelta)
            const speed = pointDelta / timeDelta
            res.push([thisTimeStr, speed])
          }
          lastPoint = thisPoint
          lastTime = thisTime
        }
      })

      console.log('res', res)
    
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

export const ElevationPlotHandler: ActionHandler = {
  type: TypePropertyPlot,
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
