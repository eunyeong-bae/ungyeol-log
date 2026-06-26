import dotenv from 'dotenv';
dotenv.config()

import app from './app.js';


// 환경변수에 PORT 값이 설정되어 있지 않으면 기본값으로 4000번 포트를 사용
const PORT = process.env.PORT || 4000; 

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});