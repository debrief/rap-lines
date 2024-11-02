import React from 'react';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import './App.css';
import State from './state';

const App: React.FC = () => {
  const initialState = {
    type: "FeatureCollection",
    features: []
  };
  const state = new State(initialState);

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
