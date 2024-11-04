import React from 'react';
import './OutlineSection.css';
import { Action } from '../state';
import { MoveNorth, MoveEast, MoveWest, MoveSouth } from '../actions/move-north';
import { ScaleUp, ScaleDown } from '../actions/scale-track';
import { SummariseTrack } from '../actions/summarise-track';

type OutlineProps = {
  addAction: (action: Action) => void
}

const OutlineSection: React.FC<OutlineProps> = ({ addAction }) => {

  return (
    <div className="outline-section">
      <h2>Outline</h2>
      <button onClick={() => addAction(MoveNorth)}>Move North</button>
      <button onClick={() => addAction(MoveEast)}>Move East</button>
      <button onClick={() => addAction(MoveWest)}>Move West</button>
      <button onClick={() => addAction(MoveSouth)}>Move South</button>
      <br/>
      <button onClick={() => addAction(ScaleUp)}>Scale Up</button>
      <button onClick={() => addAction(ScaleDown)}>Scale Down</button>
      <br/>
      <button onClick={() => addAction(SummariseTrack)}>Centre Point</button>
    </div>
  );
}

export default OutlineSection;
