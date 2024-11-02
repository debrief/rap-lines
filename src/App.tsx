import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import './App.css';
import State from './state';

const App: React.FC = () => {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    fetch('/sample.json')
      .then(response => response.json())
      .then(data => {
        const initialState = data;
        const state = new State(initialState);
        setState(state);
      });
  }, []);

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <MapArea state={state} />
      </div>
    </div>
  );
}

export default App;
