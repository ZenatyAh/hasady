'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';

export default function HomePage() {
  const router = useRouter();
  const { isReady } = useAuthGuard();
  const user = useAuthStore((state) => state.user);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);

  if (!isReady) {
    return null;
  }

  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  return (
    <main
      dir="rtl"
      className="flex min-h-screen flex-col items-center bg-[#fdfcfa] px-6 py-12 text-[#111111]"
    >
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">مرحباً{user?.name ? `، ${user.name}` : ''}</h1>
          <p className="text-sm text-[#888888]">تم تسجيل الدخول بنجاح. يمكنك إدارة حسابك من هنا.</p>
          {user?.phone ? (
            <p className="text-sm font-medium" dir="ltr">
              {user.phone}
            </p>
          ) : null}
        </div>

        <div className="space-y-4">
          <Link href="/bank-account" className="block">
            <Button className="w-full">إدارة الحساب البنكي</Button>
          </Link>
          <Button variant="ghost" className="w-full" onClick={handleLogout}>
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </main>
  );
}
