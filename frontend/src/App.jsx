import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import VotingPage from './pages/VotingPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/vote' element={<VotingPage />} />
      </Routes>
    </div>
  )
}

export default App
