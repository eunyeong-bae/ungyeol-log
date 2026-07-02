import { supabase } from '../../lib/supabase';
import type { BirthProfile, BirthProfileInput } from '@ungyeol-log/shared';

export const createBirthProfile = async(input: BirthProfileInput): Promise<BirthProfile> => {
    //1. 현재 세션에서 access token 가져오기
    const {data: {session}} = await supabase.auth.getSession();
    if(!session) throw new Error('로그인이 필요합니다.');

    //2. API 요청
    const response = await fetch(`${import.meta.env.VITE_API_URL}/birth-profiles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(input),
    });

    if(!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || '저장 실패했습니다.');
    }

    const {data} = await response.json();
    return data;
}