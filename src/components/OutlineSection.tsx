import React from 'react';
import './OutlineSection.css';
import { Action } from '../state';
import { MoveNorth, MoveEast, MoveWest, MoveSouth } from '../actions/move-north';

type OutlineProps = {
  addAction: (action: Action) => void
}

const OutlineSection: React.FC<OutlineProps> = ({ addAction }) => {
  const handleAction = (actionType: string) => {
    switch (actionType) {
      case MoveNorth.type:
        addAction(MoveNorth);
        break;
      case MoveEast.type:
        addAction(MoveEast);
        break;
      case MoveWest.type:
        addAction(MoveWest);
        break;
      case MoveSouth.type:
        addAction(MoveSouth);
        break;
      default:
        console.warn('Unknown action type', actionType);
    }
  };

  return (
    <div className="outline-section">
      <h2>Outline</h2>
      <button onClick={() => handleAction(MoveNorth.type)}>Move North</button>
      <button onClick={() => handleAction(MoveEast.type)}>Move East</button>
      <button onClick={() => handleAction(MoveWest.type)}>Move West</button>
      <button onClick={() => handleAction(MoveSouth.type)}>Move South</button>
      {/* Additional outline items go here */}
    </div>
  );
}

export default OutlineSection;
