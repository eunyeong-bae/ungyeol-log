import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoute() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        let isMounted = true;

        const checkUser = async () => {
            try{
                const { data: { user } } = await supabase.auth.getUser();
                if(isMounted) setIsLoggedIn(!!user);
            }catch(error) {
                if(isMounted) setIsLoggedIn(false);
            }

        }
        checkUser();

        return () => {isMounted = false}
    }, []);

    if(isLoggedIn === null) return <div>Loading...</div>;
    return isLoggedIn ? <Navigate to="/home" replace /> : <Outlet />;
}

export default PublicRoute;