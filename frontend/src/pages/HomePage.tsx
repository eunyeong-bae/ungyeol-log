// pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { useUser } from '../stores/userStore';

const sectionItems = [
  { label: '오늘의 운세', emoji: '🌟', desc: '오늘 하루 운세' },
  { label: '애정운', emoji: '💕', desc: '사랑과 인연' },
  { label: '재물운', emoji: '💰', desc: '금전과 재물' },
  { label: '직업운', emoji: '💼', desc: '일과 커리어' },
];

function HomePage() {
  const navigate = useNavigate();
  const user = useUser();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* 헤더 — 배경은 풀너비, 콘텐츠는 중앙 정렬 */}
      <header className="bg-white shadow-sm">
        <div className="w-full max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-600">🔮 운결록</h1>
          {user ? (
            <button
              onClick={() => navigate('/settings')}
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              마이페이지
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              로그인
            </button>
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="w-full max-w-lg mx-auto px-6 py-12 flex flex-col flex-1 gap-8">

        {/* 히어로 섹션 */}
        <section className="text-center flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-gray-800">
            나의 사주를 알아보세요
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            생년월일시로 만세력을 확인하고<br />
            AI 사주 해석까지 무료로 경험해보세요
          </p>
        </section>

        {/* 카테고리 카드 */}
        <section className="grid grid-cols-2 gap-3">
          {sectionItems.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={() => navigate('/saju/new')}
              className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-1 text-left hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">{card.emoji}</span>
              <p className="text-sm font-medium text-gray-800">{card.label}</p>
              <p className="text-xs text-gray-400">{card.desc}</p>
            </button>
          ))}
        </section>

      </main>

      {/* 바텀 CTA 버튼 — 배경은 풀너비, 버튼은 중앙 정렬 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100">
        <div className="w-full max-w-lg mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/saju/new')}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-medium text-base hover:bg-purple-700 transition-colors"
          >
            만세력 보기 →
          </button>
        </div>
      </div>

    </div>
  );
}

export default HomePage;