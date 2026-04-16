import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../lib/auth-context';
import Sidebar from '../components/Sidebar';
import ToastProvider from '../components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GigClaimSafe | Parametric Insurance for Gig Workers',
  description: 'A fintech-grade platform for automated disruption claims and instant UPI payouts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <ToastProvider />
          <Sidebar />
          <main className="min-h-screen px-8 py-8" style={{ marginLeft: '16rem' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
