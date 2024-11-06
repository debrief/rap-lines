import { AccOutcomes } from './Store';

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
  handle(acc: AccOutcomes, action: BaseAction): AccOutcomes;
}

export const TypeComposite = 'composite';

class Pipeline {
  private actions: Array<Action | CompositeAction>;
  private actionsListeners: ((actions: BaseAction[]) => void)[];
  private index: number

  constructor() {
    console.log('pipeline constructor');
    this.actions = [];
    this.actionsListeners = [];
    this.index = 0;
  }

  addAction(action: Action | CompositeAction) {
    const newAction = { ...action };
    // initialise the id of the action
    newAction.id = '' + ++this.index
    this.actions = [...this.actions, newAction];
    this.actionsListeners.forEach(listener => listener(this.actions));  
  }

  addActionsListener(listener: (actions: BaseAction[]) => void) {
    this.actionsListeners.push(listener)
  }

  removeAction(action: BaseAction) {
    // check it's in the top level actions
    if (this.actions.includes(action as CompositeAction | Action)) {
      this.actions = this.actions.filter(a => a !== action);
    } else {
      // check inside composite actions
      const compositeActions = this.actions.filter(a => a.type === TypeComposite) as CompositeAction[];
      const parent = compositeActions.find(comp => comp.items.includes(action as Action));
      if (parent) {
        parent.items = parent?.items.filter(a => a !== action);
      }
    }

    this.actions = this.actions.filter(a => a !== action);
    this.actionsListeners.forEach(listener => listener(this.actions));
  }

  ungroupAction(action: BaseAction) {
    // check it's a composite action
    if (action.type !== TypeComposite) {
      console.warn('Action is not a composite action', action);
      return;
    }
    else {
      const comp = action as CompositeAction; 
      // find the index of the composite action
      const index = this.actions.findIndex(a => a === action);
      // remove the composite action
      this.actions.splice(index, 1);
      // add the items back to the action list at the correct index
      this.actions.splice(index, 0, ...comp.items);
      // inform the action listeners
      this.actionsListeners.forEach(listener => listener(this.actions));
    }  
  }

  groupActions(selectedItems: BaseAction[], name: string) {
    const compositeAction: CompositeAction = {
      id: '' + ++this.index,
      type: TypeComposite,
      label: name,
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
  }

  toggleActionActive(action: BaseAction) {
    action.active = !action.active;
    // fire updates to action list listeners
    this.actionsListeners.forEach(listener => listener(this.actions));
  }
}

export default Pipeline;
