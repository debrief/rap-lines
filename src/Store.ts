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

  ungroupAction(action: BaseAction) {
    // check it's a composite action
    if (action.type !== TypeComposite) {
      console.warn('Action is not a composite action', action);
      return;
    }
    else {
      const comp = action as CompositeAction; 
      console.log('actions before', this.actions)
      // find the index of the composite action
      const index = this.actions.findIndex(a => a === action);
      // remove the composite action
      this.actions.splice(index, 1);
      // add the items back to the action list at the correct index
      this.actions.splice(index, 0, ...comp.items);
      console.log('actions after', this.actions)
      // inform the action listeners
      this.actionsListeners.forEach(listener => listener(this.actions));
      // update the state
      this.updateState();
    }  
  }

  groupActions(selectedItems: BaseAction[]) {
    const compositeAction: CompositeAction = {
      id: new Date().getTime().toString(),
      type: TypeComposite,
      label: 'Group',
      version: '1.0',
      active: true,
      items: selectedItems as Action[]
    }
    // find the index of the first action in the selected items
    const firstIndex = this.actions.findIndex(action => action === selectedItems[0]);

    // insert the composite action before the first action
    this.actions.splice(firstIndex, 0, compositeAction);

    // filter out the selected items
    this.actions = this.actions.filter(action => !selectedItems.includes(action));

    // fire updates to action list listeners
    this.actionsListeners.forEach(listener => listener(this.actions));

    // update the state
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
