import AdminShell from '@/components/admin/AdminShell';

export const metadata = { title: 'Admin – Nagorik Bhumi' };

export default function AdminLayout({ children, params }) {
  return <AdminShell>{children}</AdminShell>;
}
