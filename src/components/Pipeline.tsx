import React, { useState } from 'react';
import './Pipeline.css';
import { Action } from '../state';
import ActionItem from './ActionItem';

type PipelineProps = {
  actions: Action[];
  toggleActive: (action: Action) => void;
  deleteAction: (action: Action) => void;
}

const Pipeline: React.FC<PipelineProps> = ({ actions, toggleActive, deleteAction }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const setSelected = (id: string, selected: boolean) => {
    setSelectedIds(prevSelectedIds => {
      if (selected) {
        return [...prevSelectedIds, id];
      } else {
        return prevSelectedIds.filter(selectedId => selectedId !== id);
      }
    });
  };

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
            selected={selectedIds.includes(action.id)}
            setSelected={setSelected}
          />
        ))}
      </ul>
    </div>
  );
}

export default Pipeline;
