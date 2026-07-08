import {create} from 'zustand';
import {persist} from 'zustand/middleware'
import type {User} from '@supabase/supabase-js';

interface UserState {
    user: User | null;
    isAuthLoading : boolean;
    selectedProfileId: string | null;

    setUser: (user: User|null) => void;
    setAuthLoading: (loading: boolean) => void;
    setSelectedProfileId: (id: string|null) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthLoading: true,
            selectedProfileId: null,

            setUser: (user) => set(
                user 
                    ? {user, isAuthLoading: false}
                    : { user: null, isAuthLoading: false}
            ),
            setAuthLoading: (isAuthLoading) => set({isAuthLoading}),
            setSelectedProfileId: (selectedProfileId) => set({ selectedProfileId}),
            clearUser: () => set({ user:null, selectedProfileId: null, isAuthLoading: false}),
        }),
        {
            name: 'ungyeol-user-storage',
            partialize: (state) => ({ selectedProfileId: state.selectedProfileId}),
        }
    )
)

// select 분리 - 필요한 값만 구독하기 위해
export const useUser = () => useUserStore((s) => s.user);
export const useIsAuthLoading = () => useUserStore((s) => s.isAuthLoading);
export const useSelectedProfileId = () => useUserStore((s) => s.selectedProfileId);