import {Router, Request, Response} from 'express';
import {GoogleGenAI} from '@google/genai';
import { supabase } from '../lib/supabase.js';

const router = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/term-explain', async(req: Request, res: Response) => {
    try{
        const {term, context, sajuContext} = req.body;

        if(!term){
            res.status(400).json({error: '용어가 누락되었습니다.'});
            return;
        }

        const prompt = `
            당신은 사주명리학 전문가입니다. 다음 사주 용어를 쉽고 친근하게 설명해주세요.

            용어: ${term}
            맥락: ${context}
            ${sajuContext ? `이 사람의 사주 정보: ${sajuContext}` : ''}

            다음 형식으로 답변해주세요:
            1. 이 용어가 무엇인지 (2-3문장)
            2. 이 사람의 사주에서 어떤 의미를 가지는지 (2-3문장)
            3. 실생활에서 어떻게 작용하는지 (1-2문장)

            답변은 300자 내외로, 한국어로, 존댓말로 작성해주세요.
        `.trim();

        const interaction = await ai.interactions.create({
            model:'gemini-2.5-flash',
            input: prompt,
        });

        res.json({ explanation: interaction.output_text});
    }catch(error){
        console.error(`Gemini API 오류:`, error);
        res.status(500).json({error: 'AI 설명 생성에 실패했습니다.'});
    }
});

// POST /ai/fortune — AI 운세 해석
router.post('/fortune', async (req: Request, res: Response) => {
  try {
    const { sajuResult, category, profileId } = req.body;

    if (!sajuResult || !category) {
      res.status(400).json({ error: '필수 데이터가 누락되었습니다.' });
      return;
    }

    const categoryLabels: Record<string, string> = {
      love: '애정운',
      money: '재물운',
      health: '건강운',
      career: '직업운',
      overall: '종합운세',
    };

    const categoryLabel = categoryLabels[category] || category;

    const prompt = `
당신은 50년 경력의 사주명리학 전문가입니다. 아래 사주 정보를 바탕으로 ${categoryLabel}을 해석해주세요.

[사주 정보]
일간: ${sajuResult.dayStem}
사주 원국: ${sajuResult.pillars.year} ${sajuResult.pillars.month} ${sajuResult.pillars.day} ${sajuResult.pillars.hour ?? '시주 없음'}
오행 분포: 목${sajuResult.fiveElements.목} 화${sajuResult.fiveElements.화} 토${sajuResult.fiveElements.토} 금${sajuResult.fiveElements.금} 수${sajuResult.fiveElements.수}
격국: ${sajuResult.advanced.geukguk}
용신: ${sajuResult.advanced.yongsin.join(', ')}
일간 강약: ${sajuResult.advanced.dayStrength.strength === 'strong' ? '신강' : '신약'} (${sajuResult.advanced.dayStrength.score}점)
현재 대운: ${sajuResult.daeun.current ? `${sajuResult.daeun.current.ganzhi} (${sajuResult.daeun.current.stemTenGod}/${sajuResult.daeun.current.branchTenGod})` : '정보 없음'}
올해 세운: ${sajuResult.seyun.find((s: { year: number }) => s.year === new Date().getFullYear())?.ganzhi ?? '정보 없음'}

[요청]
위 사주를 바탕으로 ${categoryLabel}을 해석해주세요.

다음 구성으로 작성해주세요:
1. 전반적인 ${categoryLabel} 흐름 (3-4문장)
2. 현재 대운/세운의 영향 (2-3문장)
3. 주의할 점과 조언 (2-3문장)

친근하고 따뜻한 존댓말로, 600자 내외로 작성해주세요.
`.trim();

    const interaction = await ai.interactions.create({
      model: 'gemini-2.5-flash',
      input: prompt,
    });

    const content = interaction.output_text;

    // 로그인 사용자 + profileId 있으면 DB 저장
    let savedId: string | null = null;

    if (profileId) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (!authError && user) {
          const { data, error: dbError } = await supabase
            .from('saju_readings')
            .insert({
              birth_profile_id: profileId,
              user_id: user.id,
              category,
              content,
              saju_data: sajuResult,
            })
            .select('id')
            .single();

          if (!dbError && data) {
            savedId = data.id;
          }
        }
      }
    }

    res.json({ content, savedId });

  } catch (error) {
    console.error('운세 해석 오류:', error);
    res.status(500).json({ error: '운세 해석 생성에 실패했습니다.' });
  }
});

export default router;