import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoute() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
        }
        checkUser();
    }, []);

    if(isLoggedIn === null) return <div>Loading...</div>;
    return isLoggedIn ? <Navigate to="/home" /> : <Outlet />;
}

export default PublicRoute;