import React, { useState } from 'react';
import './Pipeline.css';
import { Action } from '../state';
import ActionItem from './ActionItem';
import { ButtonGroup, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const activateSelected = () => {
    selectedIds.forEach(id => {
      const action = actions.find(action => action.id === id);
      if (action && !action.active) {
        toggleActive(action);
      }
    });
  };

  const deactivateSelected = () => {
    selectedIds.forEach(id => {
      const action = actions.find(action => action.id === id);
      if (action && action.active) {
        toggleActive(action);
      }
    });
  };

  const deleteSelected = () => {
    selectedIds.forEach(id => {
      const action = actions.find(action => action.id === id);
      if (action) {
        deleteAction(action);
      }
    });
  };

  const allSelectedInactive = selectedIds.every(id => {
    const action = actions.find(action => action.id === id);
    return action && !action.active;
  });

  const allSelectedActive = selectedIds.every(id => {
    const action = actions.find(action => action.id === id);
    return action && action.active;
  });

  return (
    <div className="pipeline-section">
      <h2>Pipeline</h2>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button
          onClick={activateSelected}
          disabled={!allSelectedInactive}
          startIcon={<CheckBoxOutlineBlankIcon />}
        >
          Activate
        </Button>
        <Button
          onClick={deactivateSelected}
          disabled={!allSelectedActive}
          startIcon={<CheckIcon />}
        >
          Deactivate
        </Button>
        <Button
          onClick={deleteSelected}
          disabled={selectedIds.length === 0}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </ButtonGroup>
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
