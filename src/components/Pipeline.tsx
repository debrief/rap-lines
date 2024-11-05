import React from 'react';
import './Pipeline.css';
import { Action } from '../state';
import ActionItem from './ActionItem';

type PipelineProps = {
  actions: Action[];
  toggleActive: (action: Action) => void;
  deleteAction: (action: Action) => void;
}

const Pipeline: React.FC<PipelineProps> = ({ actions, toggleActive, deleteAction }) => {
  return (
    <div className="pipeline-section">
      <h2>Pipeline</h2>
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
    </div>
  );
}

export default Pipeline;
