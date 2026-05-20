import Image from 'next/image';

/**
 * Shared logo header shown at the top of every auth/onboarding page.
 */
export function AuthLogo() {
  return (
    <div className="flex w-full justify-center">
      <Image
        src="/images/logo.png"
        alt="شعار محاصيل"
        width={140}
        height={140}
        priority
        className="object-contain"
      />
    </div>
  );
}
