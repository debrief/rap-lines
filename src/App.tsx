import React, { useCallback, useEffect, useState } from 'react';
import Pipeline from './components/Pipeline';
import OutlineSection from './components/OutlineSection';
import MapArea from './components/MapArea';
import './App.css';
import Store, { Action, ActionHandler, BaseAction } from './Store';
import { MoveEastHandler, MoveNorthHandler, MoveSouthHandler, MoveWestHandler } from './actions/move-north';
import { FeatureCollection } from 'geojson';
import { ScaleUpHandler } from './actions/scale-track';
import { SummariseTrackHandler } from './actions/summarise-track';
import { IJsonModel, Layout, Model } from 'flexlayout-react'; // P9936

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
  const [actions, setActions] = useState<BaseAction[]>([]);

  const stateListener = (state: FeatureCollection) => {
    setState(state)
  }

  const actionsListener  = (actions: BaseAction[]) => {
    setActions(actions)
  }

  const addAction = useCallback((action: Action) => {
    if (store){
      store?.addAction(action);
    }
  }, [store])

  const groupAction = useCallback((actions: BaseAction[], name: string) => {
    if (store){
      store?.groupActions(actions, name);
    }
  }, [store])

  const unGroupAction = useCallback((action: BaseAction) => {
    if (store){
      store?.ungroupAction(action);
    }
  }, [store])


  const toggleActive = useCallback((action: BaseAction) => {
    if (store) {
      store.toggleActionActive(action);
    }
  }, [store]);

  const removeAction = useCallback((action: BaseAction) => {
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
        // store this initial state
        const newStore = new Store(initialState);
        const handlers = registerHandlers()
        handlers.forEach(handler => newStore.addHandler(handler));
        newStore.addStateListener(stateListener);
        newStore.addActionsListener(actionsListener)
        setState(initialState)
        setStore(newStore);
      });
  }, []);

  if (!store) {
    return <div>Loading...</div>;
  }

  const json: IJsonModel = {
    global: {
      tabSetTabStripHeight: 45,
      tabEnableClose: false,
      tabEnableRenderOnDemand: false,
      tabSetEnableMaximize: false
    },
    layout: {
      type: "row",
      children: [
        {
          type: "tabset",
          weight: 20,
          children: [
            {
              type: "tab",
              name: "Pipeline",
              component: "pipeline"
            },
            {
              type: "tab",
              name: "Outline",
              component: "outline"
            }
          ]
        },
        {
          type: "tabset",
          weight: 80,
          children: [
            {
              type: "tab",
              name: "Map",
              component: "map"
            }
          ]
        }
      ]
    }
  };

  const model = Model.fromJson(json);

  const factory = (node: any) => {
    const component = node.getComponent();
    if (component === "pipeline") {
      return <Pipeline toggleActive={toggleActive} deleteAction={removeAction}
        groupAction={groupAction} actions={actions} unGroupAction={unGroupAction} />;
    } else if (component === "outline") {
      return <OutlineSection addAction={addAction} />;
    } else if (component === "map") {
      return <MapArea state={state} />;
    }
  };

  return (
    <div className="app">
      <Layout model={model} factory={factory} />
    </div>
  );
}

export default App;
