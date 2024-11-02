import React from 'react';
import HistorySection from './HistorySection';
import OutlineSection from './OutlineSection';
import './Sidebar.css';
import State from '../state';

interface SidebarProps {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State | null>>;
}

const Sidebar: React.FC<SidebarProps> = ({ state, setState }) => {
  return (
    <aside className="sidebar">
      <HistorySection />
      <OutlineSection state={state} setState={setState} />
    </aside>
  );
}

export default Sidebar;
