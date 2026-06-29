import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user}} = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
        }
        checkUser();
    }, [])

    if(isLoggedIn === null) return <div>Loading...</div>;

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute