import type { BirthInfo } from './saju.types'

// 사용자 정보
export interface User {
  id: string
  email: string
  createdAt: string
}

// 사주 프로필 (저장된 사주 대상자)
export interface BirthProfile {
  id: string
  userId: string
  name: string
  birthInfo: BirthInfo
  createdAt: string
}