import React from 'react';
import { TypeComposite } from '../Store';
import { Card, CardContent, CardActions, IconButtonProps, styled, IconButton } from '@mui/material';
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
import LayersIcon from '@mui/icons-material/Layers';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import { TypeScale } from '../actions/scale-track';
import { TypeSummarise } from '../actions/summarise-track';
import './ActionItem.css';
import { BaseAction, CompositeAction } from '../Pipeline';

interface ActionItemProps {
  action: BaseAction;
  toggleActive: (action: BaseAction) => void;
  deleteAction: (action: BaseAction) => void;
  selected: boolean;
  setSelected: (id: string, selected: boolean) => void;
  child?: boolean
}

const iconFor = (action: BaseAction): React.ReactElement => {
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
    case TypeComposite:
      return <LayersIcon />;
    default: return <Settings />;
  }
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(90deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
  ],
}));

const ActionItem: React.FC<ActionItemProps> = ({ action, child, toggleActive, deleteAction, selected, setSelected }) => {

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = (e: any) => {
    setExpanded(!expanded);
    e.stopPropagation();
  };

  const handleSelection = () => {
    setSelected(action.id, !selected);
  };

  const isComposite = action.type === TypeComposite;

  return (
    <Card
      variant='outlined'
      style={{
        margin: '5px',
        borderWidth: selected ? '2px' : '1px',
        backgroundColor: selected ? '#d3d3d3' : 'white',
        marginLeft: child ? '20px' : '0px',
        width: '90%'
      }}
      className="action-item"
      onClick={handleSelection}
    >
      <CardContent style={{padding: '2px', display: 'inline'}}>
        <span>{iconFor(action)} {action.label} {action.id.slice(-6)}</span>
      </CardContent>
      <CardActions style={{display: 'inline', float: 'right'}}>
      {isComposite && <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>}
        { action.active ? <CheckIcon onClick={(e) => { e.stopPropagation(); toggleActive(action); }} />: <CheckBoxOutlineBlankIcon onClick={(e) => { e.stopPropagation(); toggleActive(action); }} />}
        <DeleteIcon onClick={(e) => { e.stopPropagation(); deleteAction(action); }}  />
      </CardActions>
      {expanded && (action as CompositeAction).items.map((item) => {
        return <ActionItem child key={item.id} action={item} toggleActive={toggleActive} deleteAction={deleteAction} selected={selected} setSelected={setSelected} />
      })}
    </Card>
  );
}

export default ActionItem;
