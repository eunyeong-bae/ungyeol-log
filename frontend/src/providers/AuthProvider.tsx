import { useEffect} from 'react';
import {supabase} from '../lib/supabase';
import { useUserStore } from '../stores/userStore';

function AuthProvider ({children} : {children: React.ReactNode}) {
    const setUser = useUserStore((s) => s.setUser);
    const setAuthLoading = useUserStore((s) => s.setAuthLoading);
    const clearUser = useUserStore((s) => s.clearUser);

    useEffect(() => {
        let isMounted = true;

        //1. 앱 첫 로드 시 현재 세션 확인
        const initSession = async() => {
            try{
                const {data: {session}} = await supabase.auth.getSession();
                console.log("🚀 ~ initSession ~ session:", session)
                if(isMounted) setUser(session?.user ?? null);
            }catch{
                if(isMounted) setAuthLoading(false);
            }
        }

        initSession();

        //2. 이후 로그인/로그아웃/토큰갱신 등을 실시간으로 구독
        const {data: {subscription}} = supabase.auth.onAuthStateChange(
            (event, session) => {
                if(!isMounted) return;

                if(event === 'SIGNED_OUT'){
                    clearUser();
                }else {
                    setUser(session?.user ?? null);
                }
            }
        );

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        }
    }, [])

    return <>{children}</>
}

export default AuthProvider;