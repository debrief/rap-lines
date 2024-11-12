import React, { useEffect } from 'react';
import { Outcomes, TypeComposite, TypeSimpleOutcome, TypeSpatialOutcome, SimpleOutcome, SpatialOutcome, ShadedOutcome, Outcome, Array2dOutcome, TypeArray2dOutcome } from '../classes/Store';
import { Card, CardContent, CardActions, IconButtonProps, styled, IconButton, Tooltip } from '@mui/material';
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
import { BaseAction, CompositeAction } from '../classes/Pipeline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useDrag, useDrop } from 'react-dnd';
import DragHandleIcon from '@mui/icons-material/DragHandle';

interface ActionItemProps {
  action: BaseAction;
  toggleActive: (action: BaseAction) => void;
  deleteAction: (action: BaseAction) => void;
  selected: boolean;
  setSelected: (id: string, selected: boolean) => void;
  child?: boolean;
  outcomes: Outcomes;
  visibleOutcomes: ShadedOutcome[];
  toggleVisibleOutcome: (id: string) => void;
  moveAction: (draggedId: string, targetId: string) => void;
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

const ActionItem: React.FC<ActionItemProps> = ({ action, child, toggleActive, deleteAction, selected, setSelected, outcomes, visibleOutcomes, toggleVisibleOutcome, moveAction }) => {

  const [expanded, setExpanded] = React.useState(false);
  const [color, setColor] = React.useState<string | null>(null);
  const [thisOutcome, setThisOutcome] = React.useState<Outcome | null>(null);

  useEffect(() => {
    const thisShadedOutcome = visibleOutcomes.find(outcome => outcome.id === action.id);
    if(thisShadedOutcome) {
      setColor(thisShadedOutcome.color);
    }
  }, [visibleOutcomes, action.id]);

  useEffect(() => {
    const thisShadedOutcome = visibleOutcomes.find(outcome => outcome.id === action.id);
    if(thisShadedOutcome) {
      setColor(thisShadedOutcome.color);
    } else {
      setColor('')
    }
  }, [visibleOutcomes, action.id]);

  useEffect(() => {
    setThisOutcome(outcomes[action.id]);
  }, [outcomes, action]);

  const handleExpandClick = (e: any) => {
    setExpanded(!expanded);
    e.stopPropagation();
  };

  const handleSelection = () => {
    setSelected(action.id, !selected);
  };

  const isComposite = action.type === TypeComposite;

  const renderOutcome = (outcome: SimpleOutcome | SpatialOutcome | Array2dOutcome) => {
    if (outcome.type === TypeSimpleOutcome) {
      return outcome.description;
    } else if (outcome.type === TypeSpatialOutcome) {
      return 'SPATIAL OUTCOME';
    } else if (outcome.type === TypeArray2dOutcome) {
      return (outcome as Array2dOutcome).data.length + ' items';
    } else {
      return '--outcome not handled--';
    }
  };

  const handleVisibilityToggle = (e: any) => {
    e.stopPropagation();
    toggleVisibleOutcome(action.id);
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: 'ACTION_ITEM',
    item: { id: action.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !child, // Prevent dragging if it's a child action
  });

  const [, dropRef] = useDrop({
    accept: 'ACTION_ITEM',
    drop(draggedItem: { id: string }) {
      if (draggedItem.id !== action.id) {
        moveAction(draggedItem.id, action.id);
      }
    }
  });

  return (
    <Card
      ref={(node) => dragRef(dropRef(node))}
      variant='outlined'
      style={{
        margin: '5px',
        borderWidth: selected ? '2px' : '1px',
        backgroundColor: selected ? '#d3d3d3' : 'white',
        marginLeft: child ? '20px' : '0px',
        width: '90%',
        opacity: isDragging ? 0.5 : 1,
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
        {thisOutcome && (
          <Tooltip title={renderOutcome(thisOutcome)}>
            <IconButton style={{padding: 0, display: 'inline-block'}}>
            <InfoIcon titleAccess='Dumbo' />
            </IconButton>
          </Tooltip>
        )}
        {thisOutcome && (
          <Tooltip title="Show/hide this outcome">
            <IconButton onClick={handleVisibilityToggle}>
              {color ? <VisibilityIcon style={{color: color || 'default'
              }} /> : <VisibilityOffIcon />}
            </IconButton>
          </Tooltip>
        )}
        <DragHandleIcon />
        { action.active ? <CheckIcon onClick={(e) => { e.stopPropagation(); toggleActive(action); }} />: <CheckBoxOutlineBlankIcon onClick={(e) => { e.stopPropagation(); toggleActive(action); }} />}
        <DeleteIcon onClick={(e) => { e.stopPropagation(); deleteAction(action); }}  />
      </CardActions>
      {expanded && (action as CompositeAction).items.map((item) => {
        return <ActionItem child key={item.id} action={item} toggleActive={toggleActive} deleteAction={deleteAction} outcomes={outcomes} selected={selected} toggleVisibleOutcome={toggleVisibleOutcome} setSelected={setSelected} visibleOutcomes={visibleOutcomes} moveAction={moveAction} />
      })}
    </Card>
  );
}

export default ActionItem;
