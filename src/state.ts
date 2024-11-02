import { FeatureCollection } from 'geojson';

export interface Action {
  type: string;
  payload: any;
  label: string;
  version: string;
}

export interface ActionHandler {
  type: string
  handle(state: FeatureCollection, action: Action): FeatureCollection;
}

class State {
  private actions: Action[];
  private currentState: FeatureCollection;
  private handlers: ActionHandler[];

  constructor(initialState: FeatureCollection) {
    this.actions = [];
    this.currentState = initialState;
    this.handlers = []
  }

  addAction(action: Action) {
    this.actions.push(action);
    this.updateState();
  }

  addHandler(handler: ActionHandler) {
    this.handlers.push(handler);
  }

  modifyAction(index: number, newAction: Action) {
    if (index >= 0 && index < this.actions.length) {
      this.actions[index] = newAction;
      this.updateState();
    }
  }

  private updateState() {
    this.currentState = this.actions.reduce((state, action) => {
      // see if we have an handler
      const handler = this.handlers.find(handler => handler.type === action.type);
      if (handler) {
        return handler.handle(state, action);
      } else {
        console.warn('No handler found for action', action, this.handlers.map(handler => handler.type));
        return state
      }
    }, this.currentState);
  }

  getState(): FeatureCollection {
    return this.currentState;
  }
}

export default State;
