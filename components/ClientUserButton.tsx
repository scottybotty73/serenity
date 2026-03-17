'use client';

import dynamic from 'next/dynamic';
import { UserButton } from '@neondatabase/auth/react';

// Dynamically import UserButton to avoid hydration issues
const DynamicUserButton = dynamic(() => Promise.resolve(UserButton), {
  ssr: false,
  loading: () => <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse" />
});

export function ClientUserButton() {
  return <DynamicUserButton size="icon" />;
}