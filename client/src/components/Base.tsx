import React from 'react'
import App from './App'

import '../../node_modules/foundation-sites/dist/css/foundation.min.css'
import '../../node_modules/font-awesome/css/font-awesome.min.css'
import '../css/Base.css'

const Base: React.FC = () => {
  return (
    <main>
      <App />
    </main>
  )
}

export default Base // @todo: avoid export default
