import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { UserProvider } from '@/context/UserContext';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Nagorik Bhumi – Land Services for a Better Bangladesh',
  description: 'Manage your land records securely with Nagorik Bhumi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', 'Hind Siliguri', sans-serif" }} suppressHydrationWarning>
        <LanguageProvider>
          <UserProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
