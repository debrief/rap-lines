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
  groupAction: (actions: BaseAction[], name: string) => void;
  unGroupAction: (action: BaseAction) => void;

}

const Sidebar: React.FC<SidebarProps> = ({ actions, addAction, toggleActive, deleteAction, 
  groupAction, unGroupAction }) => {
  return (
    <aside className="sidebar">
      <Pipeline toggleActive={toggleActive} deleteAction={deleteAction}
        groupAction={groupAction} actions={actions} unGroupAction={unGroupAction} />
      <OutlineSection addAction={addAction} />
    </aside>
  );
}

export default Sidebar;
