import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PipelineViewer from './components/PipelineViewer';
import Tools from './components/Tools';
import MapArea from './components/MapArea';
import './App.css';
import Store, { Outcomes } from './Store';
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
  const [outcomes, setOutcomes] = useState<Outcomes>({});
  const [actions, setActions] = useState<BaseAction[]>([]);
  const [visibleOutcomes, setVisibleOutcomes] = useState<string[]>([]);

  const stateListener = (state: FeatureCollection | null, outcomes: Outcomes) => {
    setState(state);
    setOutcomes(outcomes);
  }

  console.log('outcomes', outcomes)

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
        setOutcomes({});
      });
  }, [actionsListener, pipeline, store]);

  if (!store) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <div className="sidebar">
        <PipelineViewer toggleActive={toggleActive} deleteAction={removeAction}
          groupAction={groupAction} actions={actions} unGroupAction={unGroupAction} outcomes={outcomes} 
          visibleOutcomes={visibleOutcomes} setVisibleOutcomes={setVisibleOutcomes} />
        <div><h2>Detail View</h2></div>  
      </div>
      <div className="main-content">
        <Box><Tools addAction={addAction} /></Box>
        <MapArea state={state} visibleOutcomes={visibleOutcomes} />
      </div>
    </div>
  );
}

export default App;
