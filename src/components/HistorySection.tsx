import React from 'react';
import './HistorySection.css';
import { Action } from '../state';

type HistoryProps = {
  actions: Action[]
}
const HistorySection: React.FC<HistoryProps> = ({actions}) => {
  return (
    <div className="history-section">
      <h2>History</h2>
      <ul>
        {actions.map((action, index) => (
          <li key={index}>{action.type}</li>
        ))}
      </ul>
      {/* Additional history items go here */}
    </div>
  );
}

export default HistorySection;
