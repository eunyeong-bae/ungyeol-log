-- ungyeol-log DB 스키마
-- 생성일: 2026-06-27

-- 1. birth_profiles 테이블 (사주 대상자 정보)
CREATE TABLE birth_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  birth_year INTEGER NOT NULL,
  birth_month INTEGER NOT NULL,
  birth_day INTEGER NOT NULL,
  birth_hour INTEGER,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  is_lunar BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. saju_readings 테이블 (AI 해석 결과)
CREATE TABLE saju_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  birth_profile_id UUID REFERENCES birth_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category VARCHAR(20) NOT NULL CHECK (category IN ('love', 'money', 'health', 'career', 'overall')),
  content TEXT NOT NULL,
  saju_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS 활성화
ALTER TABLE birth_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saju_readings ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 설정 (본인 데이터만 접근 가능)
CREATE POLICY "본인 프로필만 접근" ON birth_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "본인 해석만 접근" ON saju_readings
  FOR ALL USING (auth.uid() = user_id);