import React from 'react';

const Rank = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <div className="white f3">
        {'Your current rank is...'}
      </div>
      <div className="white f1">
        {'#1'}
      </div>
    </div>
  );
}

export default Rank;