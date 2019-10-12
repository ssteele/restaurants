import React from 'react';

import Restaurant from './Restaurant';

import '../../node_modules/foundation-sites/dist/css/foundation.min.css';
import '../css/App.css';

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
