import { FeatureCollection, GeoJSON } from 'geojson';

interface Action {
  type: string;
  payload: any;
  label: string;
  version: string;
}

class State {
  private actions: Action[];
  private currentState: FeatureCollection;

  constructor(initialState: FeatureCollection) {
    this.actions = [];
    this.currentState = initialState;
  }

  addAction(action: Action) {
    this.actions.push(action);
    this.updateState();
  }

  modifyAction(index: number, newAction: Action) {
    if (index >= 0 && index < this.actions.length) {
      this.actions[index] = newAction;
      this.updateState();
    }
  }

  private updateState() {
    this.currentState = this.actions.reduce((state, action) => {
      // Apply each action to the state
      // This is a placeholder implementation, you should replace it with your own logic
      return state;
    }, this.currentState);
  }

  getState(): FeatureCollection {
    return this.currentState;
  }
}

export default State;
