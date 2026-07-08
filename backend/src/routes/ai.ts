import {Router, Request, Response} from 'express';
import {GoogleGenAI} from '@google/genai';

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

export default router;