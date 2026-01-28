import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AddData from './AddData'
import GetData from './GetData'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<GetData />} />
        <Route path="/add-data" element={<AddData />} />
      </Routes>
    </div>
  )
}

export default App
