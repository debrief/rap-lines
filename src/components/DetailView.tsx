import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Theme } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import TextIcon from '@mui/icons-material/TextFields';
import { Array2dOutcome, Outcome, Outcomes, ShadedOutcome, SimpleOutcome, TypeArray2dOutcome, TypeSimpleOutcome, TypeSpatialOutcome } from '../Store';
import './DetailView.css';
import ScatterChart from '@mui/x-charts/ScatterChart';
import { BarChart, LineChart, SparkLineChart } from '@mui/x-charts';

interface DetailViewProps {
  outcomes: Outcomes;
  visibleOutcomes: ShadedOutcome[];
}

const settings = {
  valueFormatter: (value: number | null) => `${value}%`,
  height: 100,
  showTooltip: true,
  showHighlight: true,
  // data: [60, -15, 66, 68, 87, 82, 83, 85, 92, 75, 76, 50, 91],
  margin: { top: 10, bottom: 20, left: 5, right: 5 },
  sx: (theme: Theme) => ({
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  }),
};

const renderOutcome = (outcome: Outcome): React.ReactElement => {
  switch(outcome.type) {
    case TypeSimpleOutcome:
      return <ListItemText primary={(outcome as SimpleOutcome).description} />
    case TypeSpatialOutcome:
      return <ListItemText primary={'Spatial Outcome'} />
    case TypeArray2dOutcome:
      const data2d = (outcome as Array2dOutcome).data;
      const xData = data2d.map(row => new Date(row[0]).getTime())
      const yData = data2d.map(row => row[1])
      const valueFormatter = (value: number) => new Date(value).toLocaleString()
      return <LineChart
        {...settings}
        xAxis={[{ data: xData, scaleType: 'point', valueFormatter: valueFormatter  }]}
        series={[
          {
            data: yData,
          },
        ]}
        width={200}
        height={100}
      />
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
