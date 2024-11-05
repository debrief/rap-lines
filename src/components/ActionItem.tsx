import React from 'react';
import { Action } from '../state';
import { Card, CardContent, CardActions } from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import Settings from '@mui/icons-material/Settings';
import { TypeNorth, TypeSouth, TypeEast, TypeWest } from '../actions/move-north';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import InfoIcon from '@mui/icons-material/Info';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import { TypeScale } from '../actions/scale-track';
import { TypeSummarise } from '../actions/summarise-track';

interface ActionItemProps {
  action: Action;
  toggleActive: (action: Action) => void;
  deleteAction: (action: Action) => void;
  selected: boolean;
  setSelected: (id: string, selected: boolean) => void;
}

const iconFor = (action: Action): React.ReactElement => {
  switch(action.type) {
    case TypeNorth:
      return <NorthIcon />;
    case TypeSouth:
      return <SouthIcon />;
    case TypeEast:
      return <EastIcon />;
    case TypeWest:
      return <WestIcon />;
    case TypeScale:
      return <TextIncreaseIcon />;
      case TypeSummarise:
        return <InfoIcon />;
      default: return <Settings />;
  }
}

const ActionItem: React.FC<ActionItemProps> = ({ action, toggleActive, deleteAction, selected, setSelected }) => {
  const handleSelection = () => {
    setSelected(action.id, !selected);
  };

  return (
    <Card
      variant='outlined'
      style={{
        margin: '5px',
        borderWidth: selected ? '2px' : '1px',
        backgroundColor: selected ? '#d3d3d3' : 'white'
      }}
      className="action-item"
      onClick={handleSelection}
    >
      <CardContent style={{padding: '2px', display: 'inline'}}>
        <span>{iconFor(action)} {action.label} {action.id.slice(-6)}</span>
      </CardContent>
      <CardActions style={{display: 'inline'}}>
        { action.active ? <CheckIcon onClick={(e) => { e.stopPropagation(); toggleActive(action); }} />: <CheckBoxOutlineBlankIcon onClick={(e) => { e.stopPropagation(); toggleActive(action); }} />}
        <DeleteIcon onClick={() => deleteAction(action)} />
      </CardActions>
      { action.results && <CardContent>
        <span>{action.results}</span>
      </CardContent> }
    </Card>
  );
}

export default ActionItem;
