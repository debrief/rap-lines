import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import TextIcon from '@mui/icons-material/TextFields';
import { Outcomes, ShadedOutcome, TypeSimpleOutcome, TypeSpatialOutcome } from '../Store';
import './DetailView.css';

interface DetailViewProps {
  outcomes: Outcomes;
  visibleOutcomes: ShadedOutcome[];
}

const DetailView: React.FC<DetailViewProps> = ({ outcomes, visibleOutcomes }) => {
  return (
    <div className='detail-view'>
      <h2>Detail View</h2>
      <List style={{ maxHeight: '60%', overflowY: 'auto' }}>
        {visibleOutcomes.map((visibleOutcome) => {
          const outcome = outcomes[visibleOutcome.id];
          if (!outcome) return null;
          const style={ color: visibleOutcome.color }
          return (
            <ListItem key={visibleOutcome.id}>
                <ListItemIcon>
                  {outcome.type === TypeSpatialOutcome ? <MapIcon style={style} /> : <TextIcon style={style}/>}
                </ListItemIcon>
                <ListItemText primary={outcome.type === TypeSimpleOutcome ? outcome.description : 'Spatial Outcome'} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default DetailView;
