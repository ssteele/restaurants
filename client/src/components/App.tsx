import React from 'react'

import Restaurant from './Restaurant'

import '../../node_modules/foundation-sites/dist/css/foundation.min.css'
import '../../node_modules/font-awesome/css/font-awesome.min.css';

import '../css/App.css'

const App: React.FC = () => {
  return (
    <div className="App">
      <Restaurant />
    </div>
  )
}

export default App
