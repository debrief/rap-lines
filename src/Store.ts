import { FeatureCollection } from 'geojson';
import { ActionHandler, BaseAction, CompositeAction } from './Pipeline';

export const TypeComposite = 'composite';

export const printFeature = (msg: string, feature: FeatureCollection) => {
  const firstFeature = feature.features[0];
  if (firstFeature.geometry.type === 'Point') {
    const firstCoord = firstFeature.geometry.coordinates;
    console.log(msg + ` [${firstCoord[0]}, ${firstCoord[1]}]`)
  }
}

export interface Outcome {
  actionId: string;
  description: string;
}

export type Outcomes =   { [key: string]: Outcome }

export interface AccOutcomes {
  state: FeatureCollection
  outcomes: Outcomes
}

class Store {
  private currentState: FeatureCollection | null;
  private initialState: FeatureCollection | null;
  private handlers: ActionHandler[];
  private stateListeners: ((state: FeatureCollection | null, outcomes: { [key: string]: Outcome }) => void)[];
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
  
  setInitialState(initialState: FeatureCollection) {
    this.initialState = initialState;
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
