'use client';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { fetchWithAuth } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setProfile, clearProfile } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const isPublicRoute = ['/login', '/signup', '/'].includes(pathname);
            
            if (!token) {
                if (!isPublicRoute) {
                    router.push('/login');
                }
                setIsChecking(false);
                return;
            }
            
            try {
                const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    
                    if (!data.target_role && !pathname.startsWith('/onboarding')) {
                        router.push('/onboarding/step1');
                    } else if (isPublicRoute && data.target_role) {
                        router.push('/dashboard');
                    }
                } else {
                    clearProfile();
                    localStorage.removeItem('token');
                    if (!isPublicRoute) router.push('/login');
                }
            } catch (e) {
                console.error("Auth restore failed", e);
            } finally {
                setIsChecking(false);
            }
        };
        
        checkAuth();
    }, [pathname, router, setProfile, clearProfile]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
