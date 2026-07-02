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
        if(!name || !relationship || !birthInfo) {
            res.status(400).json({error: 'Missing required fields'});
            return;
        }

        //5. DB INSERT
        const { data, error: dbError} = await supabase
            .from('birth_profiles')
            .insert({
                user_id: user.id,
                name,
                relationship,
                birth_year: birthInfo.birthYear,
                birth_month: birthInfo.birthMonth,
                birth_day: birthInfo.birthDay,
                birth_hour: birthInfo.birthHour,
                birth_minute: birthInfo.birthMinute,
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

export default router;