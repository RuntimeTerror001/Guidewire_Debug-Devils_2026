'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: '1rem',
          background: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
        },
      }}
    />
  );
}
