import {supabase} from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
function SettingsPage() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try{
      await supabase.auth.signOut();
      navigate('/');
    }catch{
      console.log('failed logout')
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-lg mx-auto px-6 py-8 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-gray-800">설정</h1>
        <p className="text-gray-400 text-sm">준비 중입니다.</p>
        <button 
          className="bg-red-500 text-white py-2 px-4 rounded-1g hover:bg-red-600 transition-colors"
          onClick={handleLogout}
        >로그아웃</button>
      </div>
    </div>
  )
}
export default SettingsPage;