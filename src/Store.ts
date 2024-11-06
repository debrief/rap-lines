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
  private currentState: FeatureCollection;
  private initialState: FeatureCollection;
  private handlers: ActionHandler[];
  private stateListeners: ((state: FeatureCollection) => void)[];
  private index: number

  constructor(initialState: FeatureCollection) {
    console.log('store constructor', initialState);
    this.currentState = initialState;
    this.initialState = initialState;
    this.handlers = []
    this.stateListeners = [];
    this.index = 0;

    // register the composite handler
    this.addHandler(this.CompositeHandler);
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

  addStateListener(listener: (state: FeatureCollection) => void) {
    this.stateListeners.push(listener)
  }

  private updateState(actions: BaseAction[]) {
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

  getState(): FeatureCollection {
    return this.currentState;
  }
}

export default Store;
