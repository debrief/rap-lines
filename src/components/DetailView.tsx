import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Card } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import TextIcon from '@mui/icons-material/TextFields';
import { Outcomes, ShadedOutcome, TypeSimpleOutcome, TypeSpatialOutcome } from '../Store';

interface DetailViewProps {
  outcomes: Outcomes;
  visibleOutcomes: ShadedOutcome[];
}

const DetailView: React.FC<DetailViewProps> = ({ outcomes, visibleOutcomes }) => {
  return (
    <div>
      <h2>Detail View</h2>
      <List>
        {visibleOutcomes.map((visibleOutcome) => {
          const outcome = outcomes[visibleOutcome.id];
          if (!outcome) return null;

          return (
            <ListItem key={visibleOutcome.id}>
              <Card style={{ backgroundColor: visibleOutcome.color }}>
                <ListItemIcon>
                  {outcome.type === TypeSpatialOutcome ? <MapIcon /> : <TextIcon />}
                </ListItemIcon>
                <ListItemText primary={outcome.type === TypeSimpleOutcome ? outcome.description : 'Spatial Outcome'} />
              </Card>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default DetailView;
