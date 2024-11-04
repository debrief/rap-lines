import React from 'react';
import './HistorySection.css';
import { Action } from '../state';
import ActionItem from './ActionItem';

type HistoryProps = {
  actions: Action[];
  toggleActive: (action: Action) => void;
  deleteAction: (action: Action) => void;
}

const HistorySection: React.FC<HistoryProps> = ({ actions, toggleActive, deleteAction }) => {
  return (
    <div className="history-section">
      <h2>History</h2>
      <ul>
        {actions.map((action, index) => (
          <ActionItem
            key={index}
            action={action}
            toggleActive={toggleActive}
            deleteAction={deleteAction}
          />
        ))}
      </ul>
      {/* Additional history items go here */}
    </div>
  );
}

export default HistorySection;
