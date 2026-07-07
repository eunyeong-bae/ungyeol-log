// pages/BirthProfileFormPage.tsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { BirthProfileInput } from '@ungyeol-log/shared';
import { useUser } from '../stores/userStore';
import { useBirthProfileMutation } from '../services/hooks/useBirthProfileMutation';
import { useSajuCalculation } from '../services/hooks/useSajuCalculation';

// react-hook-form이 관리할 폼 필드 타입
interface BirthProfileFormData {
  name: string;
  relationship: string;
  customRelationship: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number | null;
  birthMinute: number | null;
  gender: 'male' | 'female';
  isLunar: boolean;
}

const RELATIONSHIP_OPTIONS = [
  '본인', '배우자', '연인', '부모', '자녀', '친구', '직접입력'
] as const;

function BirthProfileFormPage() {
  const navigate = useNavigate();
  const user = useUser();
  const {mutate : saveBirthProfile, isPending: isSaving, error: saveError} = useBirthProfileMutation();
  const { mutate: calculateSaju, isPending: isCalculating, error: calcError } = useSajuCalculation();

  const isPending = isCalculating || isSaving;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<BirthProfileFormData>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      relationship: '',
      customRelationship: '',
      birthYear: undefined,
      birthMonth: undefined,
      birthDay: undefined,
      birthHour: null,
      birthMinute: null,
      gender: undefined,
      isLunar: false,
    },
  });

  // 관계 선택 버튼 클릭 시 watch로 현재 값 확인 + setValue로 직접 세팅
  const selectedRelationship = watch('relationship');
  const selectedGender = watch('gender');

  const onSubmit = (data: BirthProfileFormData) => {
    console.log("🚀 ~ onSubmit ~ data:", data)
    const submitData: BirthProfileInput = {
      name: data.name.trim(),
      relationship: data.relationship === '직접입력'
        ? data.customRelationship.trim()
        : data.relationship,
      birthInfo: {
        year: Number(data.birthYear),
        month: Number(data.birthMonth),
        day: Number(data.birthDay),
        hour: data.birthHour !== null ? Number(data.birthHour) : null,
        minute: data.birthMinute !== null ? Number(data.birthMinute) : null,
        gender: data.gender,
        isLunar: data.isLunar,
      },
    };

     // 1. 사주 계산 (로그인 여부 무관하게 항상)
    calculateSaju(submitData.birthInfo, {
      onSuccess: (sajuResult) => {
        if (user) {
          // 2-a: 로그인 → DB 저장 → 성공하면 결과 페이지로
          saveBirthProfile(submitData, {
            onSuccess: (savedProfile) => {
              navigate('/result', {
                state: { ...submitData, profileId: savedProfile.id, sajuResult },
              });
            },
          });
        } else {
          // 2-b: 비로그인 → 저장 없이 바로 결과 페이지로
          navigate('/result', { state: { ...submitData, sajuResult } });
        }
      },
    });

  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="w-full max-w-lg mx-auto px-6 py-4 flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-purple-600 transition-colors mr-4"
          >
            ← 뒤로
          </button>
          <h1 className="text-lg font-bold text-purple-600">🔮 사주 정보 입력</h1>
        </div>
      </header>

      <div className="w-full max-w-lg mx-auto px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>

          {/* 이름 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              {...register('name', {
                required: '이름을 입력해주세요',
                maxLength: { value: 20, message: '이름은 20자 이내로 입력해주세요' },
              })}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          {/* 관계 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              관계 <span className="text-red-500">*</span>
            </label>
            {/* register로 hidden input 등록 — 버튼 클릭 시 setValue로 값 세팅 */}
            <input
              type="hidden"
              {...register('relationship', { required: '관계를 선택해주세요' })}
            />
            <div className="flex flex-wrap gap-2">
              {RELATIONSHIP_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setValue('relationship', option, { shouldValidate: true });
                    if(option !== '직접입력') {
                      setValue('customRelationship', '', { shouldValidate: false });
                      clearErrors('customRelationship');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors
                    ${selectedRelationship === option
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                      : 'border-gray-300 text-gray-600 hover:border-purple-300'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {selectedRelationship === '직접입력' && (
              <input
                type="text"
                placeholder="관계를 직접 입력해주세요 (10자 이내)"
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                {...register('customRelationship', {
                  validate: (value) => {
                    if (selectedRelationship === '직접입력' && !value.trim()) {
                      return '관계를 직접 입력해주세요';
                    }
                    if (value.length > 10) {
                      return '10자 이내로 입력해주세요';
                    }
                    return true;
                  },
                })}
              />
            )}
            {errors.relationship && (
              <p className="text-red-500 text-xs">{errors.relationship.message}</p>
            )}
            {errors.customRelationship && (
              <p className="text-red-500 text-xs">{errors.customRelationship.message}</p>
            )}
          </div>

          {/* 생년월일 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              생년월일 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="flex flex-col flex-1">
                <input
                  type="number"
                  placeholder="연도"
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  {...register('birthYear', {
                    required: '연도를 입력해주세요',
                    min: { value: 1900, message: '1900~2100 사이로 입력해주세요' },
                    max: { value: 2100, message: '1900~2100 사이로 입력해주세요' },
                  })}
                />
                {errors.birthYear && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthYear.message}</p>
                )}
              </div>
              <div className="flex flex-col w-20">
                <input
                  type="number"
                  placeholder="월"
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  {...register('birthMonth', {
                    required: '월을 입력해주세요',
                    min: { value: 1, message: '1~12 사이로 입력해주세요' },
                    max: { value: 12, message: '1~12 사이로 입력해주세요' },
                  })}
                />
                {errors.birthMonth && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthMonth.message}</p>
                )}
              </div>
              <div className="flex flex-col w-20">
                <input
                  type="number"
                  placeholder="일"
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  {...register('birthDay', {
                    required: '일을 입력해주세요',
                    min: { value: 1, message: '1~31 사이로 입력해주세요' },
                    max: { value: 31, message: '1~31 사이로 입력해주세요' },
                  })}
                />
                {errors.birthDay && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthDay.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 음력 여부 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isLunar"
              className="w-4 h-4 accent-purple-500"
              {...register('isLunar')}
            />
            <label htmlFor="isLunar" className="text-sm text-gray-700 cursor-pointer">
              음력으로 입력
            </label>
          </div>

          {/* 태어난 시간 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              태어난 시간
              <span className="text-gray-400 text-xs ml-1">(선택, 모르면 비워두세요)</span>
            </label>
            <div className="flex gap-2 items-start">
              <div className="flex flex-col flex-1">
                <input
                  type="number"
                  placeholder="시 (0~23)"
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  {...register('birthHour', {
                    min: { value: 0, message: '0~23 사이로 입력해주세요' },
                    max: { value: 23, message: '0~23 사이로 입력해주세요' },
                  })}
                />
                {errors.birthHour && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthHour.message}</p>
                )}
              </div>
              <span className="text-gray-400 text-sm mt-3">:</span>
              <div className="flex flex-col flex-1">
                <input
                  type="number"
                  placeholder="분 (0~59)"
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  {...register('birthMinute', {
                    min: { value: 0, message: '0~59 사이로 입력해주세요' },
                    max: { value: 59, message: '0~59 사이로 입력해주세요' },
                  })}
                />
                {errors.birthMinute && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthMinute.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 성별 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              성별 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {(['male', 'female'] as const).map((g) => (
                <div key={g} className="flex-1">
                  <input
                    type="radio"
                    id={`gender-${g}`}
                    value={g}
                    className="sr-only peer"
                    {...register('gender', { required: '성별을 선택해주세요' })}
                  />
                  <label
                    htmlFor={`gender-${g}`}
                    className={`flex items-center justify-center py-2.5 rounded-lg border cursor-pointer text-sm transition-colors
                      peer-focus-visible:ring-2 peer-focus-visible:ring-purple-400 peer-focus-visible:ring-offset-1
                      ${selectedGender === g
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                        : 'border-gray-300 text-gray-600 hover:border-purple-300'
                      }`}
                  >
                    {g === 'male' ? '남성' : '여성'}
                  </label>
                </div>
              ))}
            </div>
            {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
          </div>

           {/* 사주 계산 API 에러 표시 (새로 추가) */}
          {(calcError || saveError) && (
            <p className="text-red-500 text-sm text-center">{calcError?.message || saveError?.message}</p>
          )}


          {/* 버튼 */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isPending}
              className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? '계산 중...' : '만세력 보기'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default BirthProfileFormPage;