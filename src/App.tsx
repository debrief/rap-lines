import React, { useCallback, useEffect, useState } from 'react';
import Pipeline from './Pipeline';
import Tools from './components/Tools';
import MapArea from './components/MapArea';
import './App.css';
import Store, { Action, ActionHandler, BaseAction } from './Store';
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
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);

  const [state, setState] = useState<FeatureCollection | null>(null);
  const [actions, setActions] = useState<BaseAction[]>([]);

  const stateListener = (state: FeatureCollection) => {
    setState(state)
  }

  const actionsListener  = (actions: BaseAction[]) => {
    setActions(actions)
  }

  const addAction = useCallback((action: Action) => {
    if (pipeline){
      pipeline?.addAction(action);
    }
  }, [pipeline])

  const groupAction = useCallback((actions: BaseAction[], name: string) => {
    if (pipeline){
      pipeline?.groupActions(actions, name);
    }
  }, [pipeline])

  const unGroupAction = useCallback((action: BaseAction) => {
    if (pipeline){
      pipeline?.ungroupAction(action);
    }
  }, [pipeline])


  const toggleActive = useCallback((action: BaseAction) => {
    if (pipeline) {
      pipeline.toggleActionActive(action);
    }
  }, [pipeline]);

  const removeAction = useCallback((action: BaseAction) => {
    if (pipeline) {
      pipeline.removeAction(action);
    }
  }, [pipeline]);

  useEffect(() => {
//    fetch('/sample.json')
    fetch('/waypoints.geojson')
      .then(response => response.json())
      .then(data => {
        console.clear()
        const initialState = data;
        // store this initial state
        const newStore = new Store(initialState);
        const newPipeline = new Pipeline(initialState);
        const handlers = registerHandlers()
        handlers.forEach(handler => newPipeline.addHandler(handler));
        newPipeline.addStateListener(stateListener);
        newPipeline.addActionsListener(actionsListener)
        newStore.addStateListener(stateListener);
        newPipeline.addActionsListener(newStore.updateState.bind(newStore));
        setState(initialState)
        setStore(newStore);
        setPipeline(newPipeline);
      });
  }, []);

  if (!store || !pipeline) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Pipeline toggleActive={toggleActive} deleteAction={removeAction}
          groupAction={groupAction} actions={actions} unGroupAction={unGroupAction} />
        <Tools addAction={addAction} />
      </div>
      <div className="main-content">
        <MapArea state={state} />
      </div>
    </div>
  );
}

export default App;
