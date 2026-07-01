// pages/BirthProfileFormPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RelationshipType } from '@ungyeol-log/shared';

interface BirthProfileForm {
  name: string;
  relationship: RelationshipType | '';
  customRelationship: string; // 직접입력 시 사용
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  gender: 'male' | 'female' | '';
  isLunar: boolean;
}

interface FormErrors {
  name?: string;
  relationship?: string;
  birthYear?: string;
  birthMonth?: string;
  birthDay?: string;
  birthHour?: string;
  birthMinute?: string;
  gender?: string;
}

const INITIAL_FORM: BirthProfileForm = {
  name: '',
  relationship: '',
  customRelationship: '',
  birthYear: '',
  birthMonth: '',
  birthDay: '',
  birthHour: '',
  birthMinute: '',
  gender: '',
  isLunar: false,
};

const RELATIONSHIP_OPTIONS = [
  '본인', '배우자', '연인', '부모', '자녀', '친구', '직접입력'
] as const;

const GENDER = ['male', 'female'] as const;

function BirthProfileFormPage() {
  const [form, setForm] = useState<BirthProfileForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRelationshipSelect = (value: string) => {
    setForm((prev) => ({
      ...prev,
      relationship: value as RelationshipType,
      customRelationship: value !== '직접입력' ? '' : prev.customRelationship,
    }));
    setErrors((prev) => ({ ...prev, relationship: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    } else if (form.name.trim().length > 50) {
      newErrors.name = '이름은 50자 이내로 입력해주세요';
    }

    if (!form.relationship) {
      newErrors.relationship = '관계를 선택해주세요';
    } else if (form.relationship === '직접입력' && !form.customRelationship.trim()) {
      newErrors.relationship = '관계를 직접 입력해주세요';
    }

    const year = Number(form.birthYear);
    if (!form.birthYear) {
      newErrors.birthYear = '태어난 연도를 입력해주세요';
    } else if (year < 1900 || year > 2100) {
      newErrors.birthYear = '1900~2100 사이의 연도를 입력해주세요';
    }

    const month = Number(form.birthMonth);
    if (!form.birthMonth) {
      newErrors.birthMonth = '태어난 월을 입력해주세요';
    } else if (month < 1 || month > 12) {
      newErrors.birthMonth = '1~12 사이의 월을 입력해주세요';
    }

    const day = Number(form.birthDay);
    if (!form.birthDay) {
      newErrors.birthDay = '태어난 일을 입력해주세요';
    } else if (day < 1 || day > 31) {
      newErrors.birthDay = '1~31 사이의 일을 입력해주세요';
    }

    if (form.birthHour !== '') {
      const hour = Number(form.birthHour);
      if (hour < 0 || hour > 23) {
        newErrors.birthHour = '0~23 사이의 시간을 입력해주세요';
      }
    }

    if (form.birthMinute !== '') {
      const minute = Number(form.birthMinute);
      if (minute < 0 || minute > 59) {
        newErrors.birthMinute = '0~59 사이의 분을 입력해주세요';
      }
    }

    if (!form.gender) {
      newErrors.gender = '성별을 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // 제출 데이터 구성
    const submitData = {
      name: form.name.trim(),
      relationship: form.relationship === '직접입력'
        ? form.customRelationship.trim()
        : form.relationship,
      birth_year: Number(form.birthYear),
      birth_month: Number(form.birthMonth),
      birth_day: Number(form.birthDay),
      birth_hour: form.birthHour !== '' ? Number(form.birthHour) : null,
      birth_minute: form.birthMinute !== '' ? Number(form.birthMinute) : null,
      gender: form.gender,
      is_lunar: form.isLunar,
    };

    // 나중에 Ablecity API 호출 + TanStack Query useMutation으로 대체
    console.log('제출 데이터:', submitData);
    navigate('/result', { state: submitData });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* 헤더 */}
      <header className="flex items-center px-6 py-4 bg-white shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-purple-600 transition-colors mr-4"
        >
          ← 
        </button>
        <h1 className="text-lg font-bold text-purple-600">🔮 사주 정보 입력</h1>
      </header>

      <div className="flex-1 px-6 py-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md mx-auto" noValidate>

          {/* 이름 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="이름을 입력해주세요"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* 관계 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              관계 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {RELATIONSHIP_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleRelationshipSelect(option)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors
                    ${form.relationship === option
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                      : 'border-gray-300 text-gray-600 hover:border-purple-300'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {/* 직접입력 선택 시 텍스트 필드 노출 */}
            {form.relationship === '직접입력' && (
              <input
                type="text"
                name="customRelationship"
                value={form.customRelationship}
                onChange={handleChange}
                placeholder="관계를 직접 입력해주세요"
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            )}
            {errors.relationship && (
              <p className="text-red-500 text-xs">{errors.relationship}</p>
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
                  name="birthYear"
                  value={form.birthYear}
                  onChange={handleChange}
                  placeholder="연도"
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {errors.birthYear && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthYear}</p>
                )}
              </div>
              <div className="flex flex-col w-20">
                <input
                  type="number"
                  name="birthMonth"
                  value={form.birthMonth}
                  onChange={handleChange}
                  placeholder="월"
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {errors.birthMonth && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthMonth}</p>
                )}
              </div>
              <div className="flex flex-col w-20">
                <input
                  type="number"
                  name="birthDay"
                  value={form.birthDay}
                  onChange={handleChange}
                  placeholder="일"
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {errors.birthDay && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthDay}</p>
                )}
              </div>
            </div>
          </div>

          {/* 음력 여부 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isLunar"
              id="isLunar"
              checked={form.isLunar}
              onChange={handleCheckboxChange}
              className="w-4 h-4 accent-purple-500"
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
            <div className="flex gap-2 items-center">
              <div className="flex flex-col flex-1">
                <input
                  type="number"
                  name="birthHour"
                  value={form.birthHour}
                  onChange={handleChange}
                  placeholder="시 (0~23)"
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {errors.birthHour && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthHour}</p>
                )}
              </div>
              <span className="text-gray-400 text-sm">:</span>
              <div className="flex flex-col flex-1">
                <input
                  type="number"
                  name="birthMinute"
                  value={form.birthMinute}
                  onChange={handleChange}
                  placeholder="분 (0~59)"
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {errors.birthMinute && (
                  <p className="text-red-500 text-xs mt-1">{errors.birthMinute}</p>
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
              {GENDER.map((g) => (
                <label
                  key={g}
                  className={`flex-1 flex items-center justify-center py-2.5 rounded-lg border cursor-pointer text-sm transition-colors
                    ${form.gender === g
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                      : 'border-gray-300 text-gray-600 hover:border-purple-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {g === 'male' ? '남성' : '여성'}
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              만세력 보기
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default BirthProfileFormPage;