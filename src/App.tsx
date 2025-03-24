import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import PlayerDetailPage from './pages/PlayerDetailPage'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/player/:id" element={<PlayerDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
