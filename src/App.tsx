import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import './App.css';
import Store, { Action, ActionHandler } from './state';
import { MoveEastHandler, MoveNorthHandler, MoveSouthHandler, MoveWestHandler } from './actions/move-north';
import { FeatureCollection } from 'geojson';

const registerHandlers = ():ActionHandler[] => {
  const res: ActionHandler[] = [];
  res.push(MoveNorthHandler);
  res.push(MoveSouthHandler);
  res.push(MoveEastHandler);
  res.push(MoveWestHandler);
  return res;
}

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

  return (
    <div className="app">
      <Sidebar actions={actions} addAction={addAction} />
      <div className="main-content">
        <MapArea state={state} />
      </div>
    </div>
  );
}

export default App;
