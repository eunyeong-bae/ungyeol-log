import type { BirthInfo, SajuChartResult } from '@ungyeol-log/shared';

export const calculateSaju = async (birthInfo: BirthInfo): Promise<SajuChartResult> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/saju/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ birthInfo }),
  });

  if (!response.ok) {
    let message = '사주 계산에 실패했습니다.';
    try {
      const error = await response.json();
      message = error.error || message;
    } catch {
      // JSON 파싱 실패 시 기본 메시지
    }
    throw new Error(message);
  }

  const { data } = await response.json();
  return data;
};