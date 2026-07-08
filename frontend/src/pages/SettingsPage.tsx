import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useBirthProfiles } from '../services/hooks/useBirthProfiles';
import { calculateSaju } from '../services/api/saju';

function SettingsPage() {
  const navigate = useNavigate();
  const { data: profiles, isLoading, error } = useBirthProfiles();
  const [loadingProfileId, setLoadingProfileId] = useState<string | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const handleLogout = async () => {
    const {error} = await supabase.auth.signOut();
    if(error){
      console.error('로그아웃 실패', error);
      return;
    }
    navigate('/');
  };

  // 프로필 클릭 → 사주 재계산 → FortunePage 이동
  const handleProfileClick = async (profile: any) => {
    setLoadingProfileId(profile.id);
    setCalcError(null); //이전 에러 초기화

    try {
      const birthInfo = {
        year: profile.birth_year,
        month: profile.birth_month,
        day: profile.birth_day,
        hour: profile.birth_hour,
        minute: profile.birth_minute,
        gender: profile.gender,
        isLunar: profile.is_lunar,
      };

      const sajuResult = await calculateSaju(birthInfo);

      navigate('/fortune', {
        state: {
          name: profile.name,
          relationship: profile.relationship,
          birthInfo,
          profileId: profile.id,
          sajuResult,
        },
      });
    } catch (err) {
      setCalcError('사주 계산에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoadingProfileId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="w-full max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-purple-600" onClick={() => navigate('/')}>🔮 운결록</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="w-full max-w-lg mx-auto px-6 py-6 flex flex-col gap-6">

        {/* 저장된 사주 프로필 목록 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-gray-800">저장된 사주</h2>

          {isLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm">목록을 불러오지 못했어요.</p>
          )}

          {profiles?.length === 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-gray-400 text-sm">저장된 사주가 없어요.</p>
              <button
                onClick={() => navigate('/saju/new')}
                className="mt-3 text-sm text-purple-600 hover:underline"
              >
                사주 입력하러 가기 →
              </button>
            </div>
          )}

          {calcError && (
            <p className="text-red-400 text-sm text-center py-2">{calcError}</p>
          )}

          {profiles?.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => handleProfileClick(profile)}
              disabled={loadingProfileId === profile.id}
              className="bg-white rounded-xl p-4 shadow-sm text-left flex items-center justify-between hover:shadow-md transition-shadow disabled:opacity-50"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{profile.name}</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">
                    {profile.relationship}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {profile.birth_year}년 {profile.birth_month}월 {profile.birth_day}일
                  {profile.birth_hour !== null ? ` ${profile.birth_hour}시` : ''}
                  {' · '}{profile.gender === 'male' ? '남성' : '여성'}
                  {' · '}{profile.is_lunar ? '음력' : '양력'}
                </span>
              </div>
              <span className="text-gray-300 text-lg">
                {loadingProfileId === profile.id ? '⏳' : '→'}
              </span>
            </button>
          ))}
        </section>

      </div>
    </div>
  );
}

export default SettingsPage;