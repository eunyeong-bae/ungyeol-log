// pages/ResultPage.tsx
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { BirthProfileInput, SajuChartResult, PillarDetail } from '@ungyeol-log/shared';
import { useUser } from '../stores/userStore';

const ELEMENT_BG: Record<string, string> = {
  목: 'bg-green-100 text-green-800',
  화: 'bg-red-100 text-red-800',
  토: 'bg-yellow-100 text-yellow-800',
  금: 'bg-gray-100 text-gray-700',
  수: 'bg-blue-100 text-blue-800',
};

const ELEMENT_BAR: Record<string, string> = {
  목: 'bg-green-500',
  화: 'bg-red-500',
  토: 'bg-yellow-500',
  금: 'bg-gray-400',
  수: 'bg-blue-500',
};

type PillarKey = 'year' | 'month' | 'day' | 'hour';
const PILLAR_LABELS: Record<PillarKey, string> = {
  hour: '시주',
  day: '일주',
  month: '월주',
  year: '연주',
};
// 만세력 표기 관례: 시주 → 연주 순서 (오른쪽이 연주)
const PILLAR_ORDER: PillarKey[] = ['hour', 'day', 'month', 'year'];

interface TermInfo {
  term: string;
  context: string;
}

// 용어 설명 모달 (Claude API 연동 예정 자리)
function TermModal({ term, context, onClose }: TermInfo & { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // 1. 모달 열리면 닫기 버튼으로 포커스 이동
    closeButtonRef.current?.focus();

    // 2. Escape 키로 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // 3. Tab 포커스를 모달 안에 가두기 (focus trap)
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="term-modal-title"
        className="bg-white rounded-t-2xl w-full max-w-lg px-6 py-8 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 id="term-modal-title" className="text-lg font-bold text-gray-800">
            <span className="text-purple-600">{term}</span> 이란?
          </h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="닫기"
            className="text-gray-400 hover:text-gray-600 text-xl focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-500">{context}</p>
        <div className="bg-purple-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
          <p className="text-purple-500 text-xs mb-2">🔮 AI 설명 (준비 중)</p>
          <p>Claude API 연동 후 이 자리에 {term}에 대한 맞춤 설명이 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
}

// 기둥 카드 하나 (천간+지지+지장간+십이운성+신살)
function PillarColumn({
  pillarKey,
  detail,
  tenGod,
  stage12,
  sals,
  onTermClick,
}: {
  pillarKey: PillarKey;
  detail: PillarDetail;
  tenGod: { stem: string; branch: string };
  stage12: string;
  sals: { twelveSal: string; specialSals: string[] };
  onTermClick: (info: TermInfo) => void;
}) {
  const label = PILLAR_LABELS[pillarKey];
  const hidden = [detail.hiddenStems.여기, detail.hiddenStems.중기, detail.hiddenStems.정기]
    .filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <p className="text-center text-xs text-gray-500 font-medium">{label}</p>

      {/* 천간 */}
      <button
        type="button"
        className={`rounded-xl p-2.5 flex flex-col items-center gap-0.5 ${ELEMENT_BG[detail.element.stem]}`}
        onClick={() => onTermClick({
          term: tenGod.stem,
          context: `${label} 천간 ${detail.stem}(${detail.stemKo})의 십성`,
        })}
      >
        <span className="text-2xl font-bold">{detail.stem}</span>
        <span className="text-[10px]">{detail.stemKo}</span>
        <span className="text-[10px] font-medium">{tenGod.stem}</span>
      </button>

      {/* 지지 */}
      <button
        type="button"
        className={`rounded-xl p-2.5 flex flex-col items-center gap-0.5 ${ELEMENT_BG[detail.element.branch]}`}
        onClick={() => onTermClick({
          term: tenGod.branch,
          context: `${label} 지지 ${detail.branch}(${detail.branchKo})의 십성`,
        })}
      >
        <span className="text-2xl font-bold">{detail.branch}</span>
        <span className="text-[10px]">{detail.branchKo}</span>
        <span className="text-[10px] font-medium">{tenGod.branch}</span>
      </button>

      {/* 지장간 */}
      <div className="flex flex-col items-center">
        {hidden.map((stem, i) => (
          <span key={i} className="text-[10px] text-gray-400">{stem}</span>
        ))}
      </div>

      {/* 십이운성 */}
      <button
        type="button"
        className="text-[11px] text-center text-indigo-600 hover:underline"
        onClick={() => onTermClick({ term: stage12, context: `${label}의 십이운성` })}
      >
        {stage12}
      </button>

      {/* 신살 */}
      <div className="flex flex-col items-center gap-0.5">
        <button
          type="button"
          className="text-[11px] text-orange-500 hover:underline"
          onClick={() => onTermClick({ term: sals.twelveSal, context: `${label}의 12신살` })}
        >
          {sals.twelveSal}
        </button>
        {sals.specialSals.map((sal) => (
          <button
            key={sal}
            type="button"
            className="text-[11px] text-rose-500 hover:underline"
            onClick={() => onTermClick({ term: sal, context: `${label}의 특수신살` })}
          >
            {sal}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser();
  const [selectedTerm, setSelectedTerm] = useState<TermInfo | null>(null);

  const state = location.state as
    | (BirthProfileInput & { profileId?: string; sajuResult: SajuChartResult })
    | null;

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

  const { name, relationship, birthInfo, sajuResult } = state;
  const totalElements = Object.values(sajuResult.fiveElements).reduce((a, b) => a + b, 0);
  const missingElements = Object.entries(sajuResult.fiveElements)
    .filter(([, count]) => count === 0)
    .map(([el]) => el);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full max-w-lg mx-auto px-6 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-purple-600 mr-4">
            ← 뒤로
          </button>
          <h1 className="text-lg font-bold text-purple-600">🔮 만세력 결과</h1>
        </div>
      </header>

      <div className="w-full max-w-lg mx-auto px-6 py-6 flex flex-col gap-5 pb-32">

        {/* 입력 정보 + 핵심 요약 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <h2 className="text-base font-bold text-gray-800">{name}님의 사주</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
              {birthInfo.year}년 {birthInfo.month}월 {birthInfo.day}일
            </span>
            {birthInfo.hour !== null && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                {birthInfo.hour}시{birthInfo.minute !== null ? ` ${birthInfo.minute}분` : ''}
              </span>
            )}
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
              {birthInfo.isLunar ? '음력' : '양력'}
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
              {birthInfo.gender === 'male' ? '남성' : '여성'}
            </span>
            <span className="px-3 py-1 bg-purple-100 rounded-full text-xs text-purple-600">
              {relationship}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>일간 <b className="text-purple-600">{sajuResult.dayStem}</b></span>
            <button
              type="button"
              className="hover:underline"
              onClick={() => setSelectedTerm({ term: sajuResult.advanced.geukguk, context: '사주의 격국' })}
            >
              격국 <b className="text-purple-600">{sajuResult.advanced.geukguk}</b>
            </button>
            <button
              type="button"
              className="hover:underline"
              onClick={() => setSelectedTerm({ term: '용신', context: `이 사주의 용신: ${sajuResult.advanced.yongsin.join(', ')}` })}
            >
              용신 <b className="text-purple-600">{sajuResult.advanced.yongsin.join(' ')}</b>
            </button>
            <button
              type="button"
              className="hover:underline"
              onClick={() => setSelectedTerm({ term: '공망', context: `이 사주의 공망: ${sajuResult.gongmang.branchesKo.join(', ')}` })}
            >
              공망 <b className="text-purple-600">{sajuResult.gongmang.branchesKo.join(' ')}</b>
            </button>
          </div>
        </section>

        {/* 사주팔자 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-800">사주팔자</h2>
          <p className="text-xs text-gray-400">글자를 클릭하면 용어 설명을 볼 수 있어요</p>
          <div className="flex gap-2">
            {PILLAR_ORDER.map((key) => {
              const detail = sajuResult.pillarDetails[key];
              const tenGod = sajuResult.tenGods[key];
              const stage12 = sajuResult.stages12[key];
              const sals = sajuResult.sals[key];

              if (!detail || !tenGod || !stage12 || !sals) {
                // 시간 모름 → 시주 빈 칸 표시
                return (
                  <div key={key} className="flex flex-col gap-2 flex-1 min-w-0">
                    <p className="text-center text-xs text-gray-500 font-medium">{PILLAR_LABELS[key]}</p>
                    <div className="rounded-xl p-2.5 bg-gray-50 flex items-center justify-center h-24">
                      <span className="text-xs text-gray-300">시간<br />모름</span>
                    </div>
                  </div>
                );
              }

              return (
                <PillarColumn
                  key={key}
                  pillarKey={key}
                  detail={detail}
                  tenGod={tenGod}
                  stage12={stage12}
                  sals={sals}
                  onTermClick={setSelectedTerm}
                />
              );
            })}
          </div>
        </section>

        {/* 천간/지지 관계 (합충형파해) */}
        <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <h2 className="text-base font-bold text-gray-800">합충 관계</h2>
          <div className="flex flex-wrap gap-2">
            {sajuResult.stemRelations.map((rel, i) => (
              <button
                key={`stem-${i}`}
                type="button"
                className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs hover:bg-teal-100"
                onClick={() => setSelectedTerm({ term: rel.desc, context: `천간 ${rel.type}` })}
              >
                {rel.desc}
              </button>
            ))}
            {Object.entries(sajuResult.branchRelations)
              .filter(([type]) => type !== '지장간')
              .flatMap(([type, entries]) =>
                Object.values(entries).map((desc, i) => (
                  <button
                    key={`${type}-${i}`}
                    type="button"
                    className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-xs hover:bg-cyan-100"
                    onClick={() => setSelectedTerm({ term: desc, context: `지지 ${type}` })}
                  >
                    {desc}
                  </button>
                ))
              )}
          </div>
        </section>

        {/* 오행 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-800">오행 분포</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(sajuResult.fiveElements).map(([element, count]) => {
              const percent = totalElements > 0 ? Math.round((count / totalElements) * 100) : 0;
              return (
                <div key={element} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-8">{element}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${ELEMENT_BAR[element]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{count}개</span>
                </div>
              );
            })}
          </div>
          {missingElements.length > 0 && (
            <button
              type="button"
              className="text-xs text-left text-red-400 hover:underline"
              onClick={() => setSelectedTerm({
                term: `${missingElements.join(', ')} 없음`,
                context: '사주에 없는 오행의 의미',
              })}
            >
              ⚠️ {missingElements.join(', ')} 기운이 없어요 — 클릭해서 의미 알아보기
            </button>
          )}
        </section>

        {/* 신강/신약 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <h2 className="text-base font-bold text-gray-800">일간 강약</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-purple-500"
                style={{ width: `${sajuResult.advanced.dayStrength.score}%` }}
              />
            </div>
            <span className="text-sm font-bold text-purple-600">
              {sajuResult.advanced.dayStrength.score}점
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {sajuResult.advanced.dayStrength.strength === 'strong' ? '신강' : '신약'} 사주예요
          </p>
        </section>

        {/* 대운 */}
        <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-800">대운</h2>
          <p className="text-xs text-gray-400">
            {sajuResult.daeun.startAge}세부터 시작, 10년 단위로 바뀌어요
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sajuResult.daeun.list.map((d) => {
              const isCurrent = sajuResult.daeun.current?.startAge === d.startAge;
              return (
                <div
                  key={d.startAge}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-3 rounded-xl border
                    ${isCurrent ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'}`}
                >
                  <span className="text-[10px] text-gray-500">{d.startAge}세</span>
                  <span className={`text-sm font-bold ${isCurrent ? 'text-purple-600' : 'text-gray-700'}`}>
                    {d.ganzhi}
                  </span>
                  <span className="text-[10px] text-gray-400">{d.stemTenGod}/{d.branchTenGod}</span>
                  <span className="text-[10px] text-indigo-500">{d.stage12}</span>
                  {d.sal.length > 0 && (
                    <span className="text-[10px] text-orange-500">{d.sal.join(',')}</span>
                  )}
                  {isCurrent && <span className="text-[10px] text-purple-500 font-medium">현재</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* 세운 (최근/향후 몇 년) */}
        <section className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-800">세운 (연간 흐름)</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sajuResult.seyun.map((s) => {
              const isThisYear = s.year === new Date().getFullYear();
              return (
                <div
                  key={s.year}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-3 rounded-xl border
                    ${isThisYear ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'}`}
                >
                  <span className="text-[10px] text-gray-500">{s.year}</span>
                  <span className={`text-sm font-bold ${isThisYear ? 'text-purple-600' : 'text-gray-700'}`}>
                    {s.ganzhi}
                  </span>
                  <span className="text-[10px] text-gray-400">{s.tenGodStem}/{s.tenGodBranch}</span>
                  <span className="text-[10px] text-indigo-500">{s.stage12}</span>
                  {isThisYear && <span className="text-[10px] text-purple-500 font-medium">올해</span>}
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* 바텀 CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="w-full max-w-lg mx-auto px-6 py-4">
          {user ? (
            <button
              onClick={() => navigate('/fortune', { state })}
              className="w-full py-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              🔮 AI 운세 해석 보기
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-center text-gray-500">
                로그인하면 AI 운세 해석을 무료로 볼 수 있어요
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                로그인하고 AI 운세 보기 →
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedTerm && (
        <TermModal
          term={selectedTerm.term}
          context={selectedTerm.context}
          onClose={() => setSelectedTerm(null)}
        />
      )}
    </div>
  );
}

export default ResultPage;