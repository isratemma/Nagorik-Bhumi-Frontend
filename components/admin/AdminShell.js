'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem('nb_user');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export default function AdminShell({ children }) {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (!user || (user.role !== 'admin' && user.role !== 'officer')) {
      router.replace('/admin-login');
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: "'Inter', 'Hind Siliguri', sans-serif",
      background: '#f9fafb',
    }}>
      <div style={{ width: '224px', flexShrink: 0, overflowY: 'auto' }}>
        <AdminSidebar />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <AdminTopbar />
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
