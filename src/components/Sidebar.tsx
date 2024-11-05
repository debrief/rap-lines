import React from 'react';
import Pipeline from './Pipeline';
import OutlineSection from './OutlineSection';
import './Sidebar.css';
import { Action } from '../state';

interface SidebarProps {
  actions: Action[];
  addAction: (action: Action) => void
  toggleActive: (action: Action) => void
  deleteAction: (action: Action) => void
}

const Sidebar: React.FC<SidebarProps> = ({ actions, addAction, toggleActive, deleteAction }) => {
  return (
    <aside className="sidebar">
      <Pipeline toggleActive={toggleActive} deleteAction={deleteAction} actions={actions} />
      <OutlineSection addAction={addAction} />
    </aside>
  );
}

export default Sidebar;
