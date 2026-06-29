import {useEffect, useState} from "react";
import {supabase} from "../lib/supabase";

function HomePage () {
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async() => {
            const { data: {user}} = await supabase.auth.getUser();
            setUserEmail(user?.email || null);
        }

        getUser();
    }, [])

    const handleLogout = async() => {
        await supabase.auth.signOut();
        window.location.href = '/login'; // 로그아웃 후 로그인 페이지로 리디렉션
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-md flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold text-purple-600">🔮 운영로그</h1>
                <p className="text-gray-600">환영해요! <span className="font-medium">{userEmail}</span></p>
                <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                로그아웃
                </button>
            </div>
        </div>
    )
}

export default HomePage