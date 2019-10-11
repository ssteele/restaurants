import React from 'react';
import Restaurant from './Restaurant';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Restaurant />
      </header>
    </div>
  );
}

export default App;
