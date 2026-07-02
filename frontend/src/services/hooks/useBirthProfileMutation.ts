import {useMutation} from '@tanstack/react-query';
import {createBirthProfile} from '../api/birthProfiles';
import type {BirthProfileInput} from '@ungyeol-log/shared';

export function useBirthProfileMutation() {
    return useMutation({
        mutationFn: async (input: BirthProfileInput) => createBirthProfile(input),
    })

}