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
import { Modal, ListItem, ListItemButton, ListItemText, Button, List, ButtonGroup } from '@mui/material';
import * as L from 'leaflet'
import { ElevationPlotHandler, SpeedPlotHandler } from './actions/two-dim-plots';

const registerHandlers = ():ActionHandler[] => {
  const res: ActionHandler[] = [];
  res.push(MoveNorthHandler);
  res.push(MoveSouthHandler);
  res.push(MoveEastHandler);
  res.push(MoveWestHandler);
  res.push(ScaleUpHandler)
  res.push(SummariseTrackHandler)
  res.push(ElevationPlotHandler)
  res.push(SpeedPlotHandler)
  return res;
}

const sources = ['./track-points2.geojson', './track-points.geojson', './uk-waypoints.geojson', './us-waypoints.geojson']

const App: React.FC = () => {
  const store = useMemo(() => new Store(), []);
  const pipeline = useMemo(() => new Pipeline(), []);
  
  const [state, setState] = useState<FeatureCollection | null>(null);
  const [sourceName, setSourceName] = useState<string>('');
  const [previousSourceName, setPreviousSourceName] = useState<string>('');
  const [outcomes, setOutcomes] = useState<Outcomes>({});
  const [actions, setActions] = useState<BaseAction[]>([]);
  const [visibleOutcomes, setVisibleOutcomes] = useState<ShadedOutcome[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSource, setSelectedSource] = useState<string>('');
  
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | undefined>(undefined);
  
  const stateListener = (name: string, state: FeatureCollection | null, outcomes: Outcomes) => {
    setState(state);
    setOutcomes(outcomes);
    setSourceName(name);
  }
  
  useEffect(() => {
    if (sourceName !== previousSourceName) {
      console.log('Source has changed', sourceName, previousSourceName)
      setPreviousSourceName(sourceName)
      const bounds = state?.features.reduce((acc: L.LatLngBounds | undefined, feature) => {
        if (feature.geometry.type === 'Point') {
          const point = feature.geometry.coordinates as [number, number];
          const switched = [point[1], point[0]] as L.LatLngExpression
          if (acc) {
            return acc.extend(switched);
          } else {
            return L.latLngBounds(switched, switched);
          }  
        }
        return acc;
      }, undefined)
      if (bounds) {
        setMapBounds(bounds.pad(0.4))
      }
    }
  }, [sourceName, previousSourceName, state]);
  
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
  
  const handleEditSource = () => {
    setSelectedSource('')
    setIsModalOpen(true);
  };
  
  const handleSelectSource = (source: string) => {
    setSelectedSource(source);
  };
  
  const handleConfirmSource = () => {
    if (selectedSource) {
      store.setInitialState(selectedSource, actions);
    }
    setIsModalOpen(false);
  };
  
  const handleCancelSource = () => {
    setSelectedSource('');
    setIsModalOpen(false);
  };
  
  useEffect(() => {
    if (store && actionsListener && pipeline) { 
      const handlers = registerHandlers()
      handlers.forEach(handler => store.addHandler(handler));
      console.log('registering state listener')
      store.addStateListener(stateListener);
      pipeline.addActionsListener(actionsListener);
      setOutcomes({});
    }
  }, [store, actionsListener, pipeline]);
  
  useEffect(() => {
    if (store) {
      if (!store.getInitialState()) {
        console.log('initialising store with', sources[0])
        store.setInitialState(sources[0], [])
      } else {        
        console.log('store already initialised')
      }
    }
  }, [store]);
  
  
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
      return <PipelineViewer sourceName={sourceName} toggleActive={toggleActive} deleteAction={removeAction}
      groupAction={groupAction} actions={actions} unGroupAction={unGroupAction} outcomes={outcomes}   
      visibleOutcomes={visibleOutcomes} setVisibleOutcomes={setVisibleOutcomes} onEditSource={handleEditSource} />
      case 'detail':
      return <DetailView outcomes={outcomes} visibleOutcomes={visibleOutcomes} />
      case 'map':   
      return <div  className="main-content">
      <Tools addAction={addAction} />
      <MapArea mapBounds={mapBounds} state={state} visibleOutcomes={visibleOutcomes} outcomes={outcomes} />
      </div>
      default:  
      return <div>Unknown component {component}</div>;
    }
  };
  
  return (
    <div className="app">
      <Layout model={model} factory={factory} />
      <Modal open={isModalOpen} onClose={handleCancelSource}>
        <div className="modal-content">
        <h2>Select Source</h2>
        <List>
        {sources.map((source, index) => (
          <ListItem key={index} disablePadding>
          <ListItemButton selected={source === selectedSource} onClick={() => handleSelectSource(source)}>
          <ListItemText primary={source} />
          </ListItemButton>
          </ListItem>
        ))}
        </List>
        <ButtonGroup style={{float:'right', paddingRight: '5px'}}>
          <Button onClick={handleCancelSource}>Cancel</Button>
          <Button onClick={handleConfirmSource} disabled={!selectedSource}>OK</Button>
        </ButtonGroup>
        </div>
      </Modal>
    </div>
  );
}

export default App;
