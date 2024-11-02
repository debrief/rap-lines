import React from 'react';
import './OutlineSection.css';
import State from '../state';
import { MoveNorth, MoveEast, MoveWest, MoveSouth } from '../actions/move-north';

const OutlineSection: React.FC<{ state: State, setState: (state: State) => void }> = ({ state, setState }) => {
  const handleAction = (actionType: string) => {
    switch (actionType) {
      case MoveNorth.type:
        state.addAction(MoveNorth);
        break;
      case MoveEast.type:
        state.addAction(MoveEast);
        break;
      case MoveWest.type:
        state.addAction(MoveWest);
        break;
      case MoveSouth.type:
        state.addAction(MoveSouth);
        break;
      default:
        console.warn('Unknown action type', actionType);
    }
    console.log('new state', state);
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
