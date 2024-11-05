import React, { useCallback, useEffect, useState } from 'react';
import './Pipeline.css';
import { BaseAction, TypeComposite } from '../Store';
import ActionItem from './ActionItem';
import { ButtonGroup, Tooltip, IconButton, Dialog } from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import CallSplitIcon from '@mui/icons-material/CallSplit';

type PipelineProps = {
  actions: BaseAction[];
  toggleActive: (action: BaseAction) => void;
  deleteAction: (action: BaseAction) => void;
  groupAction: (actions: BaseAction[], name: string) => void;
  unGroupAction: (action: BaseAction) => void;
}

type DialogProps = {
  title: string
  label: string
  setValue: (value: string | null) => void
}

const Pipeline: React.FC<PipelineProps> = ({ actions, toggleActive, deleteAction, 
  groupAction, unGroupAction
 }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState<DialogProps | null>(null);
  const [dialogText, setDialogText] = useState<string>('');

  const setValue = (value: string | null) => {
    if (value !== null) {
      // determine if the selected items are consecutive
      const selectedIndices = selectedIds.map(id => actions.findIndex(action => action.id === id));
      const sorted = selectedIndices.slice().sort();
      const sortedItems = sorted.map(index => actions[index]);
      // now clear the selection
      setSelectedIds([]);
      // and create the group
      groupAction(sortedItems, value)
    }
    setShowDialog(null);
  }

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

  const unGroupSelected = () => {
    const selectedAction = actions.find(action => action.id === selectedIds[0]);
    if (!selectedAction) {
      console.warn('No action found for id', selectedIds[0]);
      return
    }
    // clear the selection, since things are about to change
    setSelectedIds([]);
    unGroupAction(selectedAction as BaseAction)
  };


  const groupSelected = () => {
    // popup a dialog, for the user to enter a name for the group
    // then group the selected items
    const dialog: DialogProps = {title: 'Group', label: 'Group Name', setValue: setValue}
    setShowDialog(dialog)
  };

  const groupIsSelected = (): boolean => {
    if (selectedIds.length !== 1) {
      return false
    }
    const action = actions.find(action => action.id === selectedIds[0]);
    return action?.type === TypeComposite
  }

  const consecutiveSelected = (): boolean => {
    if (selectedIds.length <= 1) {
      return false
    }
    // determine if the selected items are consecutive
    const selectedIndices = selectedIds.map(id => actions.findIndex(action => action.id === id));
    const sorted = selectedIndices.slice().sort();
    const matching = sorted.every((num, i) => i === sorted.length - 1 || num === sorted[i + 1] - 1)
    return matching
  }

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
      {showDialog && <Dialog open={true}> 
        <h2>{showDialog.title}</h2>
        <input type="text" onChange={e => setDialogText(e.target.value)} />
        <ButtonGroup  >
          <button onClick={() => setValue(null)}>Cancel</button>
          <button onClick={() => setValue(dialogText)}>OK</button>
        </ButtonGroup>
      </Dialog>}
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
        <Tooltip title="Group Selected">
          <IconButton
            onClick={groupSelected}
            disabled={!consecutiveSelected()}
            ><CallMergeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Ungroup Selected">
          <IconButton
            onClick={unGroupSelected}
            disabled={!groupIsSelected()}
            ><CallSplitIcon />
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
