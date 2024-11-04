import { FeatureCollection } from 'geojson';

export interface Action {
  // this will be unique for each action, initialised when the action is created
  id: string
  type: string;
  payload: any;
  label: string;
  version: string;
  active: boolean; // Added active property
}

export interface ActionHandler {
  type: string
  handle(state: FeatureCollection, action: Action): FeatureCollection;
}

export const printFeature = (msg: string, feature: FeatureCollection) => {
  const firstFeature = feature.features[0];
  if (firstFeature.geometry.type === 'Point') {
    const firstCoord = firstFeature.geometry.coordinates;
    console.log(msg + ` [${firstCoord[0]}, ${firstCoord[1]}]`)
  }
}

class Store {
  private actions: Action[];
  private currentState: FeatureCollection;
  private initialState: FeatureCollection;
  private handlers: ActionHandler[];
  private stateListeners: ((state: FeatureCollection) => void)[];
  private actionsListeners: ((actions: Action[]) => void)[];

  constructor(initialState: FeatureCollection) {
    console.log('store constructor', initialState);
    this.actions = [];
    this.currentState = initialState;
    this.initialState = initialState;
    this.handlers = []
    this.stateListeners = [];
    this.actionsListeners = [];
  }

  addAction(action: Action) {
    const newAction = { ...action };
    // initialise the id of the action
    const timeStamp = new Date().getTime();
    newAction.id = '' + timeStamp % 1000000;
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

  addActionsListener(listener: (actions: Action[]) => void) {
    this.actionsListeners.push(listener)
  }

  modifyAction(index: number, newAction: Action) {
    if (index >= 0 && index < this.actions.length) {
      this.actions[index] = newAction;
      this.updateState();
    }
  }

  removeAction(action: Action) {
    this.actions = this.actions.filter(a => a !== action);
    this.actionsListeners.forEach(listener => listener(this.actions));
    this.updateState();
  }

  toggleActionActive(action: Action) {
    const index = this.actions.indexOf(action);
    if (index !== -1) {
      this.actions[index].active = !this.actions[index].active;
      this.updateState();
    }
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
