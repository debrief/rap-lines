import { FeatureCollection } from 'geojson';
import { ActionHandler, BaseAction, CompositeAction } from './Pipeline';

export const TypeComposite = 'composite';
export const TypeSimpleOutcome = 'SimpleOutcome'; // P8c9a
export const TypeSpatialOutcome = 'SpatialOutcome'; // P8c9a

export const printFeature = (msg: string, feature: FeatureCollection) => {
  const firstFeature = feature.features[0];
  if (firstFeature.geometry.type === 'Point') {
    const firstCoord = firstFeature.geometry.coordinates;
    console.log(msg + ` [${firstCoord[0]}, ${firstCoord[1]}]`)
  }
}

export interface SimpleOutcome {
  type: typeof TypeSimpleOutcome; // Pb793
  description: string;
}

export interface SpatialOutcome {
  type: typeof TypeSpatialOutcome; // P57f0
  after: FeatureCollection;
}

export type Outcome = SimpleOutcome | SpatialOutcome;

export type Outcomes = { [key: string]: Outcome }

/** combine an outcome id with a color */
export interface ShadedOutcome {
  id: string
  color: string
}

/** custom object, used for passing data down through `reduce` method
 * when processing an sequence of actions
 */
export interface AccOutcomes {
  state: FeatureCollection
  outcomes: Outcomes
}

class Store {
  private currentState: FeatureCollection | null;
  private initialState: FeatureCollection | null;
  private handlers: ActionHandler[];
  private stateListeners: ((state: FeatureCollection | null, outcomes: Outcomes) => void)[];
  private index: number;
  private outcomes: Outcomes;
  
  constructor() {
    console.log('store constructor');
    this.currentState = null;
    this.initialState = null;
    this.handlers = [];
    this.stateListeners = [];
    this.index = 0;
    this.outcomes = {};
    
    // register the composite handler
    this.addHandler(this.CompositeHandler);
  }
  
  private CompositeHandler: ActionHandler = {
    type: TypeComposite,
    handle: (acc, action) => {
      const compAction = action as unknown as CompositeAction;
      const items = compAction.items;
      const newAcc = items.reduce((acc, action) => {
        if (!action.active) {
          return acc;
        }
        const handler = this.handlers.find(handler => handler.type === action.type);
        if (handler) {
          const newState = JSON.parse(JSON.stringify(acc.state));
          const newAcc = {state: newState, outcomes: acc.outcomes}
          return handler.handle(newAcc, action);
        } else {
          console.warn('No handler found for action', action, this.handlers.map(handler => handler.type));
          return acc;
        }
      }, acc);
      // take a copy of the state object
      return newAcc;
    }
  }
  
  setInitialState(path: string, actions: BaseAction[]) {
    console.log('about to fetch', path)
    fetch(path)
    .then(response => response.json())
    .then(data => {
      this.initialState = data;
      this.updateState(actions)
    })
  }
  
  addHandler(handler: ActionHandler) {
    this.handlers.push(handler);
  }
  
  addStateListener(listener: (state: FeatureCollection | null, outcomes: Outcomes) => void) {
    this.stateListeners.push(listener);
  }
  
  actionsListener(actions: BaseAction[]) {
    this.updateState(actions);
  }
  
  private updateState(actions: BaseAction[]) {
    if (!this.initialState) {
      console.error('No initial state set');
      return;
    }
    const result = actions.reduce((acc, action) => {
      if (!action.active) {
        return acc;
      }
      const handler = this.handlers.find(handler => handler.type === action.type);
      if (handler) {
        return handler.handle(acc, action);
      } else {
        console.warn('No handler found for action', action, this.handlers.map(handler => handler.type));
        return acc;
      }
    }, { state: this.initialState, outcomes: {} });
    this.currentState = result.state;
    this.outcomes = result.outcomes;
    this.stateListeners.forEach(listener => listener(this.currentState, this.outcomes));
  }
}

export default Store;
