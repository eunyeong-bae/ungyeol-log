import { Navigate, Outlet } from 'react-router-dom';
import { useUser, useIsAuthLoading } from '../stores/userStore';

function PrivateRoute() {
    const user = useUser();
    const isAuthLoading = useIsAuthLoading();

    if(isAuthLoading) return <div>Loading...</div>;

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute