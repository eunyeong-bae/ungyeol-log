import {Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AuthProvider from './providers/AuthProvider'
import BirthProfileFormPage from './pages/BirthProfileFormPage'
import ResultPage from './pages/ResultPage'
import FortunePage from './pages/FortunePage'
import ArchivePage from './pages/ArchivePage'
import SettingsPage from './pages/SettingsPage'


function App() {

  return (
    <AuthProvider>
      <Routes>
        {/* 비로그인/로그인 모두 접근 가능 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/saju/new" element={<BirthProfileFormPage />} />
        <Route path="/result" element={<ResultPage />} />

        {/* 로그인 상태에서 접근 시 홈으로 */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* 로그인 필요 */}
        <Route element={<PrivateRoute />}>
          <Route path="/fortune" element={<FortunePage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
     </Routes>
    </AuthProvider>
  )
}

export default App
