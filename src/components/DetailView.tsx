import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import TextIcon from '@mui/icons-material/TextFields';
import { Outcome, Outcomes, ShadedOutcome, SimpleOutcome, TypeArray2dOutcome, TypeSimpleOutcome, TypeSpatialOutcome } from '../Store';
import './DetailView.css';

interface DetailViewProps {
  outcomes: Outcomes;
  visibleOutcomes: ShadedOutcome[];
}

const renderOutcome = (outcome: Outcome): React.ReactElement => {
  switch(outcome.type) {
    case TypeSimpleOutcome:
      return <ListItemText primary={(outcome as SimpleOutcome).description} />
    case TypeSpatialOutcome:
      return <ListItemText primary={'Spatial Outcome'} />
    case TypeArray2dOutcome:
      return <ListItemText primary={'2D Outcome'} />
    default:
      return <ListItemText primary={'Unknown Outcome'} />
  }
}

const DetailView: React.FC<DetailViewProps> = ({ outcomes, visibleOutcomes }) => {
  return (
    <div className='detail-view'>
      <List className='detail-list'>
        {visibleOutcomes.map((visibleOutcome) => {
          const outcome = outcomes[visibleOutcome.id];
          if (!outcome) return null;
          const style={ color: visibleOutcome.color }
          return (
            <ListItem key={visibleOutcome.id}>
                <ListItemIcon>
                  {outcome.type === TypeSpatialOutcome ? <MapIcon style={style} /> : <TextIcon style={style}/>}
                </ListItemIcon>
                {renderOutcome(outcome)}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default DetailView;
