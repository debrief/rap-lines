import React from 'react';
import { Action } from '../state';
import { Card, CardContent, CardActions } from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';

interface ActionItemProps {
  action: Action;
  toggleActive: (action: Action) => void;
  deleteAction: (action: Action) => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ action, toggleActive, deleteAction }) => {
  return (
    <Card style={{margin: '5px'}} className="action-item">
      <CardContent>
        <span>{action.type} {action.id}</span>
      </CardContent>
      <CardActions>
        { action.active ? <CheckIcon onClick={() => toggleActive(action)} />: <CheckBoxOutlineBlankIcon onClick={() => toggleActive(action)} />}
        <DeleteIcon onClick={() => deleteAction(action)} />
      </CardActions>
    </Card>
  );
}

export default ActionItem;
