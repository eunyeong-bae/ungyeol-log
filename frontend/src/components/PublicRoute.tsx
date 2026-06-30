import { Navigate, Outlet } from 'react-router-dom';
import {useUser, useIsAuthLoading} from '../stores/userStore'

function PublicRoute() {
    const user = useUser();
    const isAuthLoading = useIsAuthLoading();

    if(isAuthLoading) return <div>Loading...</div>;
    return user ? <Navigate to="/home" replace /> : <Outlet />;
}

export default PublicRoute;