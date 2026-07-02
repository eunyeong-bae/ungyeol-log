import express from 'express';
import cors from 'cors';
import birthProfilesRouter from './routes/birthProfiles.js';

const app = express();

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

export default app;