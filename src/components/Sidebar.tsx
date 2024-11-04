import React from 'react';
import HistorySection from './HistorySection';
import OutlineSection from './OutlineSection';
import './Sidebar.css';
import { Action } from '../state';
import FlexLayout from 'flexlayout-react';

interface SidebarProps {
  actions: Action[];
  addAction: (action: Action) => void
  toggleActive: (action: Action) => void
  deleteAction: (action: Action) => void
}

const Sidebar: React.FC<SidebarProps> = ({ actions, addAction, toggleActive, deleteAction }) => {
  const layoutModel = {
    global: {},
    layout: {
      type: "row",
      children: [
        {
          type: "tabset",
          weight: 50,
          children: [
            {
              type: "tab",
              name: "History",
              component: "history"
            }
          ]
        },
        {
          type: "tabset",
          weight: 50,
          children: [
            {
              type: "tab",
              name: "Outline",
              component: "outline"
            }
          ]
        }
      ]
    }
  };

  const factory = (node: any) => {
    const component = node.getComponent();
    switch (component) {
      case "history":
        return <HistorySection toggleActive={toggleActive} deleteAction={deleteAction} actions={actions} />;
      case "outline":
        return <OutlineSection addAction={addAction} />;
      default:
        return null;
    }
  };

  return (
    <aside className="sidebar">
      <FlexLayout.Layout model={FlexLayout.Model.fromJson(layoutModel)} factory={factory} />
    </aside>
  );
}

export default Sidebar;
