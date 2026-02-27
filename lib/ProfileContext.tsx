'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminProfile {
    name: string
    role: string
    photoUrl: string
}

interface ProfileCtx {
    profile: AdminProfile
    updateProfile: (p: Partial<AdminProfile>) => void
}

const defaultProfile: AdminProfile = {
    name: 'Bharat Kumar',
    role: 'Chief Editor',
    photoUrl: '',
}

const ProfileContext = createContext<ProfileCtx>({
    profile: defaultProfile,
    updateProfile: () => { },
})

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<AdminProfile>(defaultProfile)

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('admin_profile')
            if (saved) setProfile(JSON.parse(saved))
        } catch { }
    }, [])

    const updateProfile = (partial: Partial<AdminProfile>) => {
        setProfile(prev => {
            const next = { ...prev, ...partial }
            try {
                localStorage.setItem('admin_profile', JSON.stringify(next))
            } catch { }
            return next
        })
    }

    return (
        <ProfileContext.Provider value={{ profile, updateProfile }}>
            {children}
        </ProfileContext.Provider>
    )
}

export const useProfile = () => useContext(ProfileContext)
