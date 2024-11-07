import React, { useState, useRef, useEffect } from 'react';
import './PipelineViewer.css';
import { Outcomes, TypeComposite } from '../Store';
import ActionItem from './ActionItem';
import { ButtonGroup, Tooltip, IconButton, Dialog, TextField, Button, List } from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import { BaseAction } from '../Pipeline';

type PipelineProps = {
  actions: BaseAction[];
  toggleActive: (action: BaseAction) => void;
  deleteAction: (action: BaseAction) => void;
  groupAction: (actions: BaseAction[], name: string) => void;
  unGroupAction: (action: BaseAction) => void;
  outcomes: Outcomes;
  visibleOutcomeIds: string[];
  setVisibleOutcomeIds: (visibleOutcomeIds: string[]) => void;
}

type DialogProps = {
  title: string
  label: string
  setValue: (value: string | null) => void
  icon? : React.ReactElement
}

const Pipeline: React.FC<PipelineProps> = ({ actions, toggleActive, deleteAction, 
  groupAction, unGroupAction, outcomes, visibleOutcomeIds, setVisibleOutcomeIds
 }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState<DialogProps | null>(null);
  const [dialogText, setDialogText] = useState<string>('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showDialog) {
      if (!textFieldRef.current) {
        setTimeout(() => {
          if (textFieldRef.current) {
            textFieldRef.current.focus();
          }
        }, 100)
      } else {
        textFieldRef.current.focus();
      }
    }
  }, [showDialog, textFieldRef]);

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
    setSelectedIds([]);
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
    const dialog: DialogProps = {title: 'Group Items', label: 'Name', 
      setValue: setValue, icon: <CallMergeIcon/>}
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      setValue(dialogText);
    }
  };

  return (
    <div className="pipeline-section">
      {showDialog && <Dialog style={{}} open={true} onKeyPress={handleKeyPress}> 
        <h4>{showDialog.icon}{showDialog.title}</h4>
        <TextField 
          label={showDialog.label} 
          onChange={e => setDialogText(e.target.value)} 
          inputRef={textFieldRef}
        />
        <ButtonGroup  >
          <Button onClick={() => setValue(null)}>Cancel</Button>
          <Button onClick={() => setValue(dialogText)}>OK</Button>
        </ButtonGroup>
      </Dialog>}
      <h2>Pipeline</h2>
      <ButtonGroup sx={{ bgcolor: 'background.paper'}} variant="contained" aria-label="outlined primary button group">
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
      <List sx={{ width: '100%', maxWidth: 360 }}>
        {actions.map((action) => (
            <ActionItem
              key={action.id}
              action={action}
              toggleActive={toggleActive}
              deleteAction={deleteAction}
              selected={selectedIds.includes(action.id)}
              setSelected={setSelected}
              outcomes={outcomes}
              visibleOutcomeIds={visibleOutcomeIds}
              setVisibleOutcomeIds={setVisibleOutcomeIds}
            />
          ))}

      </List>
    </div>
  );
}

export default Pipeline;
