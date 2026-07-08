import express from 'express';
import cors from 'cors';
import birthProfilesRouter from './routes/birthProfiles.js';
import sajuRouter from './routes/saju.js';
import aiRouter from './routes/ai.js';

const app = express();

// Render 같은 리버스 프록시 환경에서 실제 클라이언트 IP 인식
app.set('trust proxy', 1);

//미들웨어 설정
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());

// health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: '운영로그 서버 정상 동작 중' })
})

// birthProfiles route
app.use('/birth-profiles', birthProfilesRouter );

app.use('/saju', sajuRouter);

// Gemini AI 사주 설명
app.use('/ai', aiRouter);

export default app;