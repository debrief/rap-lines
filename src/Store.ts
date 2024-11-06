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

class Store {
  private currentState: FeatureCollection | null;
  private initialState: FeatureCollection | null;
  private handlers: ActionHandler[];
  private stateListeners: ((state: FeatureCollection  | null) => void)[];
  private index: number

  constructor() {
    console.log('store constructor');
    this.currentState = null;
    this.initialState = null;
    this.handlers = []
    this.stateListeners = [];
    this.index = 0;

    // register the composite handler
    this.addHandler(this.CompositeHandler);
  }

  setInitialState(initialState: FeatureCollection) {
    this.initialState = initialState
  }

  private CompositeHandler: ActionHandler = {
    type: TypeComposite,
    handle: (state, action) => {
      const compAction = action as unknown as CompositeAction;
      const items = compAction.items;
      const newState = items.reduce((state, action) => {
        if (!action.active) {
          return state;
        }
        const handler = this.handlers.find(handler => handler.type === action.type);
        if (handler) {
          const newState = JSON.parse(JSON.stringify(state));
          return handler.handle(newState, action);
        } else {
          console.warn('No handler found for action', action, this.handlers.map(handler => handler.type));
          return state;
        }
    }, state);
      // take a copy of the state object
      return newState;
    }
  }

  addHandler(handler: ActionHandler) {
    this.handlers.push(handler);
  }

  addStateListener(listener: (state: FeatureCollection | null) => void) {
    this.stateListeners.push(listener)
  }

  actionsListener(actions: BaseAction[]) {
    this.updateState(actions);
  }

  private updateState(actions: BaseAction[]) {
    if (!this.initialState) {
      console.error('No initial state set');
      return;
    }
    this.currentState = actions.reduce((state, action) => {
      if (!action.active) {
        return state;
      }
      const handler = this.handlers.find(handler => handler.type === action.type);
      if (handler) {
        return handler.handle(state, action);
      } else {
        console.warn('No handler found for action', action, this.handlers.map(handler => handler.type));
        return state;
      }
    }, this.initialState);
    this.stateListeners.forEach(listener => listener(this.currentState));
  }
}

export default Store;
