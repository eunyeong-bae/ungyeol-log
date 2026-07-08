import { Router, Request, Response } from 'express';
import { calculateSaju } from 'ssaju';
import type { SajuChartResult } from '@ungyeol-log/shared';

const router = Router();

// POST /saju/calculate
router.post('/calculate', async (req: Request, res: Response) => {
  try {
    const { birthInfo } = req.body;

    // 필수 필드 검증
    if (
      !birthInfo ||
      birthInfo.year == null ||
      birthInfo.month == null ||
      birthInfo.day == null ||
      !birthInfo.gender ||
  birthInfo.month < 1 || birthInfo.month > 12 ||
  birthInfo.day < 1 || birthInfo.day > 31 ||
  birthInfo.year < 1900 || birthInfo.year > 2100 ||
  (birthInfo.hour != null && (birthInfo.hour < 0 || birthInfo.hour > 23)) ||
  (birthInfo.minute != null && (birthInfo.minute < 0 || birthInfo.minute > 59))
    ) {
      res.status(400).json({ error: '필수 데이터가 누락되었습니다.' });
      return;
    }

    const hasHour = birthInfo.hour != null;

    // ssaju 계산
    const raw = calculateSaju({
      year: birthInfo.year,
      month: birthInfo.month,
      day: birthInfo.day,
      ...(hasHour && {
        hour: birthInfo.hour,
        minute: birthInfo.minute ?? 0,
      }),
      gender: birthInfo.gender === 'male' ? '남' : '여',
      calendar: birthInfo.isLunar ? 'lunar' : 'solar',
    });

    // SajuChartResult 타입으로 변환
    const result: SajuChartResult = {
      pillars: {
        year: raw.pillars.year,
        month: raw.pillars.month,
        day: raw.pillars.day,
        hour: hasHour ? raw.pillars.hour : null,
      },
      pillarDetails: {
        year: raw.pillarDetails.year,
        month: raw.pillarDetails.month,
        day: raw.pillarDetails.day,
        hour: hasHour ? raw.pillarDetails.hour : null,
      },
      dayStem: raw.dayStem,
      gongmang: raw.gongmang,
      fiveElements: raw.fiveElements as SajuChartResult['fiveElements'],
      tenGods: {
        year: raw.tenGods.year,
        month: raw.tenGods.month,
        day: raw.tenGods.day,
        hour: hasHour ? raw.tenGods.hour : null,
      },
      stages12: {
        year: raw.stages12.bong.year,
        month: raw.stages12.bong.month,
        day: raw.stages12.bong.day,
        hour: hasHour ? raw.stages12.bong.hour : null,
      },
      stemRelations: raw.stemRelations,
      branchRelations: raw.branchRelations,
      sals: {
        year: raw.sals.year,
        month: raw.sals.month,
        day: raw.sals.day,
        hour: hasHour ? raw.sals.hour : null,
      },
      currentAge: raw.currentAge,
      daeun: {
        startAge: raw.daeun.startAge,
        list: raw.daeun.list,
        current: raw.daeun.current ?? null,
      },
      seyun: raw.seyun,
      wolun: raw.wolun,
      advanced: raw.advanced,
    };

    res.json({ data: result });

  } catch (error) {
    console.error('사주 계산 오류:', error);
    res.status(500).json({ error: '사주 계산에 실패했습니다.' });
  }
});

export default router;