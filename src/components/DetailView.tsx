import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Theme } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import TextIcon from '@mui/icons-material/TextFields';
import ChartIcon from '@mui/icons-material/ShowChart';
import { Array2dOutcome, Outcome, Outcomes, ShadedOutcome, SimpleOutcome, TypeArray2dOutcome, TypeSimpleOutcome, TypeSpatialOutcome } from '../Store';
import './DetailView.css';
import { ScatterChart, ScatterValueType } from '@mui/x-charts';

interface DetailViewProps {
  outcomes: Outcomes;
  visibleOutcomes: ShadedOutcome[];
}

const settings = {
  // valueFormatter: (value: number | null) => `${value}` || '',
  height: 100,
  showTooltip: true,
  showHighlight: true,
  // data: [60, -15, 66, 68, 87, 82, 83, 85, 92, 75, 76, 50, 91],
  margin: { top: 10, bottom: 20, left: 5, right: 5 },
  sx: (theme: Theme) => ({
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    width: "80% !important", 
    overflow: "visible !important"
  }),
};

const iconFor = (outcome: Outcome, color: string): React.ReactNode => {
  const style={ color: color }
  switch(outcome.type) {
    case TypeSpatialOutcome:
      return <MapIcon  style={style}/>
      case TypeSimpleOutcome:
      return <TextIcon  style={style}/>
      case TypeArray2dOutcome:
      return <ChartIcon  style={style}/>
      default:
      return <TextIcon  style={style}/>
  }
}


const renderOutcome = (outcome: Outcome): React.ReactElement => {
  switch(outcome.type) {
    case TypeSimpleOutcome:
      return <ListItemText primary={(outcome as SimpleOutcome).description} />
    case TypeSpatialOutcome:
      return <ListItemText primary={'Spatial Outcome'} />
    case TypeArray2dOutcome:
      const data2d = (outcome as Array2dOutcome).data;
      const values = data2d.map((row, index) => ({x:new Date(row[0]).getTime(), y: row[1], id: index}))
      const valueFormatter = (value: ScatterValueType) => `Time:${new Date(value.x).toLocaleString()} Value:${value.y.toFixed(2)}`
      const axisFormatter = (value: number) => new Date(value).toLocaleTimeString()
      return <ScatterChart
        {...settings}
        series={[
          { data: values, valueFormatter: valueFormatter }
        ]}
        xAxis={[{ valueFormatter: axisFormatter  }]}
        width={200}
        height={200}
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
          return (
            <ListItem key={visibleOutcome.id}>
                <ListItemIcon>
                  {iconFor(outcome, visibleOutcome.color)}
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
