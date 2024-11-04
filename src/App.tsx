import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import './App.css';
import Store, { Action, ActionHandler } from './state';
import { MoveEastHandler, MoveNorthHandler, MoveSouthHandler, MoveWestHandler } from './actions/move-north';
import { FeatureCollection } from 'geojson';
import { ScaleUpHandler } from './actions/scaleTrack';
import FlexLayout from 'flexlayout-react';

const registerHandlers = ():ActionHandler[] => {
  const res: ActionHandler[] = [];
  res.push(MoveNorthHandler);
  res.push(MoveSouthHandler);
  res.push(MoveEastHandler);
  res.push(MoveWestHandler);
  res.push(ScaleUpHandler)
  return res;
}

const layoutModel: FlexLayout.IJsonModel = {
  global: {},
  layout: {
    type: "row",
    children: [
      {
        type: "tabset",
        weight: 20,
        children: [
          {
            type: "tab",
            name: "Sidebar",
            component: "sidebar"
          }
        ]
      },
      {
        type: "tabset",
        weight: 80,
        children: [
          {
            type: "tab",
            name: "MapArea",
            component: "maparea"
          }
        ]
      }
    ]
  }
};

const App: React.FC = () => {
  const [store, setStore] = useState<Store | null>(null);

  const [state, setState] = useState<FeatureCollection | null>(null);
  const [actions, setActions] = useState<Action[]>([]);

  const stateListener = (state: FeatureCollection) => {
    setState(state)
  }

  const actionsListener  = (actions: Action[]) => {
    setActions(actions)
  }

  const addAction = useCallback((action: Action) => {
    if (store){
      store?.addAction(action);
    }
  }, [store])

  const toggleActionActive = useCallback((action: Action) => {
    if (store) {
      store.toggleActionActive(action);
    }
  }, [store]);

  const removeAction = useCallback((action: Action) => {
    if (store) {
      store.removeAction(action);
    }
  }, [store]);

  useEffect(() => {
//    fetch('/sample.json')
    fetch('/waypoints.geojson')
      .then(response => response.json())
      .then(data => {
        console.clear()
        const initialState = data;
        const newStore = new Store(initialState);
        console.log('newStore', newStore, data);
        const handlers = registerHandlers()
        handlers.forEach(handler => newStore.addHandler(handler));
        newStore.addStateListener(stateListener);
        newStore.addActionsListener(actionsListener)
        setStore(newStore);
      });
  }, []);

  if (!store) {
    return <div>Loading...</div>;
  }



  const factory = (node: any) => {
    const component = node.getComponent();
    switch (component) {
      case "sidebar":
        return <Sidebar actions={actions} addAction={addAction} toggleActive={toggleActionActive} deleteAction={removeAction} />;
      case "maparea":
        return <MapArea state={state} />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <FlexLayout.Layout model={FlexLayout.Model.fromJson(layoutModel)} factory={factory} />
    </div>
  );
}

export default App;
