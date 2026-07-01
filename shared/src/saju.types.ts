// 관계 선택지 타입
export type RelationshipType =
  | '본인'
  | '배우자'
  | '연인'
  | '부모'
  | '자녀'
  | '친구'
  | string; // 직접입력 허용

// 생년월일 입력 정보 (만세력 계산용)
export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number | null; // 선택 필드 — null이면 "모름"
  minute: number | null; // 선택 필드 — null이면 "모름"
  gender: 'male' | 'female';
  isLunar: boolean;
}

// 사주팔자 결과
export interface SajuResult {
  fourPillars: {
    year: string;   // 년주
    month: string;  // 월주
    day: string;    // 일주
    hour: string;   // 시주
  };
  fiveElements: {
    wood: number;   // 목
    fire: number;   // 화
    earth: number;  // 토
    metal: number;  // 금
    water: number;  // 수
  };
  dayMaster: string; // 일간
}

// AI 해석 요청
export interface InterpretRequest {
  sajuResult: SajuResult;
  category: 'love' | 'money' | 'health' | 'career' | 'overall';
}

// AI 해석 응답
export interface InterpretResponse {
  category: string;
  content: string;
  createdAt: string;
}