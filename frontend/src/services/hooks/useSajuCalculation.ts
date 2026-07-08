import { useMutation } from '@tanstack/react-query';
import { calculateSaju} from '../api/saju';
import type { BirthInfo } from '@ungyeol-log/shared';

export function useSajuCalculation() {
    return useMutation({
        mutationFn: (birthInfo: BirthInfo) => calculateSaju(birthInfo),
    })
}