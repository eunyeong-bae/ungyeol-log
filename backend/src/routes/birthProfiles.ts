import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase.js';

const router = Router();

// POST /birth-profiles
router.post('/', async(req: Request, res: Response) => {
    try{
        //1. Authorization header에서 Bearer token 추출
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.status(401).json({error: 'Unauthorized'});
            return;
        }
        const token = authHeader.split(' ')[1];
        //2. Supabase에서 토큰 검증
        const {data: {user}, error: authError} = await supabase.auth.getUser(token);
        if(authError || !user) {
            res.status(401).json({error: 'Unauthorized token'});
            return ;
        }

        // 3. 요청 바디에서 데이터 추출
        const {name, relationship, birthInfo } = req.body;

        //4. 필수 필드 검증
        if (
            !name ||
            !relationship ||
            !birthInfo ||
            birthInfo.year == null ||
            birthInfo.month == null ||
            birthInfo.day == null ||
            !birthInfo.gender
            ) {
                res.status(400).json({ error: '필수 데이터가 누락되었습니다.' });
                return;
            }

        //5. DB INSERT
        const { data, error: dbError} = await supabase
            .from('birth_profiles')
            .insert({
                user_id: user.id,
                name,
                relationship,
                birth_year: birthInfo.year,
                birth_month: birthInfo.month,
                birth_day: birthInfo.day,
                birth_hour: birthInfo.hour,
                birth_minute: birthInfo.minute,
                gender: birthInfo.gender,
                is_lunar: birthInfo.isLunar,
            })
            .select()
            .single();

        if(dbError) {
            console.error('DB Insert Error:', dbError);
            res.status(500).json({error: 'Database error'});
            return;
        }

        res.status(201).json({data});
        
    }catch(error){
        console.error('Unexpected Error:', error);
        res.status(500).json({error: 'Unexpected error'});
    }
})

// GET /birth-profiles — 내 프로필 목록 조회
router.get('/', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: '인증 토큰이 없습니다.' });
      return;
    }
    const token = authHeader.split(' ')[1];

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
      return;
    }

    const { data, error: dbError } = await supabase
      .from('birth_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (dbError) {
      res.status(500).json({ error: 'DB 조회에 실패했습니다.' });
      return;
    }

    res.json({ data });

  } catch (error) {
    console.error('프로필 목록 조회 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

export default router;