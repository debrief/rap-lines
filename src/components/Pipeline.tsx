import React, { useState } from 'react';
import './Pipeline.css';
import { Action } from '../state';
import ActionItem from './ActionItem';
import { ButtonGroup, Tooltip, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';

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

  const selectAll = () => {
    // special case. If all items are currently selected, deselect all
    if (selectedIds.length === actions.length) {
      setSelectedIds([]);
      return
    } else {
      const allIds = actions.map(action => action.id);
      setSelectedIds(allIds);  
    }
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
        <Tooltip title="Select/Deselect All">
          <IconButton onClick={selectAll}>
            <DoneAllIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Activate Selected">
          <IconButton
            onClick={activateSelected}
            disabled={selectedIds.length === 0 || !allSelectedInactive}>
            <CheckIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Deactivate Selected">
          <IconButton
            onClick={deactivateSelected}
            disabled={selectedIds.length === 0 || !allSelectedActive}
            ><CheckBoxOutlineBlankIcon />
           </IconButton>
        </Tooltip>
        <Tooltip title="Delete Selected">
          <IconButton
            onClick={deleteSelected}
            disabled={selectedIds.length === 0}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
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
