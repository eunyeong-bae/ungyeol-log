import { StrictMode } from 'react' //개발 환경에서의 잠재적인 문제 미리 감지
import { createRoot } from 'react-dom/client' //React 앱을 실제 HTML에 연결해주는 함수
import { BrowserRouter } from 'react-router-dom' //React Router를 사용하여 SPA 라우팅을 구현
import {QueryClient, QueryClientProvider} from '@tanstack/react-query' //React Query를 사용하여 서버 상태 관리
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient() //React Query 클라이언트 인스턴스 생성

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
