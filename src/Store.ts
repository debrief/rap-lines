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

export interface CompositeAction extends BaseAction {
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
  private currentState: FeatureCollection;
  private stateListeners: ((state: FeatureCollection) => void)[];

  constructor(initialState: FeatureCollection) {
    console.log('store constructor', initialState);
    this.currentState = initialState;
    this.stateListeners = [];
  }

  addStateListener(listener: (state: FeatureCollection) => void) {
    this.stateListeners.push(listener)
  }

  updateState(state: FeatureCollection) {
    this.currentState = state;
    this.stateListeners.forEach(listener => listener(this.currentState));
  }

  getState(): FeatureCollection {
    return this.currentState;
  }
}

export default Store;
