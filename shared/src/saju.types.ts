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
  gender: 'male' | 'female' | '';
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

// ===== ssaju 기반 만세력 타입 =====

// 기둥 상세 (년/월/일/시 공통)
export interface PillarDetail {
  stem: string;          // 천간 한자 (예: 戊)
  branch: string;        // 지지 한자 (예: 辰)
  stemKo: string;        // 천간 한글 (예: 무)
  branchKo: string;      // 지지 한글 (예: 진)
  element: {
    stem: string;        // 천간 오행 (예: 토)
    branch: string;      // 지지 오행
  };
  yinYang: {
    stem: string;        // 음/양
    branch: string;
  };
  hiddenStems: {
    여기: string | null;
    중기: string | null;
    정기: string | null;
  };
}

// 십성 (기둥별)
export interface TenGods {
  year: { stem: string; branch: string };
  month: { stem: string; branch: string };
  day: { stem: string; branch: string };
  hour: { stem: string; branch: string } | null;
}

// 천간 관계 (합/충)
export interface StemRelation {
  type: string;          // '합' | '충'
  pillars: string[];     // ['hour', 'day']
  desc: string;          // '甲戊 충'
  stems: string[];
}

// 신살 (기둥별)
export interface PillarSals {
  twelveSal: string;      // 12신살 (예: 망신살)
  specialSals: string[];  // 특수신살 (예: ['화개살'])
}

// 대운 항목
export interface DaeunItem {
  startAge: number;
  endAge: number;
  ganzhi: string;         // 간지 (예: 癸未)
  stem: string;
  branch: string;
  startYear: number;
  stemTenGod: string;
  branchTenGod: string;
  stage12: string;        // 십이운성
  sal: string[];          // 신살
}

// 세운 항목 (연 단위)
export interface SeyunItem {
  year: number;
  ganzhi: string;
  stem: string;
  branch: string;
  tenGodStem: string;
  tenGodBranch: string;
  stage12: string;
}

// 월운 항목
export interface WolunItem {
  month: number;
  monthName: string;      // 인월(1월)
  ganzhi: string;
  stem: string;
  branch: string;
  stemTenGod: string;
  branchTenGod: string;
  stage12: string;
}

// 고급 분석
export interface AdvancedAnalysis {
  dayStrength: {
    strength: string;     // 'strong' | 'weak' 등
    score: number;
  };
  geukguk: string;        // 격국 (예: 식상격)
  yongsin: string[];      // 용신 (예: ['丙', '癸', '甲'])
  sinsal: {
    gilsin: string[];     // 길신
    hyungsin: string[];   // 흉신
  };
  interpretation: string; // 기본 해석 텍스트
}

// 만세력 전체 결과 (백엔드 /saju/calculate 응답)
export interface SajuChartResult {
  pillars: {
    year: string;         // 乙亥
    month: string;
    day: string;
    hour: string | null;  // 시간 모르면 null
  };
  pillarDetails: {
    year: PillarDetail;
    month: PillarDetail;
    day: PillarDetail;
    hour: PillarDetail | null;
  };
  dayStem: string;        // 일간 (예: 戊)
  gongmang: {
    branches: string[];   // ['戌', '亥']
    branchesKo: string[];
  };
  fiveElements: {
    목: number;
    화: number;
    토: number;
    금: number;
    수: number;
  };
  tenGods: TenGods;
  stages12: {
    year: string;
    month: string;
    day: string;
    hour: string | null;
  };
  stemRelations: StemRelation[];
  branchRelations: Record<string, Record<string, string>>; // 육합/파/원진 등
  sals: {
    year: PillarSals;
    month: PillarSals;
    day: PillarSals;
    hour: PillarSals | null;
  };
  currentAge: number;
  daeun: {
    startAge: number;
    list: DaeunItem[];
    current: DaeunItem | null;
  };
  seyun: SeyunItem[];
  wolun: WolunItem[];
  advanced: AdvancedAnalysis;
}