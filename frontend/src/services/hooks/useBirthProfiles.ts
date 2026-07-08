import { useQuery } from '@tanstack/react-query';
import { getBirthProfiles } from '../api/birthProfiles';

export function useBirthProfiles() {
  return useQuery({
    queryKey: ['birthProfiles'],
    queryFn: getBirthProfiles,
  });
}