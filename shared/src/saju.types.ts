// 생년월일 입력 정보
export interface BirthInfo {
  year: number
  month: number
  day: number
  hour: number
  gender: 'male' | 'female'
  isLunar: boolean // 음력 여부
}

// 사주팔자 결과
export interface SajuResult {
  fourPillars: {
    year: string   // 년주
    month: string  // 월주
    day: string    // 일주
    hour: string   // 시주
  }
  fiveElements: {
    wood: number   // 목
    fire: number   // 화
    earth: number  // 토
    metal: number  // 금
    water: number  // 수
  }
  dayMaster: string  // 일간
}

// AI 해석 요청
export interface InterpretRequest {
  sajuResult: SajuResult
  category: 'love' | 'money' | 'health' | 'career' | 'overall'
}

// AI 해석 응답
export interface InterpretResponse {
  category: string
  content: string
  createdAt: string
}