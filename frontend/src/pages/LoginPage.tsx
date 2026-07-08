import {supabase} from '../lib/supabase';

function LoginPage() {
    const handleGoogleLogin = async() => {
        const {error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo:`${window.location.origin}/` // 로그인 후 리디렉션할 URL
            }
        });
        if(error){
            console.error(error);
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-md flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold text-purple-600">🔮 운영로그</h1>
                <p className="text-gray-500">나만의 사주 기록을 시작해보세요</p>
                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">Google로 로그인</span>
                </button>
            </div>
        </div>
    )
}

export default LoginPage