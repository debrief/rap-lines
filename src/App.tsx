import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PipelineViewer from './components/PipelineViewer';
import Tools from './components/Tools';
import MapArea from './components/MapArea';
import './App.css';
import Store from './Store';
import { MoveEastHandler, MoveNorthHandler, MoveSouthHandler, MoveWestHandler } from './actions/move-north';
import { FeatureCollection } from 'geojson';
import { ScaleUpHandler } from './actions/scale-track';
import { SummariseTrackHandler } from './actions/summarise-track';
import Pipeline, { Action, ActionHandler, BaseAction, CompositeAction } from './Pipeline';
import { Box } from '@mui/material';

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
  const store = useMemo(() => new Store(), []);
  const pipeline = useMemo(() => new Pipeline(), []);

  const [state, setState] = useState<FeatureCollection | null>(null);
  const [actions, setActions] = useState<BaseAction[]>([]);

  const stateListener = (state: FeatureCollection | null) => {
    setState(state)
  }

  const actionsListener = useCallback((actions: BaseAction[]) => {
    if (store){
      setActions(actions)
      store.actionsListener(actions)
    } else {
      console.error('No store to listen to actions')
    }
  }, [store])

  const addAction = useCallback((action: Action | CompositeAction) => {
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
        const handlers = registerHandlers()
        handlers.forEach(handler => store.addHandler(handler));
        store.addStateListener(stateListener);
        pipeline.addActionsListener(actionsListener);
        store.setInitialState(initialState)
        setState(initialState)
      });
  }, [actionsListener, pipeline, store]);

  if (!store) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <div className="sidebar">
        <PipelineViewer toggleActive={toggleActive} deleteAction={removeAction}
          groupAction={groupAction} actions={actions} unGroupAction={unGroupAction} />
        <div>Lower section</div>  
      </div>
      <div className="main-content">
        <Box><Tools addAction={addAction} /></Box>
        <MapArea state={state} />
      </div>
    </div>
  );
}

export default App;
