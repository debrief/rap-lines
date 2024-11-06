import React from 'react';
import './OutlineSection.css';
import { Action } from '../Store';
import { MoveNorth, MoveEast, MoveWest, MoveSouth } from '../actions/move-north';
import { ScaleUp, ScaleDown } from '../actions/scale-track';
import { SummariseTrack } from '../actions/summarise-track';
import { Card, CardContent, CardHeader } from '@mui/material';

type OutlineProps = {
  addAction: (action: Action) => void
}

const OutlineSection: React.FC<OutlineProps> = ({ addAction }) => {

  return (
    <div className="outline-section">
      <h2>Tools</h2>
      <Card>
        <CardHeader title="Move" />
        <CardContent>
        <button onClick={() => addAction(MoveNorth)}>Move North</button>
        <button onClick={() => addAction(MoveEast)}>Move East</button>
        <button onClick={() => addAction(MoveWest)}>Move West</button>
        <button onClick={() => addAction(MoveSouth)}>Move South</button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Scale" />
        <CardContent>
        <button onClick={() => addAction(ScaleUp)}>Scale Up</button>
        <button onClick={() => addAction(ScaleDown)}>Scale Down</button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Info" />
        <CardContent>
          <button onClick={() => addAction(SummariseTrack)}>Centre Point</button>
        </CardContent>
      </Card>
    </div>
  );
}

export default OutlineSection;
