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
import 'flexlayout-react/style/light.css';  

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
      tabEnableClose: false,
      tabEnableRenderOnDemand: false,
      tabSetEnableMaximize: false
    },
    layout: {
      type: "row",
      id: "1",
      children: [
        {
          type: "row",
          id: "#40d1ca12-0ac9-4a2a-96a1-3cec31330d7a",
          weight: 40,
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
                  name: "Tools",
                  component: "outline"
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
