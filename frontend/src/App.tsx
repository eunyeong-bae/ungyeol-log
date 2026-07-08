import './App.css'
import AuthProvider from './providers/AuthProvider'
import AppRouter from './router'


function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
