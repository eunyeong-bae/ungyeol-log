import { StrictMode } from 'react' //개발 환경에서의 잠재적인 문제 미리 감지
import { createRoot } from 'react-dom/client' //React 앱을 실제 HTML에 연결해주는 함수
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
