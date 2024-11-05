import { FeatureCollection } from 'geojson';

export interface BaseAction {
  id: string
  type: string;
  label: string;
  version: string;
  active: boolean
}

export interface Action extends BaseAction {
  payload: any;
}

interface CompositeAction extends BaseAction {
  items: Action[];
}

export interface ActionHandler {
  type: string
  handle(state: FeatureCollection, action: BaseAction): FeatureCollection;
}

export const TypeComposite = 'composite';

export const printFeature = (msg: string, feature: FeatureCollection) => {
  const firstFeature = feature.features[0];
  if (firstFeature.geometry.type === 'Point') {
    const firstCoord = firstFeature.geometry.coordinates;
    console.log(msg + ` [${firstCoord[0]}, ${firstCoord[1]}]`)
  }
}

class Store {
  private actions: Array<Action | CompositeAction>;
  private currentState: FeatureCollection;
  private initialState: FeatureCollection;
  private handlers: ActionHandler[];
  private stateListeners: ((state: FeatureCollection) => void)[];
  private actionsListeners: ((actions: BaseAction[]) => void)[];

  constructor(initialState: FeatureCollection) {
    console.log('store constructor', initialState);
    this.actions = [];
    this.currentState = initialState;
    this.initialState = initialState;
    this.handlers = []
    this.stateListeners = [];
    this.actionsListeners = [];

    // register the composite handler
    this.addHandler(this.CompositeHandler);
  }

  private CompositeHandler: ActionHandler = {
    type: TypeComposite,
    handle: (state, action) => {
      const compAction = action as unknown as CompositeAction;
      const items = compAction.items;
      items.reduce((state, action) => {
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
    }, state);
      // take a copy of the state object
      const newState = JSON.parse(JSON.stringify(state));
      return newState;
    }
  }

  addAction(action: Action | CompositeAction) {
    const newAction = { ...action };
    // initialise the id of the action
    newAction.id =new Date().getTime().toString();
    this.actions.push(newAction);
    this.actionsListeners.forEach(listener => listener(this.actions));  
    this.updateState();
  }

  addHandler(handler: ActionHandler) {
    this.handlers.push(handler);
  }

  addStateListener(listener: (state: FeatureCollection) => void) {
    this.stateListeners.push(listener)
  }

  addActionsListener(listener: (actions: BaseAction[]) => void) {
    this.actionsListeners.push(listener)
  }

  removeAction(action: BaseAction) {
    this.actions = this.actions.filter(a => a !== action);
    this.actionsListeners.forEach(listener => listener(this.actions));
    this.updateState();
  }

  toggleActionActive(action: BaseAction) {
    action.active = !action.active;
    this.updateState();
  }

  private updateState() {
    this.currentState = this.actions.reduce((state, action) => {
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
