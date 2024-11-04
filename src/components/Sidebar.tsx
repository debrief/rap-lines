import React from 'react';
import HistorySection from './HistorySection';
import OutlineSection from './OutlineSection';
import './Sidebar.css';
import { Action } from '../state';

interface SidebarProps {
  actions: Action[];
  addAction: (action: Action) => void
}

const Sidebar: React.FC<SidebarProps> = ({ actions, addAction }) => {
  return (
    <aside className="sidebar">
      <HistorySection actions={actions} />
      <OutlineSection addAction={addAction} />
    </aside>
  );
}

export default Sidebar;
