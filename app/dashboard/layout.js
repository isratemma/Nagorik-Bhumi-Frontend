'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function DashboardLayout({ children }) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: "'Inter', 'Hind Siliguri', sans-serif",
      background: '#f9fafb',
    }}>

      {/* Sidebar — fixed width, no z-index tricks */}
      <div style={{ width: '224px', flexShrink: 0, overflowY: 'auto' }}>
        <Sidebar />
      </div>

      {/* Right side: topbar + scrollable content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Topbar />
        {/* This div scrolls the page content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </div>
      </div>

    </div>
  );
}
