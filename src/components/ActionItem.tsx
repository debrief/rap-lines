import React from 'react';
import { Action } from '../state';

interface ActionItemProps {
  action: Action;
  toggleActive: (action: Action) => void;
  deleteAction: (action: Action) => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ action, toggleActive, deleteAction }) => {
  return (
    <div className="action-item">
      <span>{action.type}</span>
      <button onClick={() => toggleActive(action)}>
        {action.active ? 'Deactivate' : 'Activate'}
      </button>
      <button onClick={() => deleteAction(action)}>Delete</button>
    </div>
  );
}

export default ActionItem;
