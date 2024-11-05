import React from 'react';
import Pipeline from './Pipeline';
import OutlineSection from './OutlineSection';
import './Sidebar.css';
import { Action, BaseAction } from '../Store';

interface SidebarProps {
  actions: BaseAction[];
  addAction: (action: Action) => void
  toggleActive: (action: BaseAction) => void
  deleteAction: (action: BaseAction) => void
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
