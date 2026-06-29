import {Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

function App() {

  return (
     <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<HomePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
     </Routes>
  )
}

export default App
