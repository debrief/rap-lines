import React from 'react';
import './Tools.css';
import { Action } from '../Pipeline';
import { MoveNorth, MoveEast, MoveWest, MoveSouth } from '../actions/move-north';
import { ScaleUp, ScaleDown } from '../actions/scale-track';
import { SummariseTrack } from '../actions/summarise-track';
import { Button, ButtonGroup,  } from '@mui/material';
import { ElevationPlot } from '../actions/plot-elevation';

type OutlineProps = {
  addAction: (action: Action) => void
}

const CustomGroup = (props: React.PropsWithChildren): React.ReactElement => {
  return <ButtonGroup size="small" variant="contained">
    { props.children }
  </ButtonGroup>
}

const Tools: React.FC<OutlineProps> = ({ addAction }) => {
  
  return (
    <div style={{backgroundColor: '#fff'}} className="tools">
      Move:
      <CustomGroup>
        <Button onClick={() => addAction(MoveNorth)}>Move North</Button>
        <Button onClick={() => addAction(MoveEast)}>Move East</Button>
        <Button onClick={() => addAction(MoveWest)}>Move West</Button>
        <Button onClick={() => addAction(MoveSouth)}>Move South</Button>
      </CustomGroup>
      Scale:
      <CustomGroup>
        <Button onClick={() => addAction(ScaleUp)}>Scale Up</Button>
        <Button onClick={() => addAction(ScaleDown)}>Scale Down</Button>
      </CustomGroup>
      Info:
      <CustomGroup>
      <Button onClick={() => addAction(SummariseTrack)}>Centre Point</Button>
      <Button onClick={() => addAction(ElevationPlot)}>Elevation Plot</Button>
      </CustomGroup>
    </div>
  );
}

export default Tools;
