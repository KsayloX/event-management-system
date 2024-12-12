import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          {
            'bg-gray-100 text-gray-800': variant === 'default',
            'bg-blue-100 text-blue-800': variant === 'primary',
            'bg-green-100 text-green-800': variant === 'success',
            'bg-amber-100 text-amber-800': variant === 'warning',
          },
          className
        )
      )}
    >
      {children}
    </span>
  );
}