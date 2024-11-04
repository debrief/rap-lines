import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import './App.css';
import Store, { Action, ActionHandler } from './state';
import { MoveEastHandler, MoveNorthHandler, MoveSouthHandler, MoveWestHandler } from './actions/move-north';
import { FeatureCollection } from 'geojson';
import { ScaleUpHandler } from './actions/scale-track';
import { SummariseTrackHandler } from './actions/summarise-track';

const registerHandlers = ():ActionHandler[] => {
  const res: ActionHandler[] = [];
  res.push(MoveNorthHandler);
  res.push(MoveSouthHandler);
  res.push(MoveEastHandler);
  res.push(MoveWestHandler);
  res.push(ScaleUpHandler)
  res.push(SummariseTrackHandler)
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
        const handlers = registerHandlers()
        handlers.forEach(handler => newStore.addHandler(handler));
        newStore.addStateListener(stateListener);
        newStore.addActionsListener(actionsListener)
        // fire empty add action, to force update
        newStore.addAction(null)
        setStore(newStore);
      });
  }, []);

  if (!store) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Sidebar actions={actions} addAction={addAction} toggleActive={toggleActionActive} deleteAction={removeAction} />
      <div className="main-content">
        <MapArea state={state} />
      </div>
    </div>
  );
}

export default App;
