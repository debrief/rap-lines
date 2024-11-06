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
  private stateListeners: ((state: FeatureCollection | null, outcomes: { [key: string]: any }) => void)[];
  private index: number;
  private outcomes: { [key: string]: any };

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

  setInitialState(initialState: FeatureCollection) {
    this.initialState = initialState;
  }

  private CompositeHandler: ActionHandler = {
    type: TypeComposite,
    handle: (state, action) => {
      const compAction = action as unknown as CompositeAction;
      const items = compAction.items;
      const result = items.reduce((acc, action) => {
        if (!action.active) {
          return acc;
        }
        const handler = this.handlers.find(handler => handler.type === action.type);
        if (handler) {
          const newState = JSON.parse(JSON.stringify(acc.state));
          const { newState: updatedState, summary } = handler.handle(newState, action);
          acc.state = updatedState;
          acc.outcomes[action.id] = summary;
          return acc;
        } else {
          console.warn('No handler found for action', action, this.handlers.map(handler => handler.type));
          return acc;
        }
      }, { state, outcomes: {} });
      return result;
    }
  }

  addHandler(handler: ActionHandler) {
    this.handlers.push(handler);
  }

  addStateListener(listener: (state: FeatureCollection | null, outcomes: { [key: string]: any }) => void) {
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
        const { newState, summary } = handler.handle(acc.state, action);
        acc.state = newState;
        acc.outcomes[action.id] = summary;
        return acc;
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
