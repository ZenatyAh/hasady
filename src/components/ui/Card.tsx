import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <section
      className={`w-full rounded-[2rem] bg-white/95 p-6 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.18)] ring-1 ring-[#d9efdf] ${className}`}
    >
      {children}
    </section>
  );
}
