import type { BirthInfo, RelationshipType } from './saju.types';

// 사용자 정보
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

// 사주 프로필 (저장된 사주 대상자)
export interface BirthProfile {
  id: string;
  userId: string;
  name: string;
  relationship: RelationshipType; // 추가
  birthInfo: BirthInfo;
  createdAt: string;
}

// 비로그인 포함, 폼 제출 시 사용하는 입력 타입
export interface BirthProfileInput {
  name: string;
  relationship: RelationshipType;
  birthInfo: BirthInfo;
}