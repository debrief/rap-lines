import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import OutlineSection from './components/OutlineSection';
import HistorySection from './components/HistorySection';
import './App.css';
import State, { ActionHandler } from './state';
import { MoveEastHandler, MoveNorthHandler, MoveSouthHandler, MoveWestHandler } from './actions/move-north';

const registerHandlers = ():ActionHandler[] => {
  const res: ActionHandler[] = [];
  res.push(MoveNorthHandler);
  res.push(MoveSouthHandler);
  res.push(MoveEastHandler);
  res.push(MoveWestHandler);
  return res;
}

const App: React.FC = () => {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    fetch('/sample.json')
      .then(response => response.json())
      .then(data => {
        const initialState = data;
        const state = new State(initialState);
        const handlers = registerHandlers()
        handlers.forEach(handler => state.addHandler(handler));
        setState(state);
      });
  }, []);

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Sidebar state={state} setState={setState} />
      <div className="main-content">
        <MapArea state={state} />
      </div>
    </div>
  );
}

export default App;
