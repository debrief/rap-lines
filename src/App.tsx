import React from 'react';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <MapArea />
      </div>
    </div>
  );
}

export default App;
