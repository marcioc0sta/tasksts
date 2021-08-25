import React, { ReactElement } from 'react'

import Calendar from 'components/Calendar'
import Recorder from 'components/Recorder'

function App(): ReactElement {
  return (
    <div className='App'>
      <Recorder />
      <Calendar />
    </div>
  )
}

export default App
