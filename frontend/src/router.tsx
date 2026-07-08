import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';

// 페이지는 lazy loading — 필요할 때만 번들 로드
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const BirthProfileFormPage = lazy(() => import('./pages/BirthProfileFormPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const FortunePage = lazy(() => import('./pages/FortunePage'));
const ArchivePage = lazy(() => import('./pages/ArchivePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-purple-400 text-sm animate-pulse">🔮 불러오는 중...</span>
    </div>
  );
}

function AppRouter() {
    return (
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
    )
}

export default AppRouter;