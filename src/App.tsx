import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import PipelineViewer from './components/PipelineViewer';
import Tools from './components/Tools';
import MapArea from './components/MapArea';
import './App.css';
import Store, { Outcomes, ShadedOutcome } from './Store';
import { MoveEastHandler, MoveNorthHandler, MoveSouthHandler, MoveWestHandler } from './actions/move-north';
import { FeatureCollection } from 'geojson';
import { ScaleUpHandler } from './actions/scale-track';
import { SummariseTrackHandler } from './actions/summarise-track';
import { IJsonModel, Layout, Model, TabNode } from 'flexlayout-react'; // P9936
import 'flexlayout-react/style/light.css';  
import Pipeline, { Action, ActionHandler, BaseAction, CompositeAction } from './Pipeline';
import DetailView from './components/DetailView';

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
  const [visibleOutcomes, setVisibleOutcomes] = useState<ShadedOutcome[]>([]);
  
  const stateListener = (state: FeatureCollection | null, outcomes: Outcomes) => {
    setState(state);
    setOutcomes(outcomes);
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
    pipeline?.addAction(action);
  }, [pipeline])
  
  const groupAction = useCallback((actions: BaseAction[], name: string) => {
    pipeline?.groupActions(actions, name);
  }, [pipeline])
  
  const unGroupAction = useCallback((action: BaseAction) => {
    pipeline?.ungroupAction(action);
  }, [pipeline])
  
  
  const toggleActive = useCallback((action: BaseAction) => {
    pipeline.toggleActionActive(action);
  }, [pipeline]);
  
  const removeAction = useCallback((action: BaseAction) => {
    pipeline.removeAction(action);
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
  
  const json: IJsonModel = {
    global: {
      tabEnableClose: false,
      tabEnableRenderOnDemand: false,
      tabSetEnableMaximize: false,
      tabEnableDrag: false
    },
    layout: {
      type: "row",
      id: "1",
      children: [
        {
          type: "row",
          id: "#40d1ca12-0ac9-4a2a-96a1-3cec31330d7a",
          width: 400,
          children: [
            {
              type: "tabset",
              id: "#fbf64c0a-0b21-46fa-a7dc-61a3118356cc",
              weight: 50,
              children: [
                {
                  type: "tab",
                  id: "#4afdf74d-1ccf-46b3-b2b9-9f1d92aa162e",
                  name: "Pipeline",
                  component: "pipeline"
                }
              ]
            },
            {
              type: "tabset",
              id: "#9ee8d2ff-713f-4f92-862d-a39fe73aeea3",
              weight: 50,
              children: [
                {
                  type: "tab",
                  id: "3",
                  name: "Detail",
                  component: "detail"
                }
              ],
              active: true
            }
          ]
        },
        {
          type: "tabset",
          id: "#7b567257-4908-4cdf-a336-f6d9814b470e",
          weight: 60,
          children: [
            {
              type: "tab",
              id: "5",
              name: "Map",
              component: "map"
            }
          ]
        }
      ]
    }
  };
  
  const model = Model.fromJson(json);
  
  const factory = (node: TabNode): ReactNode => {
    const component = node.getComponent();
    switch(component) {
      case 'pipeline': 
        return <PipelineViewer toggleActive={toggleActive} deleteAction={removeAction}
        groupAction={groupAction} actions={actions} unGroupAction={unGroupAction} outcomes={outcomes}   
        visibleOutcomes={visibleOutcomes} setVisibleOutcomes={setVisibleOutcomes} />
      case 'detail':
      return <DetailView outcomes={outcomes} visibleOutcomes={visibleOutcomes} />
      case 'map':   
        return <div  className="main-content">
          <Tools addAction={addAction} />
          <MapArea state={state} visibleOutcomes={visibleOutcomes} outcomes={outcomes} />
        </div>
      default:  
        return <div>Unknown component {component}</div>;
    }
  };
  
  return (
    <div className="app">
    <Layout model={model} factory={factory} 
    />
    </div>
  );
}

export default App;
