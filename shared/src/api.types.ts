// API 공통 응답 형식
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 페이지네이션
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}