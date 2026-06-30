import {useState} from "react";
import {supabase} from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useUser } from "../stores/userStore";

function HomePage () {
    const user = useUser();
    const [logoutError, setLoggoutError] = useState<boolean|null>(null);
    const navigate = useNavigate();

    const handleLogout = async() => {
        try{
            await supabase.auth.signOut();
            navigate('/login', {replace: true})
            setLoggoutError(false)
        }catch{
            setLoggoutError(true)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-md flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold text-purple-600">🔮 운영로그</h1>
                <p className="text-gray-600">환영해요! <span className="font-medium">{user?.email}</span></p>
                {logoutError && 
                    <p className="text-red-500 text-sm">
                        로그아웃에 실패했습니다. 다시 시도해주세요.
                    </p>
                }
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