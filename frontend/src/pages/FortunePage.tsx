// pages/FortunePage.tsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { BirthProfileInput, SajuChartResult } from '@ungyeol-log/shared';
import { getFortune } from '../services/api/ai';
import { supabase } from '../lib/supabase';

const CATEGORIES = [
  { key: 'overall', label: '종합운세', emoji: '🌟' },
  { key: 'love', label: '애정운', emoji: '💕' },
  { key: 'money', label: '재물운', emoji: '💰' },
  { key: 'career', label: '직업운', emoji: '💼' },
  { key: 'health', label: '건강운', emoji: '🌿' },
] as const;

type Category = typeof CATEGORIES[number]['key'];

function FortunePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as
    | (BirthProfileInput & { profileId?: string; sajuResult: SajuChartResult })
    | null;
  console.log("🚀 ~ FortunePage ~ state:", state)

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [fortune, setFortune] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!state?.sajuResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col gap-4">
          <p className="text-gray-500">사주 정보가 없어요.</p>
          <button
            onClick={() => navigate('/saju/new')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg text-sm"
          >
            사주 입력하러 가기
          </button>
        </div>
      </div>
    );
  }

  const { sajuResult, profileId } = state;

  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category);
    setFortune(null);
    setError(null);
    setIsLoading(true);

    try {
      // 로그인된 경우 토큰 가져오기
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const { content } = await getFortune(
        sajuResult,
        category,
        profileId,
        token ?? undefined
      );

      setFortune(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : '운세 해석 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full max-w-lg mx-auto px-6 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-purple-600 mr-4"
          >
            ← 뒤로
          </button>
          <h1 className="text-lg font-bold text-purple-600">🔮 AI 운세 해석</h1>
        </div>
      </header>

      <div className="w-full max-w-lg mx-auto px-6 py-6 flex flex-col gap-6">

        {/* 카테고리 선택 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-800">어떤 운세가 궁금하세요?</h2>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategorySelect(cat.key)}
                disabled={isLoading}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors
                  ${selectedCategory === cat.key
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-sm font-medium">{cat.label}</span>
                {selectedCategory === cat.key && isLoading && (
                  <span className="ml-auto text-xs text-purple-400 animate-pulse">해석 중...</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 해석 결과 */}
        {(isLoading || fortune || error) && (
          <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-800">
              {CATEGORIES.find((c) => c.key === selectedCategory)?.emoji}{' '}
              {CATEGORIES.find((c) => c.key === selectedCategory)?.label} 해석
            </h2>

            {isLoading && (
              <div className="flex flex-col gap-2 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded w-4/6" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {fortune && (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {fortune}
              </p>
            )}

            {fortune && profileId && (
              <p className="text-xs text-gray-400 text-right">보관함에 저장됐어요 ✓</p>
            )}
          </section>
        )}

        {/* 비로그인 안내 */}
        {!profileId && (
          <div className="bg-purple-50 rounded-2xl p-4 text-sm text-purple-600 text-center">
            로그인하면 해석 결과가 보관함에 저장돼요
          </div>
        )}

      </div>
    </div>
  );
}

export default FortunePage;